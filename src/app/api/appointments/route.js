import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { Appointment } from '@/models/Appointment';
import { Patient } from '@/models/Patient';

export async function GET(request) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const patientId = searchParams.get('patientId');
    const type = searchParams.get('type'); // 'today', 'upcoming', 'all'

    let appointments;

    if (patientId) {
      appointments = await Appointment.findByPatient(patientId);
    } else if (type === 'today') {
      appointments = await Appointment.getTodayAppointments(payload.id);
    } else if (type === 'upcoming') {
      appointments = await Appointment.getUpcomingAppointments(payload.id);
    } else if (startDate && endDate) {
      appointments = await Appointment.findByDoctor(payload.id, startDate, endDate);
    } else {
      appointments = await Appointment.findByDoctor(payload.id);
    }

    // Populate patient data
    const appointmentsWithPatients = await Promise.all(
      appointments.map(async (apt) => {
        const patient = await Patient.findById(apt.patientId.toString());
        return {
          ...apt,
          _id: apt._id.toString(),
          patientId: apt.patientId.toString(),
          doctorId: apt.doctorId.toString(),
          patient: patient ? {
            _id: patient._id.toString(),
            name: patient.name,
            age: patient.age,
            sex: patient.sex,
            mrn: patient.mrn
          } : null
        };
      })
    );

    return NextResponse.json({ appointments: appointmentsWithPatients });
  } catch (error) {
    console.error('Get appointments error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { patientId, appointmentDate, appointmentTime, duration, reason, notes } = await request.json();

    if (!patientId || !appointmentDate || !appointmentTime) {
      return NextResponse.json(
        { error: 'Patient, date, and time are required' },
        { status: 400 }
      );
    }

    const appointment = await Appointment.create({
      patientId,
      doctorId: payload.id,
      appointmentDate,
      appointmentTime,
      duration,
      reason,
      notes
    });

    return NextResponse.json({ appointment }, { status: 201 });
  } catch (error) {
    console.error('Create appointment error:', error);
    return NextResponse.json(
      { error: 'Failed to create appointment' },
      { status: 500 }
    );
  }
}

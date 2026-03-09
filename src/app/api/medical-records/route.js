import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { MedicalRecord } from '@/models/MedicalRecord';

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

    const { patientId, recordData, sessionData } = await request.json();

    if (!patientId || !recordData) {
      return NextResponse.json(
        { error: 'Patient ID and record data are required' },
        { status: 400 }
      );
    }

    const record = await MedicalRecord.create({
      patientId,
      doctorId: payload.id,
      recordData,
      sessionData: sessionData || {},
    });

    return NextResponse.json({ record }, { status: 201 });
  } catch (error) {
    console.error('Create medical record error:', error);
    return NextResponse.json(
      { error: 'Failed to create medical record' },
      { status: 500 }
    );
  }
}

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
    const patientId = searchParams.get('patientId');
    const recordId = searchParams.get('recordId');

    if (recordId) {
      // Get specific record by ID
      const record = await MedicalRecord.findById(recordId);
      return NextResponse.json({ record });
    }

    if (!patientId) {
      return NextResponse.json(
        { error: 'Patient ID is required' },
        { status: 400 }
      );
    }

    // Get all records for patient
    const records = await MedicalRecord.findByPatient(patientId);

    return NextResponse.json({ records });
  } catch (error) {
    console.error('Get medical record error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch medical record' },
      { status: 500 }
    );
  }
}

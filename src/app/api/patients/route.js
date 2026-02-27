import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
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

    const patients = await Patient.findByDoctor(payload.id);

    return NextResponse.json({ patients });
  } catch (error) {
    console.error('Get patients error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch patients' },
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

    const { name, age, sex, dob, mrn } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: 'Patient name is required' },
        { status: 400 }
      );
    }

    const patient = await Patient.create({
      doctorId: payload.id,
      name,
      age,
      sex,
      dob,
      mrn,
    });

    return NextResponse.json({ patient }, { status: 201 });
  } catch (error) {
    console.error('Create patient error:', error);
    return NextResponse.json(
      { error: 'Failed to create patient' },
      { status: 500 }
    );
  }
}

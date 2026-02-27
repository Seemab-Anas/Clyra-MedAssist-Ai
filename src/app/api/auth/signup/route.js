import { NextResponse } from 'next/server';
import { Doctor } from '@/models/Doctor';
import { createToken } from '@/lib/auth';

export async function POST(request) {
  try {
    const { name, email, password, specialization } = await request.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // Create doctor
    const doctor = await Doctor.create({
      name,
      email,
      password,
      specialization: specialization || 'General Practice',
    });

    // Create JWT token
    const token = await createToken({
      id: doctor._id.toString(),
      email: doctor.email,
      name: doctor.name,
    });

    // Create response with token in cookie
    const response = NextResponse.json(
      {
        success: true,
        doctor: {
          id: doctor._id.toString(),
          name: doctor.name,
          email: doctor.email,
          specialization: doctor.specialization,
        },
      },
      { status: 201 }
    );

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create account' },
      { status: 400 }
    );
  }
}

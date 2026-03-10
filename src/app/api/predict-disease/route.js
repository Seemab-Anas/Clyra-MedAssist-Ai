import { NextResponse } from 'next/server';

// Your Colab ngrok URL (update after running Colab notebook)
const COLAB_API_URL = process.env.COLAB_API_URL || 'https://your-ngrok-url.ngrok.io';

export async function POST(request) {
  try {
    const { symptoms } = await request.json();

    if (!symptoms) {
      return NextResponse.json(
        { error: 'Symptoms are required' },
        { status: 400 }
      );
    }

    // Call Colab API
    const response = await fetch(`${COLAB_API_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ symptoms }),
    });

    if (!response.ok) {
      throw new Error(`Colab API error: ${response.statusText}`);
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      symptoms: data.symptoms,
      diagnosis: data.diagnosis,
    });

  } catch (error) {
    console.error('Disease prediction error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to predict disease',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

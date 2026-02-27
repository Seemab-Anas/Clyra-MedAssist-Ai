import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const DIALOGUE_PROMPT = `The following is a mixed conversation between a doctor and a patient.
Separate the text into:
- Doctor
- Patient

Format:
{
 "dialogue": [
   { "speaker": "doctor", "text": "" },
   { "speaker": "patient", "text": "" }
 ]
}

Only return valid JSON. Identify who is speaking based on context clues (medical terminology, asking questions vs answering, etc.).`;

export async function POST(request) {
  try {
    // Check if API key is configured
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { 
          error: 'API key not configured',
          details: 'Please create a .env.local file with GROQ_API_KEY'
        },
        { status: 500 }
      );
    }

    const { transcription } = await request.json();

    if (!transcription) {
      return NextResponse.json(
        { error: 'No transcription provided' },
        { status: 400 }
      );
    }

    console.log('Separating dialogue...');

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: DIALOGUE_PROMPT },
        {
          role: 'user',
          content: transcription,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.2,
    });

    const result = JSON.parse(completion.choices[0].message.content);

    console.log('Dialogue separation successful');

    return NextResponse.json({
      success: true,
      dialogue: result.dialogue,
    });
  } catch (error) {
    console.error('Dialogue separation error:', error);
    return NextResponse.json(
      { 
        error: 'Dialogue separation failed', 
        details: error.message 
      },
      { status: 500 }
    );
  }
}

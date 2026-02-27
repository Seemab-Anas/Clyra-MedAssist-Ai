import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import { createReadStream } from 'fs';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request) {
  let tempFilePath = null;
  
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

    const formData = await request.formData();
    const audioFile = formData.get('audio');

    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    console.log('Processing audio file:', audioFile.name, audioFile.type, audioFile.size);

    // Convert File to Buffer
    const bytes = await audioFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save to temporary file (Groq SDK needs a file path)
    const tempFileName = `audio-${Date.now()}-${audioFile.name}`;
    tempFilePath = join(tmpdir(), tempFileName);
    await writeFile(tempFilePath, buffer);

    console.log('Temp file created:', tempFilePath);

    // Transcribe using Groq Whisper with file stream
    const transcription = await groq.audio.transcriptions.create({
      file: createReadStream(tempFilePath),
      model: 'whisper-large-v3',
      language: 'en',
      response_format: 'verbose_json',
    });

    console.log('Transcription successful');

    // Clean up temp file
    await unlink(tempFilePath);

    return NextResponse.json({
      success: true,
      transcription: transcription.text,
      segments: transcription.segments,
    });
  } catch (error) {
    console.error('Transcription error:', error);
    console.error('Error details:', error.response?.data || error.message);
    
    // Clean up temp file if it exists
    if (tempFilePath) {
      try {
        await unlink(tempFilePath);
      } catch (unlinkError) {
        console.error('Failed to delete temp file:', unlinkError);
      }
    }
    
    return NextResponse.json(
      { 
        error: 'Transcription failed', 
        details: error.message,
        apiError: error.response?.data || null
      },
      { status: 500 }
    );
  }
}

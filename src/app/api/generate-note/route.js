import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { getTemplateById, getDefaultTemplate } from '@/config/prompts';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});


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

    const { dialogue, templateId } = await request.json();

    if (!dialogue) {
      return NextResponse.json(
        { error: 'No dialogue provided' },
        { status: 400 }
      );
    }

    // Get template by ID or use default
    let template;
    if (templateId) {
      template = getTemplateById(templateId);
      if (!template) {
        return NextResponse.json(
          { error: 'Template not found' },
          { status: 404 }
        );
      }
    } else {
      template = getDefaultTemplate();
    }

    // Format dialogue for better analysis
    const formattedDialogue = dialogue.map(d => 
      `${d.speaker.toUpperCase()}: ${d.text}`
    ).join('\n\n');

    console.log(`Generating ${template.title} from dialogue...`);

    const systemPrompt = `${template.prompt}

CRITICAL OUTPUT FORMAT:
You MUST return your response as valid JSON in this exact format:
{
  "content": "your complete formatted note here as plain text"
}

The "content" field should contain the entire note with all sections, formatting, line breaks, and structure as specified in the template above. Use \\n for line breaks within the content string.`;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: `Analyze this medical conversation and generate the note:\n\n${formattedDialogue}`,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
    });

    console.log(`${template.title} generated successfully`);
    
    const aiResponse = completion.choices[0].message.content;
    console.log('Raw AI response:', aiResponse);
    
    const result = JSON.parse(aiResponse);
    console.log('Parsed result:', result);

    // Call disease prediction if template supports it
    let diseasePrediction = null;
    if (template.predictDisease && result.content) {
      try {
        console.log('Calling disease prediction API...');
        const predictionRes = await fetch(`${process.env.COLAB_API_URL || process.env.NEXT_PUBLIC_COLAB_API_URL}/predict`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ symptoms: result.content }),
        });

        if (predictionRes.ok) {
          const predictionData = await predictionRes.json();
          diseasePrediction = predictionData.diagnosis;
          console.log('Disease prediction received:', diseasePrediction);
        } else {
          console.warn('Disease prediction failed:', await predictionRes.text());
        }
      } catch (error) {
        console.warn('Disease prediction error:', error.message);
        // Continue without prediction if it fails
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        ...result,
        diseasePrediction: diseasePrediction
      },
      templateName: template.title,
    });
  } catch (error) {
    console.error('Note generation error:', error);
    return NextResponse.json(
      { error: 'Note generation failed', details: error.message },
      { status: 500 }
    );
  }
}

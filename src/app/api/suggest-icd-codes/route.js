import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import ICD10Code from '@/models/ICD10Code';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request) {
  try {
    const { noteContent } = await request.json();

    if (!noteContent) {
      return NextResponse.json(
        { error: 'No note content provided' },
        { status: 400 }
      );
    }

    console.log('Analyzing note for ICD-10 code suggestions...');

    // AI prompt to extract diagnoses and suggest ICD-10 codes
    const systemPrompt = `You are a medical coding assistant. Analyze the medical note and extract all diagnoses, conditions, or symptoms mentioned.

For each diagnosis/condition found, suggest the most appropriate ICD-10 code.

Return ONLY valid JSON in this exact format:
{
  "suggestions": [
    {
      "condition": "Type 2 diabetes mellitus",
      "code": "E11.9",
      "confidence": "high"
    }
  ]
}

Rules:
- Only suggest codes for explicitly mentioned diagnoses/conditions
- Use standard ICD-10 codes (e.g., E11.9, I10, J44.9)
- confidence can be: "high", "medium", or "low"
- If no diagnoses found, return empty suggestions array
- Do not invent or assume diagnoses`;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: `Analyze this medical note and suggest ICD-10 codes:\n\n${noteContent}`,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.2,
    });

    const aiResponse = JSON.parse(completion.choices[0].message.content);
    console.log('AI suggested codes:', aiResponse);

    // Validate suggested codes against database
    const validatedSuggestions = [];
    
    if (aiResponse.suggestions && Array.isArray(aiResponse.suggestions)) {
      for (const suggestion of aiResponse.suggestions) {
        // Look up the code in database
        const codeData = await ICD10Code.getByCode(suggestion.code);
        
        if (codeData) {
          validatedSuggestions.push({
            code: codeData.code,
            description: codeData.description,
            shortDescription: codeData.shortDescription,
            condition: suggestion.condition,
            confidence: suggestion.confidence,
            source: 'AI',
            validated: true
          });
        } else {
          // Code not found in database, but include with warning
          validatedSuggestions.push({
            code: suggestion.code,
            description: suggestion.condition,
            shortDescription: suggestion.condition,
            condition: suggestion.condition,
            confidence: suggestion.confidence,
            source: 'AI',
            validated: false
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      suggestions: validatedSuggestions,
      count: validatedSuggestions.length
    });
  } catch (error) {
    console.error('ICD-10 suggestion error:', error);
    return NextResponse.json(
      { error: 'Code suggestion failed', details: error.message },
      { status: 500 }
    );
  }
}

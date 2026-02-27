import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const SYSTEM_PROMPT = `You are a medical documentation AI assistant. Generate a SOAP note from the medical conversation transcript.

**CRITICAL RULES:**
1. Extract ONLY information explicitly mentioned in the transcript
2. Never invent, assume, or infer patient details, diagnoses, or treatments
3. **EVERY section MUST use bullet points** - one item per line starting with "- "
4. **NEVER write paragraphs** - always use bullet point format
5. If a section has no information, use null

**Formatting Requirements:**
- Each bullet point starts with "- " (dash and space)
- One fact or finding per bullet point
- Use line breaks between bullet points
- Keep bullet points concise and clear

**Subjective:** Include as bullet points:
- Chief complaint and reason for visit
- Symptom characteristics (duration, timing, location, quality, severity, context)
- Symptom modifiers (what makes it better/worse)
- Associated symptoms
- Previous episodes
- Impact on daily activities

**Past Medical History:** Include as bullet points:
- Relevant past medical conditions
- Past surgical history
- Social history (smoking, alcohol, occupation, etc.)
- Family history
- Allergies
- Current medications with dosages

**Objective:** Include as bullet points (NEVER as paragraph):
- Vital signs: BP, HR, RR, temperature, SpO2 (each as separate bullet or combined)
- Physical examination: one bullet per system (general, cardiovascular, respiratory, abdomen, neurological, skin, etc.)
- Completed investigations: one bullet per test with result

**Assessment:** Include as bullet points:
- Primary diagnosis or clinical impression
- Differential diagnoses if mentioned

**Plan:** Include as bullet points:
- Investigations ordered
- Medications prescribed
- Treatment recommendations
- Referrals
- Follow-up instructions

**Example Output:**
Subjective:
"- Chest tightness for 3 days\n- Worse with exertion\n- Pressure sensation in centre of chest"

Past Medical History:
"- Hypertension for 4 years\n- Allergies: penicillin\n- Current medications: amlodipine 5mg daily"

Objective:
"- BP 148/92, HR 96, RR 20, temperature normal, oxygen saturation 97%\n- General: slightly anxious, not in acute distress\n- Cardiovascular: normal S1 and S2, no murmurs\n- Respiratory: clear bilaterally\n- Abdomen: soft, non-tender"

Assessment:
"- Possible unstable angina"

Plan:
"- Troponin levels\n- Chest X-ray\n- Commence aspirin\n- Close monitoring"

Return ONLY valid JSON:
{
  "subjective": "string with bullet points or null",
  "pastMedicalHistory": "string with bullet points or null",
  "objective": "string with bullet points or null",
  "assessment": "string with bullet points or null",
  "plan": "string with bullet points or null"
}`;

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

    const { dialogue } = await request.json();

    if (!dialogue) {
      return NextResponse.json(
        { error: 'No dialogue provided' },
        { status: 400 }
      );
    }

    // Format dialogue for better analysis
    const formattedDialogue = dialogue.map(d => 
      `${d.speaker.toUpperCase()}: ${d.text}`
    ).join('\n\n');

    console.log('Generating provider note from dialogue...');

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: `Analyze this medical conversation and extract structured information:\n\n${formattedDialogue}`,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
    });

    console.log('Provider note generated successfully');

    const result = JSON.parse(completion.choices[0].message.content);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Note generation error:', error);
    return NextResponse.json(
      { error: 'Note generation failed', details: error.message },
      { status: 500 }
    );
  }
}

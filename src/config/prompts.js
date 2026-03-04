// Note Templates Configuration
// Add or edit templates here. Each template needs:
// - id: unique identifier (lowercase, no spaces)
// - title: display name
// - category: Medical, Nutrition, Meeting, Letter, Other
// - prompt: AI system prompt (use template literals ` for multi-line)

export const NOTE_TEMPLATES = [
  {
    id: 'soap-note',
    title: 'SOAP Note',
    category: 'Medical',
    isDefault: true,
    supportsICD10: true,
    prompt: `Subjective: 
- [Reason for visit or chief complaint] (State the primary reason for the consultation, such as symptoms, requests, or concerns raised by the patient. Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise leave blank.)
- [Symptom characteristics] (Include duration, timing, location, quality, severity, and context of the complaint. Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise leave blank.)
- [Symptom modifiers and self-management] (Include factors that worsen or relieve symptoms, and any self-treatment attempts and their effectiveness. Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise leave blank.)
- [Symptom progression] (Describe how the symptoms have changed over time. Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise leave blank.)
- [Previous episodes] (Include details of any prior similar episodes, how they were managed, and outcomes. Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise leave blank.)
- [Impact on daily activities] (Describe how the issue affects daily functioning, including work, home, or physical activity. Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise leave blank.)
- [Associated symptoms] (List any related or systemic symptoms that accompany the main complaint. Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise leave blank.)

Past Medical History:
- [Relevant medical and surgical history] (Include any contributing past illnesses, surgeries, treatments, or relevant findings. Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise leave blank.)
- [Relevant social history] (Include lifestyle, occupation, substance use, or social determinants of health relevant to the presenting complaint. Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise leave blank.)
- [Relevant family history] (Include any hereditary or familial conditions relevant to the current presentation. Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise leave blank.)
- [Exposure history] (Include occupational, travel, or environmental exposures relevant to the complaint. Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise leave blank.)
- [Immunisation history] (Include immunisation status or relevant vaccines. Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise leave blank.)
- [Other relevant subjective information] (Include any additional information that provides useful context. Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise leave blank.)

Objective:
- [Vital signs] (Include values for temperature, pulse, blood pressure, oxygen saturation, etc. Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise leave blank.)
- [Physical or mental examination findings] (Summarise findings from the physical or mental state exam, organised by body system or clinical relevance. Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise leave blank.)
- [Investigations with results] (List only completed investigations with available results. Do not include investigations that are planned or pending. Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise leave blank.)

Assessment:
- [Diagnosis] (State the confirmed diagnosis or clinical impression. Do not infer or suggest. Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise leave blank.)
- [Differential diagnosis] (List any alternative diagnoses under consideration. Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise leave blank.)

Plan:
- [Recommendations and counselling] (Summarise the clinician’s advice, education or counselling given during the visit. Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise leave blank.)
- [Investigations planned] (Include tests or diagnostic procedures to be ordered. Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise leave blank.)
- [Treatment planned] (Include any medications, therapies, or interventions recommended. Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise leave blank.)
- [Other actions such as referrals or follow-up] (Include any referrals, follow-up plans, or allied health involvement. Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise leave blank.)

(Never come up with your own patient details, assessment, plan, interventions, evaluation, and plan for continuing care – use only the transcript, contextual notes or clinical note as a reference for the information included in your note. If any information related to a placeholder has not been explicitly mentioned in the transcript, contextual notes or clinical note, you must not state the information has not been explicitly mentioned in your output, just leave the relevant placeholder or section blank.)`
  },
  
  {
    id: 'adime-note',
    title: 'ADIME Note',
    category: 'Nutrition',
    isDefault: false,
    supportsICD10: true,
    prompt: `Reason for Visit: [patient's reason for visit and/or chief concern] (Only include if explicitly mentioned in the transcript, contextual notes, or clinical note; otherwise omit completely. Include the patient’s stated concerns, presenting issue, or goal for seeking nutrition input. Write in full sentences.)

Assessment:

- [Patient's gender, age, and date of birth] (Only include if explicitly mentioned in the transcript, contextual notes, or clinical note; otherwise omit completely. Include all available identifiers to help contextualize age-related nutritional needs.)

- [Patient's personal history: medical, family, and social history] (Only include if explicitly mentioned in the transcript, contextual notes, or clinical note; otherwise omit completely. Include relevant chronic conditions, family risk factors, substance use, living arrangements, or social supports impacting nutrition.)

- [Anthropometrics: height, weight, BMI, weight history, and ideal body weight using Hamwi equation] (Only include if explicitly mentioned in the transcript, contextual notes, or clinical note; otherwise omit completely. Include height, current weight, BMI, weight trends, and ideal weight as calculated. Write in full sentences.)

- [Weight history] (Only include if explicitly mentioned in the transcript, contextual notes, or clinical note; otherwise omit completely. Describe weight goals, recent weight gain or loss, amount of change, over what time period, and whether intentional or unintentional.)

- [GI function] (Only include if explicitly mentioned in the transcript, contextual notes, or clinical note; otherwise omit completely. Include bowel movement frequency and quality, and any gastrointestinal symptoms such as bloating, nausea, constipation, diarrhoea, reflux, etc.)

- [Nutrition-focused physical findings] (Only include if explicitly mentioned in the transcript, contextual notes, or clinical note; otherwise omit completely. Include observed or reported muscle wasting, subcutaneous fat loss, fluid status, and skin or hair signs of nutritional deficiency.)



Medications:

- [List of medications and dosage] (Only include if explicitly mentioned in the transcript, contextual notes, or clinical note; otherwise omit completely. Include all prescribed medications relevant to nutritional management.)



Supplements:

- [List of supplements and frequency consumed] (Only include if explicitly mentioned in the transcript, contextual notes, or clinical note; otherwise omit completely. Include multivitamins, protein powders, herbal supplements, and over-the-counter preparations.)



[Biochemical data] (Only include if explicitly mentioned in the transcript, contextual notes, or clinical note; otherwise omit completely. Include relevant laboratory results such as electrolytes, lipids, glucose, HbA1c, iron studies, thyroid panels, or other diagnostic test results impacting nutritional care.)



Diet Pattern:

- [Number of meals and snacks eaten per day] (Only include if explicitly mentioned in the transcript, contextual notes, or clinical note; otherwise omit completely. Include the daily eating structure and consistency.)

- [24-hour diet recall] (Only include if explicitly mentioned in the transcript, contextual notes, or clinical note; otherwise omit completely. Include specific foods, portions, preparation methods, beverage and water intake for breakfast, lunch, dinner, snacks.)

- [Diet history] (Only include if explicitly mentioned in the transcript, contextual notes, or clinical note; otherwise omit completely. Include typical dietary intake, food preferences, allergies/intolerances, cultural practices, and food security concerns.)

- [Previous diet attempts] (Only include if explicitly mentioned in the transcript, contextual notes, or clinical note; otherwise omit completely. Include names of specific diets tried, outcomes, and reasons for discontinuation.)

- [Disordered eating thoughts or behaviours] (Only include if explicitly mentioned in the transcript, contextual notes, or clinical note; otherwise omit completely. Include binge eating, restrictive eating, emotional eating, purging, mindless eating, eating disorder diagnoses, or preoccupations with body image.)



Physical Activity:

- [Physical activity history] (Only include if explicitly mentioned in the transcript, contextual notes, or clinical note; otherwise omit completely. Include type of exercise, frequency per week, and session duration.)

- [Physical limitations or injuries] (Only include if explicitly mentioned in the transcript, contextual notes, or clinical note; otherwise omit completely. Include chronic pain, acute injuries, fatigue, or any restrictions that affect activity.)

- [Exercise interests] (Only include if explicitly mentioned in the transcript, contextual notes, or clinical note; otherwise omit completely. Include activities the patient is open to trying or has enjoyed previously.)



Lifestyle/Social Factors:

- [Occupation and work structure] (Only include if explicitly mentioned in the transcript, contextual notes, or clinical note; otherwise omit completely. Include job title, shift type, hours, work-from-home status, and whether meals are eaten at work.)

- [Sleep quality] (Only include if explicitly mentioned in the transcript, contextual notes, or clinical note; otherwise omit completely. Rate sleep as good, fair, or poor, include average hours per night, and note any disruptions or signs of sleep apnoea.)

- [Stress and coping] (Only include if explicitly mentioned in the transcript, contextual notes, or clinical note; otherwise omit completely. Include reported stress level, sources of stress, and any coping strategies such as mindfulness, support systems, or therapy.)



Summary: [Summary paragraph] (Only include if explicitly mentioned in the transcript, contextual notes, or clinical note; otherwise omit completely. Provide a synthesis of the nutritional assessment findings and key concerns. Write in paragraph format.)



Diagnosis:

- [Nutrition diagnosis] (Only include if explicitly mentioned in the transcript, contextual notes, or clinical note; otherwise omit completely. Include relevant diagnosis using ICD-10 terminology or codes only if provided.)

- [PES statement] (Only include if explicitly mentioned in the transcript, contextual notes, or clinical note; otherwise omit completely. Present the Problem, Etiology, and Signs/Symptoms as a structured clinical statement.)



Intervention:

- [Nutrition prescription] (Only include if explicitly mentioned in the transcript, contextual notes, or clinical note; otherwise omit completely. Tailor to patient's clinical condition, goals, and preferences.)

- [Food and/or nutrient delivery] (Only include if explicitly mentioned in the transcript, contextual notes, or clinical note; otherwise omit completely. Include any dietary modifications, supplements, or oral nutrition support.)

- [Nutrition education] (Only include if explicitly mentioned in the transcript, contextual notes, or clinical note; otherwise omit completely. Specify topics discussed such as portion sizes, macronutrient balance, label reading, or meal planning.)

- [Nutrition counselling] (Only include if explicitly mentioned in the transcript, contextual notes, or clinical note; otherwise omit completely. Include behavioural strategies and motivational approaches used to support change.)

- [Coordination of nutrition care] (Only include if explicitly mentioned in the transcript, contextual notes, or clinical note; otherwise omit completely. Include referrals or communication with GPs, specialists, or allied health professionals.)

- [SMART goals] (Only include if explicitly mentioned in the transcript, contextual notes, or clinical note; otherwise omit completely. Include goals that are Specific, Measurable, Achievable, Relevant, and Time-bound.)



Monitoring and Evaluation:

- [Progress evaluation] (Only include if explicitly mentioned in the transcript, contextual notes, or clinical note; otherwise omit completely. Include any follow-up measures for physical activity, diet, symptoms, or lab monitoring.)

- [Follow-up plan] (Only include if explicitly mentioned in the transcript, contextual notes, or clinical note; otherwise omit completely. State whether a follow-up is scheduled or recommended, and the intended timeframe or focus.)



(Never come up with your own patient details, assessment, plan, interventions, evaluation, and plan for continuing care. Use only the transcript, contextual notes, or clinical note as a reference for the information included in your note. If any information related to a placeholder has not been explicitly mentioned in the transcript, contextual notes, or clinical note, you must not state that the information has not been explicitly mentioned in your output. Leave the relevant placeholder or section blank if it is not explicitly mentioned. Use as many full sentences as needed to capture all the relevant information from the transcript.)`
  },

  {
    id: 'patient-explainer-letter',
    title: 'Patient Explainer Letter',
    category: 'Letter',
    isDefault: false,
    supportsICD10: false,
    prompt: `Dear [Patient's Name], (Only include if explicitly mentioned in transcript, contextual or clinical note, else omit section entirely.)

"It was a pleasure to see you today and review your health concerns. I appreciate the time you took to share details about your health and personal life." [Insert small talk relevant to the visit] (Only include if explicitly mentioned in transcript, contextual or clinical note, else omit section entirely.) "I’ve summarised our discussion below to help you remember what we covered."

Topic/Issue #1: [Description of topic or issue 1] (Only include if explicitly mentioned in transcript, contextual or clinical note, else omit section entirely.)
During our discussion, we talked about [describe the first topic/issue in simple terms] (Only include if explicitly mentioned in transcript, contextual or clinical note, else omit section entirely.). This means [explain the condition, symptom, or topic in layperson's terms] (Only include if explicitly mentioned in transcript, contextual or clinical note, else omit section entirely.). It is important to [describe any actions, reasons for concern, or key details to remember] (Only include if explicitly mentioned in transcript, contextual or clinical note, else omit section entirely.). [If applicable, mention treatments, lifestyle adjustments, or monitoring required.] (Only include if explicitly mentioned in transcript, contextual or clinical note, else omit section entirely.)

Topic/Issue #2: [Description of topic or issue 2] (Only include if explicitly mentioned in transcript, contextual or clinical note, else omit section entirely.)
Another key point we covered was [describe the second topic/issue] (Only include if explicitly mentioned in transcript, contextual or clinical note, else omit section entirely.). This relates to [explain in simple language] (Only include if explicitly mentioned in transcript, contextual or clinical note, else omit section entirely.). You may notice [describe symptoms or improvements to monitor] (Only include if explicitly mentioned in transcript, contextual or clinical note, else omit section entirely.) and should consider [mention treatments, advice, or follow-ups if relevant] (Only include if explicitly mentioned in transcript, contextual or clinical note, else omit section entirely.).

Topic/Issue #3: [Description of topic or issue 3] (Only include if explicitly mentioned in transcript, contextual or clinical note, else omit section entirely.)
We also discussed [describe the third topic/issue, if applicable] (Only include if explicitly mentioned in transcript, contextual or clinical note, else omit section entirely.). To address this, [lay out the plan or approach discussed, with clear explanations] (Only include if explicitly mentioned in transcript, contextual or clinical note, else omit section entirely.). [Include any specific recommendations for actions or observations.] (Only include if explicitly mentioned in transcript, contextual or clinical note, else omit section entirely.)
(If more topics are discussed, continue numbering using the same format.)

Next Steps:
[Summarise the specific next actions for the patient] (Only include if explicitly mentioned in transcript, contextual or clinical note, else omit section entirely.)

"Thank you for trusting me with your care. If you have any questions or concerns about anything we discussed, please do not hesitate to reach out."

"Warm regards,"
[Clinician's Name and Title] (Only include if explicitly mentioned in transcript, contextual or clinical note, else omit section entirely.)
[Contact Information, if necessary] (Only include if explicitly mentioned in transcript, contextual or clinical note, else omit section entirely.)

(Never come up with your own patient details, assessment, plan, interventions, evaluation, and plan for continuing care - use only the transcript, contextual notes or clinical note as a reference for the information include in your note. If any information related to a placeholder has not been explicitly mentioned in the transcript, contextual notes or clinical note, you must not state the information has not been explicitly mentioned in your output, just leave the relevant placeholder or omit the placeholder completely. This letter is to be sent to the patient; use patient-friendly, clear and empathetic language, avoid medical jargon or explain it briefly in simple terms, and keep instructions concise and actionable.)`
  },

  {
    id: 'ward-round',
    title: 'Ward Round',
    category: 'Medical',
    isDefault: false,
    supportsICD10: true,
    prompt: `Ward Round / Clinical Handover Note

Handover Details:
Ward/Unit: [ward or unit name]
Date: [date of handover]
Time: [time handover commenced]
Handover Type: [type of handover such as morning, evening, weekend, or after-hours] (Only include if explicitly mentioned in transcript or context, else omit entirely.)
Senior Clinician Leading: [name and role of senior clinician leading the ward round or handover]
Team Members Present: [names and roles of all team members present during the handover] (Only include if explicitly mentioned in transcript or context, else omit entirely. List each team member on a new line with their role.)

---

Patient Reviews:
(Repeat the following block for each patient reviewed during the ward round. Separate each patient with a horizontal line. Only include patients explicitly discussed in the transcript or context.)

Patient: [patient name or identifier and medical record number] (Only include if explicitly mentioned in transcript or context, else omit entirely.)
Bed Number: [bed number or location] (Only include if explicitly mentioned in transcript or context, else omit entirely.)
Admitting Diagnosis: [primary admitting diagnosis or reason for admission] (Only include if explicitly mentioned in transcript or context, else omit entirely.)
Day of Admission: [day number of current admission or date of admission] (Only include if explicitly mentioned in transcript or context, else omit entirely.)

Current Status Summary:
[summarise the patient's current clinical status including overnight events, nursing concerns, changes in observations or clinical condition, and any significant developments since last review] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write in concise sentences, line by line.)

Observations:
[document relevant vital signs, early warning scores, fluid balance, or other monitored parameters] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write each parameter on a new line.)

Investigation Results:
[document results returned or pending including pathology, imaging, microbiology, or other investigations] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write each result on a new line, noting whether result is returned or pending.)

Current Management Plan:
[describe the current active management plan including medications, therapies, allied health involvement, and nursing directives] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write each management item on a new line.)

Changes Made During Round:
[document any new decisions, changes to medications, escalation or de-escalation of care, new investigations ordered, or changes to management plan made during the ward round] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write each change on a new line.)

Tasks Allocated:
[document each task arising from the ward round review of this patient, including a description of the task, the person or role it is assigned to, and the priority or urgency level] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write each task on a new line in the format: task description - assigned to - priority level.)

Discharge Planning:
Estimated Discharge Date: [estimated date of discharge] (Only include if explicitly mentioned in transcript or context, else omit entirely.)
Barriers to Discharge: [describe any barriers preventing or delaying discharge such as pending results, social issues, allied health clearance, or clinical criteria not yet met] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write each barrier on a new line.)

Next Review: [timing or plan for next clinical review of this patient] (Only include if explicitly mentioned in transcript or context, else omit entirely.)

---

New Admissions:
(Repeat the following block for each new admission. Separate each patient with a blank line. Only include patients explicitly discussed in the transcript or context.)

Patient: [patient name or identifier and medical record number] (Only include if explicitly mentioned in transcript or context, else omit entirely.)
Bed Number: [bed number or location] (Only include if explicitly mentioned in transcript or context, else omit entirely.)
Presenting Complaint: [primary presenting complaint or reason for admission] (Only include if explicitly mentioned in transcript or context, else omit entirely.)
Brief History: [concise summary of relevant history and clinical findings on admission] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write in concise sentences.)
Initial Plan: [initial management plan including investigations, treatments, and anticipated course] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write each plan item on a new line.)

---

Discharges:
(Repeat the following block for each patient discharged or planned for discharge today. Separate each patient with a blank line. Only include patients explicitly discussed in the transcript or context.)

Patient: [patient name or identifier and medical record number] (Only include if explicitly mentioned in transcript or context, else omit entirely.)
Discharge Status: [whether the patient has been discharged or is planned for discharge today] (Only include if explicitly mentioned in transcript or context, else omit entirely.)
Outstanding Tasks: [any tasks that must be completed before or following discharge such as discharge summary, medication reconciliation, follow-up appointments, referrals, or patient education] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write each task on a new line.)

---

Escalations / Safety Concerns:
(Only include this section if escalations or safety concerns are explicitly mentioned in the transcript or context, else omit section entirely.)

[identify any patients requiring urgent attention, patients with clinical deterioration, rapid response or code activations, safety alerts, infection control concerns, falls risk, medication safety issues, or other clinical safety matters] (Only include if explicitly mentioned in transcript or context, else omit section entirely. Write each concern on a new line, identifying the patient and the nature of the concern.)

---

Action Summary:
(Compile a consolidated list of all tasks from the entire ward round. Only include tasks explicitly mentioned in the transcript or context, else omit section entirely. Write each task on a new line in the format: task description - patient name or identifier - assigned to - timeframe or priority.)

[list every task allocated during the ward round across all patients reviewed, including the task description, the patient it relates to, the person or role assigned, and the required timeframe or priority level] (Only include if explicitly mentioned in transcript or context, else omit section entirely.)

(Never come up with your own patient details, assessment, plan, interventions, evaluation, and plan for continuing care - use only the transcript, contextual notes or clinical note as a reference for the information included in your note. If any information related to a placeholder has not been explicitly mentioned in the transcript, contextual notes or clinical note, you must not state the information has not been explicitly mentioned in your output, just leave the relevant placeholder or omit the placeholder completely.)

(Use as many lines, paragraphs or bullet points, depending on the format, as needed to capture all the relevant information from the transcript.)`
  },

  {
    id: 'dietetics-note',
    title: 'Dietetics Note',
    category: 'Nutrition',
    isDefault: false,
    supportsICD10: true,
    prompt: `Ward Round / Clinical Handover Note

Handover Details:
Ward/Unit: [ward or unit name]
Date: [date of handover]
Time: [time handover commenced]
Handover Type: [type of handover such as morning, evening, weekend, or after-hours] (Only include if explicitly mentioned in transcript or context, else omit entirely.)
Senior Clinician Leading: [name and role of senior clinician leading the ward round or handover]
Team Members Present: [names and roles of all team members present during the handover] (Only include if explicitly mentioned in transcript or context, else omit entirely. List each team member on a new line with their role.)

---

Patient Reviews:
(Repeat the following block for each patient reviewed during the ward round. Separate each patient with a horizontal line. Only include patients explicitly discussed in the transcript or context.)

Patient: [patient name or identifier and medical record number] (Only include if explicitly mentioned in transcript or context, else omit entirely.)
Bed Number: [bed number or location] (Only include if explicitly mentioned in transcript or context, else omit entirely.)
Admitting Diagnosis: [primary admitting diagnosis or reason for admission] (Only include if explicitly mentioned in transcript or context, else omit entirely.)
Day of Admission: [day number of current admission or date of admission] (Only include if explicitly mentioned in transcript or context, else omit entirely.)

Current Status Summary:
[summarise the patient's current clinical status including overnight events, nursing concerns, changes in observations or clinical condition, and any significant developments since last review] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write in concise sentences, line by line.)

Observations:
[document relevant vital signs, early warning scores, fluid balance, or other monitored parameters] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write each parameter on a new line.)

Investigation Results:
[document results returned or pending including pathology, imaging, microbiology, or other investigations] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write each result on a new line, noting whether result is returned or pending.)

Current Management Plan:
[describe the current active management plan including medications, therapies, allied health involvement, and nursing directives] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write each management item on a new line.)

Changes Made During Round:
[document any new decisions, changes to medications, escalation or de-escalation of care, new investigations ordered, or changes to management plan made during the ward round] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write each change on a new line.)

Tasks Allocated:
[document each task arising from the ward round review of this patient, including a description of the task, the person or role it is assigned to, and the priority or urgency level] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write each task on a new line in the format: task description - assigned to - priority level.)

Discharge Planning:
Estimated Discharge Date: [estimated date of discharge] (Only include if explicitly mentioned in transcript or context, else omit entirely.)
Barriers to Discharge: [describe any barriers preventing or delaying discharge such as pending results, social issues, allied health clearance, or clinical criteria not yet met] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write each barrier on a new line.)

Next Review: [timing or plan for next clinical review of this patient] (Only include if explicitly mentioned in transcript or context, else omit entirely.)

---

New Admissions:
(Repeat the following block for each new admission. Separate each patient with a blank line. Only include patients explicitly discussed in the transcript or context.)

Patient: [patient name or identifier and medical record number] (Only include if explicitly mentioned in transcript or context, else omit entirely.)
Bed Number: [bed number or location] (Only include if explicitly mentioned in transcript or context, else omit entirely.)
Presenting Complaint: [primary presenting complaint or reason for admission] (Only include if explicitly mentioned in transcript or context, else omit entirely.)
Brief History: [concise summary of relevant history and clinical findings on admission] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write in concise sentences.)
Initial Plan: [initial management plan including investigations, treatments, and anticipated course] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write each plan item on a new line.)

---

Discharges:
(Repeat the following block for each patient discharged or planned for discharge today. Separate each patient with a blank line. Only include patients explicitly discussed in the transcript or context.)

Patient: [patient name or identifier and medical record number] (Only include if explicitly mentioned in transcript or context, else omit entirely.)
Discharge Status: [whether the patient has been discharged or is planned for discharge today] (Only include if explicitly mentioned in transcript or context, else omit entirely.)
Outstanding Tasks: [any tasks that must be completed before or following discharge such as discharge summary, medication reconciliation, follow-up appointments, referrals, or patient education] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write each task on a new line.)

---

Escalations / Safety Concerns:
(Only include this section if escalations or safety concerns are explicitly mentioned in the transcript or context, else omit section entirely.)

[identify any patients requiring urgent attention, patients with clinical deterioration, rapid response or code activations, safety alerts, infection control concerns, falls risk, medication safety issues, or other clinical safety matters] (Only include if explicitly mentioned in transcript or context, else omit section entirely. Write each concern on a new line, identifying the patient and the nature of the concern.)

---

Action Summary:
(Compile a consolidated list of all tasks from the entire ward round. Only include tasks explicitly mentioned in the transcript or context, else omit section entirely. Write each task on a new line in the format: task description - patient name or identifier - assigned to - timeframe or priority.)

[list every task allocated during the ward round across all patients reviewed, including the task description, the patient it relates to, the person or role assigned, and the required timeframe or priority level] (Only include if explicitly mentioned in transcript or context, else omit section entirely.)

(Never come up with your own patient details, assessment, plan, interventions, evaluation, and plan for continuing care - use only the transcript, contextual notes or clinical note as a reference for the information included in your note. If any information related to a placeholder has not been explicitly mentioned in the transcript, contextual notes or clinical note, you must not state the information has not been explicitly mentioned in your output, just leave the relevant placeholder or omit the placeholder completely.)

(Use as many lines, paragraphs or bullet points, depending on the format, as needed to capture all the relevant information from the transcript.)`
  },

  {
    id: 'eating-disorder-assessment',
    title: 'Eating Disorder Intake & Assessment',
    category: 'Nutrition',
    isDefault: false,
    supportsICD10: true,
    prompt: `1. Weight History  
 - Dieting History: [Details about past diets or weight-loss efforts.] (Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise omit completely.)  
 - Weight Cycling: [Information on any fluctuations in weight over time.] (Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise omit completely.)  
 - Pre-morbid Weight: [Client’s usual or stable weight before any significant changes.] (Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise omit completely.)

2. Body Image  
 - Body Checking Behaviors: [Describe any behaviors related to checking appearance or body size.] (Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise omit completely.)  
 - Body Avoiding Activities: [Activities the client avoids due to body image concerns.] (Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise omit completely.)

3. Disordered Eating/Eating Disorder Behavior  
 - Restricting Intake: [Frequency, duration, context of restricting food intake.] (Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise omit completely.)  
 - Binge Eating: [Frequency, duration, context of binge eating episodes.] (Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise omit completely.)  
 - Overeating: [Details on any instances of overeating.] (Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise omit completely.)  
 - Self-induced Vomiting: [Frequency, duration, context of vomiting to control weight.] (Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise omit completely.)  
 - Exercise: [Details on exercise patterns, including any compulsive exercise.] (Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise omit completely.)  
 - Rumination: [Instances of food regurgitation or rumination.] (Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise omit completely.)  
 - Chewing and Spitting: [Frequency and context of chewing food and spitting it out.] (Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise omit completely.)  
 - Laxative/Diuretic Use: [Details on any use of laxatives or diuretics.] (Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise omit completely.)  
 - Diet Pills: [Information on any diet pill usage.] (Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise omit completely.)  
 - Night Eating: [Details on eating behaviors during the night.] (Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise omit completely.)

4. Eating Behavior  
 - Hunger/Fullness Cues: [Client’s ability to recognize and respond to hunger/fullness.] (Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise omit completely.)  
 - Food Rules/Fear Foods: [Any specific food rules or foods the client fears.] (Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise omit completely.)  
 - Allergies/Intolerances: [Known food allergies or intolerances.] (Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise omit completely.)  
 - Vegan/Vegetarian: [Details on any vegan or vegetarian diet followed.] (Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise omit completely.)

5. Nutrition Intake  
 - Wakes Up: [Usual wake-up time and any eating habits upon waking.] (Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise omit completely.)  
 - Breakfast: [Details on breakfast routine.] (Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise omit completely.)  
 - Snack: [Details on morning snack, if applicable.] (Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise omit completely.)  
 - Lunch: [Details on lunch routine.] (Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise omit completely.)  
 - Snack: [Details on afternoon snack, if applicable.] (Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise omit completely.)  
 - Dinner: [Details on dinner routine.] (Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise omit completely.)  
 - Snack: [Details on evening snack, if applicable.] (Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise omit completely.)  
 - Meals per Day: [Total number of meals and snacks per day.] (Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise omit completely.)  
 - Fluid Intake: [Details on daily fluid consumption.] (Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise omit completely.)

6. Physical Activity Behavior  
 - Current Activity: [Type and frequency of physical activity.] (Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise omit completely.)  
 - Relationship with Physical Activity: [Client’s feelings and relationship with physical activity.] (Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise omit completely.)

7. Medical & Psychiatric History  
 - [Details on any relevant medical and psychiatric history.] (Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise omit completely.)

8. Menstrual History  
 - Age of Menses: [Age at onset of menstruation.] (Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise omit completely.)  
 - Dates of Last Period: [Most recent menstrual period dates.] (Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise omit completely.)  
 - Usual Cycle Length: [Typical length of menstrual cycle.] (Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise omit completely.)  
 - Regularity of Cycle: [Description of cycle regularity.] (Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise omit completely.)  
 - Symptoms: [Any symptoms related to menstruation.] (Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise omit completely.)  
 - Use of Contraception: [Type of contraception used.] (Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise omit completely.)

9. Gut/Bowel Health  
 - [Details on bowel habits and gut health.] (Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise omit completely.)

10. Pathology/Scans  
 - ECG/BMD: [Details on any relevant pathology or scans.] (Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise omit completely.)

11. Medications/Supplements  
 - [List any medications or supplements the client is currently taking.] (Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise omit completely.)

12. Social History/Lifestyle  
 - Living Status: [Details on living arrangements.] (Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise omit completely.)  
 - Occupation: [Client’s occupation.] (Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise omit completely.)  
 - Alcohol Intake: [Details on alcohol consumption.] (Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise omit completely.)  
 - Smoking Status: [Smoking habits, if applicable.] (Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise omit completely.)  
 - Stress: [Stress levels and sources of stress.] (Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise omit completely.)  
 - Sleep: [Details on sleep patterns and quality.] (Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise omit completely.)  
 - Relaxation/Self-care Activities: [Activities the client engages in for relaxation and self-care.] (Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise omit completely.)  
 - Other Allied Health Professionals: [List of other healthcare providers involved in the client’s care.] (Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise omit completely.)

(Never come up with your own patient details, assessment, plan, interventions, evaluation, and plan for continuing care - use only the transcript, contextual notes, or clinical note as a reference for the information included in your note. If any information related to a placeholder has not been explicitly mentioned in the transcript, contextual notes or clinical note, you must not state that it has not been mentioned and instead leave the relevant placeholder blank.)`
  },

  {
    id: 'smart-goals',
    title: 'SMART Goals',
    category: 'Other',
    isDefault: false,
    supportsICD10: false,
    prompt: `SMART Goal 1    
Patient problems/needs/relevant conditions:  
- [Briefly state the relevant problem, need or condition for SMART goal 1] (Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise omit completely.)

Goals - changes to be achieved:  
- [Briefly state or list the goal(s) or changes to be achieved by the patient for SMART goal 1] (Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise omit completely.)

Required treatments and services, including patient actions:  
- [Briefly state or list the treatments and services required to reach the above goals, including any actions to be taken by the patient] (Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise omit completely.)

Arrangements for treatment/services (when, who, contact details):  
- [Briefly state or list what actions the doctor has taken or arrangement they will make to assist the patient in accessing the required treatments and services, including any relevant dates, clinician information and contact details for the services] (Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise omit completely.)

SMART Goal 2  
Patient problems/needs/relevant conditions:  
- [Briefly state the relevant problem, need or condition for SMART goal 2] (Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise omit completely.)

Goals - changes to be achieved:  
- [Briefly state or list the goal(s) or changes to be achieved by the patient for SMART goal 2] (Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise omit completely.)

Required treatments and services, including patient actions:  
- [Briefly state or list the treatments and services required to reach the above goals, including any actions to be taken by the patient] (Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise omit completely.)

Arrangements for treatment/services (when, who, contact details):  
- [Briefly state or list what actions the doctor has taken or arrangement they will make to assist the patient in accessing the required treatments and services, including any relevant dates, clinician information and contact details for the services] (Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise omit completely.)

(Only include SMART Goal 2, 3, 4 etc if the relevant SMART goals have been stated in the consult note or transcript; use the same template above for each SMART Goal listed.)

(Never come up with your own patient details, assessment, plan, interventions, evaluation, or next steps—use only the transcript, contextual notes, or clinical note as reference for all information. If any information related to a placeholder has not been explicitly mentioned, do not state that in the output; simply leave the relevant placeholder or section out entirely. Use as many lines, paragraphs, or bullet points as needed to capture all relevant information from the transcript.)`
  },

  {
    id: 'board-meeting-minutes',
    title: 'Board Executive Meeting Minutes',
    category: 'Meeting',
    isDefault: false,
    supportsICD10: false,
    prompt: `Meeting Details:
[organisation name] (Only include if explicitly mentioned in transcript or context, else omit entirely.)
[meeting type e.g. Board Meeting, Executive Meeting, Board Sub-Committee Meeting] (Only include if explicitly mentioned in transcript or context, else omit entirely.)
[date of meeting] (Only include if explicitly mentioned in transcript or context, else omit entirely. Use format DD/MM/YYYY.)
[time of meeting including start time and expected end time] (Only include if explicitly mentioned in transcript or context, else omit entirely.)
[location or virtual platform used for the meeting] (Only include if explicitly mentioned in transcript or context, else omit entirely.)
[name and title of the chairperson] (Only include if explicitly mentioned in transcript or context, else omit entirely.)
[name and title of the minute taker] (Only include if explicitly mentioned in transcript or context, else omit entirely.)

Attendance:

Members Present
[list each member present with their full name and title or role on the board] (Only include if explicitly mentioned in transcript or context, else omit section entirely. List each member on a new line.)

Apologies
[list each member who submitted apologies with their full name and title] (Only include if explicitly mentioned in transcript or context, else omit section entirely. List each member on a new line.)

Guests and Observers
[list any guests, observers or invitees attending with their name, title and reason for attendance] (Only include if explicitly mentioned in transcript or context, else omit section entirely. List each person on a new line.)

Quorum
[confirm whether quorum was achieved, stating the number of members present versus the number required for quorum] (Only include if explicitly mentioned in transcript or context, else omit section entirely.)

Declaration of Conflicts of Interest:
[describe any new conflicts of interest declared by members, including the member name, nature of the conflict and the agenda item to which it relates] (Only include if explicitly mentioned in transcript or context, else omit section entirely. List each declaration on a new line.)
[describe any previously declared standing conflicts of interest relevant to items on the current agenda] (Only include if explicitly mentioned in transcript or context, else omit section entirely. List each on a new line.)
[describe how each declared conflict was managed, including whether the member was recused from discussion or voting on the relevant item] (Only include if explicitly mentioned in transcript or context, else omit section entirely.)
(If no conflicts of interest were declared, state: "No new or existing conflicts of interest were declared.")

Previous Minutes:
[state whether the minutes from the previous meeting were approved, including the date of the previous meeting and the names of the mover and seconder of the motion to approve] (Only include if explicitly mentioned in transcript or context, else omit section entirely.)
[describe any amendments requested to the previous minutes before approval] (Only include if explicitly mentioned in transcript or context, else omit section entirely.)

Matters Arising from Previous Minutes
[for each matter arising, describe the item, the person responsible, the current status and any update provided] (Only include if explicitly mentioned in transcript or context, else omit section entirely. List each matter arising on a new line with the item description, responsible person and status clearly identified.)

Consent Agenda:
[list all items approved under the consent agenda without discussion] (Only include if explicitly mentioned in transcript or context, else omit section entirely. List each item on a new line.)
[describe any items removed from the consent agenda for separate discussion, including the reason for removal and the member who requested removal] (Only include if explicitly mentioned in transcript or context, else omit section entirely. List each removed item on a new line.)
(If no consent agenda was used, omit this section entirely.)

Reports:
(Repeat the following block for each standing report presented during the meeting. Only include each report if explicitly mentioned in transcript or context, else omit entirely.)

[report title e.g. CEO Report, Finance Report, Clinical Governance Report, Operations Report, Quality and Safety Report]
Presenter: [name and title of the person presenting the report] (Only include if explicitly mentioned in transcript or context, else omit entirely.)
Key Highlights and Issues: [summarise the key highlights, achievements, concerns and issues raised in the report] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write in full sentences.)
Questions Raised and Responses: [document questions raised by board or executive members and the responses provided] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write each question and response pair on a new line.)
Decisions or Directions Given: [document any decisions made or directions given by the board or executive in relation to the report] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write each decision or direction on a new line.)

Strategic Items:
(Repeat the following block for each strategic item requiring board or executive decision or discussion. Only include each item if explicitly mentioned in transcript or context, else omit entirely.)

[item title and paper reference number]
Background and Context: [describe the background, context and purpose of the item being brought to the board or executive for consideration] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write in full sentences.)
Options Presented: [describe the options or recommendations presented for consideration] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write each option on a new line.)
Discussion Summary: [summarise the key points of discussion, including differing views, concerns raised and considerations noted] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write in full sentences.)
Resolution and Decision: [state the resolution or decision reached, including the exact wording of any formal motion, the name of the mover and seconder] (Only include if explicitly mentioned in transcript or context, else omit entirely.)
Voting Outcome: [state the voting outcome including the number of votes for, against and any abstentions] (Only include if a formal vote was taken and explicitly mentioned in transcript or context, else omit entirely.)

Risk and Compliance:
[summarise the current status of the organisational risk register, including the total number of risks, any changes to risk ratings and the highest rated risks] (Only include if explicitly mentioned in transcript or context, else omit section entirely. Write in full sentences.)
[describe any new risks identified or existing risks escalated during the meeting, including the risk description, rating and proposed mitigation] (Only include if explicitly mentioned in transcript or context, else omit section entirely. Write each risk on a new line.)
[describe any regulatory matters discussed, including compliance status, audit findings, accreditation updates or correspondence from regulators] (Only include if explicitly mentioned in transcript or context, else omit section entirely. Write in full sentences.)
[describe any legal matters or updates discussed, including litigation, claims, legal advice received or contractual matters] (Only include if explicitly mentioned in transcript or context, else omit section entirely. Write in full sentences.)

Finance:

Financial Performance Summary
Revenue: [state revenue figure and any variance from budget] (Only include if explicitly mentioned in transcript or context, else omit entirely.)
Expenditure: [state expenditure figure and any variance from budget] (Only include if explicitly mentioned in transcript or context, else omit entirely.)
Net Result: [state net surplus or deficit and variance from budget] (Only include if explicitly mentioned in transcript or context, else omit entirely.)
Cash Position: [state current cash position and any commentary on liquidity] (Only include if explicitly mentioned in transcript or context, else omit entirely.)
[describe any other key financial metrics or ratios discussed] (Only include if explicitly mentioned in transcript or context, else omit entirely.)

Capital Expenditure
[describe any capital expenditure items presented for approval, including the item description, amount, business case summary and approval outcome] (Only include if explicitly mentioned in transcript or context, else omit section entirely. List each item on a new line.)

In-Camera / Confidential Session:
(If an in-camera or confidential session was held, include the following notation. If no confidential session was held, omit this section entirely.)
[state that the board or executive moved into a confidential session, including the time the session commenced and the time it concluded] (Only include if explicitly mentioned in transcript or context, else omit section entirely.)
[list any members or guests who were excused from the confidential session] (Only include if explicitly mentioned in transcript or context, else omit entirely.)
[state that details of the confidential session are recorded in a separate confidential minute and stored in accordance with governance requirements] (Only include if explicitly mentioned in transcript or context, else omit entirely.)

Resolutions Register:
(List all formal resolutions passed during the meeting. Number each resolution sequentially. Only include if explicitly mentioned in transcript or context, else omit section entirely.)
[resolution number, resolution text, mover, seconder and outcome for each resolution passed] (Only include if explicitly mentioned in transcript or context, else omit section entirely. List each resolution on a new line with its number, full text, mover, seconder and outcome clearly stated.)

Action Register:
(List all actions arising from the meeting. Only include if explicitly mentioned in transcript or context, else omit section entirely.)
[for each action, describe the action item, the person responsible, the deadline for completion and the current status] (Only include if explicitly mentioned in transcript or context, else omit section entirely. List each action on a new line with the action description, responsible person, deadline and status clearly identified.)

Next Meeting:
[date and time of the next scheduled meeting] (Only include if explicitly mentioned in transcript or context, else omit entirely. Use format DD/MM/YYYY.)
[location or platform for the next meeting] (Only include if explicitly mentioned in transcript or context, else omit entirely.)
[key agenda items anticipated for the next meeting] (Only include if explicitly mentioned in transcript or context, else omit entirely. List each anticipated item on a new line.)

(Never come up with your own patient details, assessment, plan, interventions, evaluation, and plan for continuing care - use only the transcript, contextual notes or clinical note as a reference for the information included in your note. If any information related to a placeholder has not been explicitly mentioned in the transcript, contextual notes or clinical note, you must not state the information has not been explicitly mentioned in your output, just leave the relevant placeholder or omit the placeholder completely.)

(Use as many lines, paragraphs or bullet points, depending on the format, as needed to capture all the relevant information from the transcript.)

(All resolutions, decisions and voting outcomes must be recorded with precise wording. Board and executive meeting minutes are legal documents and must be stored and maintained in accordance with organisational governance policies and applicable legislation.)`
  },

  {
    id: 'business-meeting',
    title: 'Business Meeting',
    category: 'Meeting',
    isDefault: false,
    supportsICD10: false,
    prompt: `Meeting Summary
[comprehensive summary of the key topics discussed, decisions made, and outcomes from the meeting] (Only include if explicitly mentioned in transcript, contextual notes or clinical note, else omit completely. Write in paragraph format.)

Attendees
[list of meeting participants as identified in the transcript] (Only include if explicitly mentioned in transcript, contextual notes or clinical note, else omit completely. Format as a simple list.)

Meeting Minutes
[chronological record of discussion points, decisions, and action items with speaker attribution where identifiable] (Only include if explicitly mentioned in transcript, contextual notes or clinical note, else omit completely. Write in detailed paragraphs or bullet points as appropriate.)

Action Items
[specific tasks, responsibilities, and deadlines assigned during the meeting] (Only include if explicitly mentioned in transcript, contextual notes or clinical note, else omit section entirely. Format as bullet points with responsible parties and timelines.)

Key Decisions
[important decisions made during the meeting and their rationale] (Only include if explicitly mentioned in transcript, contextual notes or clinical note, else omit section entirely. Write in paragraph format.)

Next Steps
[planned follow-up activities, future meetings, or subsequent actions discussed] (Only include if explicitly mentioned in transcript, contextual notes or clinical note, else omit section entirely. Format as bullet points or paragraphs.)

Post-Meeting Reflections
[Post-meeting reflections, insights, and commentary as provided at the end of the transcript] (Only include if explicitly mentioned in transcript, contextual notes or clinical note, else omit section entirely. Write in paragraph format.)`
  },

  {
    id: 'clinical-governance-meeting',
    title: 'Clinical Governance Meeting Note',
    category: 'Meeting',
    isDefault: false,
    supportsICD10: false,
    prompt: `Clinical Governance Meeting Minutes

1. Meeting Details:
[organisation or department name] (Only include if explicitly mentioned in transcript or context, else omit entirely.)
Date: [date of meeting] (Only include if explicitly mentioned in transcript or context, else omit entirely.)
Time: [start time and end time of meeting] (Only include if explicitly mentioned in transcript or context, else omit entirely.)
Location: [meeting location or virtual platform used] (Only include if explicitly mentioned in transcript or context, else omit entirely.)
Chair: [name and title of meeting chair] (Only include if explicitly mentioned in transcript or context, else omit entirely.)

Attendees:
[list each attendee with their name and role, each on a new line] (Only include if explicitly mentioned in transcript or context, else omit entirely. List each attendee on a separate line in the format: Name - Role.)

Apologies:
[list names and roles of those who sent apologies] (Only include if explicitly mentioned in transcript or context, else omit entirely. List each person on a separate line.)

Quorum Status:
[state whether quorum was achieved and the basis for determination] (Only include if explicitly mentioned in transcript or context, else omit entirely.)

2. Previous Minutes:

Confirmation of Previous Minutes:
[state whether the minutes from the previous meeting were accepted as a true and accurate record, including who moved and seconded the motion] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write in full sentences.)

Matters Arising:
[for each matter arising from previous minutes, document the item description, responsible person, current status, and any update or progress notes] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write each matter arising on its own line in the format: Item - Responsible Person - Status - Update. Repeat for each matter arising discussed.)

3. Incident Review:

Summary of Incidents Since Last Meeting:
[document the total number of incidents reported since the previous meeting, breakdown by severity classification, and summary of incident categories] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write in full sentences and paragraphs.)

Specific Incidents for Detailed Discussion:
[for each incident discussed in detail, document a de-identified summary of the incident, contributing factors identified, impact on patient safety or care quality, and any immediate actions taken] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write each incident as a separate paragraph. De-identify patient information where appropriate.)

Root Cause Analyses:
[document any root cause analyses completed or in progress, including the incident reference, findings, and recommendations] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write each root cause analysis on its own line or paragraph.)

Trends Identified:
[describe any patterns or trends identified across incidents, including timeframes, clinical areas, or contributing factors] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write in full sentences and paragraphs.)

Recommendations Arising:
[document each recommendation arising from incident review, including the rationale for the recommendation and proposed responsible person or team] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write each recommendation on a separate line.)

4. Clinical Audit and Quality Indicators:

Audit Results Presented:
[for each audit presented, document the audit title, scope, methodology, key findings, and conclusions] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write each audit as a separate paragraph.)

Performance Against Benchmarks:
[document performance against key quality indicators and benchmarks, noting whether targets were met, exceeded, or not met] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write in full sentences.)

Areas of Concern:
[describe any areas where performance is below expected standards, including contributing factors and proposed corrective actions] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write each area of concern as a separate paragraph.)

Areas of Good Practice:
[describe any areas of notable good practice or sustained high performance deserving recognition] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write in full sentences.)

5. Risk Register Review:

New Risks Identified:
[for each new risk identified, document the risk description, initial risk rating, proposed controls, and responsible person] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write each new risk on its own line or paragraph.)

Existing Risks Reviewed:
[for each existing risk reviewed, document the risk description, current risk rating, controls currently in place, effectiveness of controls, and any further actions required] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write each risk reviewed as a separate entry with all fields on their own lines.)

Risks for Escalation:
[document any risks that require escalation to the board, executive, or external body, including the rationale for escalation] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write each risk for escalation as a separate paragraph.)

Risks Recommended for Closure:
[document any risks recommended for closure, including the rationale and evidence supporting closure] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write each risk recommended for closure on a separate line.)

6. Policy and Guideline Review:

Policies Due for Review:
[list each policy due for review, including the policy name, current version date, and assigned reviewer] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write each policy on a separate line.)

New Guidelines to Adopt:
[document any new clinical guidelines recommended for adoption, including the source, relevance, and proposed implementation approach] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write each guideline as a separate paragraph.)

Gaps Identified:
[describe any gaps in current policies or guidelines, including the clinical area affected and proposed actions to address the gap] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write in full sentences.)

7. Compliance and Regulatory:

Accreditation Status:
[document current accreditation status, including any upcoming accreditation activities, deadlines, or preparation requirements] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write in full sentences.)

Regulatory Correspondence:
[document any correspondence received from or sent to regulatory bodies, including the nature of the correspondence and any required actions] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write each item of correspondence as a separate paragraph.)

Mandatory Reporting Obligations:
[document any mandatory reporting obligations addressed or outstanding, including the relevant authority and deadlines] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write each obligation on a separate line.)

External Reviews:
[document any external reviews conducted, planned, or in progress, including the reviewing body, scope, and findings or status] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write in full sentences.)

8. Consumer Feedback:

Patient Complaints and Compliments:
[summarise themes arising from patient complaints and compliments since the last meeting, including the number received, key themes, and any actions taken or required] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write in full sentences and paragraphs.)

Patient Experience Data:
[document any patient experience survey results or other consumer feedback data reviewed, including key findings and trends] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write in full sentences.)

9. Improvement Initiatives:

Current Quality Improvement Projects:
[for each current quality improvement project, document the project name, current status, progress against milestones, and outcomes achieved to date] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write each project as a separate paragraph.)

New Initiatives Proposed:
[document any new quality improvement initiatives proposed, including the rationale, scope, proposed lead, and resource requirements] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write each proposed initiative as a separate paragraph.)

10. Education and Training:

Clinical Education Delivered:
[document any clinical education sessions delivered since the last meeting, including the topic, audience, and attendance] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write each education session on a separate line.)

Mandatory Training Compliance:
[document current mandatory training compliance rates, noting any areas of concern or non-compliance] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write in full sentences.)

Lessons Learned Communications:
[document any lessons learned communications disseminated to staff, including the topic, format, and distribution] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write each communication on a separate line.)

11. Items for Escalation:
[document each matter requiring escalation to the board, executive, or other governance body, including a clear description of the issue, the rationale for escalation, the recommended action, and the urgency] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write each escalation item as a separate paragraph with full rationale documented.)

12. Action Register:

Actions Carried Forward from Previous Meetings:
[for each action carried forward, document the action description, responsible person, original deadline, revised deadline if applicable, and current status] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write each action on its own line in the format: Action - Responsible Person - Deadline - Status.)

New Actions from This Meeting:
[for each new action arising from this meeting, document the action description, responsible person, agreed deadline, and the agenda item from which it arose] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write each action on its own line in the format: Action - Responsible Person - Deadline - Arising From.)

13. Next Meeting:
Date: [date of next meeting] (Only include if explicitly mentioned in transcript or context, else omit entirely.)
Time: [time of next meeting] (Only include if explicitly mentioned in transcript or context, else omit entirely.)

Standing Agenda Items:
[list the standing agenda items for the next meeting] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write each item on a separate line.)

Special Agenda Items:
[list any special or additional agenda items flagged for the next meeting, including the requesting person and reason] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write each item on a separate line.)

(Never come up with your own patient details, assessment, plan, interventions, evaluation, and plan for continuing care - use only the transcript, contextual notes or clinical note as a reference for the information included in your note. If any information related to a placeholder has not been explicitly mentioned in the transcript, contextual notes or clinical note, you must not state the information has not been explicitly mentioned in your output, just leave the relevant placeholder or omit the placeholder completely.)

(Use as many lines, paragraphs or bullet points, depending on the format, as needed to capture all the relevant information from the transcript.)

(Ensure all decisions made during the meeting are clearly documented with the rationale recorded. Document who proposed and who seconded motions where applicable. Record any dissenting views or abstentions for formal accountability.)`
  },

  {
    id: 'team-meeting',
    title: 'Departmental Team Meeting Note',
    category: 'Meeting',
    isDefault: false,
    supportsICD10: false,
    prompt: `Meeting Details:
[department or clinical unit name] (Only include if explicitly mentioned in transcript or context, else omit section entirely.)
Date: [date of meeting] (Only include if explicitly mentioned in transcript or context, else omit section entirely.)
Time: [start and end time of meeting] (Only include if explicitly mentioned in transcript or context, else omit section entirely.)
Location: [meeting location or virtual platform used] (Only include if explicitly mentioned in transcript or context, else omit section entirely.)
Chair: [name and role of person chairing the meeting] (Only include if explicitly mentioned in transcript or context, else omit section entirely.)
Attendees: [names and roles of all staff present] (Only include if explicitly mentioned in transcript or context, else omit section entirely. List each attendee on a new line with their role.)
Apologies: [names and roles of staff who sent apologies] (Only include if explicitly mentioned in transcript or context, else omit section entirely. List each person on a new line.)

Previous Minutes:
[summary of matters arising from the previous meeting minutes] (Only include if explicitly mentioned in transcript or context, else omit section entirely. Write in paragraphs of full sentences.)
[status update on each action item from the previous meeting including responsible person and whether the action was completed, in progress or outstanding] (Only include if explicitly mentioned in transcript or context, else omit section entirely. List each action item on a new line with its current status.)

Department Performance:
[key performance metrics for the reporting period relevant to the department such as wait times, patient throughput, did-not-wait rates, bed occupancy, complication rates, readmission rates, turnaround times or other department-specific KPIs] (Only include if explicitly mentioned in transcript or context, else omit section entirely. List each metric on a new line with its value.)
[comparison of current performance metrics against departmental or organisational targets] (Only include if explicitly mentioned in transcript or context, else omit section entirely. Write in full sentences.)
[description of notable trends, patterns or changes in performance over recent reporting periods] (Only include if explicitly mentioned in transcript or context, else omit section entirely. Write in paragraphs of full sentences.)

Staffing and Roster:
[current staffing levels across relevant roles and any comparison to funded or required establishment] (Only include if explicitly mentioned in transcript or context, else omit section entirely. Write in full sentences.)
[details of current vacancies including role, recruitment status and expected timelines] (Only include if explicitly mentioned in transcript or context, else omit section entirely. List each vacancy on a new line.)
[upcoming planned leave, roster gaps or coverage challenges] (Only include if explicitly mentioned in transcript or context, else omit section entirely. Write in full sentences.)
[details of locum or agency staff use including roles and duration] (Only include if explicitly mentioned in transcript or context, else omit section entirely. Write in full sentences.)
[any staff concerns, morale issues or workforce challenges raised during the meeting] (Only include if explicitly mentioned in transcript or context, else omit section entirely. Write in paragraphs of full sentences.)

Equipment and Resources:
[equipment issues, faults, maintenance updates or new equipment requests] (Only include if explicitly mentioned in transcript or context, else omit section entirely. List each item on a new line with a brief description.)
[supply chain problems, stock shortages or procurement delays] (Only include if explicitly mentioned in transcript or context, else omit section entirely. Write in full sentences.)
[IT system issues, software updates, downtime or access problems] (Only include if explicitly mentioned in transcript or context, else omit section entirely. Write in full sentences.)
[physical environment concerns such as space constraints, maintenance issues or facility upgrades] (Only include if explicitly mentioned in transcript or context, else omit section entirely. Write in full sentences.)

Clinical Updates:
[new clinical guidelines, protocols or policies relevant to the department] (Only include if explicitly mentioned in transcript or context, else omit section entirely. List each update on a new line with a brief summary.)
[changes to referral pathways, intake processes or interdepartmental workflows] (Only include if explicitly mentioned in transcript or context, else omit section entirely. Write in full sentences.)
[new services, procedures or models of care being introduced or trialled] (Only include if explicitly mentioned in transcript or context, else omit section entirely. Write in full sentences.)

Quality and Safety:
[recent clinical incidents, adverse events or complaints relevant to the department including any immediate actions taken] (Only include if explicitly mentioned in transcript or context, else omit section entirely. Write in paragraphs of full sentences. Do not include identifiable patient details.)
[results of recent clinical audits or quality reviews relevant to the department] (Only include if explicitly mentioned in transcript or context, else omit section entirely. Write in full sentences.)
[patient feedback, compliments or survey results] (Only include if explicitly mentioned in transcript or context, else omit section entirely. Write in full sentences.)
[near-miss events reported and any learning points identified] (Only include if explicitly mentioned in transcript or context, else omit section entirely. Write in full sentences.)
[infection control updates, outbreak alerts or hand hygiene compliance data] (Only include if explicitly mentioned in transcript or context, else omit section entirely. Write in full sentences.)

Process Improvements:
[current quality improvement projects or initiatives underway within the department including progress updates] (Only include if explicitly mentioned in transcript or context, else omit section entirely. List each project on a new line with its current status.)
[new improvement ideas proposed by staff during the meeting] (Only include if explicitly mentioned in transcript or context, else omit section entirely. List each idea on a new line with a brief description.)
[workflow changes, process redesigns or efficiency initiatives discussed] (Only include if explicitly mentioned in transcript or context, else omit section entirely. Write in full sentences.)

Education and Training:
[upcoming education sessions, in-service training, simulation exercises or skills workshops relevant to the department] (Only include if explicitly mentioned in transcript or context, else omit section entirely. List each session on a new line with date and details.)
[mandatory training compliance status and any overdue requirements] (Only include if explicitly mentioned in transcript or context, else omit section entirely. Write in full sentences.)
[conference opportunities, study leave applications or external education events] (Only include if explicitly mentioned in transcript or context, else omit section entirely. Write in full sentences.)
[student, intern or registrar supervision matters, rotations or teaching commitments] (Only include if explicitly mentioned in transcript or context, else omit section entirely. Write in full sentences.)

Staff Recognition and Wellbeing:
[shout-outs, acknowledgements or recognition of individual or team achievements] (Only include if explicitly mentioned in transcript or context, else omit section entirely. Write in full sentences.)
[staff wellbeing check-in including any concerns raised, support resources discussed or wellbeing initiatives] (Only include if explicitly mentioned in transcript or context, else omit section entirely. Write in full sentences.)
[upcoming social events, team-building activities or celebrations] (Only include if explicitly mentioned in transcript or context, else omit section entirely. Write in full sentences.)

General Business:
[any other items raised by staff members that do not fall under the above sections] (Only include if explicitly mentioned in transcript or context, else omit section entirely. Write in paragraphs of full sentences. Attribute items to the person who raised them where possible.)

Action Items:
[task description] - [responsible person] - [deadline or target date] (Only include if explicitly mentioned in transcript or context, else omit section entirely. List each action item on a new line in the format: task - responsible person - deadline.)

Next Meeting:
Date: [date of next scheduled meeting] (Only include if explicitly mentioned in transcript or context, else omit section entirely.)
Time: [time of next scheduled meeting] (Only include if explicitly mentioned in transcript or context, else omit section entirely.)
[agenda items flagged for the next meeting] (Only include if explicitly mentioned in transcript or context, else omit section entirely. List each flagged item on a new line.)

(Never come up with your own patient details, assessment, plan, interventions, evaluation, and plan for continuing care - use only the transcript, contextual notes or clinical note as a reference for the information included in your note. If any information related to a placeholder has not been explicitly mentioned in the transcript, contextual notes or clinical note, you must not state the information has not been explicitly mentioned in your output, just leave the relevant placeholder or omit the placeholder completely.)

(Use as many lines, paragraphs or bullet points, depending on the format, as needed to capture all the relevant information from the transcript.)`
  },

  {
    id: 'allied-health-meeting',
    title: 'Allied Health Team Meeting Note',
    category: 'Meeting',
    isDefault: false,
    supportsICD10: false,
    prompt: `Allied Health Team Meeting

Meeting Details:
Date: [date of meeting] (Only include if explicitly mentioned in transcript or context, else omit entirely. Use DD/MM/YYYY format.)
Time: [start and end time of meeting] (Only include if explicitly mentioned in transcript or context, else omit entirely.)
Location: [meeting location or virtual platform used] (Only include if explicitly mentioned in transcript or context, else omit entirely.)
Chair: [name and discipline of meeting chair] (Only include if explicitly mentioned in transcript or context, else omit entirely.)
Minute Taker: [name of person taking minutes] (Only include if explicitly mentioned in transcript or context, else omit entirely.)

Attendees:
[list each attendee with their name and allied health discipline] (Only include if explicitly mentioned in transcript or context, else omit entirely. List each attendee on a new line in the format: Name - Discipline.)

Apologies:
[list names and disciplines of those who sent apologies] (Only include if explicitly mentioned in transcript or context, else omit entirely. List each person on a new line.)

Patient/Client Updates:
(Repeat the block below for each patient or client discussed during the meeting. Only include if explicitly mentioned in transcript or context, else omit section entirely.)

Patient Identifier: [patient name or identifier discussed] (Only include if explicitly mentioned in transcript or context, else omit entirely.)
Discipline(s) Involved: [allied health disciplines currently involved in this patient's care] (Only include if explicitly mentioned in transcript or context, else omit entirely. List disciplines separated by commas.)
Progress Update: [brief summary of patient progress, current status, or concerns raised by treating clinicians] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write in concise sentences.)
Cross-Referrals: [any new referrals needed between allied health disciplines for this patient] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write in concise sentences.)
Coordination Issues / Shared Goals: [describe any coordination challenges, shared treatment goals, or collaborative interventions discussed] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write in concise sentences.)
Decisions / Outcomes: [document any decisions made or agreed outcomes regarding this patient's care] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write in concise sentences.)

Caseload and Waitlist Management:
Waitlist Status by Discipline: [summarise current waitlist numbers and status for each allied health discipline represented] (Only include if explicitly mentioned in transcript or context, else omit entirely. List each discipline on a new line with waitlist numbers and average wait time where available.)
Prioritisation Decisions: [describe any decisions made about prioritising patients on waitlists, including criteria used] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write in concise sentences.)
Patients at Risk of Breaching Wait Time Targets: [identify any patients or categories at risk of exceeding wait time benchmarks and actions planned] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write in concise sentences.)
Discharge Planning: [describe any patients identified for discharge or transition from active caseload] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write in concise sentences.)

Resource and Staffing:
Leave and Absences: [document upcoming or current staff leave, including dates and impact on service delivery] (Only include if explicitly mentioned in transcript or context, else omit entirely. List each staff member on a new line.)
Vacancies: [describe any current unfilled positions and recruitment status] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write in concise sentences.)
Locum / Agency Staff: [note any temporary staffing arrangements in place or being organised] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write in concise sentences.)
Workload Distribution: [describe any workload rebalancing, case transfers, or coverage arrangements discussed] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write in concise sentences.)
Equipment and Resources: [note any equipment needs, orders, maintenance issues, or resource requests discussed] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write in concise sentences.)

Service Development:
Process Improvements: [describe any workflow, documentation, or process changes discussed or proposed] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write in concise sentences.)
New Programs or Groups: [note any new group programs, clinical pathways, or services being developed or launched] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write in concise sentences.)
Evidence-Based Practice Updates: [summarise any new evidence, clinical guidelines, or research findings shared with the team] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write in concise sentences.)
Student Placements: [document any current or upcoming student placements, supervision arrangements, or related logistics] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write in concise sentences.)
Quality and Safety: [note any quality improvement activities, incident reviews, or safety concerns discussed] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write in concise sentences.)

Professional Development:
Upcoming Training: [list any upcoming training sessions, workshops, or in-services relevant to the team] (Only include if explicitly mentioned in transcript or context, else omit entirely. List each item on a new line with dates where available.)
Conference Attendance: [note any planned or recent conference attendance and key learnings shared] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write in concise sentences.)
Journal Club: [describe any journal club topics discussed or planned, including article details] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write in concise sentences.)
Competency Requirements: [note any credentialing, competency assessments, or mandatory training updates discussed] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write in concise sentences.)

General Business:
[document any other items raised during the meeting not covered by the sections above] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write each item as a separate point on a new line.)

Action Items:
(List each action item on a new line in the format below. Only include if explicitly mentioned in transcript or context, else omit section entirely.)
Action: [describe the task or action agreed upon] | Responsible: [name and discipline of person responsible] | Deadline: [due date or timeframe for completion]

Next Meeting:
Date: [date of next meeting] (Only include if explicitly mentioned in transcript or context, else omit entirely. Use DD/MM/YYYY format.)
Time: [time of next meeting] (Only include if explicitly mentioned in transcript or context, else omit entirely.)
Agenda Items to Carry Forward: [list any items deferred or flagged for follow-up at the next meeting] (Only include if explicitly mentioned in transcript or context, else omit entirely. List each item on a new line.)

(Never come up with your own patient details, assessment, plan, interventions, evaluation, and plan for continuing care - use only the transcript, contextual notes or clinical note as a reference for the information included in your note. If any information related to a placeholder has not been explicitly mentioned in the transcript, contextual notes or clinical note, you must not state the information has not been explicitly mentioned in your output, just leave the relevant placeholder or omit the placeholder completely.)

(Use as many lines, paragraphs or bullet points, depending on the format, as needed to capture all the relevant information from the transcript.)`
  },

  {
    id: 'discharge-planning-meeting',
    title: 'Discharge Planning Meeting Note',
    category: 'Meeting',
    isDefault: false,
    supportsICD10: false,
    prompt: `Discharge Planning Meeting

Meeting Details:
[date of meeting] (Only include if explicitly mentioned in transcript or context, else omit entirely.)
[time of meeting] (Only include if explicitly mentioned in transcript or context, else omit entirely.)
[location or virtual platform used for meeting] (Only include if explicitly mentioned in transcript or context, else omit entirely.)
[patient full name and hospital identifier or medical record number] (Only include if explicitly mentioned in transcript or context, else omit entirely.)
[current ward or unit where the patient is admitted] (Only include if explicitly mentioned in transcript or context, else omit entirely.)
[primary admitting diagnosis and any significant secondary diagnoses] (Only include if explicitly mentioned in transcript or context, else omit entirely.)
[date of admission] (Only include if explicitly mentioned in transcript or context, else omit entirely.)

Attendees:
[list each attendee with their full name and professional role or discipline, including medical officer, nursing staff, allied health professionals, social worker, discharge coordinator, patient, family members or carers, and any other participants] (Only include if explicitly mentioned in transcript or context, else omit entirely. List each attendee on a separate line with their name followed by their role in parentheses.)

Medical Fitness for Discharge:
[describe the patient's current clinical status including vital sign stability, symptom resolution, wound healing progress, and overall medical trajectory] (Only include if explicitly mentioned in transcript or context, else omit section entirely. Write in paragraphs of full sentences.)
[list any outstanding investigations, procedures, or specialist consultations still pending and their expected completion] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write as a list with each item on a new line.)
[state whether formal medical clearance for discharge has been given, including the name and role of the clearing clinician, or if clearance is pending and what conditions must be met] (Only include if explicitly mentioned in transcript or context, else omit entirely.)

Planned Discharge:
[target discharge date] (Only include if explicitly mentioned in transcript or context, else omit entirely.)
[discharge destination such as home, inpatient rehabilitation facility, residential aged care, transitional care, palliative care, or other setting, with facility name if known] (Only include if explicitly mentioned in transcript or context, else omit entirely.)
[transport arrangements including mode of transport, booking status, scheduled time, and who is responsible for arranging] (Only include if explicitly mentioned in transcript or context, else omit entirely.)

Functional Assessment:
[describe the patient's current mobility status including gait, balance, transfers, stair negotiation, use of mobility aids, and any physiotherapy or occupational therapy assessment findings relevant to safe discharge] (Only include if explicitly mentioned in transcript or context, else omit section entirely. Write in full sentences.)
[describe the patient's current level of independence with activities of daily living including showering, dressing, toileting, meal preparation, and domestic tasks] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write in full sentences.)
[describe any cognitive assessment findings relevant to discharge safety including orientation, decision-making capacity, memory, and ability to manage medications or emergency situations independently] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write in full sentences.)
[describe continence status including any continence aids required or continence management plans in place] (Only include if explicitly mentioned in transcript or context, else omit entirely.)

Home Environment and Support:
[describe the patient's home setup including dwelling type, access issues such as stairs or narrow doorways, bathroom configuration, and any identified hazards] (Only include if explicitly mentioned in transcript or context, else omit section entirely. Write in full sentences.)
[list any home modifications required, their current status such as ordered, in progress, or completed, and who is responsible for arranging] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write as a list with each item on a new line.)
[list any equipment required for safe discharge such as hospital bed, commode, shower chair, rails, pressure care devices, with their current order and delivery status] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write as a list with each item on a new line including status.)
[describe carer availability including who will be providing support at home, hours of availability, and any concerns about carer capacity or carer stress] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write in full sentences.)

Care Package and Community Services:
[list all community services arranged or to be arranged including home nursing, personal care, domestic assistance, meal services, allied health, day programs, and any other support services, with referral status and expected start dates] (Only include if explicitly mentioned in transcript or context, else omit section entirely. Write as a list with each service on a new line including provider name if known, referral status, and start date.)

Medications:
[list the planned discharge medications including name, dose, route, and frequency for each medication] (Only include if explicitly mentioned in transcript or context, else omit section entirely. Write as a numbered list with each medication on a new line.)
[describe any changes made to the patient's medications during the admission including new medications started, medications ceased, and dose adjustments, with reasons for each change] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write as a list with each change on a new line.)
[state whether medication education has been completed with the patient and/or carer, including what was covered and who provided the education] (Only include if explicitly mentioned in transcript or context, else omit entirely.)
[state whether a pharmacy review of the discharge medication list has been completed, including the pharmacist's name if known and any recommendations made] (Only include if explicitly mentioned in transcript or context, else omit entirely.)

Follow-Up Appointments:
[list all follow-up appointments arranged or to be arranged including general practitioner, specialist, and allied health appointments, with clinician name, date, time, and location where known, and state if the appointment is confirmed or still to be booked] (Only include if explicitly mentioned in transcript or context, else omit section entirely. Write as a list with each appointment on a new line.)

Patient and Family Understanding and Concerns:
[describe the patient's and family's or carer's documented understanding of the discharge plan, including what has been explained to them and their level of agreement with the plan] (Only include if explicitly mentioned in transcript or context, else omit section entirely. Write in paragraphs of full sentences.)
[document any concerns raised by the patient, family, or carer, including specific worries about safety, readiness, support adequacy, or other issues] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write in full sentences.)
[document any unresolved issues or disagreements regarding the discharge plan and how these are being addressed] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write in full sentences.)

Action Items:
(For each action item discussed in the meeting, document the following on a separate line. Repeat for every action item identified. Do not omit any action items discussed.)

Action Item 1
Task: [describe the specific task or action required] (Only include if explicitly mentioned in transcript or context, else omit entirely.)
Responsible Person: [name and role of the person responsible for completing this task] (Only include if explicitly mentioned in transcript or context, else omit entirely.)
Deadline: [date or timeframe by which the task must be completed] (Only include if explicitly mentioned in transcript or context, else omit entirely.)
Status: [current status such as not started, in progress, completed, or blocked] (Only include if explicitly mentioned in transcript or context, else omit entirely.)

(Repeat the above Action Item format for each subsequent action item, numbering sequentially as Action Item 2, Action Item 3, and so on, until all action items from the meeting have been captured.)

Contingency Plan:
[describe the plan if discharge is delayed, including clinical criteria that must be met before discharge can proceed, interim care arrangements, and who is responsible for reassessing readiness] (Only include if explicitly mentioned in transcript or context, else omit section entirely. Write in full sentences.)
[describe what the patient and family should do if issues arise post-discharge, including who to contact, relevant phone numbers, when to present to the emergency department, and any red flag symptoms to watch for] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write in full sentences.)

(Never come up with your own patient details, assessment, plan, interventions, evaluation, and plan for continuing care - use only the transcript, contextual notes or clinical note as a reference for the information included in your note. If any information related to a placeholder has not been explicitly mentioned in the transcript, contextual notes or clinical note, you must not state the information has not been explicitly mentioned in your output, just leave the relevant placeholder or omit the placeholder completely.)

(Use as many lines, paragraphs or bullet points, depending on the format, as needed to capture all the relevant information from the transcript.)`
  },

  {
    id: 'family-meeting',
    title: 'Family Meeting Case Conference Note',
    category: 'Meeting',
    isDefault: false,
    supportsICD10: false,
    prompt: `(Note: This document forms part of the patient's medical record and may be accessed by the patient or their authorised representative under applicable health records legislation. Ensure all entries are factual, objective, and clinically appropriate.)

Meeting Details:
Date: [date of meeting] (Only include if explicitly mentioned in transcript or context, else omit entirely.)
Time: [time meeting commenced and concluded] (Only include if explicitly mentioned in transcript or context, else omit entirely.)
Location: [location of meeting or telehealth platform used] (Only include if explicitly mentioned in transcript or context, else omit entirely.)
Patient: [patient full name] (Only include if explicitly mentioned in transcript or context, else omit entirely.)
Patient Identifier: [patient identifier such as medical record number, date of birth or unit number] (Only include if explicitly mentioned in transcript or context, else omit entirely.)
Reason for Meeting: [brief statement of the reason for convening the meeting] (Only include if explicitly mentioned in transcript or context, else omit entirely.)

Attendees:
[list each attendee on a separate line including their full name, role or relationship to the patient, and whether they attended in person or via telehealth] (Only include if explicitly mentioned in transcript or context, else omit entirely. List each attendee on a separate line in the format: Name - Role/Relationship - Attendance mode. Repeat for each attendee discussed.)

Purpose of Meeting:
[describe the purpose and objectives of the meeting including the specific topics or decisions the meeting was convened to address] (Only include if explicitly mentioned in transcript or context, else omit section entirely. Write in a brief paragraph of full sentences.)

Background / Context:
[summarise the patient's current clinical situation, relevant medical history, recent investigations or changes in condition, and the circumstances leading to this meeting being convened] (Only include if explicitly mentioned in transcript or context, else omit section entirely. Write in paragraphs of full sentences.)

Information Shared:

Diagnosis and Current Condition
[describe the diagnosis and current clinical condition as communicated to the patient and family during the meeting] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write in paragraphs of full sentences.)

Prognosis and Expected Trajectory
[describe the prognostic information and expected clinical trajectory communicated to the patient and family] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write in paragraphs of full sentences.)

Treatment Options
[describe the treatment options discussed including benefits, risks, alternatives and any limitations of treatment as communicated to the patient and family] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write in paragraphs of full sentences.)

Support Services Available
[describe any support services, allied health referrals, community resources or psychosocial supports discussed with the patient and family] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write in paragraphs of full sentences.)

Family / Patient Questions and Concerns:
[document the questions raised by the patient or family members, concerns expressed, specific topics they sought clarification on, and how each was addressed by the clinical team] (Only include if explicitly mentioned in transcript or context, else omit section entirely. Write in paragraphs of full sentences. Attribute questions or concerns to the person who raised them where possible.)

Decisions Made:
[document all decisions reached during the meeting including the rationale, any decisions that were deferred and the reasons for deferral, and whether consensus was reached] (Only include if explicitly mentioned in transcript or context, else omit section entirely. Write in paragraphs of full sentences.)

Emotional Tone / Family Response:
[describe how the information was received by the patient and family, the overall emotional tone of the meeting, the level of understanding demonstrated, any distress observed, and any conflict or disagreement that arose] (Only include if explicitly mentioned in transcript or context, else omit section entirely. Write in a brief paragraph of full sentences. Use sensitive, objective language.)

Follow-Up Plan:
[describe the agreed follow-up plan including next steps in care, who will be responsible for follow-up, any scheduled follow-up meetings or contacts, referrals made, and any outstanding items requiring further discussion] (Only include if explicitly mentioned in transcript or context, else omit section entirely. Write in paragraphs of full sentences.)

Action Items:
[list each action item on a separate line including the task to be completed, the person responsible, and the deadline or timeframe] (Only include if explicitly mentioned in transcript or context, else omit section entirely. List each action item on a separate line in the format: Task - Responsible Person - Deadline. Repeat for each action item discussed.)

(Never come up with your own patient details, assessment, plan, interventions, evaluation, and plan for continuing care - use only the transcript, contextual notes or clinical note as a reference for the information included in your note. If any information related to a placeholder has not been explicitly mentioned in the transcript, contextual notes or clinical note, you must not state the information has not been explicitly mentioned in your output, just leave the relevant placeholder or omit the placeholder completely.)

(Use as many lines, paragraphs or bullet points, depending on the format, as needed to capture all the relevant information from the transcript.)`
  },

  {
    id: 'clinical-supervision',
    title: 'Case Review Clinical Supervision Note',
    category: 'Medical',
    isDefault: false,
    supportsICD10: false,
    prompt: `Case Review / Clinical Supervision Note

(This document is a confidential professional development record. It should be stored securely and treated in accordance with organisational clinical governance policies.)

Session Details:
[date of supervision session] (Only include if explicitly mentioned in transcript or context, else omit entirely.)
[time supervision session commenced and concluded] (Only include if explicitly mentioned in transcript or context, else omit entirely.)
[location or virtual platform where supervision was conducted] (Only include if explicitly mentioned in transcript or context, else omit entirely.)
[full name and professional role of supervisee] (Only include if explicitly mentioned in transcript or context, else omit entirely.)
[full name and professional role of supervisor] (Only include if explicitly mentioned in transcript or context, else omit entirely.)
[type of supervision session such as individual, group or peer supervision] (Only include if explicitly mentioned in transcript or context, else omit entirely.)

Cases Presented:

(Repeat the following block for each case discussed during the supervision session. Number each case sequentially starting from 1.)

Case [number]

De-identified Case Summary
[describe the presenting problem, relevant background history, current management plan and any pertinent clinical details for this case using de-identified information only] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write in paragraphs of full sentences. Do not include any identifying patient information such as real names, dates of birth or addresses.)

Clinical Reasoning Discussed
[describe the clinical reasoning explored during supervision including differential diagnoses considered, rationale for the approach taken, evidence base discussed and any clinical frameworks or guidelines referenced] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write in paragraphs of full sentences.)

Challenges and Uncertainties
[describe any challenges, uncertainties, ethical dilemmas or areas of difficulty identified by the supervisee in relation to this case] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write in paragraphs of full sentences.)

Supervisor Feedback and Recommendations
[describe the feedback, guidance, recommendations and clinical insights provided by the supervisor in response to the case presentation] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write in paragraphs of full sentences.)

Alternative Approaches Considered
[describe any alternative clinical approaches, treatment options or management strategies discussed as possibilities for this case] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write in paragraphs of full sentences.)

Learning Points
[describe the key learning points, clinical insights and professional development takeaways arising from the discussion of this case] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write in paragraphs of full sentences.)

Professional Development:

Themes Across Cases
[describe any overarching themes, patterns or recurring issues identified across the cases presented during this supervision session] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write in paragraphs of full sentences.)

Skills Development Needs
[describe any specific clinical skills, competencies or knowledge areas identified as requiring further development] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write in paragraphs of full sentences.)

Confidence and Self-Assessment
[describe the supervisee's reflections on their confidence levels, self-assessed strengths and areas where they feel less assured in their clinical practice] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write in paragraphs of full sentences.)

Areas for Further Learning
[describe any topics, clinical areas or professional development activities identified for the supervisee to pursue before the next supervision session or in the longer term] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write in paragraphs of full sentences.)

Wellbeing Check:
[describe any clinician wellbeing concerns raised during the session including but not limited to vicarious trauma, compassion fatigue, workload pressures, work-life balance issues or emotional responses to clinical work] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write in paragraphs of full sentences. Approach this section with a supportive and non-judgemental tone.)

Actions for Supervisee:
[describe each specific action item, task or follow-up item agreed upon during the supervision session along with the expected timeframe for completion and any resources or support identified to assist with each action] (Only include if explicitly mentioned in transcript or context, else omit entirely. Write each action on its own line with the associated timeframe.)

Next Session:
[date and time of next scheduled supervision session] (Only include if explicitly mentioned in transcript or context, else omit entirely.)
[cases, topics or themes to be prepared for discussion at the next session] (Only include if explicitly mentioned in transcript or context, else omit entirely.)

(Never come up with your own patient details, assessment, plan, interventions, evaluation, and plan for continuing care - use only the transcript, contextual notes or clinical note as a reference for the information include in your note. If any information related to a placeholder has not been explicitly mentioned in the transcript, contextual notes or clinical note, you must not state the information has not been explicitly mentioned in your output, just leave the relevant placeholder or omit the placeholder completely.)

(Use as many lines, paragraphs or bullet points, depending on the format, as needed to capture all the relevant information from the transcript.)`
  },

  {
    id: 'dietetic-consultation',
    title: 'Dietetic Consultation Note',
    category: 'Nutrition',
    isDefault: false,
    supportsICD10: true,
    prompt: `Dietetic Consultation Note:
 
 Referral Reason:
 [detail referring clinician, date of referral, and specific concerns to be addressed] (Only include if explicitly mentioned in transcript or context, else omit section entirely. Write in full sentences as a paragraph.)
 
 Clinical Background:
 [outline relevant medical history, current treatment, and diagnosis affecting nutritional status] (Only include if explicitly mentioned in transcript or context, else omit section entirely. Write in full sentences as a paragraph.)
 
 Diet History and Intake:
 [describe patient's usual diet, recent changes, appetite, intake patterns, hydration status] (Only include if explicitly mentioned in transcript or context, else omit section entirely. Write in full sentences as a paragraph.)
 
 Nutrition-Focused Physical Findings:
 [document visible signs of malnutrition, muscle or fat loss, fluid accumulation] (Only include if explicitly mentioned in transcript or context, else omit section entirely. List items as bullet points.)
 
 Assessment and Impression:
 [provide summary of findings and nutritional risk] (Only include if explicitly mentioned in transcript or context, else omit section entirely. Write in full sentences as a paragraph.)
 
 Recommendations:
 [record dietetic advice given, feeding plan, referrals made, and further investigations requested] (Only include if explicitly mentioned in transcript or context, else omit section entirely. Write in full sentences as a paragraph.)
 
 Follow-Up Plan:
 [detail timing and responsibility for next review] (Only include if explicitly mentioned in transcript or context, else omit section entirely. Write in full sentences as a paragraph.)
 
 (Never come up with your own patient details, assessment, plan, interventions, evaluation, and plan for continuing care - use only the transcript, contextual notes or clinical note as a reference for the information include in your note. If any information related to a placeholder has not been explicitly mentioned in the transcript, contextual notes or clinical note, you must not state the information has not been explicitly mentioned in your output, just leave the relevant placeholder or omit the placeholder completely.)
 (Use as many lines, paragraphs or bullet points, depending on the format, as needed to capture all the relevant information from the transcript.)`
  },

  {
    id: 'dietetic-summary-letter',
    title: 'Dietetic Summary Letter',
    category: 'Letter',
    isDefault: false,
    supportsICD10: false,
    prompt: `Re: [Patient name], [DOB]
 Seen on: [date of review]
 Dietitian: [name]
 
 Thank you for referring [Patient name] for nutritional assessment and support.
 
 [Summarise the referral concern and presenting dietary or growth issue.] (Only include if explicitly mentioned in transcript, contextual notes or clinical note; otherwise omit completely)
 
 [Outline key findings from the assessment including growth data, feeding patterns, dietary intake, and medical background.] (Only include if explicitly mentioned in transcript, contextual notes or clinical note; otherwise omit completely)
 
 [State nutritional impression including any deficiencies, excesses, risk factors or behavioural feeding concerns.] (Only include if explicitly mentioned in transcript, contextual notes or clinical note; otherwise omit completely)
 
 [Describe recommendations made including dietary changes, supplementation, feeding strategies, and MDT referrals.] (Only include if explicitly mentioned in transcript, contextual notes or clinical note; otherwise omit completely)
 
 [Include requests for GP monitoring, lab work, or support with prescriptions if applicable.] (Only include if explicitly mentioned in transcript, contextual notes or clinical note; otherwise omit completely)
 
 Kind regards,
 
 [Clinician Name]
 [Clinician Signature] 
 
(Never come up with your own patient details, assessment, plan, interventions, evaluation, and plan for continuing care - use only the transcript, contextual notes or clinical note as a reference for the information include in your note. If any information related to a placeholder has not been explicitly mentioned in the transcript, contextual notes or clinical note, you must not state the information has not been explicitly mentioned in your output, just leave the relevant placeholder or omit the placeholder completely. Use as many lines, paragraphs or bullet points, depending on the format, as needed to capture all the relevant information from the transcript.)`
  },

  {
    id: 'discharge-nutrition-summary',
    title: 'Discharge Nutrition Summary',
    category: 'Nutrition',
    isDefault: false,
    supportsICD10: true,
    prompt: `Discharge Nutrition Summary:
 
 Patient Details:
 [record patient name, MRN, DOB, and admission/discharge dates](Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise omit completely.) 
 
 Reason for Admission:
 [document the primary diagnosis and nutritional relevance] (Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise omit completely.) 
 
 Dietetic Involvement:
 [summarise duration, frequency and purpose of dietetic reviews during admission](Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise omit completely.) 
 
 Nutrition Interventions:
 [outline nutritional goals addressed, support provided (e.g., ONS, enteral feeds), and education given](Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise omit completely.) 
 
 Progress and Outcomes:
 [describe patient's response to interventions, weight changes, appetite, and functional improvement](Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise omit completely.) 
 
 Discharge Nutrition Plan:
 [record recommended diet, supplements, follow-up appointments, referrals to community dietitians or services] (Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise omit completely.) 
 
 (Never come up with your own patient details, assessment, plan, interventions, evaluation, and plan for continuing care - use only the transcript, contextual notes or clinical note as a reference for the information include in your note. If any information related to a placeholder has not been explicitly mentioned in the transcript, contextual notes or clinical note, you must not state the information has not been explicitly mentioned in your output, just leave the relevant placeholder or omit the placeholder completely.)
 (Use as many lines, paragraphs or bullet points, depending on the format, as needed to capture all the relevant information from the transcript.)`
  },

  {
    id: 'referral-letter',
    title: 'Generic Referral Letter',
    category: 'Letter',
    isDefault: false,
    supportsICD10: false,
    prompt: `[Today’s Date]

Dear [Name and title of clinician the letter is addressed to], (Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise omit completely)

Re: [Patient’s full name] (Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise omit completely)

"Thank you for seeing the patient below." 

I am writing to refer my patient, [Patient’s full name] (Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise omit completely), who is known with [Known medical conditions including past diagnoses, chronic diseases or relevant background medical history] (Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise omit completely) and is currently using [Medications, including prescription medications, over-the-counter medications, supplements] (Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise omit completely).

[He/She/They] (Only include gender-specific pronouns if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise use gender-neutral pronouns by default) presented to me today with the following problem which includes [History of presenting complaint, current concerns or symptoms, clinical context, relevant background to the issue, and discussion topics covered] (Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise omit completely. Write in full sentences.)

Your expertise would be greatly appreciated in assisting with further management strategies for this patient.

"Thank you for your attention to this matter."

Yours sincerely,  
[Clinician’s title, full name and surname] (Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise omit completely)  
[Clinician type or specialty] (Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise omit completely)  
[Clinician’s contact details or registration number] (Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise omit completely)

(Never come up with your own patient details, medical history, symptoms, diagnosis, assessment, management plan or clinician information—use only what is explicitly provided in the transcript, contextual notes or clinical note. If information related to a placeholder has not been mentioned, omit that section or placeholder entirely. Do not insert generic statements, summaries, or assumptions in place of missing data. Maintain the letter’s structure and tone, ensuring the final document is clinically accurate.)`
  },

  {
    id: 'soap-with-issues',
    title: 'SOAP Note Including Issues',
    category: 'Medical',
    isDefault: false,
    supportsICD10: true,
    prompt: `Subjective:
[reasons for visit, including chief complaints such as requests, symptoms etc] (Include reasons for presentation such as requests, symptom complaints, or discussion points. Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise leave blank.)
[duration, timing, location, quality, severity and context of presenting complaint] (Include specific details relating to when symptoms began, how long they last, where they occur, how they feel, how severe they are, and the context in which they appear. Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise leave blank.)
[factors that worsen or alleviate the symptoms, including self-treatment attempts and their effectiveness] (Include any known triggers or relieving factors, including medications or strategies the patient has already tried. Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise leave blank.)
[progression of symptoms over time] (Include any changes in frequency, severity, or pattern of symptoms since onset. Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise leave blank.)
[previous episodes of similar symptoms including management and outcomes] (Include timing and frequency of prior episodes, how they were managed and whether they resolved. Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise leave blank.)
[impact of symptoms on daily activities, work or social functioning] (Include how the symptoms are affecting the patient's ability to carry out work, school, social or self-care tasks. Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise leave blank.)
[associated symptoms, both focal and systemic] (Include any other symptoms that are temporally or contextually related to the primary complaint, including both localised and generalised/systemic features. Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise leave blank.)

Past Medical History:
[past medical and surgical history relevant to the reasons for visit and chief complaints] (Include previous diagnoses, chronic conditions, hospitalisations or surgical interventions that are relevant to the current presentation. Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise leave blank.)
[relevant social history] (Include lifestyle factors, occupation, living situation, substance use, and social determinants of health that may impact or relate to the presenting complaint. Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise leave blank.)
[relevant family history] (Include any genetic, familial or hereditary conditions that may relate to the patient’s current symptoms or risk profile. Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise leave blank.)
[exposure history] (Include exposure to environmental, occupational, infectious or toxic agents that may relate to the presenting complaint. Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise leave blank.)
[immunisation history and status] (Include history of relevant vaccinations and whether the patient is up-to-date, especially in relation to the presenting condition. Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise leave blank.)
[any other relevant subjective information] (Include any other relevant patient-reported factors not captured above that may inform clinical understanding. Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise leave blank.)

Objective:
[vital signs] (Include any measured or reported vital signs such as heart rate, blood pressure, temperature, respiratory rate or oxygen saturation. Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise leave blank.)
[physical or mental state examination findings, including system-specific examinations] (Include observed or elicited signs from general or system-based physical or mental health examinations. Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise leave blank.)
[completed investigations and their results] (Include only completed investigations for which results have been explicitly mentioned. Do not include planned or ordered investigations. Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise leave blank.)

Assessment & Plan:
(Repeat the following block for each issue, request or problem explicitly identified in the transcript, contextual notes or clinical note. Number each issue sequentially in the output.)
[issue, request, problem or condition name] (Include only if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise leave blank.)
[diagnosis explicitly stated by the clinician] (Include a diagnosis only if it has been clearly and explicitly mentioned in the transcript, contextual notes or clinical note. Do not infer, summarise or create a diagnosis. Only include if explicitly mentioned; otherwise leave blank.)
[differential diagnoses] (Include only if differential diagnoses have been explicitly listed in the transcript, contextual notes or clinical note. Do not generate or suggest possible diagnoses. Otherwise leave blank.)
[investigations planned] (Include investigations or tests that the clinician has stated will be arranged. Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise leave blank.)
[treatment planned] (Include therapies, medications, or other interventions that the clinician has explicitly stated will be initiated. Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise leave blank.)
[referrals made or recommended] (Include any referrals to specialists, allied health or community services that have been explicitly stated. Only include if explicitly mentioned in the transcript, contextual notes or clinical note; otherwise leave blank.)

(Never come up with your own patient details, assessment, plan, interventions, evaluation, and plan for continuing care - use only the transcript, contextual notes or clinical note as a reference for the information include in your note. If any information related to a placeholder has not been explicitly mentioned in the transcript, contextual notes or clinical note, you must not state the information has not been explicitly mentioned in your output, just leave the relevant placeholder or omit the placeholder completely.) (Use as many lines, paragraphs or bullet points, depending on the format, as needed to capture all the relevant information from the transcript.)`
  },
];

// Helper function to get template by ID
export function getTemplateById(id) {
  return NOTE_TEMPLATES.find(template => template.id === id);
}

// Helper function to get default template
export function getDefaultTemplate() {
  return NOTE_TEMPLATES.find(template => template.isDefault) || NOTE_TEMPLATES[0];
}

// Helper function to get all templates
export function getAllTemplates() {
  return NOTE_TEMPLATES;
}

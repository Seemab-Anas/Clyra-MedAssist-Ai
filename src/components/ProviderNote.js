'use client';

import { useState } from 'react';
import { ArrowLeft, Download, Printer, User as UserIcon, Edit2, Save, X, MessageSquare, Loader2 } from 'lucide-react';
import Image from 'next/image';

export default function ProviderNote({ patient, doctor, recordData, onBack, transcription, dialogue, isGenerating }) {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Create a formatted text version
    const content = generateTextContent();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `provider-note-${patient.name.replace(/\s+/g, '-')}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateTextContent = () => {
    return `
PROVIDER NOTE
=============

PATIENT INFORMATION
Name: ${patient.name}
Age: ${patient.age || 'N/A'}
Sex: ${patient.sex || 'N/A'}
DOB: ${patient.dob || 'N/A'}
MRN / Patient ID: ${patient.mrn || 'N/A'}
Date & Time: ${formatDate(recordData.createdAt)}

PROVIDER INFORMATION
Provider Name: ${doctor?.name || 'N/A'}
Specialization: ${doctor?.specialization || 'N/A'}

SUBJECTIVE
Chief Complaint: ${recordData.subjective?.chiefComplaint || 'Not documented'}
History of Present Illness: ${recordData.subjective?.historyOfPresentIllness || 'Not documented'}
Past Medical History: ${recordData.subjective?.pastMedicalHistory?.join(', ') || 'None reported'}
Past Surgical History: ${recordData.subjective?.pastSurgicalHistory?.join(', ') || 'None reported'}
Family History: ${recordData.subjective?.familyHistory || 'Not documented'}
Social History: ${recordData.subjective?.socialHistory || 'Not documented'}
Allergies: ${recordData.subjective?.allergies?.join(', ') || 'None reported'}
Current Medications: ${recordData.subjective?.currentMedications?.join(', ') || 'None reported'}

Review of Systems:
- General: ${recordData.subjective?.reviewOfSystems?.general || 'Not documented'}
- HEENT: ${recordData.subjective?.reviewOfSystems?.heent || 'Not documented'}
- Respiratory: ${recordData.subjective?.reviewOfSystems?.respiratory || 'Not documented'}
- Cardiovascular: ${recordData.subjective?.reviewOfSystems?.cardiovascular || 'Not documented'}
- GI: ${recordData.subjective?.reviewOfSystems?.gi || 'Not documented'}
- GU: ${recordData.subjective?.reviewOfSystems?.gu || 'Not documented'}
- Musculoskeletal: ${recordData.subjective?.reviewOfSystems?.musculoskeletal || 'Not documented'}
- Neuro: ${recordData.subjective?.reviewOfSystems?.neuro || 'Not documented'}
- Skin: ${recordData.subjective?.reviewOfSystems?.skin || 'Not documented'}
- Psych: ${recordData.subjective?.reviewOfSystems?.psych || 'Not documented'}

OBJECTIVE
Vital Signs:
- BP: ${recordData.objective?.vitalSigns?.bp || 'Not recorded'}
- Heart Rate: ${recordData.objective?.vitalSigns?.heartRate || 'Not recorded'}
- Respiratory Rate: ${recordData.objective?.vitalSigns?.respiratoryRate || 'Not recorded'}
- Temperature: ${recordData.objective?.vitalSigns?.temperature || 'Not recorded'}
- SpO2: ${recordData.objective?.vitalSigns?.spo2 || 'Not recorded'}

Physical Examination:
- General Appearance: ${recordData.objective?.physicalExamination?.generalAppearance || 'Not documented'}
- HEENT: ${recordData.objective?.physicalExamination?.heent || 'Not documented'}
- Neck: ${recordData.objective?.physicalExamination?.neck || 'Not documented'}
- Cardiovascular: ${recordData.objective?.physicalExamination?.cardiovascular || 'Not documented'}
- Respiratory: ${recordData.objective?.physicalExamination?.respiratory || 'Not documented'}
- Abdomen: ${recordData.objective?.physicalExamination?.abdomen || 'Not documented'}
- Neurological: ${recordData.objective?.physicalExamination?.neurological || 'Not documented'}
- Skin: ${recordData.objective?.physicalExamination?.skin || 'Not documented'}

Diagnostics / Imaging: ${recordData.objective?.diagnostics || 'None ordered'}

ASSESSMENT
Primary Diagnosis: ${recordData.assessment?.primaryDiagnosis || 'Not determined'}
Differential Diagnosis: ${recordData.assessment?.differentialDiagnosis?.join(', ') || 'None listed'}
ICD-10 Codes: ${recordData.assessment?.icd10Codes?.join(', ') || 'Not coded'}

PLAN
Medications & Dosages:
${recordData.plan?.medications?.map(med => `- ${med.name || med}: ${med.dosage || ''} ${med.frequency || ''}`).join('\n') || 'None prescribed'}

Labs / Imaging Ordered:
${recordData.plan?.labsOrdered?.join('\n- ') || 'None ordered'}

Treatment Plan: ${recordData.plan?.treatmentPlan || 'Not documented'}
Lifestyle Modifications: ${recordData.plan?.lifestyleModifications || 'None discussed'}
Follow-Up Recommendations: ${recordData.plan?.followUp || 'Not specified'}
    `.trim();
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header Actions */}
        <div className="flex items-center justify-between mb-8 print:hidden">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <div className="flex gap-3">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              Download
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
            >
              <Printer className="h-4 w-4" />
              Print
            </button>
          </div>
        </div>

        {/* Provider Note */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-lg">
          <h1 className="text-3xl font-light text-zinc-900 dark:text-zinc-50 mb-8 text-center">
            Provider Note
          </h1>

          {/* Patient Information */}
          <section className="mb-8 pb-8 border-b border-zinc-200 dark:border-zinc-800">
            <h2 className="text-xl font-medium text-zinc-900 dark:text-zinc-50 mb-4">
              Patient Information
            </h2>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-zinc-500 dark:text-zinc-400">Name:</span>
                <span className="ml-2 text-zinc-900 dark:text-zinc-50 font-medium">{patient.name}</span>
              </div>
              <div>
                <span className="text-zinc-500 dark:text-zinc-400">Age:</span>
                <span className="ml-2 text-zinc-900 dark:text-zinc-50">{patient.age || 'N/A'}</span>
              </div>
              <div>
                <span className="text-zinc-500 dark:text-zinc-400">Sex:</span>
                <span className="ml-2 text-zinc-900 dark:text-zinc-50">{patient.sex || 'N/A'}</span>
              </div>
              <div>
                <span className="text-zinc-500 dark:text-zinc-400">DOB:</span>
                <span className="ml-2 text-zinc-900 dark:text-zinc-50">{patient.dob || 'N/A'}</span>
              </div>
              <div>
                <span className="text-zinc-500 dark:text-zinc-400">MRN / Patient ID:</span>
                <span className="ml-2 text-zinc-900 dark:text-zinc-50">{patient.mrn || 'N/A'}</span>
              </div>
              <div>
                <span className="text-zinc-500 dark:text-zinc-400">Date & Time:</span>
                <span className="ml-2 text-zinc-900 dark:text-zinc-50">{formatDate(recordData.createdAt)}</span>
              </div>
            </div>
          </section>

          {/* Provider Information */}
          <section className="mb-8 pb-8 border-b border-zinc-200 dark:border-zinc-800">
            <h2 className="text-xl font-medium text-zinc-900 dark:text-zinc-50 mb-4">
              Provider Information
            </h2>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-zinc-500 dark:text-zinc-400">Provider Name:</span>
                <span className="ml-2 text-zinc-900 dark:text-zinc-50 font-medium">{doctor?.name || 'N/A'}</span>
              </div>
              <div>
                <span className="text-zinc-500 dark:text-zinc-400">Specialization:</span>
                <span className="ml-2 text-zinc-900 dark:text-zinc-50">{doctor?.specialization || 'N/A'}</span>
              </div>
            </div>
          </section>

          {/* Subjective */}
          <section className="mb-8 pb-8 border-b border-zinc-200 dark:border-zinc-800">
            <h2 className="text-xl font-medium text-zinc-900 dark:text-zinc-50 mb-4">
              Subjective
            </h2>
            <div className="space-y-4 text-sm">
              <div>
                <h3 className="font-medium text-zinc-700 dark:text-zinc-300 mb-1">Chief Complaint (CC):</h3>
                <p className="text-zinc-600 dark:text-zinc-400">{recordData.subjective?.chiefComplaint || 'Not documented'}</p>
              </div>
              <div>
                <h3 className="font-medium text-zinc-700 dark:text-zinc-300 mb-1">History of Present Illness (HPI):</h3>
                <p className="text-zinc-600 dark:text-zinc-400">{recordData.subjective?.historyOfPresentIllness || 'Not documented'}</p>
              </div>
              <div>
                <h3 className="font-medium text-zinc-700 dark:text-zinc-300 mb-1">Past Medical History (PMH):</h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  {recordData.subjective?.pastMedicalHistory?.length > 0
                    ? recordData.subjective.pastMedicalHistory.join(', ')
                    : 'None reported'}
                </p>
              </div>
              <div>
                <h3 className="font-medium text-zinc-700 dark:text-zinc-300 mb-1">Past Surgical History (PSH):</h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  {recordData.subjective?.pastSurgicalHistory?.length > 0
                    ? recordData.subjective.pastSurgicalHistory.join(', ')
                    : 'None reported'}
                </p>
              </div>
              <div>
                <h3 className="font-medium text-zinc-700 dark:text-zinc-300 mb-1">Family History:</h3>
                <p className="text-zinc-600 dark:text-zinc-400">{recordData.subjective?.familyHistory || 'Not documented'}</p>
              </div>
              <div>
                <h3 className="font-medium text-zinc-700 dark:text-zinc-300 mb-1">Social History:</h3>
                <p className="text-zinc-600 dark:text-zinc-400">{recordData.subjective?.socialHistory || 'Not documented'}</p>
              </div>
              <div>
                <h3 className="font-medium text-zinc-700 dark:text-zinc-300 mb-1">Allergies:</h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  {recordData.subjective?.allergies?.length > 0
                    ? recordData.subjective.allergies.join(', ')
                    : 'None reported'}
                </p>
              </div>
              <div>
                <h3 className="font-medium text-zinc-700 dark:text-zinc-300 mb-1">Current Medications:</h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  {recordData.subjective?.currentMedications?.length > 0
                    ? recordData.subjective.currentMedications.join(', ')
                    : 'None reported'}
                </p>
              </div>
              <div>
                <h3 className="font-medium text-zinc-700 dark:text-zinc-300 mb-2">Review of Systems (ROS):</h3>
                <div className="grid md:grid-cols-2 gap-3 pl-4">
                  {Object.entries(recordData.subjective?.reviewOfSystems || {}).map(([system, value]) => (
                    <div key={system}>
                      <span className="text-zinc-500 dark:text-zinc-400 capitalize">{system}:</span>
                      <span className="ml-2 text-zinc-600 dark:text-zinc-400">{value || 'Not documented'}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Objective */}
          <section className="mb-8 pb-8 border-b border-zinc-200 dark:border-zinc-800">
            <h2 className="text-xl font-medium text-zinc-900 dark:text-zinc-50 mb-4">
              Objective
            </h2>
            <div className="space-y-4 text-sm">
              <div>
                <h3 className="font-medium text-zinc-700 dark:text-zinc-300 mb-2">Vital Signs:</h3>
                <div className="grid md:grid-cols-2 gap-3 pl-4">
                  <div>
                    <span className="text-zinc-500 dark:text-zinc-400">BP:</span>
                    <span className="ml-2 text-zinc-600 dark:text-zinc-400">{recordData.objective?.vitalSigns?.bp || 'Not recorded'}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 dark:text-zinc-400">Heart Rate:</span>
                    <span className="ml-2 text-zinc-600 dark:text-zinc-400">{recordData.objective?.vitalSigns?.heartRate || 'Not recorded'}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 dark:text-zinc-400">Respiratory Rate:</span>
                    <span className="ml-2 text-zinc-600 dark:text-zinc-400">{recordData.objective?.vitalSigns?.respiratoryRate || 'Not recorded'}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 dark:text-zinc-400">Temperature:</span>
                    <span className="ml-2 text-zinc-600 dark:text-zinc-400">{recordData.objective?.vitalSigns?.temperature || 'Not recorded'}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 dark:text-zinc-400">SpO2:</span>
                    <span className="ml-2 text-zinc-600 dark:text-zinc-400">{recordData.objective?.vitalSigns?.spo2 || 'Not recorded'}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-zinc-700 dark:text-zinc-300 mb-2">Physical Examination:</h3>
                <div className="space-y-2 pl-4">
                  {Object.entries(recordData.objective?.physicalExamination || {}).map(([area, finding]) => (
                    <div key={area}>
                      <span className="text-zinc-500 dark:text-zinc-400 capitalize">{area}:</span>
                      <span className="ml-2 text-zinc-600 dark:text-zinc-400">{finding || 'Not documented'}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-medium text-zinc-700 dark:text-zinc-300 mb-1">Diagnostics / Imaging:</h3>
                <p className="text-zinc-600 dark:text-zinc-400">{recordData.objective?.diagnostics || 'None ordered'}</p>
              </div>
            </div>
          </section>

          {/* Assessment */}
          <section className="mb-8 pb-8 border-b border-zinc-200 dark:border-zinc-800">
            <h2 className="text-xl font-medium text-zinc-900 dark:text-zinc-50 mb-4">
              Assessment
            </h2>
            <div className="space-y-4 text-sm">
              <div>
                <h3 className="font-medium text-zinc-700 dark:text-zinc-300 mb-1">Primary Diagnosis:</h3>
                <p className="text-zinc-600 dark:text-zinc-400">{recordData.assessment?.primaryDiagnosis || 'Not determined'}</p>
              </div>
              <div>
                <h3 className="font-medium text-zinc-700 dark:text-zinc-300 mb-1">Differential Diagnosis:</h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  {recordData.assessment?.differentialDiagnosis?.length > 0
                    ? recordData.assessment.differentialDiagnosis.join(', ')
                    : 'None listed'}
                </p>
              </div>
              <div>
                <h3 className="font-medium text-zinc-700 dark:text-zinc-300 mb-1">ICD-10 Codes:</h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  {recordData.assessment?.icd10Codes?.length > 0
                    ? recordData.assessment.icd10Codes.join(', ')
                    : 'Not coded'}
                </p>
              </div>
            </div>
          </section>

          {/* Plan */}
          <section>
            <h2 className="text-xl font-medium text-zinc-900 dark:text-zinc-50 mb-4">
              Plan
            </h2>
            <div className="space-y-4 text-sm">
              <div>
                <h3 className="font-medium text-zinc-700 dark:text-zinc-300 mb-2">Medications & Dosages:</h3>
                {recordData.plan?.medications?.length > 0 ? (
                  <ul className="list-disc list-inside text-zinc-600 dark:text-zinc-400 space-y-1 pl-4">
                    {recordData.plan.medications.map((med, idx) => (
                      <li key={idx}>
                        {typeof med === 'string' ? med : `${med.name || 'Medication'}: ${med.dosage || ''} ${med.frequency || ''}`}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-zinc-600 dark:text-zinc-400">None prescribed</p>
                )}
              </div>
              <div>
                <h3 className="font-medium text-zinc-700 dark:text-zinc-300 mb-2">Labs / Imaging Ordered:</h3>
                {recordData.plan?.labsOrdered?.length > 0 ? (
                  <ul className="list-disc list-inside text-zinc-600 dark:text-zinc-400 space-y-1 pl-4">
                    {recordData.plan.labsOrdered.map((lab, idx) => (
                      <li key={idx}>{lab}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-zinc-600 dark:text-zinc-400">None ordered</p>
                )}
              </div>
              <div>
                <h3 className="font-medium text-zinc-700 dark:text-zinc-300 mb-1">Treatment Plan:</h3>
                <p className="text-zinc-600 dark:text-zinc-400">{recordData.plan?.treatmentPlan || 'Not documented'}</p>
              </div>
              <div>
                <h3 className="font-medium text-zinc-700 dark:text-zinc-300 mb-1">Lifestyle Modifications:</h3>
                <p className="text-zinc-600 dark:text-zinc-400">{recordData.plan?.lifestyleModifications || 'None discussed'}</p>
              </div>
              <div>
                <h3 className="font-medium text-zinc-700 dark:text-zinc-300 mb-1">Follow-Up Recommendations:</h3>
                <p className="text-zinc-600 dark:text-zinc-400">{recordData.plan?.followUp || 'Not specified'}</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

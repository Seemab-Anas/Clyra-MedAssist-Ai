'use client';

import { ArrowLeft, FileText, Activity, AlertTriangle, Pill, Heart, MessageSquare } from 'lucide-react';

export default function MedicalDataDisplay({ data, transcription, dialogue, onBack, onReset }) {
  const { entities, provider_note, missing_info, differential_diagnosis, drug_alerts } = data;

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </button>
          <button
            onClick={onReset}
            className="px-4 py-2 text-sm border border-zinc-300 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
          >
            New Recording
          </button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-light text-zinc-900 dark:text-zinc-50 mb-2">
            Medical Analysis Results
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">
            Structured clinical documentation from your conversation
          </p>
        </div>

        {/* Separated Dialogue */}
        {dialogue && dialogue.length > 0 && (
          <div className="mb-6 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
              <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">
                Conversation
              </h2>
            </div>
            <div className="space-y-3">
              {dialogue.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-lg ${
                    item.speaker === 'doctor'
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500'
                      : 'bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-xs font-semibold uppercase ${
                        item.speaker === 'doctor'
                          ? 'text-blue-700 dark:text-blue-300'
                          : 'text-green-700 dark:text-green-300'
                      }`}
                    >
                      {item.speaker}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Raw Transcription */}
        <details className="mb-6 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">
          <summary className="cursor-pointer flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100">
            <FileText className="h-5 w-5" />
            <span className="text-lg font-medium">Raw Transcription</span>
          </summary>
          <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {transcription}
          </p>
        </details>

        {/* Entities */}
        <div className="mb-6 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
            <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">
              Clinical Entities
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Symptoms */}
            <div>
              <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Symptoms
              </h3>
              <div className="flex flex-wrap gap-2">
                {entities.symptoms?.length > 0 ? (
                  entities.symptoms.map((symptom, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-xs rounded-full"
                    >
                      {symptom}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-zinc-400">None reported</span>
                )}
              </div>
            </div>

            {/* History */}
            <div>
              <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Medical History
              </h3>
              <div className="flex flex-wrap gap-2">
                {entities.history?.length > 0 ? (
                  entities.history.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs rounded-full"
                    >
                      {item}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-zinc-400">None reported</span>
                )}
              </div>
            </div>

            {/* Medications */}
            <div>
              <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Current Medications
              </h3>
              <div className="flex flex-wrap gap-2">
                {entities.medications?.length > 0 ? (
                  entities.medications.map((med, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-xs rounded-full"
                    >
                      {med}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-zinc-400">None reported</span>
                )}
              </div>
            </div>

            {/* Allergies */}
            <div>
              <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Allergies
              </h3>
              <div className="flex flex-wrap gap-2">
                {entities.allergies?.length > 0 ? (
                  entities.allergies.map((allergy, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 text-xs rounded-full"
                    >
                      {allergy}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-zinc-400">None reported</span>
                )}
              </div>
            </div>
          </div>

          {/* Vitals */}
          <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-800">
            <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
              Vital Signs
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <VitalCard label="BP" value={entities.vitals?.blood_pressure} />
              <VitalCard label="HR" value={entities.vitals?.heart_rate} unit="bpm" />
              <VitalCard label="RR" value={entities.vitals?.respiratory_rate} unit="bpm" />
              <VitalCard label="Temp" value={entities.vitals?.temperature} />
              <VitalCard label="SpO2" value={entities.vitals?.oxygen_saturation} />
            </div>
          </div>
        </div>

        {/* Provider Note (SOAP) */}
        <div className="mb-6 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
            <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">
              Provider Note (SOAP)
            </h2>
          </div>

          <div className="space-y-4">
            <NoteSection title="Subjective" content={provider_note?.subjective} />
            <NoteSection title="Objective" content={provider_note?.objective} />
            <NoteSection title="Assessment" content={provider_note?.assessment} />
            <NoteSection title="Plan" content={provider_note?.plan} />
          </div>
        </div>

        {/* Differential Diagnosis */}
        {differential_diagnosis?.length > 0 && (
          <div className="mb-6 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Pill className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
              <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">
                Differential Diagnosis
              </h2>
            </div>

            <div className="space-y-3">
              {differential_diagnosis.map((diagnosis, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-zinc-900 dark:text-zinc-50">
                      {diagnosis.condition}
                    </h3>
                    <span className="text-sm font-mono text-zinc-600 dark:text-zinc-400">
                      {(parseFloat(diagnosis.probability) * 100).toFixed(0)}%
                    </span>
                  </div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {diagnosis.reason}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Alerts */}
        {(missing_info?.length > 0 || drug_alerts?.length > 0) && (
          <div className="border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <h2 className="text-lg font-medium text-amber-900 dark:text-amber-50">
                Alerts & Missing Information
              </h2>
            </div>

            {missing_info?.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-2">
                  Missing Information
                </h3>
                <ul className="list-disc list-inside text-sm text-amber-700 dark:text-amber-300 space-y-1">
                  {missing_info.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {drug_alerts?.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-2">
                  Drug Alerts
                </h3>
                <ul className="list-disc list-inside text-sm text-amber-700 dark:text-amber-300 space-y-1">
                  {drug_alerts.map((alert, idx) => (
                    <li key={idx}>{alert}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function VitalCard({ label, value, unit }) {
  return (
    <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
      <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">{label}</div>
      <div className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
        {value || '—'}
        {value && unit && <span className="text-xs ml-1">{unit}</span>}
      </div>
    </div>
  );
}

function NoteSection({ title, content }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
        {title}
      </h3>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
        {content || 'Not documented'}
      </p>
    </div>
  );
}

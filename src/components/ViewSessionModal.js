'use client';

import { X, Calendar, Clock, FileText, User, Download, Copy, Check } from 'lucide-react';
import { useState } from 'react';

export default function ViewSessionModal({ session, patient, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!session) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(session.noteContent || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([session.noteContent || ''], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${patient?.name || 'Patient'}_${session.templateName}_${new Date(session.sessionDate).toLocaleDateString()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-blue-50 to-white">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Session Details</h2>
            <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(session.sessionDate || session.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span>{session.sessionTime || 'N/A'}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {/* Patient Info */}
          {patient && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Patient Information</h3>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-600">Name:</span>
                  <span className="ml-2 font-medium text-gray-900">{patient.name}</span>
                </div>
                <div>
                  <span className="text-gray-600">Age:</span>
                  <span className="ml-2 font-medium text-gray-900">{patient.age} years</span>
                </div>
                <div>
                  <span className="text-gray-600">Sex:</span>
                  <span className="ml-2 font-medium text-gray-900">{patient.sex}</span>
                </div>
                {patient.mrn && (
                  <div>
                    <span className="text-gray-600">MRN:</span>
                    <span className="ml-2 font-medium text-gray-900">{patient.mrn}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Session Metadata */}
          <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-xs text-gray-600 mb-1">Template</div>
              <div className="font-medium text-gray-900">{session.templateName || 'SOAP Note'}</div>
            </div>
            
            {session.duration > 0 && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-600 mb-1">Duration</div>
                <div className="font-medium text-gray-900">
                  {Math.floor(session.duration / 60)}:{String(session.duration % 60).padStart(2, '0')}
                </div>
              </div>
            )}

            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-xs text-gray-600 mb-1">Recording Type</div>
              <div className="font-medium text-gray-900">
                {session.recordingType === 'live' ? '🎤 Live' : '📁 Upload'}
              </div>
            </div>

            {session.icdCodes && session.icdCodes.length > 0 && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-600 mb-1">ICD-10 Codes</div>
                <div className="font-medium text-gray-900">{session.icdCodes.length} codes</div>
              </div>
            )}
          </div>

          {/* ICD-10 Codes */}
          {session.icdCodes && session.icdCodes.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">ICD-10 Codes</h3>
              <div className="space-y-2">
                {session.icdCodes.map((code, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <span className="px-2 py-1 bg-green-600 text-white rounded text-xs font-mono font-semibold">
                      {code.code || code}
                    </span>
                    <span className="text-sm text-gray-700 flex-1">
                      {code.description || code.name || 'No description'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Medical Note */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">Medical Note</h3>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-green-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy
                    </>
                  )}
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Download
                </button>
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 whitespace-pre-wrap font-mono text-sm text-gray-800 max-h-96 overflow-auto">
              {session.noteContent || 'No note content available'}
            </div>
          </div>

          {/* Transcription */}
          {session.transcription && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Transcription</h3>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-700 max-h-64 overflow-auto">
                {session.transcription}
              </div>
            </div>
          )}

          {/* Dialogue */}
          {session.dialogue && session.dialogue.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Conversation Dialogue</h3>
              <div className="space-y-3 max-h-64 overflow-auto">
                {session.dialogue.map((line, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg ${
                      line.speaker === 'Doctor' 
                        ? 'bg-blue-50 border-l-4 border-blue-500' 
                        : 'bg-green-50 border-l-4 border-green-500'
                    }`}
                  >
                    <div className="font-semibold text-sm mb-1">
                      {line.speaker === 'Doctor' ? '👨‍⚕️ Doctor' : '👤 Patient'}
                    </div>
                    <div className="text-sm text-gray-700">{line.text}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

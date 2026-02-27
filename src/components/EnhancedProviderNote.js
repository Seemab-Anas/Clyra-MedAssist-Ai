'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, Download, Printer, User as UserIcon, Edit2, Save, X, 
  MessageSquare, Loader2, FileText, Activity, Clipboard 
} from 'lucide-react';
import Image from 'next/image';

export default function EnhancedProviderNote({ 
  patient, 
  doctor, 
  recordData, 
  onBack, 
  transcription, 
  segments = [],
  dialogue,
  isGenerating = false 
}) {
  const [activeNoteTab, setActiveNoteTab] = useState('soap');
  const [showTranscriptionSidebar, setShowTranscriptionSidebar] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedData, setEditedData] = useState(recordData || {});

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatTimestamp = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}${ms > 0 ? `.${ms.toString().padStart(2, '0')}` : ''}s`;
  };

  const handleEditToggle = () => {
    setIsEditMode(!isEditMode);
  };

  const handleSave = () => {
    setIsEditMode(false);
    // Here you would typically save to backend
    console.log('Saving edited data:', editedData);
  };

  const handleCancel = () => {
    setEditedData(recordData);
    setIsEditMode(false);
  };

  const updateField = (section, field, value) => {
    setEditedData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const EditableField = ({ label, value, section, field, multiline = false }) => {
    // Get current value from editedData
    const getCurrentValue = () => {
      let currentValue = editedData[section]?.[field] || value || '';
      
      // Handle arrays
      if (Array.isArray(currentValue)) {
        return currentValue.join(', ');
      }
      
      // Handle objects (like physicalExamination)
      if (typeof currentValue === 'object' && currentValue !== null) {
        // Convert object to readable string
        return Object.entries(currentValue)
          .map(([key, val]) => `${key}: ${val}`)
          .join('\n');
      }
      
      return String(currentValue);
    };

    const handleInputChange = (e) => {
      const newValue = e.target.value;
      updateField(section, field, newValue);
    };

    // Check if field has value
    const hasValue = () => {
      const val = getCurrentValue();
      return val && val !== '' && val !== 'null';
    };

    // Don't render if no value and not in edit mode
    if (!isEditMode && !hasValue()) {
      return null;
    }

    return (
      <div className="mb-4">
        <h3 className="font-semibold text-gray-700 mb-2">{label}</h3>
        {isEditMode ? (
          multiline ? (
            <textarea
              value={getCurrentValue()}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 min-h-[80px]"
              placeholder="Not documented"
            />
          ) : (
            <input
              type="text"
              value={getCurrentValue()}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              placeholder="Not documented"
            />
          )
        ) : (
          <p className="text-gray-600 bg-gray-50 px-3 py-2 rounded-lg whitespace-pre-wrap">
            {getCurrentValue()}
          </p>
        )}
      </div>
    );
  };

  // Loading popup during generation
  if (isGenerating) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center">
          <Loader2 className="h-16 w-16 animate-spin text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Generating SOAP Note</h2>
          <p className="text-gray-600">
            Please wait while we process the transcription and generate your medical note...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      {/* Main Content Area */}
      <div className="flex-1">
        {/* Content */}
        <div className="p-6">
          {/* Controls Bar */}
          <div className="flex justify-between items-center gap-2 mb-6">
            <div className="flex gap-2">
              {!isEditMode ? (
                <button
                  onClick={handleEditToggle}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Edit2 className="h-4 w-4" />
                  Edit SOAP Note
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors flex items-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Note Format Tabs */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

            {/* SOAP Note Content */}
            {activeNoteTab === 'soap' && (
              <div className="p-8 space-y-8">
                {/* Subjective Section */}
                {(editedData.subjective || isEditMode) && (
                  <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-blue-600">
                      Subjective
                    </h2>
                    {isEditMode ? (
                      <textarea
                        value={editedData.subjective || ''}
                        onChange={(e) => setEditedData(prev => ({ ...prev, subjective: e.target.value }))}
                        className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 min-h-[200px] font-mono text-sm"
                        placeholder="- Enter bullet points here&#10;- One per line"
                      />
                    ) : (
                      <div className="bg-gray-50 rounded-lg p-4 whitespace-pre-wrap text-gray-700 leading-relaxed">
                        {editedData.subjective}
                      </div>
                    )}
                  </section>
                )}

                {/* Past Medical History Section */}
                {(editedData.pastMedicalHistory || isEditMode) && (
                  <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-blue-600">
                      Past Medical History
                    </h2>
                    {isEditMode ? (
                      <textarea
                        value={editedData.pastMedicalHistory || ''}
                        onChange={(e) => setEditedData(prev => ({ ...prev, pastMedicalHistory: e.target.value }))}
                        className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 min-h-[150px] font-mono text-sm"
                        placeholder="- Enter bullet points here&#10;- One per line"
                      />
                    ) : (
                      <div className="bg-gray-50 rounded-lg p-4 whitespace-pre-wrap text-gray-700 leading-relaxed">
                        {editedData.pastMedicalHistory}
                      </div>
                    )}
                  </section>
                )}

                {/* Objective Section */}
                {(editedData.objective || isEditMode) && (
                  <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-blue-600">
                      Objective
                    </h2>
                    {isEditMode ? (
                      <textarea
                        value={editedData.objective || ''}
                        onChange={(e) => setEditedData(prev => ({ ...prev, objective: e.target.value }))}
                        className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 min-h-[200px] font-mono text-sm"
                        placeholder="- Enter bullet points here&#10;- One per line"
                      />
                    ) : (
                      <div className="bg-gray-50 rounded-lg p-4 whitespace-pre-wrap text-gray-700 leading-relaxed">
                        {editedData.objective}
                      </div>
                    )}
                  </section>
                )}

                {/* Assessment Section */}
                {(editedData.assessment || isEditMode) && (
                  <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-blue-600">
                      Assessment
                    </h2>
                    {isEditMode ? (
                      <textarea
                        value={editedData.assessment || ''}
                        onChange={(e) => setEditedData(prev => ({ ...prev, assessment: e.target.value }))}
                        className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 min-h-[100px] font-mono text-sm"
                        placeholder="- Enter bullet points here&#10;- One per line"
                      />
                    ) : (
                      <div className="bg-gray-50 rounded-lg p-4 whitespace-pre-wrap text-gray-700 leading-relaxed">
                        {editedData.assessment}
                      </div>
                    )}
                  </section>
                )}

                {/* Plan Section */}
                {(editedData.plan || isEditMode) && (
                  <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-blue-600">
                      Plan
                    </h2>
                    {isEditMode ? (
                      <textarea
                        value={editedData.plan || ''}
                        onChange={(e) => setEditedData(prev => ({ ...prev, plan: e.target.value }))}
                        className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 min-h-[150px] font-mono text-sm"
                        placeholder="- Enter bullet points here&#10;- One per line"
                      />
                    ) : (
                      <div className="bg-gray-50 rounded-lg p-4 whitespace-pre-wrap text-gray-700 leading-relaxed">
                        {editedData.plan}
                      </div>
                    )}
                  </section>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}

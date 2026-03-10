'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, Download, Printer, User as UserIcon, Edit2, Save, X, 
  MessageSquare, Loader2, FileText, Activity, Clipboard, AlertCircle 
} from 'lucide-react';
import Image from 'next/image';
import ICDCodeSelector from './ICDCodeSelector';
import { getTemplateById } from '@/config/prompts';

export default function EnhancedProviderNote({ 
  patient, 
  doctor, 
  recordData, 
  onBack, 
  transcription, 
  segments = [],
  dialogue,
  isGenerating = false,
  templateId 
}) {
  const [activeNoteTab, setActiveNoteTab] = useState('soap');
  const [showTranscriptionSidebar, setShowTranscriptionSidebar] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedData, setEditedData] = useState(recordData || {});
  const [editedContent, setEditedContent] = useState(recordData?.content || '');
  const [icdCodes, setIcdCodes] = useState(recordData?.icdCodes || []);
  
  const template = templateId ? getTemplateById(templateId) : null;

  // Sync editedContent when recordData changes
  useEffect(() => {
    console.log('EnhancedProviderNote received recordData:', recordData);
    if (recordData) {
      setEditedData(recordData);
      setEditedContent(recordData.content || '');
      setIcdCodes(recordData.icdCodes || []);
    }
  }, [recordData]);

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
    // Update the content and ICD codes in editedData
    setEditedData(prev => ({ ...prev, content: editedContent, icdCodes }));
    // Here you would typically save to backend
    console.log('Saving edited data:', { ...editedData, content: editedContent, icdCodes });
  };

  const handleCancel = () => {
    setEditedData(recordData);
    setEditedContent(recordData?.content || '');
    setIcdCodes(recordData?.icdCodes || []);
    setIsEditMode(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const content = editedData.content || '';
    const patientName = patient?.name || 'Patient';
    const date = new Date().toLocaleDateString();
    
    // Create text content
    let textContent = `Medical Note - ${patientName}\n`;
    textContent += `Date: ${date}\n`;
    textContent += `Doctor: ${doctor?.name || 'Unknown'}\n`;
    textContent += `\n${'='.repeat(50)}\n\n`;
    textContent += content;
    
    // Add ICD codes if present
    if (icdCodes && icdCodes.length > 0) {
      textContent += `\n\n${'='.repeat(50)}\n`;
      textContent += `\nICD-10 Codes:\n`;
      icdCodes.forEach(code => {
        textContent += `- ${code.code}: ${code.description || code.shortDescription}\n`;
      });
    }
    
    // Create blob and download
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `medical-note-${patientName.replace(/\s+/g, '-')}-${date}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Generating Note</h2>
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
                <>
                  <button
                    onClick={handleEditToggle}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Edit2 className="h-4 w-4" />
                    Edit Note
                  </button>
                  <button
                    onClick={handlePrint}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors flex items-center gap-2"
                  >
                    <Printer className="h-4 w-4" />
                    Print
                  </button>
                  <button
                    onClick={handleDownload}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </button>
                </>
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

            {/* Generic Note Content */}
            {activeNoteTab === 'soap' && (
              <div className="p-8">
                {isEditMode ? (
                  <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 min-h-[600px] font-mono text-sm"
                    placeholder="Enter note content here..."
                  />
                ) : (
                  <div className="bg-gray-50 rounded-lg p-6 whitespace-pre-wrap text-gray-700 leading-relaxed font-sans">
                    {editedData.content || 'No content available'}
                  </div>
                )}
                
                {/* Disease Prediction Section */}
                {editedData.diseasePrediction && template?.predictDisease && (
                  <div className="mt-6 border-t border-gray-200 pt-6">
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-6 w-6 text-purple-600 shrink-0 mt-1" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-purple-900 mb-3 text-lg">
                            🤖 AI Disease Prediction (Fine-tuned Gemma Model)
                          </h3>
                          <div className="bg-white rounded-lg p-4 border border-purple-100">
                            <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
                              {editedData.diseasePrediction}
                            </pre>
                          </div>
                          <p className="text-xs text-purple-600 mt-3 italic">
                            ⚠️ This prediction is generated by an AI model and should be used as a supplementary tool only. 
                            Always verify with clinical judgment and diagnostic tests.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* ICD-10 Code Selector */}
                <ICDCodeSelector
                  noteContent={editedContent}
                  initialCodes={icdCodes}
                  onCodesChange={setIcdCodes}
                  templateSupportsICD10={template?.supportsICD10 || false}
                />
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}

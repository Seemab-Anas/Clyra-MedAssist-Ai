'use client';

import { useState, useRef } from 'react';
import { ArrowLeft, Upload, FileAudio, Loader2, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import PatientSelector from './PatientSelector';
import EnhancedProviderNote from './EnhancedProviderNote';

export default function AudioUpload({ onBack }) {
  const { user } = useAuth();
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [segments, setSegments] = useState([]);
  const [dialogue, setDialogue] = useState(null);
  const [medicalData, setMedicalData] = useState(null);
  const [showProviderNote, setShowProviderNote] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Check if it's an audio file
      if (!selectedFile.type.startsWith('audio/')) {
        setError('Please select a valid audio file');
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('audio/')) {
      setFile(droppedFile);
      setError('');
    } else {
      setError('Please drop a valid audio file');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const removeFile = () => {
    setFile(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleProcess = async () => {
    if (!file) return;

    setLoading(true);
    setError('');

    try {
      // Step 1: Transcribe audio
      const formData = new FormData();
      formData.append('audio', file);

      const transcribeRes = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      const transcribeData = await transcribeRes.json();

      if (!transcribeRes.ok) {
        throw new Error(transcribeData.details || transcribeData.error || 'Transcription failed');
      }

      setTranscription(transcribeData.transcription);
      setSegments(transcribeData.segments || []);

      // Step 2: Separate dialogue
      const dialogueRes = await fetch('/api/separate-dialogue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcription: transcribeData.transcription }),
      });

      const dialogueData = await dialogueRes.json();

      if (!dialogueRes.ok) {
        throw new Error(dialogueData.details || dialogueData.error || 'Dialogue separation failed');
      }

      setDialogue(dialogueData.dialogue);

      // Step 3: Generate medical note from dialogue
      const noteRes = await fetch('/api/generate-note', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dialogue: dialogueData.dialogue }),
      });

      const noteData = await noteRes.json();

      if (!noteRes.ok) {
        throw new Error(noteData.details || noteData.error || 'Note generation failed');
      }

      setMedicalData(noteData.data);

      // Step 4: Save to database
      const saveRes = await fetch('/api/medical-records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: selectedPatient._id,
          recordData: noteData.data,
        }),
      });

      if (saveRes.ok) {
        setShowProviderNote(true);
      }
    } catch (err) {
      setError(err.message || 'An error occurred during processing');
    } finally {
      setLoading(false);
    }
  };

  // Show patient selector first
  if (!selectedPatient) {
    return (
      <PatientSelector
        onSelectPatient={setSelectedPatient}
        onBack={onBack}
      />
    );
  }

  // Show provider note after processing
  if (showProviderNote && medicalData) {
    return (
      <EnhancedProviderNote
        patient={selectedPatient}
        doctor={user}
        recordData={medicalData}
        transcription={transcription}
        segments={segments}
        dialogue={dialogue}
        isGenerating={false}
        onBack={() => {
          setShowProviderNote(false);
          setMedicalData(null);
          setTranscription('');
          setSegments([]);
          setDialogue(null);
          setFile(null);
          setSelectedPatient(null);
        }}
      />
    );
  }

  // Show loading popup during processing
  if (loading) {
    return (
      <>
        <div className="min-h-screen bg-white p-6">
          <div className="max-w-3xl mx-auto">
            <button
              onClick={() => setSelectedPatient(null)}
              className="mb-8 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Patient Selection
            </button>
          </div>
        </div>
        <EnhancedProviderNote
          patient={selectedPatient}
          doctor={user}
          recordData={{}}
          isGenerating={true}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 p-6">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => setSelectedPatient(null)}
          className="mb-8 flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Patient Selection
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-light text-zinc-900 dark:text-zinc-50 mb-2">
            Upload Audio File
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">
            Upload a medical conversation recording for {selectedPatient.name}
          </p>
        </div>

        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-2xl p-12 text-center hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
        >
          {!file ? (
            <>
              <div className="mb-4 inline-flex rounded-full bg-zinc-100 dark:bg-zinc-800 p-6">
                <Upload className="h-10 w-10 text-zinc-600 dark:text-zinc-400" />
              </div>
              <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-50 mb-2">
                Drop your audio file here
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
                or click to browse
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                className="hidden"
                id="audio-upload"
              />
              <label
                htmlFor="audio-upload"
                className="inline-block px-6 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg text-sm font-medium cursor-pointer hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
              >
                Select File
              </label>
            </>
          ) : (
            <div className="flex items-center justify-between bg-zinc-50 dark:bg-zinc-900 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <FileAudio className="h-8 w-8 text-zinc-600 dark:text-zinc-400" />
                <div className="text-left">
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                    {file.name}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={removeFile}
                className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {file && !loading && (
          <button
            onClick={handleProcess}
            className="mt-6 w-full py-4 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
          >
            Process Audio
          </button>
        )}

        {loading && (
          <div className="mt-6 p-8 bg-zinc-50 dark:bg-zinc-900 rounded-xl text-center">
            <Loader2 className="h-8 w-8 animate-spin text-zinc-600 dark:text-zinc-400 mx-auto mb-3" />
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Processing your audio file...
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1">
              This may take a moment
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

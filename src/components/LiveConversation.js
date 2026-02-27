'use client';

import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Mic, Square, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import PatientSelector from './PatientSelector';
import EnhancedProviderNote from './EnhancedProviderNote';

export default function LiveConversation({ onBack }) {
  const { user } = useAuth();
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [loading, setLoading] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [segments, setSegments] = useState([]);
  const [dialogue, setDialogue] = useState(null);
  const [medicalData, setMedicalData] = useState(null);
  const [showProviderNote, setShowProviderNote] = useState(false);
  const [error, setError] = useState('');

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        stream.getTracks().forEach((track) => track.stop());
        await processAudio(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      setError('');

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      setError('Failed to access microphone. Please grant permission.');
      console.error('Microphone access error:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const processAudio = async (audioBlob) => {
    setLoading(true);
    setError('');

    try {
      // Convert webm to a format compatible with Whisper (we'll send as-is and let the API handle it)
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');

      // Step 1: Transcribe audio
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

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
          setRecordingTime(0);
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
            Live Conversation
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">
            Record a medical conversation for {selectedPatient.name}
          </p>
        </div>

        <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-12 text-center">
          {!isRecording && !loading && (
            <>
              <div className="mb-6 inline-flex rounded-full bg-zinc-100 dark:bg-zinc-800 p-8">
                <Mic className="h-16 w-16 text-zinc-600 dark:text-zinc-400" />
              </div>
              <h3 className="text-xl font-medium text-zinc-900 dark:text-zinc-50 mb-2">
                Ready to Record
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8">
                Click the button below to start recording
              </p>
              <button
                onClick={startRecording}
                className="px-8 py-4 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
              >
                Start Recording
              </button>
            </>
          )}

          {isRecording && (
            <>
              <div className="mb-6 inline-flex rounded-full bg-red-100 dark:bg-red-900/30 p-8 animate-pulse">
                <Mic className="h-16 w-16 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-medium text-zinc-900 dark:text-zinc-50 mb-2">
                Recording...
              </h3>
              <p className="text-3xl font-mono text-zinc-600 dark:text-zinc-400 mb-8">
                {formatTime(recordingTime)}
              </p>
              <button
                onClick={stopRecording}
                className="px-8 py-4 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors flex items-center gap-2 mx-auto"
              >
                <Square className="h-5 w-5 fill-current" />
                Stop Recording
              </button>
            </>
          )}

          {loading && (
            <>
              <Loader2 className="h-16 w-16 animate-spin text-zinc-600 dark:text-zinc-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-zinc-900 dark:text-zinc-50 mb-2">
                Processing Recording
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Transcribing and analyzing your conversation...
              </p>
            </>
          )}
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}

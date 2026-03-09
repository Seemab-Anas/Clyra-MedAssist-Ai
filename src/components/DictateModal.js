'use client';

import { useState, useRef, useEffect } from 'react';
import { Mic, Square, Loader2, X, CheckCircle } from 'lucide-react';

export default function DictateModal({ isOpen, onClose, onComplete, selectedTemplate }) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState('');
  const [audioBlob, setAudioBlob] = useState(null);
  
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

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

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Failed to access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processAudio = async () => {
    if (!audioBlob) return;

    setIsProcessing(true);
    
    try {
      // Step 1: Transcribe
      setProcessingStage('Transcribing audio...');
      const formData = new FormData();
      
      // Create a File object with proper name and type
      const audioFile = new File([audioBlob], `recording-${Date.now()}.webm`, {
        type: 'audio/webm'
      });
      
      formData.append('audio', audioFile);

      console.log('Sending audio for transcription:', {
        size: audioFile.size,
        type: audioFile.type,
        name: audioFile.name
      });

      const transcribeRes = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      const transcribeData = await transcribeRes.json();
      
      console.log('Transcribe response:', transcribeRes.status, transcribeData);
      
      if (!transcribeRes.ok) {
        throw new Error(transcribeData.error || transcribeData.details || 'Transcription failed');
      }

      // Step 2: Separate dialogue
      setProcessingStage('Analyzing conversation...');
      const dialogueRes = await fetch('/api/separate-dialogue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcription: transcribeData.transcription }),
      });

      const dialogueData = await dialogueRes.json();
      if (!dialogueRes.ok) {
        throw new Error(dialogueData.error || 'Dialogue separation failed');
      }

      // Step 3: Generate note
      setProcessingStage('Generating medical note...');
      const noteRes = await fetch('/api/generate-note', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          dialogue: dialogueData.dialogue,
          templateId: selectedTemplate?.id
        }),
      });

      const noteData = await noteRes.json();
      if (!noteRes.ok) {
        throw new Error(noteData.error || 'Note generation failed');
      }

      setProcessingStage('Complete!');
      
      // Return all data to parent
      onComplete({
        transcription: transcribeData.transcription,
        dialogue: dialogueData.dialogue,
        generatedNote: noteData.data,
        templateName: noteData.templateName,
        duration: recordingTime,
        recordingType: 'live'
      });

      // Close modal after short delay
      setTimeout(() => {
        onClose();
        resetModal();
      }, 1000);

    } catch (error) {
      console.error('Processing error:', error);
      console.error('Error details:', {
        message: error.message,
        stage: processingStage,
        audioBlobSize: audioBlob?.size
      });
      
      alert(`Failed at: ${processingStage}\n\nError: ${error.message}\n\nCheck console for details.`);
      setIsProcessing(false);
      setProcessingStage('');
    }
  };

  const resetModal = () => {
    setIsRecording(false);
    setRecordingTime(0);
    setIsProcessing(false);
    setProcessingStage('');
    setAudioBlob(null);
    chunksRef.current = [];
  };

  const handleClose = () => {
    if (isRecording) {
      stopRecording();
    }
    resetModal();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {isProcessing ? 'Processing Recording' : 'Dictate Medical Note'}
          </h2>
          {!isProcessing && (
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          )}
        </div>

        {/* Processing State */}
        {isProcessing && (
          <div className="text-center py-8">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-700 font-medium mb-2">{processingStage}</p>
            <p className="text-sm text-gray-500">Please wait, this may take a moment...</p>
          </div>
        )}

        {/* Recording State */}
        {!isProcessing && (
          <>
            {/* Template Info */}
            {selectedTemplate && (
              <div className="mb-6 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-900">
                  <span className="font-medium">Template:</span> {selectedTemplate.title}
                </p>
              </div>
            )}

            {/* Recording Visualization */}
            <div className="mb-6">
              <div className="relative">
                {/* Circular Recording Indicator */}
                <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center transition-all ${
                  isRecording 
                    ? 'bg-red-500 shadow-lg shadow-red-500/50 animate-pulse' 
                    : audioBlob 
                    ? 'bg-green-500' 
                    : 'bg-gray-200'
                }`}>
                  {isRecording ? (
                    <Mic className="h-16 w-16 text-white" />
                  ) : audioBlob ? (
                    <CheckCircle className="h-16 w-16 text-white" />
                  ) : (
                    <Mic className="h-16 w-16 text-gray-400" />
                  )}
                </div>

                {/* Recording Time */}
                <div className="text-center mt-4">
                  <p className="text-3xl font-mono font-bold text-gray-900">
                    {formatTime(recordingTime)}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {isRecording ? 'Recording in progress...' : audioBlob ? 'Recording complete' : 'Ready to record'}
                  </p>
                </div>
              </div>
            </div>

            {/* Instructions */}
            {!isRecording && !audioBlob && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Instructions:</strong>
                </p>
                <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                  <li>Click the microphone to start recording</li>
                  <li>Speak clearly about the patient consultation</li>
                  <li>Click stop when finished</li>
                  <li>AI will generate a structured medical note</li>
                </ul>
              </div>
            )}

            {/* Control Buttons */}
            <div className="flex gap-3">
              {!isRecording && !audioBlob && (
                <button
                  onClick={startRecording}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  <Mic className="h-5 w-5" />
                  Start Recording
                </button>
              )}

              {isRecording && (
                <button
                  onClick={stopRecording}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  <Square className="h-5 w-5" />
                  Stop Recording
                </button>
              )}

              {audioBlob && !isRecording && (
                <>
                  <button
                    onClick={() => {
                      setAudioBlob(null);
                      setRecordingTime(0);
                    }}
                    className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                  >
                    Re-record
                  </button>
                  <button
                    onClick={processAudio}
                    className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    Generate Note
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

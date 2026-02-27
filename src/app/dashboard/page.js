'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  Upload, Mic, LogOut, Loader2, User, Search, Plus, 
  Home, FileText, Settings, Users, ChevronRight, X,
  Activity, Calendar, Clock, MessageSquare, FileAudio, Square,
  UserCircle, Bell, Grid, Globe, Users2, DollarSign, HelpCircle, Keyboard, LayoutGrid,
  ChevronDown, Check, MoreHorizontal, Download, Copy, Trash2, Sparkles
} from 'lucide-react';
import PatientSelector from '@/components/PatientSelector';
import EnhancedProviderNote from '@/components/EnhancedProviderNote';

export default function Dashboard() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('newSession');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPatientSelector, setShowPatientSelector] = useState(false);
  const [mode, setMode] = useState(null);
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [patientRecords, setPatientRecords] = useState([]);
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showLiveModal, setShowLiveModal] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [dialogue, setDialogue] = useState(null);
  const [generatedNote, setGeneratedNote] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const [sessionTab, setSessionTab] = useState('context');
  const [showTranscribeMenu, setShowTranscribeMenu] = useState(false);
  const [sessionStatus, setSessionStatus] = useState('idle');
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);
  const [uploadMode, setUploadMode] = useState('transcribe');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showTasksPanel, setShowTasksPanel] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/signin');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchPatients();
    }
  }, [user]);

  useEffect(() => {
    if (selectedPatient) {
      fetchPatientRecords(selectedPatient._id);
    }
  }, [selectedPatient]);

  const fetchPatients = async () => {
    try {
      const response = await fetch('/api/patients');
      const data = await response.json();
      if (response.ok) {
        setPatients(data.patients);
      }
    } catch (err) {
      console.error('Failed to fetch patients:', err);
    }
  };

  const fetchPatientRecords = async (patientId) => {
    setLoadingRecords(true);
    try {
      const response = await fetch(`/api/medical-records?patientId=${patientId}`);
      const data = await response.json();
      if (response.ok) {
        setPatientRecords(data.records || []);
      }
    } catch (err) {
      console.error('Failed to fetch patient records:', err);
    } finally {
      setLoadingRecords(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setShowPatientSelector(false);
    setActiveTab('newSession');
    fetchPatientRecords(patient._id);
  };

  const handleStartUpload = () => {
    setShowUploadModal(true);
  };

  const handleStartLive = () => {
    setShowLiveModal(true);
  };

  const processAudio = async (audioBlob) => {
    setIsProcessing(true);
    try {
      // Step 1: Transcribe audio
      const formData = new FormData();
      formData.append('audio', audioBlob);

      const transcribeRes = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      const transcribeData = await transcribeRes.json();
      if (!transcribeRes.ok) {
        throw new Error(transcribeData.error || 'Transcription failed');
      }
      setTranscription(transcribeData.transcription);

      // Step 2: Separate dialogue
      const dialogueRes = await fetch('/api/separate-dialogue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcription: transcribeData.transcription }),
      });

      const dialogueData = await dialogueRes.json();
      if (!dialogueRes.ok) {
        throw new Error(dialogueData.error || 'Dialogue separation failed');
      }
      setDialogue(dialogueData.dialogue);

      // Step 3: Generate medical note
      const noteRes = await fetch('/api/generate-note', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dialogue: dialogueData.dialogue }),
      });

      const noteData = await noteRes.json();
      if (!noteRes.ok) {
        throw new Error(noteData.error || 'Note generation failed');
      }
      setGeneratedNote(noteData.data);

      // Step 4: Save to database (only if patient is selected)
      if (selectedPatient) {
        await fetch('/api/medical-records', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            patientId: selectedPatient._id,
            recordData: noteData.data,
          }),
        });

        // Refresh records
        fetchPatientRecords(selectedPatient._id);
      }
      
      // Close modals
      setShowUploadModal(false);
      setShowLiveModal(false);
      setUploadFile(null);
    } catch (err) {
      console.error('Processing error:', err);
      alert(err.message || 'An error occurred during processing');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = async () => {
    if (!uploadFile) return;
    
    // Simulate upload progress
    setUploadProgress(0);
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // Wait for progress to complete
    await new Promise(resolve => setTimeout(resolve, 2200));
    
    // Close upload modal and show template selector
    setShowUploadModal(false);
    setShowTemplateSelector(true);
  };

  const handleTemplateSelect = async (template) => {
    setSelectedTemplate(template);
    setShowTemplateSelector(false);
    
    // Process the audio file
    if (uploadFile) {
      await processAudio(uploadFile);
      setUploadFile(null);
      setUploadProgress(0);
      
      // Switch to note tab and show tasks panel
      setSessionTab('note');
      setShowTasksPanel(true);
    }
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

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        stream.getTracks().forEach((track) => track.stop());
        await processAudio(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      alert('Failed to access microphone. Please grant permission.');
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

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };


  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (patient.mrn && patient.mrn.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const latestRecord = patientRecords.length > 0 ? patientRecords[0] : null;

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
        {/* User Profile at Top */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-semibold text-sm">
              SA
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <h3 className="text-sm font-semibold text-gray-900 truncate">
                  {user.name.split(' ')[0]} {user.name.split(' ')[1]?.charAt(0) || ''}
                </h3>
                <ChevronRight className="h-3 w-3 text-gray-400 flex-shrink-0" />
              </div>
              <p className="text-xs text-gray-500 truncate">
                {user.email || user.specialization || 'Doctor'}
              </p>
            </div>
            <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
              <LayoutGrid className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* New Session Button */}
        <div className="px-4 pt-4">
          <button
            onClick={() => {
              setActiveTab('newSession');
              setSelectedPatient(null);
              setSessionTab('context');
              setShowTasksPanel(false);
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all shadow-sm font-medium text-sm"
          >
            <Plus className="h-4 w-4" />
            <span>New session</span>
          </button>
          <button className="ml-auto mt-2 p-1.5 hover:bg-gray-100 rounded transition-colors">
            <Bell className="h-4 w-4 text-gray-600" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 pt-4 space-y-1 overflow-y-auto">
          <button
            onClick={() => setActiveTab('viewSessions')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors text-sm ${
              activeTab === 'viewSessions'
                ? 'bg-gray-100 text-gray-900 font-medium'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-2">
              <Users2 className="h-4 w-4" />
              <span>View sessions</span>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </button>
          
          <button
            onClick={() => setActiveTab('tasks')}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
              activeTab === 'tasks'
                ? 'bg-gray-100 text-gray-900 font-medium'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>Tasks</span>
          </button>

          {/* Templates Section */}
          <div className="pt-4">
            <p className="px-3 text-xs font-medium text-gray-500 mb-2">Templates</p>
            <button
              onClick={() => setActiveTab('templateLibrary')}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                activeTab === 'templateLibrary'
                  ? 'bg-gray-100 text-gray-900 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Grid className="h-4 w-4" />
              <span>Template library</span>
            </button>
            
            <button
              onClick={() => setActiveTab('community')}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                activeTab === 'community'
                  ? 'bg-gray-100 text-gray-900 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Globe className="h-4 w-4" />
              <span>Community</span>
            </button>
          </div>

          {/* Additional Navigation */}
          <div className="pt-4 space-y-1">
            <button
              onClick={() => setActiveTab('team')}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                activeTab === 'team'
                  ? 'bg-gray-100 text-gray-900 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Users className="h-4 w-4" />
              <span>Team</span>
            </button>
            
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                activeTab === 'settings'
                  ? 'bg-gray-100 text-gray-900 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </button>
          </div>
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-gray-200 space-y-1">
          <button
            onClick={() => setActiveTab('help')}
            className="w-full flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-sm"
          >
            <HelpCircle className="h-4 w-4" />
            <span>Help</span>
          </button>
          
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Content Area */}
        <div className={`flex-1 overflow-y-auto ${activeTab === 'newSession' ? '' : 'p-8'}`}>
          {/* New Session Tab - New Design */}
          {activeTab === 'newSession' && (
            <div className="h-full flex flex-col bg-white rounded-lg shadow-sm border border-gray-200">
              {/* Session Header */}
              <div className="border-b border-gray-200 px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Add Patient Details Button */}
                  <div className="relative">
                    <button
                      onClick={() => setShowPatientDropdown(!showPatientDropdown)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-gray-100 text-sm text-gray-700"
                    >
                      <User className="h-4 w-4" />
                      <span>{selectedPatient ? selectedPatient.name : 'Add patient details'}</span>
                      {selectedPatient && <span className="ml-1 px-2 py-0.5 bg-green-100 text-green-600 rounded text-xs">✓</span>}
                    </button>
                    
                    {/* Patient Dropdown */}
                    {showPatientDropdown && (
                      <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                        <button
                          onClick={() => {
                            setShowPatientSelector(true);
                            setShowPatientDropdown(false);
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-2 border-b border-gray-200"
                        >
                          <Plus className="h-4 w-4 text-gray-600" />
                          <span className="text-sm text-gray-700">Create new patient</span>
                        </button>
                        <div className="p-3">
                          <p className="text-xs font-medium text-gray-500 mb-2">Suggested</p>
                          <p className="text-xs text-gray-500 mb-3">No suggested patients found</p>
                          <p className="text-xs font-medium text-gray-900">All patients</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Date/Time */}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>Today {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                  </div>

                  {/* Language Selector */}
                  <button className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-gray-100 text-sm text-gray-700">
                    <Globe className="h-4 w-4" />
                    <span>English</span>
                  </button>
                </div>

                {/* Right Side - Transcribe Button */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>00:00</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="w-1 h-4 bg-green-500 rounded-full"></div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Transcribe Button with Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setShowTranscribeMenu(!showTranscribeMenu)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                      <Mic className="h-4 w-4" />
                      <span>Transcribe</span>
                      <ChevronDown className="h-4 w-4" />
                    </button>

                    {/* Transcribe Dropdown Menu */}
                    {showTranscribeMenu && (
                      <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-1">
                        <button
                          onClick={() => {
                            startRecording();
                            setShowTranscribeMenu(false);
                            setSessionStatus('transcribing');
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-gray-50 text-sm text-gray-700 flex items-center gap-2"
                        >
                          <Check className="h-4 w-4 text-green-600" />
                          <span>Transcribe</span>
                        </button>
                        <button
                          onClick={() => {
                            setShowTranscribeMenu(false);
                            setSessionStatus('dictating');
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-gray-50 text-sm text-gray-700"
                        >
                          Dictate
                        </button>
                        <button
                          onClick={() => {
                            startRecording();
                            setShowTranscribeMenu(false);
                            setSessionStatus('live-transcription');
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-gray-50 text-sm text-gray-700"
                        >
                          Live transcription
                        </button>
                        <div className="border-t border-gray-200 my-1"></div>
                        <button
                          onClick={() => {
                            handleStartUpload();
                            setShowTranscribeMenu(false);
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-gray-50 text-sm text-gray-700 flex items-center gap-2"
                        >
                          <Upload className="h-4 w-4" />
                          <span>Upload session audio</span>
                          <Download className="h-4 w-4 ml-auto" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Tabs Section */}
              <div className="border-b border-gray-200 px-6">
                <div className="flex items-center gap-6">
                  <button
                    onClick={() => setSessionTab('context')}
                    className={`px-1 py-3 text-sm font-medium border-b-2 transition-colors ${
                      sessionTab === 'context'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      <span>Context</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setSessionTab('transcript')}
                    className={`px-1 py-3 text-sm font-medium border-b-2 transition-colors ${
                      sessionTab === 'transcript'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span>Transcript</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setSessionTab('note')}
                    className={`px-1 py-3 text-sm font-medium border-b-2 transition-colors ${
                      sessionTab === 'note'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span>Note</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Template and Actions Bar */}
              <div className="border-b border-gray-200 px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-md hover:bg-gray-50 text-sm text-gray-700">
                    <Grid className="h-4 w-4" />
                    <span>Select a template</span>
                  </button>
                  <button className="p-1.5 hover:bg-gray-100 rounded-md">
                    <MoreHorizontal className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-1.5 hover:bg-gray-100 rounded-md">
                    <Download className="h-4 w-4 text-gray-600" />
                  </button>
                  <button className="p-1.5 hover:bg-gray-100 rounded-md">
                    <Copy className="h-4 w-4 text-gray-600" />
                  </button>
                  <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200">
                    Copy
                  </button>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 flex overflow-hidden">
                {/* Main Content */}
                <div className="flex-1 overflow-y-auto p-8">
                  {/* Context Tab */}
                  {sessionTab === 'context' && !transcription && (
                    <div className="text-center max-w-md mx-auto mt-20">
                      {/* Arrow Illustration */}
                      <div className="mb-8 flex justify-end">
                        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="text-gray-800">
                          <path
                            d="M10 70 Q 40 20, 70 10"
                            stroke="currentColor"
                            strokeWidth="2"
                            fill="none"
                          />
                          <path
                            d="M 70 10 L 60 8 L 65 18 Z"
                            fill="currentColor"
                          />
                        </svg>
                      </div>

                      <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        Start this session using the header
                      </h2>
                      <p className="text-sm text-gray-600 mb-6">
                        Your note will appear here once your session is complete
                      </p>

                      {/* Status Dropdown */}
                      <div className="inline-block">
                        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                          <button className="px-4 py-2 bg-green-600 text-white rounded-t-lg text-sm font-medium w-full flex items-center justify-center gap-2">
                            <Mic className="h-4 w-4" />
                            <span>Start transcribing</span>
                            <Check className="h-4 w-4" />
                          </button>
                          <div className="px-4 py-2 text-sm text-gray-700 border-t border-gray-200">
                            Transcribing
                          </div>
                          <div className="px-4 py-2 text-sm text-gray-700 border-t border-gray-200">
                            Dictating
                          </div>
                          <div className="px-4 py-2 text-sm text-gray-700 border-t border-gray-200 rounded-b-lg">
                            Upload session audio
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-3">
                          Select your visit mode in the dropdown
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Transcript Tab */}
                  {sessionTab === 'transcript' && (transcription || dialogue) && (
                    <div className="max-w-4xl">
                      <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Transcription</h3>
                        <div className="space-y-3">
                          {dialogue && Array.isArray(dialogue) && dialogue.length > 0 ? (
                            dialogue.map((item, idx) => (
                              <div 
                                key={idx} 
                                className={`rounded-lg p-4 ${
                                  item.speaker === 'doctor' 
                                    ? 'bg-blue-50 border-l-4 border-blue-500' 
                                    : 'bg-green-50 border-l-4 border-green-500'
                                }`}
                              >
                                <div className="flex items-start gap-3">
                                  <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                    item.speaker === 'doctor' ? 'bg-blue-100' : 'bg-green-100'
                                  }`}>
                                    <User className={`h-4 w-4 ${
                                      item.speaker === 'doctor' ? 'text-blue-600' : 'text-green-600'
                                    }`} />
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-xs font-semibold text-gray-600 mb-1 uppercase">
                                      {item.speaker}
                                    </p>
                                    <p className="text-sm text-gray-700 leading-relaxed">{item.text}</p>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : transcription ? (
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                              <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{transcription}</p>
                            </div>
                          ) : (
                            <div className="text-center text-gray-500 py-8">
                              <p className="text-sm">No transcription available</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Note Tab - SOAP Note */}
                  {sessionTab === 'note' && generatedNote && (
                    <div className="max-w-4xl">
                      <EnhancedProviderNote
                        patient={selectedPatient}
                        doctor={user}
                        recordData={generatedNote}
                        transcription={transcription}
                        dialogue={dialogue}
                        isGenerating={false}
                        onBack={() => setGeneratedNote(null)}
                      />
                    </div>
                  )}

                  {sessionTab === 'note' && !generatedNote && (
                    <div className="text-center max-w-md mx-auto mt-20">
                      <p className="text-gray-500">No note generated yet. Please transcribe audio first.</p>
                    </div>
                  )}
                </div>

                {/* Tasks Panel */}
                {showTasksPanel && transcription && (
                  <div className="w-80 border-l border-gray-200 bg-white flex flex-col">
                    <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">Tasks</h3>
                        <span className="px-2 py-0.5 bg-red-100 text-red-600 rounded text-xs font-medium">
                          Ask
                        </span>
                      </div>
                      <button
                        onClick={() => setShowTasksPanel(false)}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                      >
                        <X className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4">
                      <div className="space-y-3">
                        <div className="text-sm text-gray-600">
                          <p className="font-medium text-gray-900 mb-2">Transcription Summary</p>
                          <p className="text-xs leading-relaxed">{transcription.substring(0, 200)}...</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Bar */}
              <div className="border-t border-gray-200 px-6 py-3 bg-orange-50">
                <div className="flex items-center gap-2 text-sm">
                  <div className="flex items-center gap-2 text-orange-600">
                    <div className="w-4 h-4 rounded-full border-2 border-orange-600 flex items-center justify-center">
                      <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                    </div>
                    <span>Review your note before use to ensure it accurately represents the visit</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Home Tab */}
          {activeTab === 'home' && (
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <button
                    onClick={() => setShowPatientSelector(true)}
                    className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-all border border-blue-200"
                  >
                    <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center">
                      <Search className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-900">Lookup Patient</h3>
                      <p className="text-sm text-gray-600">Search existing patients</p>
                    </div>
                  </button>
                  <button
                    onClick={() => setShowPatientSelector(true)}
                    className="flex items-center gap-4 p-4 bg-gradient-to-r from-cyan-50 to-cyan-100 rounded-lg hover:from-cyan-100 hover:to-cyan-200 transition-all border border-cyan-200"
                  >
                    <div className="h-12 w-12 rounded-full bg-cyan-600 flex items-center justify-center">
                      <Plus className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-900">Add Patient</h3>
                      <p className="text-sm text-gray-600">Register new patient</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Recent Patients */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Patients</h2>
                {patients.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No patients yet</p>
                ) : (
                  <div className="space-y-2">
                    {patients.slice(0, 5).map((patient) => (
                      <button
                        key={patient._id}
                        onClick={() => handlePatientSelect(patient)}
                        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <User className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="text-left">
                            <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                            <p className="text-sm text-gray-500">
                              {patient.age && `${patient.age} years`} {patient.sex && `• ${patient.sex}`}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Patients Tab */}
          {activeTab === 'patients' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search patients..."
                      className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    />
                  </div>
                </div>
                <button
                  onClick={() => setShowPatientSelector(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-5 w-5" />
                  Add Patient
                </button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPatients.map((patient) => (
                  <button
                    key={patient._id}
                    onClick={() => handlePatientSelect(patient)}
                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all text-left"
                  >
                    <div className="flex items-start gap-3">
                      <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                        <User className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-1">{patient.name}</h3>
                        <div className="text-sm text-gray-500 space-y-0.5">
                          {patient.age && <p>Age: {patient.age}</p>}
                          {patient.sex && <p>Sex: {patient.sex}</p>}
                          {patient.mrn && <p>MRN: {patient.mrn}</p>}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Patient Detail Tab */}
          {activeTab === 'patient' && selectedPatient && (
            <div className="space-y-6">
              {/* Patient Info Card */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start gap-4">
                    <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="h-8 w-8 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedPatient.name}</h2>
                      <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
                        {selectedPatient.age && (
                          <div>
                            <span className="text-gray-500">Age:</span>
                            <span className="ml-2 text-gray-900 font-medium">{selectedPatient.age} years</span>
                          </div>
                        )}
                        {selectedPatient.sex && (
                          <div>
                            <span className="text-gray-500">Sex:</span>
                            <span className="ml-2 text-gray-900 font-medium">{selectedPatient.sex}</span>
                          </div>
                        )}
                        {selectedPatient.dob && (
                          <div>
                            <span className="text-gray-500">DOB:</span>
                            <span className="ml-2 text-gray-900 font-medium">{selectedPatient.dob}</span>
                          </div>
                        )}
                        {selectedPatient.mrn && (
                          <div>
                            <span className="text-gray-500">MRN:</span>
                            <span className="ml-2 text-gray-900 font-medium">{selectedPatient.mrn}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedPatient(null);
                      setActiveTab('patients');
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>

                {/* Last Conversation Summary */}
                {latestRecord && (
                  <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-100">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="h-5 w-5 text-blue-600" />
                      <h3 className="font-semibold text-gray-900">Last Conversation Summary</h3>
                    </div>
                    <div className="text-sm text-gray-700 space-y-1">
                      <p><span className="font-medium">Chief Complaint:</span> {latestRecord.subjective?.chiefComplaint || 'N/A'}</p>
                      <p><span className="font-medium">Diagnosis:</span> {latestRecord.assessment?.primaryDiagnosis || 'N/A'}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        <Clock className="h-3 w-3 inline mr-1" />
                        {new Date(latestRecord.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="grid md:grid-cols-2 gap-4">
                  <button
                    onClick={handleStartUpload}
                    className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg"
                  >
                    <Upload className="h-5 w-5" />
                    <span className="font-semibold">Upload Audio</span>
                  </button>
                  <button
                    onClick={handleStartLive}
                    className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-cyan-600 to-cyan-700 text-white rounded-lg hover:from-cyan-700 hover:to-cyan-800 transition-all shadow-md hover:shadow-lg"
                  >
                    <Mic className="h-5 w-5" />
                    <span className="font-semibold">Start Live Conversation</span>
                  </button>
                </div>
              </div>

              {/* Medical Records */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical Records</h3>
                {loadingRecords ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                  </div>
                ) : patientRecords.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No records yet</p>
                ) : (
                  <div className="space-y-3">
                    {patientRecords.map((record) => (
                      <div
                        key={record._id}
                        className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">
                              {record.subjective?.chiefComplaint || 'Medical Visit'}
                            </h4>
                            <p className="text-sm text-gray-600 mb-2">
                              {record.assessment?.primaryDiagnosis || 'No diagnosis'}
                            </p>
                            <p className="text-xs text-gray-500">
                              <Calendar className="h-3 w-3 inline mr-1" />
                              {new Date(record.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <FileText className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Generated SOAP Note - Inline Display */}
              {generatedNote && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="bg-blue-600 text-white px-6 py-4">
                    <h3 className="text-xl font-bold">Generated SOAP Note</h3>
                  </div>
                  <EnhancedProviderNote
                    patient={selectedPatient}
                    doctor={user}
                    recordData={generatedNote}
                    transcription={transcription}
                    dialogue={dialogue}
                    isGenerating={false}
                    onBack={() => setGeneratedNote(null)}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Upload Audio Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Upload a recording</h2>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setUploadFile(null);
                  setUploadMode('transcribe');
                }}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              <button
                className="flex-1 px-6 py-3 text-sm font-medium bg-white text-gray-900 border-b-2 border-gray-900"
              >
                Transcribe
              </button>
            </div>

            {/* Upload Area */}
            <div className="p-6">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center bg-gray-50 hover:bg-gray-100 transition-colors">
                {!uploadFile ? (
                  <>
                    <div className="mb-4 inline-flex">
                      <Upload className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="text-base font-medium text-gray-900 mb-2">
                      Click or drag file to this area to upload
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Supported formats: mp3, wav, mp4, aac, m4a, ogg, flac
                    </p>
                    <input
                      type="file"
                      accept="audio/*,video/mp4"
                      onChange={(e) => setUploadFile(e.target.files[0])}
                      className="hidden"
                      id="audio-file-input"
                    />
                    <label
                      htmlFor="audio-file-input"
                      className="inline-block px-6 py-2.5 bg-gray-900 text-white rounded-lg font-medium cursor-pointer hover:bg-gray-800 transition-colors text-sm"
                    >
                      Browse files
                    </label>
                  </>
                ) : (
                  <div className="flex items-center justify-between bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center gap-3">
                      <FileAudio className="h-8 w-8 text-blue-600" />
                      <div className="text-left">
                        <p className="text-sm font-semibold text-gray-900">{uploadFile.name}</p>
                        <p className="text-xs text-gray-500">
                          {(uploadFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setUploadFile(null)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>
                )}
              </div>

              {uploadFile && (
                <>
                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Uploading...</span>
                        <span className="text-sm font-medium text-gray-900">{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  {uploadProgress === 100 && (
                    <div className="mt-4 flex items-center gap-2 text-green-600 text-sm">
                      <Check className="h-5 w-5" />
                      <span>Upload successful!</span>
                    </div>
                  )}
                  
                  {uploadProgress === 0 && (
                    <button
                      onClick={handleFileUpload}
                      disabled={isProcessing}
                      className="w-full mt-4 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        `Upload and ${uploadMode === 'transcribe' ? 'Transcribe' : 'Dictate'}`
                      )}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Live Conversation Modal */}
      {showLiveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Live Conversation</h2>
              <button
                onClick={() => {
                  setShowLiveModal(false);
                  if (isRecording) stopRecording();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            <div className="border border-gray-200 rounded-2xl p-12 text-center">
              {!isRecording && !isProcessing && (
                <>
                  <div className="mb-6 inline-flex rounded-full bg-blue-100 p-8">
                    <Mic className="h-16 w-16 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to Record</h3>
                  <p className="text-sm text-gray-600 mb-8">
                    Click the button below to start recording
                  </p>
                  <button
                    onClick={startRecording}
                    className="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Start Recording
                  </button>
                </>
              )}

              {isRecording && (
                <>
                  <div className="mb-6 inline-flex rounded-full bg-red-100 p-8 animate-pulse">
                    <Mic className="h-16 w-16 text-red-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Recording...</h3>
                  <p className="text-3xl font-mono text-gray-600 mb-8">{formatTime(recordingTime)}</p>
                  <button
                    onClick={stopRecording}
                    className="px-8 py-4 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors flex items-center gap-2 mx-auto"
                  >
                    <Square className="h-5 w-5 fill-current" />
                    Stop Recording
                  </button>
                </>
              )}

              {isProcessing && (
                <>
                  <Loader2 className="h-16 w-16 animate-spin text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Processing Recording</h3>
                  <p className="text-sm text-gray-600">
                    Transcribing and analyzing your conversation...
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Template Selector Modal */}
      {showTemplateSelector && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="soap"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  defaultValue="soap"
                />
              </div>
              <button
                onClick={() => setShowTemplateSelector(false)}
                className="ml-4 p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            {/* Filters */}
            <div className="px-6 py-3 border-b border-gray-200 flex items-center gap-4 text-sm">
              <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                <ChevronDown className="h-4 w-4" />
                <span>Sort</span>
              </button>
              <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                <FileText className="h-4 w-4" />
                <span>Type</span>
              </button>
              <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                <User className="h-4 w-4" />
                <span>Creator</span>
              </button>
              <div className="ml-auto flex items-center gap-2">
                <span className="text-gray-600">Hide Pro</span>
                <button className="w-10 h-5 bg-gray-200 rounded-full relative">
                  <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 left-0.5"></div>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 max-h-96 overflow-y-auto">
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 mb-3">Generate a note with AI</h3>
                <button className="w-full flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                  </div>
                  <span className="font-medium text-gray-900">soap</span>
                  <Sparkles className="h-4 w-4 text-purple-600 ml-auto" />
                </button>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-3">Note templates</h3>
                <div className="space-y-2">
                  <button className="w-full flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <FileText className="h-5 w-5 text-gray-600" />
                    <span className="font-medium text-gray-900">Eating Disorder Intake & Assessment</span>
                  </button>
                  
                  <button className="w-full flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <FileText className="h-5 w-5 text-gray-600" />
                    <span className="font-medium text-gray-900">Physiotherapist's Note</span>
                  </button>
                  
                  <button className="w-full flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <FileText className="h-5 w-5 text-gray-600" />
                    <span className="font-medium text-gray-900">SMART goals</span>
                  </button>
                  
                  <button
                    onClick={() => handleTemplateSelect('soap')}
                    className="w-full flex items-center gap-3 p-4 border-2 border-blue-500 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <FileText className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-gray-900">SOAP Note</span>
                  </button>
                </div>
              </div>

              <button className="w-full mt-6 flex items-center gap-2 p-3 text-gray-600 hover:text-gray-900 transition-colors">
                <Plus className="h-5 w-5" />
                <span className="font-medium">Create new template</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Processing Popup */}
      {isProcessing && !showUploadModal && !showLiveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center">
            <Loader2 className="h-16 w-16 animate-spin text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Generating SOAP Note</h2>
            <p className="text-gray-600">
              Please wait while we process the transcription and generate your medical note...
            </p>
          </div>
        </div>
      )}

      {/* Patient Selector Modal */}
      {showPatientSelector && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <PatientSelector
              onSelectPatient={handlePatientSelect}
              onBack={() => setShowPatientSelector(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

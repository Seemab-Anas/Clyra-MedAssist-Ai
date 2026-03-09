'use client';

import { useState } from 'react';
import { Calendar, Clock, FileText, ChevronRight, Eye, Download } from 'lucide-react';

export default function SessionHistory({ sessions = [], onViewSession }) {
  const [selectedSession, setSelectedSession] = useState(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    return timeString;
  };

  if (sessions.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500 text-sm">No previous sessions found</p>
        <p className="text-gray-400 text-xs mt-1">Start a new session to create medical records</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900">
          Session History ({sessions.length})
        </h3>
      </div>

      <div className="space-y-2">
        {sessions.map((session) => (
          <div
            key={session._id}
            className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50/50 transition-all cursor-pointer group"
            onClick={() => onViewSession(session)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {/* Date and Time */}
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {formatDate(session.sessionDate || session.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <Clock className="h-3.5 w-3.5" />
                    <span className="text-xs">
                      {session.sessionTime || formatTime(session.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Template Name */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                    {session.templateName || 'SOAP Note'}
                  </span>
                  {session.icdCodes && session.icdCodes.length > 0 && (
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">
                      {session.icdCodes.length} ICD-10 {session.icdCodes.length === 1 ? 'code' : 'codes'}
                    </span>
                  )}
                </div>

                {/* Session Summary */}
                <p className="text-sm text-gray-600 line-clamp-2">
                  {session.sessionSummary || session.noteContent?.substring(0, 150) + '...' || 'No summary available'}
                </p>

                {/* Recording Type */}
                {session.recordingType && (
                  <div className="mt-2">
                    <span className="text-xs text-gray-500">
                      {session.recordingType === 'live' ? '🎤 Live Recording' : '📁 Uploaded Audio'}
                      {session.duration > 0 && ` • ${Math.floor(session.duration / 60)}:${String(session.duration % 60).padStart(2, '0')}`}
                    </span>
                  </div>
                )}
              </div>

              {/* View Button */}
              <button
                className="ml-4 p-2 rounded-lg bg-white border border-gray-200 group-hover:border-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewSession(session);
                }}
              >
                <Eye className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

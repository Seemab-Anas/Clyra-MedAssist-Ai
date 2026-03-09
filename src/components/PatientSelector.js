'use client';

import { useState, useEffect } from 'react';
import { User, Plus, Search, Loader2, X } from 'lucide-react';
import EnhancedPatientForm from './EnhancedPatientForm';

export default function PatientSelector({ onSelectPatient, onBack }) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await fetch('/api/patients');
      const data = await response.json();
      if (response.ok) {
        setPatients(data.patients);
      }
    } catch (err) {
      console.error('Failed to fetch patients:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPatient = async (formData) => {
    setSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setPatients([data.patient, ...patients]);
        setShowAddForm(false);
      } else {
        setError(data.error || 'Failed to add patient');
        alert(data.error || 'Failed to add patient');
      }
    } catch (err) {
      setError('Failed to add patient');
      alert('Failed to add patient');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (patient.mrn && patient.mrn.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="bg-white h-full flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Select Patient
          </h1>
          <p className="text-gray-500 text-xs mt-0.5">
            Choose a patient or add a new one to continue
          </p>
        </div>
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      {/* Search and Add Button */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or MRN..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900"
            />
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Patient
          </button>
        </div>
      </div>

      {/* Enhanced Patient Form Modal */}
      {showAddForm && (
        <EnhancedPatientForm
          onClose={() => setShowAddForm(false)}
          onSubmit={handleAddPatient}
        />
      )}

      {/* Patient List */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="grid md:grid-cols-2 gap-3">
          {filteredPatients.length === 0 ? (
            <div className="col-span-2 text-center py-12">
              <User className="h-10 w-10 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">
                {searchQuery ? 'No patients found' : 'No patients yet. Add your first patient to get started.'}
              </p>
            </div>
          ) : (
            filteredPatients.map((patient) => (
              <button
                key={patient._id}
                onClick={() => onSelectPatient(patient)}
                className="p-4 bg-white border border-gray-200 rounded-lg text-left hover:border-blue-400 hover:bg-blue-50 transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-gray-900 mb-1">
                      {patient.name}
                    </h3>
                    <div className="text-xs text-gray-600 space-y-0.5">
                      {patient.age && <p>Age: {patient.age}</p>}
                      {patient.sex && <p>Sex: {patient.sex}</p>}
                      {patient.mrn && <p>MRN: {patient.mrn}</p>}
                    </div>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

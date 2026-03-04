'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, X, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export default function ICDCodeSelector({ 
  noteContent, 
  initialCodes = [], 
  onCodesChange,
  templateSupportsICD10 = true 
}) {
  const [selectedCodes, setSelectedCodes] = useState(initialCodes);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Get AI suggestions when component mounts
  useEffect(() => {
    if (noteContent && aiSuggestions.length === 0 && templateSupportsICD10) {
      fetchAISuggestions();
    }
  }, [noteContent, templateSupportsICD10]);

  const fetchAISuggestions = async () => {
    setIsLoadingSuggestions(true);
    try {
      const response = await fetch('/api/suggest-icd-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ noteContent }),
      });

      const data = await response.json();
      if (data.success) {
        setAiSuggestions(data.suggestions);
      }
    } catch (error) {
      console.error('Failed to get AI suggestions:', error);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const searchCodes = async (query) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`/api/icd-codes/search?q=${encodeURIComponent(query)}&limit=10`);
      const data = await response.json();
      
      if (data.success) {
        setSearchResults(data.results);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        searchCodes(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const addCode = (code) => {
    // Check if already added
    if (selectedCodes.find(c => c.code === code.code)) {
      return;
    }

    const newCodes = [...selectedCodes, { ...code, source: code.source || 'MANUAL' }];
    setSelectedCodes(newCodes);
    onCodesChange?.(newCodes);
    setSearchQuery('');
    setSearchResults([]);
  };

  const removeCode = (codeToRemove) => {
    const newCodes = selectedCodes.filter(c => c.code !== codeToRemove);
    setSelectedCodes(newCodes);
    onCodesChange?.(newCodes);
  };

  const toggleSuggestion = (suggestion) => {
    const isSelected = selectedCodes.find(c => c.code === suggestion.code);
    
    if (isSelected) {
      removeCode(suggestion.code);
    } else {
      addCode(suggestion);
    }
  };

  // Don't render if template doesn't support ICD-10
  if (!templateSupportsICD10) {
    return null;
  }

  return (
    <div className="mt-6 border-t border-gray-200 pt-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">ICD-10 Codes</h3>

      {/* AI Suggestions */}
      {isLoadingSuggestions && (
        <div className="mb-4 p-4 bg-blue-50 rounded-lg flex items-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
          <span className="text-sm text-blue-700">AI is analyzing the note for diagnosis codes...</span>
        </div>
      )}

      {aiSuggestions.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            AI Suggested Codes
          </h4>
          <div className="space-y-2">
            {aiSuggestions.map((suggestion) => {
              const isSelected = selectedCodes.find(c => c.code === suggestion.code);
              
              return (
                <button
                  key={suggestion.code}
                  onClick={() => toggleSuggestion(suggestion)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-semibold text-gray-900">
                          {suggestion.code}
                        </span>
                        {!suggestion.validated && (
                          <AlertCircle className="h-4 w-4 text-yellow-500" title="Code not validated in database" />
                        )}
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          suggestion.confidence === 'high' ? 'bg-green-100 text-green-700' :
                          suggestion.confidence === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {suggestion.confidence}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{suggestion.description}</p>
                      <p className="text-xs text-gray-500 mt-1">Condition: {suggestion.condition}</p>
                    </div>
                    <div className="ml-3">
                      {isSelected ? (
                        <CheckCircle className="h-5 w-5 text-blue-600" />
                      ) : (
                        <Plus className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Manual Search */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Search & Add Codes</h4>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by code or description (e.g., diabetes, E11.9)"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {isSearching && (
            <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
          )}
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mt-2 border border-gray-200 rounded-lg max-h-60 overflow-y-auto">
            {searchResults.map((result) => (
              <button
                key={result.code}
                onClick={() => addCode(result)}
                className="w-full text-left p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <span className="font-mono text-sm font-semibold text-gray-900">{result.code}</span>
                    <p className="text-sm text-gray-600 mt-1">{result.description}</p>
                  </div>
                  <Plus className="h-5 w-5 text-gray-400 ml-3 flex-shrink-0" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected Codes */}
      {selectedCodes.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Codes ({selectedCodes.length})</h4>
          <div className="space-y-2">
            {selectedCodes.map((code) => (
              <div
                key={code.code}
                className="flex items-start justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-semibold text-gray-900">{code.code}</span>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                      {code.source}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{code.description || code.shortDescription}</p>
                </div>
                <button
                  onClick={() => removeCode(code.code)}
                  className="ml-3 p-1 hover:bg-gray-200 rounded transition-colors"
                >
                  <X className="h-4 w-4 text-gray-600" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedCodes.length === 0 && !isLoadingSuggestions && aiSuggestions.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p className="text-sm">No ICD-10 codes added yet.</p>
          <p className="text-xs mt-1">Search above to add codes manually.</p>
        </div>
      )}
    </div>
  );
}

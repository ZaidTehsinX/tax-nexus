import React, { useState } from 'react';
import { Search, Loader2, CheckCircle, XCircle, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import FolderSelector from './FolderSelector';
import { searchFiles } from '../api';
import { SearchFilesResponse } from '../types';

export const FileSearch: React.FC = () => {
  const [folders, setFolders] = useState<string[]>([]);
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchFilesResponse | null>(null);

  const handleSearch = async () => {
    if (folders.length === 0) {
      toast.error('Please select at least one folder');
      return;
    }
    if (!fileName.trim()) {
      toast.error('Please enter a file name to search');
      return;
    }

    setLoading(true);
    setResults(null);

    try {
      const response = await searchFiles(folders, fileName.trim());
      setResults(response);
      toast.success(`Search completed! Found in ${response.clientsWithFile.length} of ${response.totalClients} clients.`);
    } catch (error) {
      toast.error('Failed to search files. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setResults(null);
    setFolders([]);
    setFileName('');
  };

  return (
    <div className="section-container">
      <h2 className="section-title flex items-center gap-2">
        <Search className="w-5 h-5" />
        File Search
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Search Panel */}
        <div className="step-box">
          <h3 className="font-semibold text-gray-800 mb-4">Search Parameters</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                File Name
              </label>
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="e.g., Return 2024"
                className="input-field"
              />
              <p className="text-xs text-gray-500 mt-1">
                Searches for PDF files containing this name
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Client Folders
              </label>
              <FolderSelector
                selectedFolders={folders}
                onFoldersSelected={setFolders}
                placeholder="Enter folder path (e.g., C:\Clients\Ali)"
              />
            </div>

            <button
              onClick={handleSearch}
              disabled={loading || folders.length === 0 || !fileName.trim()}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              {loading ? 'Searching...' : 'Search Files'}
            </button>
          </div>
        </div>

        {/* Results Panel */}
        <div className="step-box">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Search Results</h3>
            {results && (
              <button
                onClick={clearResults}
                className="text-xs text-maroon-600 hover:text-maroon-800 font-medium"
              >
                Clear Results
              </button>
            )}
          </div>

          {!results ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <Users className="w-12 h-12 mb-3 opacity-50" />
              <p className="text-sm">Search results will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Summary */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {results.clientsWithFile.length}
                  </div>
                  <div className="text-xs text-green-700">Have "{results.fileName}"</div>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {results.clientsWithoutFile.length}
                  </div>
                  <div className="text-xs text-red-700">Missing "{results.fileName}"</div>
                </div>
              </div>

              {/* Client Lists */}
              <div className="max-h-64 overflow-y-auto space-y-3">
                {/* Clients with file */}
                {results.clientsWithFile.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-2 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Clients with file ({results.clientsWithFile.length})
                    </h4>
                    <div className="space-y-1">
                      {results.clientsWithFile.map((client, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 bg-green-50 border border-green-100 rounded px-3 py-2"
                        >
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm text-gray-700 truncate">
                            {client.clientName}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Clients without file */}
                {results.clientsWithoutFile.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-red-700 uppercase tracking-wide mb-2 flex items-center gap-1">
                      <XCircle className="w-3 h-3" />
                      Clients missing file ({results.clientsWithoutFile.length})
                    </h4>
                    <div className="space-y-1">
                      {results.clientsWithoutFile.map((client, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 bg-red-50 border border-red-100 rounded px-3 py-2"
                        >
                          <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                          <span className="text-sm text-gray-700 truncate">
                            {client.clientName}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileSearch;

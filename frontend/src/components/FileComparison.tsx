import React, { useState } from 'react';
import { GitCompare, Loader2, CheckCircle, XCircle, MinusCircle, Users, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import FolderSelector from './FolderSelector';
import { compareFiles } from '../api';
import { CompareFilesResponse } from '../types';

export const FileComparison: React.FC = () => {
  const [folders, setFolders] = useState<string[]>([]);
  const [fileName1, setFileName1] = useState('');
  const [fileName2, setFileName2] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<CompareFilesResponse | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleCompare = async () => {
    if (folders.length === 0) {
      toast.error('Please select at least one folder');
      return;
    }
    if (!fileName1.trim() || !fileName2.trim()) {
      toast.error('Please enter both file names');
      return;
    }

    setLoading(true);

    try {
      const response = await compareFiles(folders, fileName1.trim(), fileName2.trim());
      setResults(response);
      setShowResults(true);
      toast.success('Comparison completed!');
    } catch (error) {
      toast.error('Failed to compare files. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    setShowResults(false);
  };

  const clearAll = () => {
    setResults(null);
    setShowResults(false);
    setFolders([]);
    setFileName1('');
    setFileName2('');
  };

  // Comparison Results View
  if (showResults && results) {
    return (
      <div className="section-container">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={goBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h2 className="text-xl font-semibold text-maroon-950">
              Comparison Results
            </h2>
          </div>
          <button
            onClick={clearAll}
            className="text-sm text-maroon-600 hover:text-maroon-800 font-medium"
          >
            New Comparison
          </button>
        </div>

        {/* Comparison Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-green-600 mb-1">
              {results.hasBoth.length}
            </div>
            <div className="text-xs text-green-700 font-medium">Have Both Files</div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {results.hasFile1Only.length}
            </div>
            <div className="text-xs text-blue-700 font-medium">Only "{results.fileName1}"</div>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-1">
              {results.hasFile2Only.length}
            </div>
            <div className="text-xs text-orange-700 font-medium">Only "{results.fileName2}"</div>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-red-600 mb-1">
              {results.hasNeither.length}
            </div>
            <div className="text-xs text-red-700 font-medium">Missing Both</div>
          </div>
        </div>

        {/* Detailed Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Has Both */}
          <div className="step-box">
            <h4 className="flex items-center gap-2 text-sm font-semibold text-green-700 mb-3">
              <CheckCircle className="w-4 h-4" />
              Have Both Files ({results.hasBoth.length})
            </h4>
            <div className="max-h-48 overflow-y-auto space-y-1.5">
              {results.hasBoth.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">No clients</p>
              ) : (
                results.hasBoth.map((client, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-green-50 border border-green-100 rounded px-3 py-2"
                  >
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700 truncate">{client.clientName}</span>
                    <div className="ml-auto flex gap-1">
                      <span className="text-xs bg-green-200 text-green-800 px-1.5 py-0.5 rounded">
                        ✓ {results.fileName1}
                      </span>
                      <span className="text-xs bg-green-200 text-green-800 px-1.5 py-0.5 rounded">
                        ✓ {results.fileName2}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Has File 1 Only */}
          <div className="step-box">
            <h4 className="flex items-center gap-2 text-sm font-semibold text-blue-700 mb-3">
              <MinusCircle className="w-4 h-4" />
              Only "{results.fileName1}" ({results.hasFile1Only.length})
            </h4>
            <div className="max-h-48 overflow-y-auto space-y-1.5">
              {results.hasFile1Only.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">No clients</p>
              ) : (
                results.hasFile1Only.map((client, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded px-3 py-2"
                  >
                    <MinusCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700 truncate">{client.clientName}</span>
                    <div className="ml-auto flex gap-1">
                      <span className="text-xs bg-blue-200 text-blue-800 px-1.5 py-0.5 rounded">
                        ✓ {results.fileName1}
                      </span>
                      <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded">
                        ✗ {results.fileName2}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Has File 2 Only */}
          <div className="step-box">
            <h4 className="flex items-center gap-2 text-sm font-semibold text-orange-700 mb-3">
              <MinusCircle className="w-4 h-4" />
              Only "{results.fileName2}" ({results.hasFile2Only.length})
            </h4>
            <div className="max-h-48 overflow-y-auto space-y-1.5">
              {results.hasFile2Only.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">No clients</p>
              ) : (
                results.hasFile2Only.map((client, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-orange-50 border border-orange-100 rounded px-3 py-2"
                  >
                    <MinusCircle className="w-4 h-4 text-orange-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700 truncate">{client.clientName}</span>
                    <div className="ml-auto flex gap-1">
                      <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded">
                        ✗ {results.fileName1}
                      </span>
                      <span className="text-xs bg-orange-200 text-orange-800 px-1.5 py-0.5 rounded">
                        ✓ {results.fileName2}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Has Neither */}
          <div className="step-box">
            <h4 className="flex items-center gap-2 text-sm font-semibold text-red-700 mb-3">
              <XCircle className="w-4 h-4" />
              Missing Both Files ({results.hasNeither.length})
            </h4>
            <div className="max-h-48 overflow-y-auto space-y-1.5">
              {results.hasNeither.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">No clients</p>
              ) : (
                results.hasNeither.map((client, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-red-50 border border-red-100 rounded px-3 py-2"
                  >
                    <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700 truncate">{client.clientName}</span>
                    <div className="ml-auto flex gap-1">
                      <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded">
                        ✗ {results.fileName1}
                      </span>
                      <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded">
                        ✗ {results.fileName2}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Comparison Input View
  return (
    <div className="section-container">
      <h2 className="section-title flex items-center gap-2">
        <GitCompare className="w-5 h-5" />
        Return Comparison
      </h2>

      <div className="step-box">
        <h3 className="font-semibold text-gray-800 mb-4">Compare Two Return Files</h3>
        <p className="text-sm text-gray-600 mb-4">
          Compare which clients have specific returns filed. Searches inside the "Returns" subfolder of each selected client folder.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              First File Name
            </label>
            <input
              type="text"
              value={fileName1}
              onChange={(e) => setFileName1(e.target.value)}
              placeholder="e.g., Return 2024"
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Second File Name
            </label>
            <input
              type="text"
              value={fileName2}
              onChange={(e) => setFileName2(e.target.value)}
              placeholder="e.g., Return 2025"
              className="input-field"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Client Folders
          </label>
          <FolderSelector
            selectedFolders={folders}
            onFoldersSelected={setFolders}
          />
        </div>

        <button
          onClick={handleCompare}
          disabled={loading || folders.length === 0 || !fileName1.trim() || !fileName2.trim()}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <GitCompare className="w-4 h-4" />
          )}
          {loading ? 'Comparing...' : 'Compare Files'}
        </button>

        {!showResults && (
          <div className="flex flex-col items-center justify-center py-8 mt-4 border-t border-gray-200 text-gray-400">
            <Users className="w-10 h-10 mb-2 opacity-50" />
            <p className="text-sm">Comparison results will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileComparison;

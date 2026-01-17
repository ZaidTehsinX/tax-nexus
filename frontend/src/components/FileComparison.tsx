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
          <div className="flex gap-2">
            <button
              onClick={clearAll}
              className="px-4 py-2 text-sm font-medium text-white bg-maroon-600 hover:bg-maroon-700 rounded-lg transition-colors"
            >
              New Comparison
            </button>
            <button
              onClick={() => setResults(null)}
              className="px-4 py-2 text-sm font-medium text-maroon-600 bg-maroon-50 hover:bg-maroon-100 rounded-lg transition-colors border border-maroon-200"
            >
              Clear Results
            </button>
          </div>
        </div>

        {/* Comparison Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-5 text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">
              {results.hasBoth.length}
            </div>
            <div className="text-sm text-green-700 font-medium">Have Both Files</div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-5 text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {results.hasFile1Only.length}
            </div>
            <div className="text-sm text-blue-700 font-medium">Only "{results.fileName1}"</div>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-5 text-center">
            <div className="text-4xl font-bold text-orange-600 mb-2">
              {results.hasFile2Only.length}
            </div>
            <div className="text-sm text-orange-700 font-medium">Only "{results.fileName2}"</div>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-lg p-5 text-center">
            <div className="text-4xl font-bold text-red-600 mb-2">
              {results.hasNeither.length}
            </div>
            <div className="text-sm text-red-700 font-medium">Missing Both</div>
          </div>
        </div>

        {/* Detailed Results - Vertical Layout */}
        <div className="space-y-4">
          {/* Has Both */}
          <div className="step-box p-5">
            <h4 className="flex items-center gap-2 text-base font-semibold text-green-700 mb-4">
              <CheckCircle className="w-5 h-5" />
              Have Both Files ({results.hasBoth.length})
            </h4>
            <div className="max-h-52 overflow-y-auto space-y-2">
              {results.hasBoth.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">No clients</p>
              ) : (
                results.hasBoth.map((client, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 bg-green-50 border border-green-100 rounded-lg px-4 py-3"
                  >
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-700 truncate flex-1">{client.clientName}</span>
                    <div className="flex gap-2">
                      <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-md font-medium">
                        ✓ {results.fileName1}
                      </span>
                      <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-md font-medium">
                        ✓ {results.fileName2}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Has File 1 Only */}
          <div className="step-box p-5">
            <h4 className="flex items-center gap-2 text-base font-semibold text-blue-700 mb-4">
              <MinusCircle className="w-5 h-5" />
              Only "{results.fileName1}" ({results.hasFile1Only.length})
            </h4>
            <div className="max-h-52 overflow-y-auto space-y-2">
              {results.hasFile1Only.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">No clients</p>
              ) : (
                results.hasFile1Only.map((client, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-lg px-4 py-3"
                  >
                    <MinusCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-700 truncate flex-1">{client.clientName}</span>
                    <div className="flex gap-2">
                      <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-md font-medium">
                        ✓ {results.fileName1}
                      </span>
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-md font-medium">
                        ✗ {results.fileName2}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Has File 2 Only */}
          <div className="step-box p-5">
            <h4 className="flex items-center gap-2 text-base font-semibold text-orange-700 mb-4">
              <MinusCircle className="w-5 h-5" />
              Only "{results.fileName2}" ({results.hasFile2Only.length})
            </h4>
            <div className="max-h-52 overflow-y-auto space-y-2">
              {results.hasFile2Only.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">No clients</p>
              ) : (
                results.hasFile2Only.map((client, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 bg-orange-50 border border-orange-100 rounded-lg px-4 py-3"
                  >
                    <MinusCircle className="w-5 h-5 text-orange-500 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-700 truncate flex-1">{client.clientName}</span>
                    <div className="flex gap-2">
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-md font-medium">
                        ✗ {results.fileName1}
                      </span>
                      <span className="text-xs bg-orange-200 text-orange-800 px-2 py-1 rounded-md font-medium">
                        ✓ {results.fileName2}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Has Neither */}
          <div className="step-box p-5">
            <h4 className="flex items-center gap-2 text-base font-semibold text-red-700 mb-4">
              <XCircle className="w-5 h-5" />
              Missing Both Files ({results.hasNeither.length})
            </h4>
            <div className="max-h-52 overflow-y-auto space-y-2">
              {results.hasNeither.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">No clients</p>
              ) : (
                results.hasNeither.map((client, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-lg px-4 py-3"
                  >
                    <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-700 truncate flex-1">{client.clientName}</span>
                    <div className="flex gap-2">
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-md font-medium">
                        ✗ {results.fileName1}
                      </span>
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-md font-medium">
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

      <div className="step-box p-6">
        <h3 className="font-semibold text-gray-800 text-lg mb-3">Compare Two Return Files</h3>
        <p className="text-sm text-gray-600 mb-5 leading-relaxed">
          Compare which clients have specific returns filed. Searches inside the "Returns" subfolder of each selected client folder.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
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

        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Client Folders
          </label>
          <FolderSelector
            selectedFolders={folders}
            onFoldersSelected={setFolders}
          />
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleCompare}
            disabled={loading || folders.length === 0 || !fileName1.trim() || !fileName2.trim()}
            className="btn-primary flex items-center justify-center gap-2 min-w-[180px]"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <GitCompare className="w-4 h-4" />
            )}
            {loading ? 'Comparing...' : 'Compare Files'}
          </button>
        </div>

        {!showResults && (
          <div className="flex flex-col items-center justify-center py-8 mt-5 border-t border-gray-200 text-gray-400">
            <Users className="w-10 h-10 mb-2 opacity-50" />
            <p className="text-sm">Comparison results will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileComparison;

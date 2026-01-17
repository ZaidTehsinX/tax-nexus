import React, { useState, useEffect } from 'react';
import { X, HardDrive, Folder, ChevronUp, Loader2, AlertCircle } from 'lucide-react';

interface FolderBrowserProps {
  onSelectFolder: (path: string) => void;
  onClose: () => void;
}

interface FolderItem {
  name: string;
  path: string;
  isDirectory: boolean;
}

const FolderBrowser: React.FC<FolderBrowserProps> = ({ onSelectFolder, onClose }) => {
  const [currentPath, setCurrentPath] = useState('');
  const [pathInput, setPathInput] = useState('');
  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [drives, setDrives] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDrives, setShowDrives] = useState(true);

  const fetchDrives = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/drives');
      if (!response.ok) throw new Error('Failed to fetch drives');
      const data = await response.json();
      setDrives(data.drives || []);
      setShowDrives(true);
      setCurrentPath('');
      setFolders([]);
    } catch (err) {
      console.error('Error fetching drives:', err);
      setError((err as Error).message);
      // Fallback drives
      setDrives(['C:\\', 'D:\\', 'E:\\']);
    } finally {
      setLoading(false);
    }
  };

  const fetchFolders = async (path: string) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/list-dirs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to list folders');
      }

      const data = await response.json();
      setFolders(data.folders || []);
      setCurrentPath(path);
      setPathInput(path);
      setShowDrives(false);
    } catch (err) {
      console.error('Error fetching folders:', err);
      setError((err as Error).message);
      setFolders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBrowse = async () => {
    const path = pathInput?.trim();
    if (path) {
      await fetchFolders(path);
    }
  };

  const handleFolderClick = async (path: string) => {
    await fetchFolders(path);
  };

  const handleDriveClick = async (drive: string) => {
    await fetchFolders(drive);
  };

  const handleSelectFolder = () => {
    if (currentPath) {
      onSelectFolder(currentPath);
      onClose();
    }
  };

  const handleGoUp = async () => {
    if (!currentPath) return;
    
    const parts = currentPath.split('\\').filter(p => p);
    if (parts.length > 1) {
      parts.pop();
      const parentPath = parts.join('\\') + '\\';
      await fetchFolders(parentPath);
    } else {
      await fetchDrives();
    }
  };

  useEffect(() => {
    fetchDrives();
  }, []);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-[600px] max-h-[80vh] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-maroon-950 to-maroon-800 text-white px-6 py-5 rounded-t-2xl flex justify-between items-center">
          <h2 className="text-xl font-bold">Select a Folder</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Path Input */}
        <div className="p-4 bg-gray-50 border-b flex gap-3">
          <input
            type="text"
            value={pathInput}
            onChange={(e) => setPathInput(e.target.value)}
            placeholder="Enter path (e.g., C:\Clients)"
            className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-maroon-500 focus:outline-none font-mono text-sm"
            onKeyPress={(e) => e.key === 'Enter' && handleBrowse()}
          />
          <button 
            onClick={handleBrowse}
            className="px-5 py-3 bg-maroon-950 text-white rounded-lg hover:bg-maroon-800 transition-colors font-medium"
          >
            Go
          </button>
        </div>

        {/* Current Path Display */}
        {currentPath && (
          <div className="px-6 py-3 bg-maroon-50 border-b border-maroon-100 flex items-center gap-2 text-sm">
            <span className="font-semibold text-maroon-800">Current:</span>
            <span className="font-mono text-maroon-700 truncate">{currentPath}</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mx-4 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto min-h-[200px]">
          {loading && (
            <div className="flex items-center justify-center py-12 text-maroon-600">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              Loading...
            </div>
          )}

          {/* Drives View */}
          {!loading && showDrives && drives.length > 0 && (
            <div className="p-6 grid grid-cols-3 gap-4">
              {drives.map((drive) => (
                <button
                  key={drive}
                  onClick={() => handleDriveClick(drive)}
                  className="flex flex-col items-center gap-2 p-5 border-2 border-gray-200 rounded-xl hover:border-maroon-400 hover:bg-maroon-50 transition-all cursor-pointer"
                >
                  <HardDrive className="w-8 h-8 text-maroon-600" />
                  <span className="font-semibold text-gray-700">{drive}</span>
                </button>
              ))}
            </div>
          )}

          {/* Folders View */}
          {!loading && !showDrives && (
            <div className="divide-y">
              {/* Go Up Button */}
              {currentPath && (
                <button
                  onClick={handleGoUp}
                  className="w-full px-6 py-4 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left text-maroon-600 font-semibold"
                >
                  <ChevronUp className="w-5 h-5" />
                  <span>.. (Back)</span>
                </button>
              )}
              
              {/* Folder List */}
              {folders.map((folder) => (
                <button
                  key={folder.path}
                  onClick={() => handleFolderClick(folder.path)}
                  className="w-full px-6 py-4 flex items-center gap-3 hover:bg-gray-50 hover:pl-8 transition-all text-left border-l-3 border-transparent hover:border-maroon-500"
                >
                  <Folder className="w-5 h-5 text-amber-500" />
                  <span className="text-gray-700 truncate">{folder.name}</span>
                </button>
              ))}

              {/* No Folders Message */}
              {folders.length === 0 && currentPath && (
                <div className="py-12 text-center text-gray-400">
                  No subfolders found in this directory
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 rounded-b-2xl flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 border-2 border-maroon-600 text-maroon-600 rounded-lg hover:bg-maroon-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSelectFolder}
            disabled={!currentPath}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
          >
            ✓ Select This Folder
          </button>
        </div>
      </div>
    </div>
  );
};

export default FolderBrowser;

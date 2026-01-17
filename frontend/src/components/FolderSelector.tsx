import React, { useState } from 'react';
import { Folder, X, FolderTree } from 'lucide-react';
import FolderBrowser from './FolderBrowser';
import toast from 'react-hot-toast';

interface FolderSelectorProps {
  selectedFolders: string[];
  onFoldersSelected: (folders: string[]) => void;
}

export const FolderSelector: React.FC<FolderSelectorProps> = ({
  selectedFolders,
  onFoldersSelected
}) => {
  const [showBrowser, setShowBrowser] = useState(false);
  const [showSubfolderBrowser, setShowSubfolderBrowser] = useState(false);
  const [loadingSubfolders, setLoadingSubfolders] = useState(false);

  const handleFolderSelected = (path: string) => {
    if (!selectedFolders.includes(path)) {
      onFoldersSelected([...selectedFolders, path]);
    }
    setShowBrowser(false);
  };

  const handleSelectAllSubfolders = async (path: string) => {
    setShowSubfolderBrowser(false);
    setLoadingSubfolders(true);
    
    try {
      const response = await fetch('/api/list-dirs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path })
      });
      
      if (!response.ok) {
        throw new Error('Failed to get subfolders');
      }
      
      const data = await response.json();
      const subfolderPaths = data.folders.map((f: { path: string }) => f.path);
      
      if (subfolderPaths.length === 0) {
        toast.error('No subfolders found in selected folder');
        return;
      }
      
      // Add all subfolders that aren't already selected
      const newFolders = subfolderPaths.filter((p: string) => !selectedFolders.includes(p));
      if (newFolders.length > 0) {
        onFoldersSelected([...selectedFolders, ...newFolders]);
        toast.success(`Added ${newFolders.length} folder(s)`);
      } else {
        toast.info('All subfolders already selected');
      }
    } catch (error) {
      console.error('Error fetching subfolders:', error);
      toast.error('Failed to get subfolders');
    } finally {
      setLoadingSubfolders(false);
    }
  };

  const removeFolder = (index: number) => {
    const newFolders = selectedFolders.filter((_, i) => i !== index);
    onFoldersSelected(newFolders);
  };

  const clearAll = () => {
    onFoldersSelected([]);
  };

  const getFolderName = (path: string) => {
    const parts = path.split(/[/\\]/);
    return parts[parts.length - 1] || path;
  };

  return (
    <>
      {showBrowser && (
        <FolderBrowser
          onSelectFolder={handleFolderSelected}
          onClose={() => setShowBrowser(false)}
        />
      )}

      {showSubfolderBrowser && (
        <FolderBrowser
          onSelectFolder={handleSelectAllSubfolders}
          onClose={() => setShowSubfolderBrowser(false)}
        />
      )}

      <div className="space-y-3">
        {/* Select Folder Button */}
        <button
          onClick={() => setShowBrowser(true)}
          type="button"
          className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-maroon-400 hover:bg-maroon-50 transition-all text-gray-600 hover:text-maroon-700 font-medium flex items-center justify-center gap-2"
        >
          <Folder className="w-5 h-5" />
          {selectedFolders.length === 0 ? 'Select Folder' : 'Add Another Folder'}
        </button>

        {/* Select All Subfolders Button */}
        <button
          onClick={() => setShowSubfolderBrowser(true)}
          type="button"
          disabled={loadingSubfolders}
          className="w-full py-3 px-4 border-2 border-dashed border-maroon-300 rounded-lg hover:border-maroon-500 hover:bg-maroon-50 transition-all text-maroon-600 hover:text-maroon-800 font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FolderTree className="w-5 h-5" />
          {loadingSubfolders ? 'Loading...' : 'Select All Subfolders'}
        </button>

        {/* Selected folders list */}
        {selectedFolders.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Selected ({selectedFolders.length})
              </span>
              <button
                onClick={clearAll}
                type="button"
                className="text-xs text-maroon-600 hover:text-maroon-800 font-medium"
              >
                Clear All
              </button>
            </div>
            <div className="max-h-32 overflow-y-auto space-y-2">
              {selectedFolders.map((folder, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-3 group hover:border-maroon-300 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <Folder className="w-5 h-5 text-amber-500 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-gray-800 truncate">
                        {getFolderName(folder)}
                      </div>
                      <div className="text-xs text-gray-400 truncate font-mono" title={folder}>
                        {folder}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFolder(index)}
                    type="button"
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors ml-2"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default FolderSelector;
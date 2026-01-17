import React, { useState } from 'react';
import { Folder, X } from 'lucide-react';
import FolderBrowser from './FolderBrowser';

interface FolderSelectorProps {
  selectedFolders: string[];
  onFoldersSelected: (folders: string[]) => void;
}

export const FolderSelector: React.FC<FolderSelectorProps> = ({
  selectedFolders,
  onFoldersSelected
}) => {
  const [showBrowser, setShowBrowser] = useState(false);

  const handleFolderSelected = (path: string) => {
    if (!selectedFolders.includes(path)) {
      onFoldersSelected([...selectedFolders, path]);
    }
    setShowBrowser(false);
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
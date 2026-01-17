import React, { useState } from 'react';
import { FolderOpen, X, Plus } from 'lucide-react';

interface FolderSelectorProps {
  selectedFolders: string[];
  onFoldersSelected: (folders: string[]) => void;
  placeholder?: string;
}

export const FolderSelector: React.FC<FolderSelectorProps> = ({
  selectedFolders,
  onFoldersSelected,
  placeholder = 'Enter folder path (e.g., C:\\Clients\\Ali)'
}) => {
  const [inputPath, setInputPath] = useState('');

  const handleAddFolder = () => {
    const trimmedPath = inputPath.trim();
    if (trimmedPath && !selectedFolders.includes(trimmedPath)) {
      onFoldersSelected([...selectedFolders, trimmedPath]);
      setInputPath('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddFolder();
    }
  };

  const removeFolder = (index: number) => {
    const newFolders = selectedFolders.filter((_, i) => i !== index);
    onFoldersSelected(newFolders);
  };

  const clearAll = () => {
    onFoldersSelected([]);
    setInputPath('');
  };

  const getFolderName = (path: string) => {
    const parts = path.split(/[/\\]/);
    return parts[parts.length - 1] || path;
  };

  return (
    <div className="space-y-3">
      {/* Input for folder path */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <FolderOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={inputPath}
            onChange={(e) => setInputPath(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            className="input-field pl-10 pr-4 text-sm"
          />
        </div>
        <button
          onClick={handleAddFolder}
          disabled={!inputPath.trim()}
          className="px-3 py-2 bg-maroon-950 text-white rounded hover:bg-maroon-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-1 text-sm"
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
      </div>

      {/* Selected folders list */}
      {selectedFolders.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Selected Folders ({selectedFolders.length})
            </span>
            <button
              onClick={clearAll}
              className="text-xs text-maroon-600 hover:text-maroon-800 font-medium"
            >
              Clear All
            </button>
          </div>
          <div className="max-h-32 overflow-y-auto space-y-1.5">
            {selectedFolders.map((folder, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-white border border-gray-200 rounded px-3 py-2 group hover:border-maroon-300 transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <FolderOpen className="w-4 h-4 text-maroon-500 flex-shrink-0" />
                  <span className="text-sm text-gray-700 truncate" title={folder}>
                    {getFolderName(folder)}
                  </span>
                </div>
                <button
                  onClick={() => removeFolder(index)}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors ml-2"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FolderSelector;

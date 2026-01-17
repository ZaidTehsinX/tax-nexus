import React, { useState } from 'react';
import { FolderOpen, X, Plus, Clipboard, Info } from 'lucide-react';

interface FolderSelectorProps {
  selectedFolders: string[];
  onFoldersSelected: (folders: string[]) => void;
  placeholder?: string;
  helperText?: string;
}

export const FolderSelector: React.FC<FolderSelectorProps> = ({
  selectedFolders,
  onFoldersSelected,
  placeholder = 'E:\\Clients\\ClientName',
  helperText
}) => {
  const [inputPath, setInputPath] = useState('');
  const [showTip, setShowTip] = useState(false);

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text && text.trim()) {
        setInputPath(text.trim());
      }
    } catch (error) {
      console.error('Failed to paste from clipboard:', error);
    }
  };

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
    <div className="space-y-2">
      {/* Helper text */}
      {helperText && (
        <p className="text-xs text-gray-500 italic">{helperText}</p>
      )}
      
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
          onClick={handlePasteFromClipboard}
          type="button"
          className="px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors flex items-center text-sm border border-gray-300"
          title="Paste path from clipboard"
        >
          <Clipboard className="w-4 h-4" />
        </button>
        <button
          onClick={handleAddFolder}
          disabled={!inputPath.trim()}
          className="px-3 py-2 bg-maroon-950 text-white rounded hover:bg-maroon-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-1 text-sm"
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
      </div>

      {/* Tip about folder paths */}
      <div className="relative">
        <button
          onClick={() => setShowTip(!showTip)}
          className="text-xs text-maroon-600 hover:text-maroon-800 flex items-center gap-1"
        >
          <Info className="w-3 h-3" />
          How to get folder path?
        </button>
        {showTip && (
          <div className="mt-2 p-3 bg-gray-50 rounded-lg text-xs text-gray-600 border border-gray-200">
            <p className="font-medium mb-1">To copy a folder path:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Open File Explorer and navigate to your folder</li>
              <li>Click on the address bar (or press Ctrl+L)</li>
              <li>Copy the path (Ctrl+C)</li>
              <li>Paste it here using the clipboard button</li>
            </ol>
          </div>
        )}
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
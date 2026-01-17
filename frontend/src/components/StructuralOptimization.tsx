import React, { useState } from 'react';
import { FolderPlus, FileOutput, Trash2, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import FolderSelector from './FolderSelector';
import { createReturnsFolders, moveReturnFiles, deleteReturnFolders } from '../api';

interface StepResult {
  success: boolean;
  message: string;
}

export const StructuralOptimization: React.FC = () => {
  // Step 1 state
  const [step1Folders, setStep1Folders] = useState<string[]>([]);
  const [step1Loading, setStep1Loading] = useState(false);
  const [step1Result, setStep1Result] = useState<StepResult | null>(null);

  // Step 2 state
  const [step2Folders, setStep2Folders] = useState<string[]>([]);
  const [step2Loading, setStep2Loading] = useState(false);
  const [step2Result, setStep2Result] = useState<StepResult | null>(null);

  // Step 3 state
  const [step3Folders, setStep3Folders] = useState<string[]>([]);
  const [step3Loading, setStep3Loading] = useState(false);
  const [step3Result, setStep3Result] = useState<StepResult | null>(null);

  // Step 1: Create Returns folders
  const handleStep1 = async () => {
    if (step1Folders.length === 0) {
      toast.error('Please select at least one folder');
      return;
    }

    setStep1Loading(true);
    setStep1Result(null);

    try {
      const response = await createReturnsFolders(step1Folders);
      const created = response.results.filter(r => r.created).length;
      const existing = response.results.filter(r => r.alreadyExists).length;
      
      setStep1Result({
        success: true,
        message: `Created ${created} Returns folder(s). ${existing} already existed.`
      });
      toast.success('Returns folders processed successfully!');
      setStep1Folders([]);
    } catch (error) {
      setStep1Result({
        success: false,
        message: 'Failed to create Returns folders. Please try again.'
      });
      toast.error('Failed to create Returns folders');
    } finally {
      setStep1Loading(false);
    }
  };

  // Step 2: Move Return files
  const handleStep2 = async () => {
    if (step2Folders.length === 0) {
      toast.error('Please select at least one folder');
      return;
    }

    setStep2Loading(true);
    setStep2Result(null);

    try {
      const response = await moveReturnFiles(step2Folders);
      
      setStep2Result({
        success: true,
        message: `Moved ${response.totalFilesMoved} Return PDF file(s) to Returns folders.`
      });
      toast.success(`Moved ${response.totalFilesMoved} file(s) successfully!`);
      setStep2Folders([]);
    } catch (error) {
      setStep2Result({
        success: false,
        message: 'Failed to move Return files. Please try again.'
      });
      toast.error('Failed to move Return files');
    } finally {
      setStep2Loading(false);
    }
  };

  // Step 3: Delete Return folders
  const handleStep3 = async () => {
    if (step3Folders.length === 0) {
      toast.error('Please select at least one folder');
      return;
    }

    // Confirm deletion
    if (!confirm('Are you sure you want to permanently delete all "Return" folders? This action cannot be undone.')) {
      return;
    }

    setStep3Loading(true);
    setStep3Result(null);

    try {
      const response = await deleteReturnFolders(step3Folders);
      
      setStep3Result({
        success: true,
        message: `Deleted ${response.totalFoldersDeleted} "Return" folder(s) permanently.`
      });
      toast.success(`Deleted ${response.totalFoldersDeleted} folder(s) successfully!`);
      setStep3Folders([]);
    } catch (error) {
      setStep3Result({
        success: false,
        message: 'Failed to delete Return folders. Please try again.'
      });
      toast.error('Failed to delete Return folders');
    } finally {
      setStep3Loading(false);
    }
  };

  const ResultBadge: React.FC<{ result: StepResult | null }> = ({ result }) => {
    if (!result) return null;
    
    return (
      <div className={`flex items-center gap-2 mt-3 p-3 rounded-lg ${
        result.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
      }`}>
        {result.success ? (
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
        ) : (
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
        )}
        <span className="text-sm">{result.message}</span>
      </div>
    );
  };

  return (
    <div className="section-container">
      <h2 className="section-title flex items-center gap-2">
        <FolderPlus className="w-5 h-5" />
        Structural Optimization
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Step 1 */}
        <div className="step-box flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-7 h-7 flex items-center justify-center bg-maroon-950 text-white text-sm font-bold rounded">
              1
            </span>
            <h3 className="font-semibold text-gray-800">Create Returns Folder</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4 flex-1">
            Creates a "Returns" folder inside each selected client folder if it doesn't already exist.
          </p>
          
          <div className="space-y-3">
            <FolderSelector
              selectedFolders={step1Folders}
              onFoldersSelected={setStep1Folders}
              placeholder="Enter folder path (e.g., C:\Clients\Ali)"
            />
            
            <button
              onClick={handleStep1}
              disabled={step1Loading || step1Folders.length === 0}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {step1Loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <FolderPlus className="w-4 h-4" />
              )}
              {step1Loading ? 'Creating...' : 'Create Returns Folders'}
            </button>
            
            <ResultBadge result={step1Result} />
          </div>
        </div>

        {/* Step 2 */}
        <div className="step-box flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-7 h-7 flex items-center justify-center bg-maroon-950 text-white text-sm font-bold rounded">
              2
            </span>
            <h3 className="font-semibold text-gray-800">Move Return Files</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4 flex-1">
            Finds all PDF files with "Return" in the name and moves them to the Returns folder.
          </p>
          
          <div className="space-y-3">
            <FolderSelector
              selectedFolders={step2Folders}
              onFoldersSelected={setStep2Folders}
              placeholder="Enter folder path (e.g., C:\Clients\Ali)"
            />
            
            <button
              onClick={handleStep2}
              disabled={step2Loading || step2Folders.length === 0}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {step2Loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <FileOutput className="w-4 h-4" />
              )}
              {step2Loading ? 'Moving...' : 'Move Return Files'}
            </button>
            
            <ResultBadge result={step2Result} />
          </div>
        </div>

        {/* Step 3 */}
        <div className="step-box flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-7 h-7 flex items-center justify-center bg-maroon-950 text-white text-sm font-bold rounded">
              3
            </span>
            <h3 className="font-semibold text-gray-800">Delete Return Folders</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4 flex-1">
            Permanently deletes all folders named "Return" inside the selected folders.
          </p>
          
          <div className="space-y-3">
            <FolderSelector
              selectedFolders={step3Folders}
              onFoldersSelected={setStep3Folders}
              placeholder="Enter folder path (e.g., C:\Clients\Ali)"
            />
            
            <button
              onClick={handleStep3}
              disabled={step3Loading || step3Folders.length === 0}
              className="btn-primary w-full flex items-center justify-center gap-2 bg-red-700 hover:bg-red-800"
            >
              {step3Loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              {step3Loading ? 'Deleting...' : 'Delete Return Folders'}
            </button>
            
            <ResultBadge result={step3Result} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StructuralOptimization;

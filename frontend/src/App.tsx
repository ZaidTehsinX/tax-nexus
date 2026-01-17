import { useEffect, useState } from 'react';
import {
  GradientText,
  StructuralOptimization,
  FileSearch,
  FileComparison,
  Footer
} from './components';
import { checkHealth } from './api';
import { AlertCircle, Loader2 } from 'lucide-react';

function App() {
  const [apiStatus, setApiStatus] = useState<'loading' | 'connected' | 'error'>('loading');

  useEffect(() => {
    const checkApiHealth = async () => {
      const isHealthy = await checkHealth();
      setApiStatus(isHealthy ? 'connected' : 'error');
    };

    checkApiHealth();
    // Check every 30 seconds
    const interval = setInterval(checkApiHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Header */}
      <header className="text-center mb-8">
        <GradientText staticText="Tax " animatedText="Nexus" />
        <p className="text-gray-500 mt-2 text-sm">
          Client Folder & Tax Returns Management
        </p>
        <p className="text-maroon-700 text-xs mt-1 font-medium">
          Tehsin Law Associates
        </p>
        
        {/* API Status Badge */}
        <div className="mt-4">
          {apiStatus === 'loading' && (
            <span className="inline-flex items-center gap-1.5 text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              <Loader2 className="w-3 h-3 animate-spin" />
              Connecting to server...
            </span>
          )}
          {apiStatus === 'connected' && (
            <span className="inline-flex items-center gap-1.5 text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Server Connected
            </span>
          )}
          {apiStatus === 'error' && (
            <span className="inline-flex items-center gap-1.5 text-xs text-red-600 bg-red-50 px-3 py-1 rounded-full">
              <AlertCircle className="w-3 h-3" />
              Server Disconnected - Please start the backend
            </span>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="space-y-6">
        {/* Section 1: Structural Optimization */}
        <StructuralOptimization />

        {/* Section 2: File Search */}
        <FileSearch />

        {/* Section 3: File Comparison */}
        <FileComparison />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;

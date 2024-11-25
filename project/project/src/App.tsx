import React, { useState } from 'react';
import { URLInput } from './components/URLInput';
import { MindMap } from './components/MindMap';
import { Braces, Download, Settings } from 'lucide-react';
import { processWebsite } from './services/websiteService';
import { useMindMapStore } from './store/mindmapStore';

function App() {
  const [isProcessing, setIsProcessing] = useState(false);
  const { setNodes, setEdges } = useMindMapStore();

  const handleURLSubmit = async (url: string) => {
    try {
      setIsProcessing(true);
      const data = await processWebsite(url);
      setNodes(data.nodes);
      setEdges(data.edges);
    } catch (error) {
      console.error('Error:', error);
      // TODO: Add error handling UI
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Braces className="w-8 h-8 text-blue-600" />
              <h1 className="text-xl font-semibold text-gray-900">MindMap Visualizer</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-500 hover:text-blue-600 rounded-lg hover:bg-gray-100">
                <Settings className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-500 hover:text-blue-600 rounded-lg hover:bg-gray-100">
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center space-y-8">
          <URLInput onSubmit={handleURLSubmit} isLoading={isProcessing} />
          <MindMap />
        </div>
      </main>
    </div>
  );
}

export default App;
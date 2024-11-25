import React, { useState, useEffect } from 'react';
import { X, Loader } from 'lucide-react';
import { useMindMapStore } from '../store/mindmapStore';
import { listMindMaps, loadMindMap, supabase } from '../lib/supabase';

interface LoadDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoadDialog: React.FC<LoadDialogProps> = ({ isOpen, onClose }) => {
  const [mindmaps, setMindmaps] = useState<Array<{ id: string; name: string; created_at: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { setNodes, setEdges } = useMindMapStore();

  useEffect(() => {
    if (isOpen) {
      fetchMindmaps();
    }
  }, [isOpen]);

  const fetchMindmaps = async () => {
    if (!supabase) {
      setError('Supabase is not properly configured. Please check your environment variables.');
      setIsLoading(false);
      return;
    }

    try {
      setError('');
      const data = await listMindMaps();
      setMindmaps(data);
    } catch (err) {
      setError('Failed to load mindmaps. Please try again.');
      console.error('Error loading mindmaps:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoad = async (id: string) => {
    if (!supabase) return;

    try {
      setIsLoading(true);
      setError('');
      const mindmap = await loadMindMap(id);
      setNodes(mindmap.nodes);
      setEdges(mindmap.edges);
      onClose();
    } catch (err) {
      setError('Failed to load mindmap. Please try again.');
      console.error('Error loading mindmap:', err);
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Load Mindmap</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader className="w-6 h-6 animate-spin text-blue-600" />
            </div>
          ) : mindmaps.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No saved mindmaps found</p>
          ) : (
            <div className="space-y-2">
              {mindmaps.map((mindmap) => (
                <button
                  key={mindmap.id}
                  onClick={() => handleLoad(mindmap.id)}
                  className="w-full p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <div className="font-medium">{mindmap.name}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(mindmap.created_at).toLocaleDateString()}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
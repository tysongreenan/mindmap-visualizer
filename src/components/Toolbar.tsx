import React, { useState } from 'react';
import { Download, Plus, Save, FolderOpen } from 'lucide-react';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { useMindMapStore } from '../store/mindmapStore';
import { SaveDialog } from './SaveDialog';
import { LoadDialog } from './LoadDialog';

export const Toolbar: React.FC = () => {
  const { addNode } = useMindMapStore();
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [isLoadDialogOpen, setIsLoadDialogOpen] = useState(false);

  const exportToPng = async () => {
    const element = document.querySelector('.react-flow') as HTMLElement;
    if (!element) return;
    
    try {
      const dataUrl = await toPng(element, {
        backgroundColor: '#ffffff',
        quality: 1,
      });
      const link = document.createElement('a');
      link.download = 'mindmap.png';
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Error exporting PNG:', error);
    }
  };

  const exportToPdf = async () => {
    const element = document.querySelector('.react-flow') as HTMLElement;
    if (!element) return;
    
    try {
      const dataUrl = await toPng(element, {
        backgroundColor: '#ffffff',
        quality: 1,
      });
      
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [element.offsetWidth, element.offsetHeight],
      });
      
      pdf.addImage(dataUrl, 'PNG', 0, 0, element.offsetWidth, element.offsetHeight);
      pdf.save('mindmap.pdf');
    } catch (error) {
      console.error('Error exporting PDF:', error);
    }
  };

  const handleAddNode = () => {
    const newNode = {
      id: `node-${Date.now()}`,
      type: 'custom',
      position: { x: 100, y: 100 },
      data: { label: 'New Node' },
    };
    addNode(newNode);
  };

  return (
    <>
      <div className="absolute top-4 right-4 flex flex-col gap-2 bg-white p-2 rounded-lg shadow-lg">
        <button
          onClick={handleAddNode}
          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg tooltip"
          title="Add Node"
        >
          <Plus className="w-5 h-5" />
        </button>
        <button
          onClick={() => setIsSaveDialogOpen(true)}
          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg tooltip"
          title="Save Mindmap"
        >
          <Save className="w-5 h-5" />
        </button>
        <button
          onClick={() => setIsLoadDialogOpen(true)}
          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg tooltip"
          title="Load Mindmap"
        >
          <FolderOpen className="w-5 h-5" />
        </button>
        <button
          onClick={exportToPng}
          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg tooltip"
          title="Export as PNG"
        >
          <Download className="w-5 h-5" />
        </button>
        <button
          onClick={exportToPdf}
          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg tooltip"
          title="Export as PDF"
        >
          <Download className="w-5 h-5" />
        </button>
      </div>

      <SaveDialog isOpen={isSaveDialogOpen} onClose={() => setIsSaveDialogOpen(false)} />
      <LoadDialog isOpen={isLoadDialogOpen} onClose={() => setIsLoadDialogOpen(false)} />
    </>
  );
};
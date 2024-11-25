import React, { useState, memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Palette, Tag, Trash2 } from 'lucide-react';
import { useMindMapStore } from '../store/mindmapStore';

export const CustomNode = memo(({ id, data }: NodeProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const { updateNode, removeNode } = useMindMapStore();
  
  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNode(id, { data: { ...data, label: e.target.value } });
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNode(id, {
      data: {
        ...data,
        metadata: { ...data.metadata, color: e.target.value },
      },
    });
  };

  const handleTagAdd = (tag: string) => {
    const currentTags = data.metadata?.tags || [];
    updateNode(id, {
      data: {
        ...data,
        metadata: {
          ...data.metadata,
          tags: [...currentTags, tag],
        },
      },
    });
  };

  return (
    <div
      className="relative group"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
      style={{
        background: data.metadata?.color || 'white',
        borderRadius: '0.5rem',
        padding: '1rem',
        border: '2px solid #e2e8f0',
        minWidth: '150px',
      }}
    >
      <Handle type="target" position={Position.Top} />
      
      {isEditing ? (
        <input
          autoFocus
          defaultValue={data.label}
          onChange={handleLabelChange}
          onBlur={() => setIsEditing(false)}
          className="w-full bg-transparent border-none focus:outline-none"
        />
      ) : (
        <div onDoubleClick={() => setIsEditing(true)} className="font-medium">
          {data.label}
        </div>
      )}

      {data.metadata?.tags && (
        <div className="flex flex-wrap gap-1 mt-2">
          {data.metadata.tags.map((tag, index) => (
            <span
              key={index}
              className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {showControls && (
        <div className="absolute -right-2 top-0 flex flex-col gap-1 bg-white p-1 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => removeNode(id)}
            className="p-1 text-red-500 hover:bg-red-50 rounded"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button className="p-1 text-gray-500 hover:bg-gray-50 rounded">
            <Tag className="w-4 h-4" />
          </button>
          <input
            type="color"
            onChange={handleColorChange}
            className="w-6 h-6 p-0 border-none cursor-pointer"
            value={data.metadata?.color || '#ffffff'}
          />
        </div>
      )}

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
});
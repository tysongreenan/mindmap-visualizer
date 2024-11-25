export interface MindMapNode {
  id: string;
  type: 'default' | 'custom';
  position: { x: number; y: number };
  data: {
    label: string;
    url?: string;
    metadata?: {
      description?: string;
      tags?: string[];
      color?: string;
    };
  };
}

export interface MindMapEdge {
  id: string;
  source: string;
  target: string;
  type?: 'default' | 'custom';
  label?: string;
}

export interface MindMapState {
  nodes: MindMapNode[];
  edges: MindMapEdge[];
  setNodes: (nodes: MindMapNode[]) => void;
  setEdges: (edges: MindMapEdge[]) => void;
  addNode: (node: MindMapNode) => void;
  removeNode: (nodeId: string) => void;
  updateNode: (nodeId: string, data: Partial<MindMapNode>) => void;
  addEdge: (edge: MindMapEdge) => void;
  removeEdge: (edgeId: string) => void;
}
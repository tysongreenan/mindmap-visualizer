import React, { useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  NodeTypes,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useMindMapStore } from '../store/mindmapStore';
import { CustomNode } from './CustomNode';
import { Toolbar } from './Toolbar';

const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

export const MindMap: React.FC = () => {
  const { nodes, edges, setNodes, setEdges } = useMindMapStore();
  const [reactFlowNodes, setReactFlowNodes, onNodesChange] = useNodesState(nodes);
  const [reactFlowEdges, setReactFlowEdges, onEdgesChange] = useEdgesState(edges);

  const onConnect = useCallback(
    (params: Connection | Edge) => {
      const newEdge = addEdge(params, reactFlowEdges);
      setReactFlowEdges(newEdge);
      setEdges(newEdge);
    },
    [reactFlowEdges, setReactFlowEdges, setEdges]
  );

  React.useEffect(() => {
    setReactFlowNodes(nodes);
    setReactFlowEdges(edges);
  }, [nodes, edges, setReactFlowNodes, setReactFlowEdges]);

  return (
    <div className="w-full h-[calc(100vh-12rem)] bg-white rounded-lg shadow-lg relative">
      <ReactFlow
        nodes={reactFlowNodes}
        edges={reactFlowEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
        <Toolbar />
      </ReactFlow>
    </div>
  );
};
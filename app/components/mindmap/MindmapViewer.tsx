'use client';

import { useCallback, useState, useMemo, useEffect, useRef } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  NodeTypes,
  useReactFlow,
  ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { MindmapNode } from '@/app/lib/types/mindmap';
import MindmapNodeComponent from './MindmapNode';
import MindmapAside from './MindmapAside';

const nodeTypes: NodeTypes = {
  mindmapNode: MindmapNodeComponent,
};

interface MindmapViewerProps {
  rootNode: MindmapNode;
  onNodeClick?: (node: MindmapNode) => void;
}

function buildNodesAndEdges(
  node: MindmapNode,
  position: { x: number; y: number },
  expanded: Set<string>,
  selectedNodeId: string | null,
  level: number = 0
): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  const nodeId = node.id;
  const isExpanded = expanded.has(nodeId);
  const isSelected = selectedNodeId === nodeId;

  const nodeData = {
    ...node,
    level,
    isExpanded,
    isSelected,
  };

  nodes.push({
    id: nodeId,
    type: 'mindmapNode',
    position,
    data: nodeData,
    selected: isSelected,
    style: isSelected ? {
      border: '3px solid #175DDC',
      boxShadow: '0 0 20px rgba(23, 93, 220, 0.5)',
    } : undefined,
  });

  if (isExpanded && node.children.length > 0) {
    const childCount = node.children.length;
    const spacing = 250;
    const startY = position.y - ((childCount - 1) * spacing) / 2;

    node.children.forEach((child, index) => {
      const childY = startY + index * spacing;
      const childPosition = { x: position.x + 300, y: childY };
      
      const childResult = buildNodesAndEdges(
        child,
        childPosition,
        expanded,
        selectedNodeId,
        level + 1
      );
      
      nodes.push(...childResult.nodes);
      edges.push(...childResult.edges);
      
      edges.push({
        id: `e-${nodeId}-${child.id}`,
        source: nodeId,
        target: child.id,
        type: 'smoothstep',
        animated: true,
      });
    });
  }

  return { nodes, edges };
}

function MindmapViewerInner({ rootNode, onNodeClick }: MindmapViewerProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set([rootNode.id]));
  const [selectedNode, setSelectedNode] = useState<MindmapNode | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [showAside, setShowAside] = useState(false);
  const { getNode, setCenter, getViewport } = useReactFlow();
  const centeringTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const toggleExpand = useCallback((nodeId: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  }, []);

  const { nodes, edges } = useMemo(() => {
    return buildNodesAndEdges(rootNode, { x: 100, y: 400 }, expanded, selectedNodeId);
  }, [rootNode, expanded, selectedNodeId]);

  const [nodesState, setNodes, onNodesChange] = useNodesState(nodes);
  const [edgesState, setEdges, onEdgesChange] = useEdgesState(edges);

  const findNodeInTree = useCallback((n: MindmapNode, id: string): MindmapNode | null => {
    if (n.id === id) return n;
    for (const child of n.children) {
      const found = findNodeInTree(child, id);
      if (found) return found;
    }
    return null;
  }, []);

  const onNodeClickHandler = useCallback((_event: React.MouseEvent, node: Node) => {
    const nodeData = node.data as MindmapNode & { level: number; isExpanded: boolean };
    const hasChildren = nodeData.children && nodeData.children.length > 0;
    
    // If node has children, toggle expand
    if (hasChildren) {
      toggleExpand(node.id);
    }
    
    // Set selected node for highlighting
    setSelectedNodeId(node.id);
    
    // Center the view on the clicked node
    // Use setTimeout to ensure nodes are rendered before centering
    if (centeringTimeoutRef.current) {
      clearTimeout(centeringTimeoutRef.current);
    }
    
    centeringTimeoutRef.current = setTimeout(() => {
      const reactFlowNode = getNode(node.id);
      if (reactFlowNode) {
        const x = reactFlowNode.position.x + (reactFlowNode.width || 250) / 2;
        const y = reactFlowNode.position.y + (reactFlowNode.height || 100) / 2;
        const zoom = getViewport().zoom;
        setCenter(x, y, { zoom, duration: 400 });
      }
    }, 150);
    
    // Show details in aside when clicked
    const actualNode = findNodeInTree(rootNode, node.id);
    if (actualNode) {
      setSelectedNode(actualNode);
      setShowAside(true);
      if (onNodeClick) {
        onNodeClick(actualNode);
      }
    }
  }, [toggleExpand, rootNode, onNodeClick, findNodeInTree, getNode, setCenter, getViewport]);
  
  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (centeringTimeoutRef.current) {
        clearTimeout(centeringTimeoutRef.current);
      }
    };
  }, []);

  // Update nodes when expanded or selected changes
  useEffect(() => {
    const newNodesAndEdges = buildNodesAndEdges(rootNode, { x: 100, y: 400 }, expanded, selectedNodeId);
    setNodes(newNodesAndEdges.nodes);
    setEdges(newNodesAndEdges.edges);
  }, [rootNode, expanded, selectedNodeId, setNodes, setEdges]);

  return (
    <div className="w-full h-full relative flex overflow-hidden">
      <div className={`flex-1 transition-all duration-300 ease-in-out ${showAside ? 'mr-96' : 'mr-0'}`}>
        <ReactFlow
          nodes={nodesState}
          edges={edgesState}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClickHandler}
          nodeTypes={nodeTypes}
          fitView
          className="bg-gray-50"
          nodesDraggable={false}
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>
      
      <div className={`absolute top-0 right-0 h-full transition-transform duration-300 ease-in-out ${
        showAside ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {selectedNode && (
          <MindmapAside
            node={selectedNode}
            onClose={() => {
              setShowAside(false);
              setSelectedNode(null);
              setSelectedNodeId(null);
            }}
          />
        )}
      </div>
    </div>
  );
}

export default function MindmapViewer({ rootNode, onNodeClick }: MindmapViewerProps) {
  return (
    <ReactFlowProvider>
      <MindmapViewerInner rootNode={rootNode} onNodeClick={onNodeClick} />
    </ReactFlowProvider>
  );
}

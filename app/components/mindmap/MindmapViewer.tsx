'use client';

import { useCallback, useState, useMemo } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  NodeTypes,
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
  level: number = 0
): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  const nodeId = node.id;
  const isExpanded = expanded.has(nodeId);

  const nodeData = {
    ...node,
    level,
    isExpanded,
  };

  nodes.push({
    id: nodeId,
    type: 'mindmapNode',
    position,
    data: nodeData,
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

export default function MindmapViewer({ rootNode, onNodeClick }: MindmapViewerProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set([rootNode.id]));
  const [selectedNode, setSelectedNode] = useState<MindmapNode | null>(null);
  const [showAside, setShowAside] = useState(false);

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
    return buildNodesAndEdges(rootNode, { x: 100, y: 400 }, expanded);
  }, [rootNode, expanded]);

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
    
    // Always show details in aside when clicked
    const actualNode = findNodeInTree(rootNode, node.id);
    if (actualNode) {
      setSelectedNode(actualNode);
      setShowAside(true);
      if (onNodeClick) {
        onNodeClick(actualNode);
      }
    }
  }, [toggleExpand, rootNode, onNodeClick, findNodeInTree]);

  // Update nodes when expanded changes
  useMemo(() => {
    const newNodesAndEdges = buildNodesAndEdges(rootNode, { x: 100, y: 400 }, expanded);
    setNodes(newNodesAndEdges.nodes);
    setEdges(newNodesAndEdges.edges);
  }, [rootNode, expanded, setNodes, setEdges]);

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
            }}
          />
        )}
      </div>
    </div>
  );
}

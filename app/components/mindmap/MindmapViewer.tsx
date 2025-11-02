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

  // Find path from root to a node (returns array of node IDs)
  const findPathToNode = useCallback((node: MindmapNode, targetId: string, path: string[] = []): string[] | null => {
    const currentPath = [...path, node.id];
    if (node.id === targetId) {
      return currentPath;
    }
    for (const child of node.children) {
      const result = findPathToNode(child, targetId, currentPath);
      if (result) return result;
    }
    return null;
  }, []);

  // Find parent node and siblings of a given node
  const findParentAndSiblings = useCallback((node: MindmapNode, targetId: string, parent: MindmapNode | null = null): { parent: MindmapNode | null; siblings: MindmapNode[] } | null => {
    if (node.id === targetId) {
      // If this is the root node, it has no parent or siblings at the same level
      if (parent === null) {
        return { parent: null, siblings: [] };
      }
      return { parent, siblings: parent.children };
    }
    for (const child of node.children) {
      const result = findParentAndSiblings(child, targetId, node);
      if (result) return result;
    }
    return null;
  }, []);

  const onNodeClickHandler = useCallback((_event: React.MouseEvent, node: Node) => {
    const nodeData = node.data as MindmapNode & { level: number; isExpanded: boolean };
    const hasChildren = nodeData.children && nodeData.children.length > 0;
    const clickedNodeId = node.id;
    
    // Find the actual node in the tree
    const actualNode = findNodeInTree(rootNode, clickedNodeId);
    if (!actualNode) return;

    // Find path from root to clicked node (keep these expanded)
    const pathToNode = findPathToNode(rootNode, clickedNodeId);
    
    // Find parent and siblings
    const parentSiblings = findParentAndSiblings(rootNode, clickedNodeId);
    
    // Update expanded set:
    // 1. Keep path from root to clicked node expanded
    // 2. Collapse all siblings at the same level
    setExpanded(prev => {
      const next = new Set(prev);
      
      // If clicked node has children, toggle it
      if (hasChildren) {
        if (next.has(clickedNodeId)) {
          next.delete(clickedNodeId);
        } else {
          next.add(clickedNodeId);
        }
      }
      
      // Collapse siblings (nodes at same level with same parent)
      if (parentSiblings) {
        const { siblings } = parentSiblings;
        siblings.forEach(sibling => {
          if (sibling.id !== clickedNodeId) {
            next.delete(sibling.id);
            // Also collapse all descendants of collapsed siblings
            const collapseDescendants = (n: MindmapNode) => {
              next.delete(n.id);
              n.children.forEach(child => collapseDescendants(child));
            };
            sibling.children.forEach(child => collapseDescendants(child));
          }
        });
      }
      
      // Ensure path from root to clicked node remains expanded
      if (pathToNode) {
        pathToNode.forEach(pathNodeId => {
          if (pathNodeId !== clickedNodeId) {
            next.add(pathNodeId);
          }
        });
      }
      
      return next;
    });
    
    // Set selected node for highlighting
    setSelectedNodeId(clickedNodeId);
    
    // Center the view on the clicked node
    // Use setTimeout to ensure nodes are rendered before centering
    if (centeringTimeoutRef.current) {
      clearTimeout(centeringTimeoutRef.current);
    }
    
    centeringTimeoutRef.current = setTimeout(() => {
      const reactFlowNode = getNode(clickedNodeId);
      if (reactFlowNode) {
        const x = reactFlowNode.position.x + (reactFlowNode.width || 250) / 2;
        const y = reactFlowNode.position.y + (reactFlowNode.height || 100) / 2;
        const zoom = getViewport().zoom;
        setCenter(x, y, { zoom, duration: 400 });
      }
    }, 150);
    
    // Show details in aside when clicked
    setSelectedNode(actualNode);
    setShowAside(true);
    if (onNodeClick) {
      onNodeClick(actualNode);
    }
  }, [rootNode, onNodeClick, findNodeInTree, findPathToNode, findParentAndSiblings, getNode, setCenter, getViewport]);
  
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

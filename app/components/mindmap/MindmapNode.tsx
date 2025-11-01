import { Handle, Position, NodeProps } from 'reactflow';
import { MindmapNode } from '@/app/lib/types/mindmap';

interface NodeData extends MindmapNode {
  level: number;
  isExpanded: boolean;
  isSelected?: boolean;
}

export default function MindmapNodeComponent({ data, selected }: NodeProps<NodeData>) {
  const { title, level, isExpanded, children, content } = data;
  const hasChildren = children.length > 0;
  const isSelected = selected || false;
  
  const colors = [
    'bg-[#175DDC] text-white',
    'bg-[#FF6B35] text-white',
    'bg-blue-400 text-white',
    'bg-orange-400 text-white',
  ];
  
  const colorClass = colors[level % colors.length] || 'bg-gray-500 text-white';
  
  // Show brief summary or key points count if available
  const hasKeyInfo = content.keyPoints && content.keyPoints.length > 0;
  const keyPointsCount = content.keyPoints?.length || 0;
  const hasSummary = content.summary && content.summary.length > 0 && content.summary.length < 100;

  return (
    <div className={`px-4 py-2 rounded-lg shadow-lg ${colorClass} min-w-[200px] max-w-[250px] relative transition-all ${
      isSelected ? 'ring-4 ring-[#175DDC] ring-opacity-75 shadow-2xl scale-105 z-50' : ''
    }`}>
      <Handle type="target" position={Position.Left} />
      
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm leading-tight">{title}</h3>
        {hasChildren && (
          <span className="ml-2 text-xs opacity-75">
            {isExpanded ? '−' : '+'}
          </span>
        )}
      </div>
      
      {/* Show brief summary or key points indicator */}
      {hasSummary && (
        <div className="mt-1 text-xs opacity-90 leading-tight line-clamp-2">
          {content.summary}
        </div>
      )}
      {!hasSummary && hasKeyInfo && (
        <div className="mt-1 text-xs opacity-75">
          {keyPointsCount} {keyPointsCount === 1 ? 'key point' : 'key points'}
        </div>
      )}
      
      {hasChildren && !hasSummary && !hasKeyInfo && (
        <div className="mt-1 text-xs opacity-75">
          {children.length} {children.length === 1 ? 'child' : 'children'}
        </div>
      )}
      
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

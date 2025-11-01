import { Handle, Position, NodeProps } from 'reactflow';
import { MindmapNode } from '@/app/lib/types/mindmap';

interface NodeData extends MindmapNode {
  level: number;
  isExpanded: boolean;
}

export default function MindmapNodeComponent({ data }: NodeProps<NodeData>) {
  const { title, level, isExpanded, children } = data;
  const hasChildren = children.length > 0;
  
  const colors = [
    'bg-[#175DDC] text-white',
    'bg-[#FF6B35] text-white',
    'bg-blue-400 text-white',
    'bg-orange-400 text-white',
  ];
  
  const colorClass = colors[level % colors.length] || 'bg-gray-500 text-white';

  return (
    <div className={`px-4 py-2 rounded-lg shadow-lg ${colorClass} min-w-[200px] max-w-[250px] relative`}>
      <Handle type="target" position={Position.Left} />
      
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm leading-tight">{title}</h3>
        {hasChildren && (
          <span className="ml-2 text-xs opacity-75">
            {isExpanded ? '−' : '+'}
          </span>
        )}
      </div>
      
      {hasChildren && (
        <div className="mt-1 text-xs opacity-75">
          {children.length} {children.length === 1 ? 'child' : 'children'}
        </div>
      )}
      
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

import { MindmapNode } from '@/app/lib/types/mindmap';

interface MindmapAsideProps {
  node: MindmapNode | null;
  onClose: () => void;
}

export default function MindmapAside({ node, onClose }: MindmapAsideProps) {
  if (!node) {
    return null;
  }

  return (
    <aside className="w-96 bg-white border-l border-gray-200 shadow-2xl h-full overflow-y-auto">
      <div className="sticky top-0 bg-gradient-to-r from-[#175DDC] to-[#FF6B35] p-4 flex justify-between items-center z-10 shadow-md">
        <h2 className="text-xl font-bold text-white">{node.title}</h2>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200 transition-colors text-2xl font-semibold leading-none"
          aria-label="Close"
        >
          ×
        </button>
      </div>
      
      <div className="p-6 space-y-6">
        {/* Summary Section */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-2 text-lg border-b border-gray-200 pb-2">
            Summary
          </h3>
          <p className="text-gray-700 leading-relaxed">{node.content.summary}</p>
        </div>
        
        {/* Detailed Content Section */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-2 text-lg border-b border-gray-200 pb-2">
            Detailed Explanation
          </h3>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">{node.content.detailed}</p>
        </div>
        
        {/* Key Points Section */}
        {node.content.keyPoints && node.content.keyPoints.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-2 text-lg border-b border-gray-200 pb-2">
              Key Points
            </h3>
            <ul className="list-disc list-inside space-y-2">
              {node.content.keyPoints.map((point, index) => (
                <li key={index} className="text-gray-700">{point}</li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Examples Section */}
        {node.content.examples && node.content.examples.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-2 text-lg border-b border-gray-200 pb-2">
              Examples
            </h3>
            <ul className="list-disc list-inside space-y-2">
              {node.content.examples.map((example, index) => (
                <li key={index} className="text-gray-700">{example}</li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Related Children Section */}
        {node.children && node.children.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 text-lg border-b border-gray-200 pb-2">
              Related Topics ({node.children.length})
            </h3>
            <div className="space-y-4">
              {node.children.map((child) => (
                <div
                  key={child.id}
                  className="p-4 bg-gradient-to-r from-blue-50 to-orange-50 rounded-lg border-2 border-blue-200 hover:border-blue-400 transition-all shadow-sm"
                >
                  <h4 className="font-semibold text-gray-900 mb-2 text-base flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#175DDC] rounded-full"></span>
                    {child.title}
                  </h4>
                  {child.content.summary && (
                    <p className="text-sm text-gray-700 leading-relaxed mb-2">{child.content.summary}</p>
                  )}
                  {child.content.keyPoints && child.content.keyPoints.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs font-medium text-gray-600 mb-1">Key points:</p>
                      <ul className="text-xs text-gray-600 space-y-1 ml-4">
                        {child.content.keyPoints.slice(0, 2).map((point, idx) => (
                          <li key={idx} className="list-disc">{point}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {child.children && child.children.length > 0 && (
                    <p className="text-xs text-gray-500 mt-2 font-medium">
                      📚 {child.children.length} {child.children.length === 1 ? 'subtopic' : 'subtopics'} available
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Tags Section */}
        {node.metadata.tags && node.metadata.tags.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-2 text-lg border-b border-gray-200 pb-2">
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {node.metadata.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* Metadata Section */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-4 text-xs text-gray-500">
            {node.metadata.importance && (
              <span className="capitalize">
                Importance: <span className="font-semibold">{node.metadata.importance}</span>
              </span>
            )}
            {node.metadata.level !== undefined && (
              <span>
                Level: <span className="font-semibold">{node.metadata.level}</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}

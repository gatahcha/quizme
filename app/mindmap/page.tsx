import Layout from '../components/shared/Layout';
import Link from 'next/link';
import { getAllMindmaps } from '../lib/utils/fileHandler';
import { Mindmap } from '../lib/types/mindmap';

export default async function MindmapListPage() {
  const mindmaps = getAllMindmaps();

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Mindmaps</h1>
          <Link
            href="/"
            className="text-gray-600 hover:text-[#175DDC] transition-colors"
          >
            ← Back to Home
          </Link>
        </div>

        {mindmaps.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">🗺️</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No mindmaps yet
            </h2>
            <p className="text-gray-600 mb-4">
              Generate your first mindmap by running:
            </p>
            <code className="bg-gray-100 px-4 py-2 rounded text-sm">
              npm run generate:mindmap mind-map-content/your-file.md
            </code>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mindmaps.map((mindmap) => (
              <Link key={mindmap.id} href={`/mindmap/${mindmap.id}`}>
                <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6 border border-gray-200 h-full flex flex-col">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {mindmap.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
                    {mindmap.description}
                  </p>
                  <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                    <span>{mindmap.metadata.totalNodes} nodes</span>
                    <span>Depth: {mindmap.metadata.maxDepth}</span>
                  </div>
                  <div>
                    <button className="w-full px-4 py-2 bg-[#175DDC] text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                      View Mindmap →
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

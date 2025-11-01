import Layout from '../../components/shared/Layout';
import Link from 'next/link';
import { getMindmapById } from '../../lib/utils/fileHandler';
import { notFound } from 'next/navigation';
import MindmapViewer from '../../components/mindmap/MindmapViewer';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function MindmapPage({ params }: PageProps) {
  const { id } = await params;
  const mindmap = getMindmapById(id);

  if (!mindmap) {
    notFound();
  }

  return (
    <Layout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <Link
              href="/mindmap"
              className="text-gray-600 hover:text-[#175DDC] transition-colors mb-2 inline-block"
            >
              ← Back to Mindmaps
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">{mindmap.title}</h1>
            <p className="text-gray-600 mt-1">{mindmap.description}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden" style={{ height: 'calc(100vh - 200px)', minHeight: '600px' }}>
          <MindmapViewer rootNode={mindmap.rootNode} />
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>Total Nodes: {mindmap.metadata.totalNodes}</span>
            <span>Max Depth: {mindmap.metadata.maxDepth}</span>
            <span>Created: {new Date(mindmap.metadata.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </Layout>
  );
}

import Layout from './components/shared/Layout';
import Link from 'next/link';

export default function Home() {
  return (
    <Layout>
      <div className="text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-[#175DDC] to-[#FF6B35] bg-clip-text text-transparent">
            Welcome to QuizMe
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your personal study buddy. Transform your slides into interactive mindmaps and comprehensive quizzes.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-12">
          <Link href="/mindmap">
            <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-8 border-2 border-transparent hover:border-[#175DDC] h-full flex flex-col">
              <div className="text-4xl mb-4">🗺️</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Mindmaps</h2>
              <p className="text-gray-600 flex-grow">
                Explore knowledge visually with interactive, hierarchical mindmaps. Click nodes to expand and learn.
              </p>
            </div>
          </Link>

          <Link href="/quiz">
            <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-8 border-2 border-transparent hover:border-[#FF6B35] h-full flex flex-col">
              <div className="text-4xl mb-4">📝</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Quizzes</h2>
              <p className="text-gray-600 flex-grow">
                Test your knowledge with AI-generated questions. Multiple choice, true/false, and matching questions.
              </p>
            </div>
          </Link>
        </div>

        <div className="mt-12 p-6 bg-blue-50 rounded-lg max-w-2xl mx-auto">
          <h3 className="font-semibold text-gray-900 mb-2">How it works:</h3>
          <ol className="text-left text-gray-700 space-y-2 text-sm">
            <li>1. Upload your slides to Claude using the slide processor prompt</li>
            <li>2. Save the structured markdown to <code className="bg-gray-200 px-1 rounded">mind-map-content/</code></li>
            <li>3. Run <code className="bg-gray-200 px-1 rounded">npm run generate:mindmap</code> or <code className="bg-gray-200 px-1 rounded">npm run generate:quiz</code></li>
            <li>4. View and study your mindmaps and quizzes!</li>
          </ol>
        </div>
      </div>
    </Layout>
  );
}

import Layout from '../components/shared/Layout';
import Link from 'next/link';
import { getAllQuizzes } from '../lib/utils/fileHandler';
import QuizCard from '../components/quiz/QuizCard';

export default async function QuizListPage() {
  const quizzes = getAllQuizzes();

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Quizzes</h1>
          <Link
            href="/"
            className="text-gray-600 hover:text-[#FF6B35] transition-colors"
          >
            ← Back to Home
          </Link>
        </div>

        {quizzes.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No quizzes yet
            </h2>
            <p className="text-gray-600 mb-4">
              Generate your first quiz by running:
            </p>
            <code className="bg-gray-100 px-4 py-2 rounded text-sm">
              npm run generate:quiz mind-map-content/your-file.md
            </code>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

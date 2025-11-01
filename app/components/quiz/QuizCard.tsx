import Link from 'next/link';
import { Quiz } from '@/app/lib/types/quiz';

interface QuizCardProps {
  quiz: Quiz;
}

export default function QuizCard({ quiz }: QuizCardProps) {
  const difficultyColors = {
    easy: 'bg-green-500',
    medium: 'bg-yellow-500',
    hard: 'bg-orange-500',
    expert: 'bg-red-500',
  };

  const totalQuestions = quiz.metadata.totalQuestions;
  const { easy, medium, hard, expert } = quiz.metadata.difficultyDistribution;

  return (
    <Link href={`/quiz/${quiz.id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6 border border-gray-200 h-full flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-gray-900">{quiz.title}</h3>
          <span className="text-sm text-gray-500">{totalQuestions} questions</span>
        </div>
        
        <p className="text-gray-600 mb-4 text-sm flex-grow line-clamp-2">{quiz.description}</p>
        
        <div className="flex items-center gap-2 mb-4">
          <div className="flex gap-1">
            {easy > 0 && (
              <div
                className={`w-3 h-3 rounded-full ${difficultyColors.easy}`}
                title={`${easy} easy`}
              />
            )}
            {medium > 0 && (
              <div
                className={`w-3 h-3 rounded-full ${difficultyColors.medium}`}
                title={`${medium} medium`}
              />
            )}
            {hard > 0 && (
              <div
                className={`w-3 h-3 rounded-full ${difficultyColors.hard}`}
                title={`${hard} hard`}
              />
            )}
            {expert > 0 && (
              <div
                className={`w-3 h-3 rounded-full ${difficultyColors.expert}`}
                title={`${expert} expert`}
              />
            )}
          </div>
          <span className="text-xs text-gray-500">
            ~{quiz.metadata.estimatedTime} min
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Subject: {quiz.subject}</span>
          <button className="px-4 py-2 bg-[#175DDC] text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            Start Quiz →
          </button>
        </div>
      </div>
    </Link>
  );
}

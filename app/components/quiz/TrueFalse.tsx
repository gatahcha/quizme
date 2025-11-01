'use client';

import { TrueFalseQuestion } from '@/app/lib/types/quiz';

interface TrueFalseProps {
  question: TrueFalseQuestion;
  value?: boolean;
  onChange: (value: boolean) => void;
}

export default function TrueFalse({ question, value, onChange }: TrueFalseProps) {
  const difficultyColors = {
    easy: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    hard: 'bg-orange-100 text-orange-800',
    expert: 'bg-red-100 text-red-800',
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">{question.question}</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${difficultyColors[question.difficulty]}`}>
          {question.difficulty.toUpperCase()} • {question.points} pts
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => onChange(true)}
          className={`p-6 rounded-lg border-2 transition-all font-semibold ${
            value === true
              ? 'border-[#175DDC] bg-blue-50 text-[#175DDC]'
              : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700'
          }`}
        >
          True
        </button>
        <button
          onClick={() => onChange(false)}
          className={`p-6 rounded-lg border-2 transition-all font-semibold ${
            value === false
              ? 'border-[#FF6B35] bg-orange-50 text-[#FF6B35]'
              : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700'
          }`}
        >
          False
        </button>
      </div>
    </div>
  );
}

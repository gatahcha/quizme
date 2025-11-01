'use client';

import { MultipleChoiceQuestion } from '@/app/lib/types/quiz';

interface MultipleChoiceProps {
  question: MultipleChoiceQuestion;
  value?: string;
  onChange: (value: string) => void;
}

export default function MultipleChoice({
  question,
  value,
  onChange,
}: MultipleChoiceProps) {
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
      
      <div className="space-y-2">
        {question.options.map((option) => (
          <label
            key={option.id}
            className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
              value === option.id
                ? 'border-[#175DDC] bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <input
              type="radio"
              name={question.id}
              value={option.id}
              checked={value === option.id}
              onChange={(e) => onChange(e.target.value)}
              className="mr-3 w-4 h-4 text-[#175DDC] focus:ring-[#175DDC]"
            />
            <span className="text-gray-700 flex-1">{option.text}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

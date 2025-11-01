'use client';

import { useState } from 'react';
import { MatchingQuestion } from '@/app/lib/types/quiz';

interface MatchingProps {
  question: MatchingQuestion;
  value?: Record<string, string>;
  onChange: (value: Record<string, string>) => void;
}

export default function Matching({ question, value = {}, onChange }: MatchingProps) {
  const [selections, setSelections] = useState<Record<string, string>>(value);

  const handleSelect = (rightItemId: string, leftItemId: string) => {
    const newSelections = { ...selections, [rightItemId]: leftItemId };
    setSelections(newSelections);
    onChange(newSelections);
  };

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
      
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-700 mb-3">Items</h4>
          {question.leftItems.map((item) => (
            <div
              key={item.id}
              className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-gray-700"
            >
              {item.text}
            </div>
          ))}
        </div>
        
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-700 mb-3">Match With</h4>
          {question.rightItems.map((rightItem) => {
            const selectedLeftId = selections[rightItem.id];
            return (
              <div key={rightItem.id} className="space-y-2">
                <div className="text-sm font-medium text-gray-700 mb-1">{rightItem.text}</div>
                <select
                  value={selectedLeftId || ''}
                  onChange={(e) => handleSelect(rightItem.id, e.target.value)}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg bg-white text-gray-700 focus:border-[#175DDC] focus:outline-none"
                >
                  <option value="">-- Select Match --</option>
                  {question.leftItems.map((leftItem) => (
                    <option key={leftItem.id} value={leftItem.id}>
                      {leftItem.text}
                    </option>
                  ))}
                </select>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

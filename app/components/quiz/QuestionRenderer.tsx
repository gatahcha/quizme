'use client';

import { Question } from '@/app/lib/types/quiz';
import MultipleChoice from './MultipleChoice';
import TrueFalse from './TrueFalse';
import Matching from './Matching';

interface QuestionRendererProps {
  question: Question;
  value?: string | boolean | Record<string, string>;
  onChange: (value: string | boolean | Record<string, string>) => void;
}

export default function QuestionRenderer({
  question,
  value,
  onChange,
}: QuestionRendererProps) {
  switch (question.type) {
    case 'multiple-choice':
      return (
        <MultipleChoice
          question={question}
          value={value as string}
          onChange={onChange}
        />
      );
    case 'true-false':
      return (
        <TrueFalse
          question={question}
          value={value as boolean | undefined}
          onChange={onChange}
        />
      );
    case 'matching':
      return (
        <Matching
          question={question}
          value={value as Record<string, string>}
          onChange={onChange}
        />
      );
    default:
      return null;
  }
}

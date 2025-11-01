export interface Quiz {
  id: string;
  title: string;
  description: string;
  subject: string;
  questions: Question[];
  metadata: {
    createdAt: string;
    sourceFile: string;
    totalQuestions: number;
    estimatedTime: number;
    difficultyDistribution: {
      easy: number;
      medium: number;
      hard: number;
      expert: number;
    };
    tags: string[];
    version: string;
  };
  settings: {
    shuffleQuestions: boolean;
    shuffleAnswers: boolean;
    timeLimit?: number;
    passingScore: number;
  };
}

export interface Question {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'matching';
  question: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  points: number;
  explanation?: string;
  metadata: {
    tags?: string[];
    relatedNodeId?: string;
  };
}

export interface MultipleChoiceQuestion extends Question {
  type: 'multiple-choice';
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
}

export interface TrueFalseQuestion extends Question {
  type: 'true-false';
  correctAnswer: boolean;
}

export interface MatchingQuestion extends Question {
  type: 'matching';
  leftItems: {
    id: string;
    text: string;
  }[];
  rightItems: {
    id: string;
    text: string;
    correctMatchId: string;
  }[];
}

export interface QuizAnswer {
  questionId: string;
  answer: string | boolean | Record<string, string>;
  isCorrect: boolean;
}

export interface QuizResult {
  score: number;
  totalPoints: number;
  percentage: number;
  passed: boolean;
  answers: QuizAnswer[];
  timeSpent?: number;
}

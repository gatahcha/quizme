import { Quiz, Question, QuizAnswer, QuizResult, MultipleChoiceQuestion, TrueFalseQuestion, MatchingQuestion } from '../types/quiz';

export function calculateScore(
  quiz: Quiz,
  answers: Record<string, string | boolean | Record<string, string>>
): QuizResult {
  let score = 0;
  let totalPoints = 0;
  const answerResults: QuizAnswer[] = [];

  quiz.questions.forEach((question) => {
    totalPoints += question.points;
    const userAnswer = answers[question.id];
    let isCorrect = false;

    if (question.type === 'multiple-choice') {
      const mcQuestion = question as MultipleChoiceQuestion;
      const selectedOption = mcQuestion.options.find(opt => opt.id === userAnswer);
      isCorrect = selectedOption?.isCorrect || false;
    } else if (question.type === 'true-false') {
      const tfQuestion = question as TrueFalseQuestion;
      isCorrect = userAnswer === tfQuestion.correctAnswer;
    } else if (question.type === 'matching') {
      const matchQuestion = question as MatchingQuestion;
      const userMatches = userAnswer as Record<string, string>;
      isCorrect = matchQuestion.rightItems.every(
        rightItem => userMatches[rightItem.id] === rightItem.correctMatchId
      );
    }

    if (isCorrect) {
      score += question.points;
    }

    answerResults.push({
      questionId: question.id,
      answer: userAnswer,
      isCorrect,
    });
  });

  const percentage = (score / totalPoints) * 100;
  const passed = percentage >= quiz.settings.passingScore;

  return {
    score,
    totalPoints,
    percentage: Math.round(percentage * 100) / 100,
    passed,
    answers: answerResults,
  };
}

export function getQuestionAnswer(question: Question): string | boolean | Record<string, string> | null {
  if (question.type === 'multiple-choice') {
    const mcQuestion = question as MultipleChoiceQuestion;
    const correctOption = mcQuestion.options.find(opt => opt.isCorrect);
    return correctOption?.id || null;
  } else if (question.type === 'true-false') {
    const tfQuestion = question as TrueFalseQuestion;
    return tfQuestion.correctAnswer;
  } else if (question.type === 'matching') {
    const matchQuestion = question as MatchingQuestion;
    const correctMatches: Record<string, string> = {};
    matchQuestion.rightItems.forEach(rightItem => {
      correctMatches[rightItem.id] = rightItem.correctMatchId;
    });
    return correctMatches;
  }
  return null;
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

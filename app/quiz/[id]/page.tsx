'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Layout from '../../components/shared/Layout';
import Link from 'next/link';
import { Quiz } from '../../lib/types/quiz';
import QuestionRenderer from '../../components/quiz/QuestionRenderer';
import { calculateScore, shuffleArray } from '../../lib/utils/quiz';

export default function QuizPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | boolean | Record<string, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (id && isMounted) {
      fetch(`/api/quizzes/${id}`)
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            console.error('Error loading quiz:', data.error);
            return;
          }
          let loadedQuiz = data as Quiz;
          // Shuffle if enabled
          if (loadedQuiz.settings.shuffleQuestions) {
            loadedQuiz = { ...loadedQuiz, questions: shuffleArray(loadedQuiz.questions) };
          }
          setQuiz(loadedQuiz);
        })
        .catch(error => {
          console.error('Error fetching quiz:', error);
        });
    }
  }, [id, isMounted]);

  if (!quiz || !isMounted) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-600">Loading quiz...</p>
        </div>
      </Layout>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  const handleAnswerChange = (value: string | boolean | Record<string, string>) => {
    setAnswers({ ...answers, [currentQuestion.id]: value });
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    const result = calculateScore(quiz, answers);
    const resultData = encodeURIComponent(JSON.stringify(result));
    router.push(`/quiz/${quiz.id}/results?data=${resultData}&quizId=${quiz.id}`);
  };

  if (submitted) {
    return null; // Will redirect to results
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Link
              href="/quiz"
              className="text-gray-600 hover:text-[#FF6B35] transition-colors mb-2 inline-block"
            >
              ← Back to Quizzes
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">{quiz.title}</h1>
            <p className="text-gray-600 mt-1">{quiz.description}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">
                Question {currentQuestionIndex + 1} of {quiz.questions.length}
              </span>
              <span className="text-sm text-gray-600">
                {Object.keys(answers).length} answered
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-[#175DDC] to-[#FF6B35] h-2 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="my-8">
            <QuestionRenderer
              question={currentQuestion}
              value={answers[currentQuestion.id]}
              onChange={handleAnswerChange}
            />
          </div>

          <div className="flex justify-between items-center mt-8">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="px-6 py-2 border-2 border-gray-300 rounded-lg hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>

            {currentQuestionIndex === quiz.questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                className="px-6 py-3 bg-gradient-to-r from-[#175DDC] to-[#FF6B35] text-white rounded-lg hover:shadow-lg transition-all font-semibold"
              >
                Submit Quiz
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-[#175DDC] text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

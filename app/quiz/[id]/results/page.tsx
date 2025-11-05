'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Layout from '../../../components/shared/Layout';
import Link from 'next/link';
import { Quiz, QuizResult, QuizAnswer, MultipleChoiceQuestion } from '../../../lib/types/quiz';
import { getQuestionAnswer } from '../../../lib/utils/quiz';

export default function QuizResultsPage() {
  const searchParams = useSearchParams();
  const resultData = searchParams.get('data');
  const quizId = searchParams.get('quizId');
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  
  let result: QuizResult | null = null;
  if (resultData) {
    try {
      result = JSON.parse(decodeURIComponent(resultData)) as QuizResult;
    } catch (e) {
      console.error('Failed to parse result data:', e);
    }
  }

  useEffect(() => {
    if (quizId) {
      fetch(`/api/quizzes/${quizId}`)
        .then(res => res.json())
        .then(data => {
          if (!data.error) {
            setQuiz(data as Quiz);
          }
        })
        .catch(error => {
          console.error('Error fetching quiz:', error);
        });
    }
  }, [quizId]);

  if (!result) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-600">No results found.</p>
          <Link href="/quiz" className="text-[#175DDC] hover:underline mt-4 inline-block">
            Back to Quizzes
          </Link>
        </div>
      </Layout>
    );
  }

  const percentage = result.percentage;
  const passed = result.passed;
  const percentageColor = passed ? 'text-green-600' : 'text-red-600';

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Quiz Results</h1>
          <Link
            href="/quiz"
            className="text-gray-600 hover:text-[#FF6B35] transition-colors"
          >
            ← Back to Quizzes
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200 text-center">
          <div className={`text-6xl font-bold mb-4 ${percentageColor}`}>
            {percentage.toFixed(1)}%
          </div>
          <div className="text-2xl font-semibold text-gray-900 mb-2">
            {result.score} / {result.totalPoints} points
          </div>
          <div className={`text-lg font-medium ${passed ? 'text-green-600' : 'text-red-600'}`}>
            {passed ? '✅ Passed!' : '❌ Not Passed'}
          </div>
          
          {quiz && (
            <div className="mt-4 text-sm text-gray-600">
              Passing Score: {quiz.settings.passingScore}%
            </div>
          )}
        </div>

        {quiz && (
          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Question Review</h2>
            <div className="space-y-6">
              {quiz.questions.map((question, index) => {
                const answer = result!.answers.find(a => a.questionId === question.id);
                const correctAnswer = getQuestionAnswer(question);
                const isCorrect = answer?.isCorrect || false;

                return (
                  <div
                    key={question.id}
                    className={`p-4 rounded-lg border-2 ${
                      isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold text-gray-900">
                        Question {index + 1}: {question.question}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {isCorrect ? '✓ Correct' : '✗ Incorrect'} • {question.points} pts
                      </span>
                    </div>

                    <div className="mt-3 space-y-2 text-sm">
                      {question.type === 'multiple-choice' ? (
                        <div>
                          <div className="font-medium text-gray-700 mb-2">Options:</div>
                          <div className="space-y-2">
                            {(question as MultipleChoiceQuestion).options.map((option) => {
                              const isUserAnswer = answer?.answer === option.id;
                              const isCorrectOption = option.isCorrect;
                              
                              let bgColor = 'bg-gray-50';
                              let borderColor = 'border-gray-200';
                              let textColor = 'text-gray-700';
                              let label = '';
                              
                              if (isCorrectOption && isUserAnswer) {
                                bgColor = 'bg-green-100';
                                borderColor = 'border-green-500';
                                textColor = 'text-green-800';
                                label = '✓ Correct & Your Answer';
                              } else if (isCorrectOption) {
                                bgColor = 'bg-green-50';
                                borderColor = 'border-green-300';
                                textColor = 'text-green-700';
                                label = '✓ Correct Answer';
                              } else if (isUserAnswer) {
                                bgColor = 'bg-red-100';
                                borderColor = 'border-red-500';
                                textColor = 'text-red-800';
                                label = '✗ Your Answer (Incorrect)';
                              }
                              
                              return (
                                <div
                                  key={option.id}
                                  className={`p-3 rounded border-2 ${bgColor} ${borderColor} ${textColor}`}
                                >
                                  <div className="flex items-start justify-between">
                                    <span className="flex-1">{option.text}</span>
                                    {label && (
                                      <span className={`ml-3 px-2 py-1 rounded text-xs font-medium ${
                                        isCorrectOption && isUserAnswer
                                          ? 'bg-green-200 text-green-900'
                                          : isCorrectOption
                                          ? 'bg-green-200 text-green-800'
                                          : 'bg-red-200 text-red-900'
                                      }`}>
                                        {label}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <>
                          <div>
                            <span className="font-medium text-gray-700">Your answer: </span>
                            <span className={isCorrect ? 'text-green-700' : 'text-red-700'}>
                              {JSON.stringify(answer?.answer)}
                            </span>
                          </div>
                          {!isCorrect && (
                            <div>
                              <span className="font-medium text-gray-700">Correct answer: </span>
                              <span className="text-green-700">{JSON.stringify(correctAnswer)}</span>
                            </div>
                          )}
                        </>
                      )}
                      {question.explanation && (
                        <div className="mt-2 p-3 bg-blue-50 rounded">
                          <span className="font-medium text-gray-700">Explanation: </span>
                          <span className="text-gray-600">{question.explanation}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex justify-center gap-4">
          {quiz && (
            <Link
              href={`/quiz/${quiz.id}`}
              className="px-6 py-3 bg-[#175DDC] text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Retake Quiz
            </Link>
          )}
          <Link
            href="/quiz"
            className="px-6 py-3 border-2 border-gray-300 rounded-lg hover:border-gray-400 transition-colors font-medium"
          >
            Back to Quizzes
          </Link>
        </div>
      </div>
    </Layout>
  );
}

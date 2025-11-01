import { NextResponse } from 'next/server';
import { getAllQuizzes } from '@/app/lib/utils/fileHandler';

export async function GET() {
  try {
    const quizzes = getAllQuizzes();
    return NextResponse.json(quizzes);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return NextResponse.json({ error: 'Failed to fetch quizzes' }, { status: 500 });
  }
}

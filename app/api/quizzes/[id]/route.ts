import { NextResponse } from 'next/server';
import { getQuizById } from '@/app/lib/utils/fileHandler';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const quiz = getQuizById(id);
    
    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }
    
    return NextResponse.json(quiz);
  } catch (error) {
    console.error('Error fetching quiz:', error);
    return NextResponse.json({ error: 'Failed to fetch quiz' }, { status: 500 });
  }
}

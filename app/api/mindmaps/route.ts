import { NextResponse } from 'next/server';
import { getAllMindmaps } from '@/app/lib/utils/fileHandler';

export async function GET() {
  try {
    const mindmaps = getAllMindmaps();
    return NextResponse.json(mindmaps);
  } catch (error) {
    console.error('Error fetching mindmaps:', error);
    return NextResponse.json({ error: 'Failed to fetch mindmaps' }, { status: 500 });
  }
}

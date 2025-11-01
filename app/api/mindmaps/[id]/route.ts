import { NextResponse } from 'next/server';
import { getMindmapById } from '@/app/lib/utils/fileHandler';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const mindmap = getMindmapById(id);
    
    if (!mindmap) {
      return NextResponse.json({ error: 'Mindmap not found' }, { status: 404 });
    }
    
    return NextResponse.json(mindmap);
  } catch (error) {
    console.error('Error fetching mindmap:', error);
    return NextResponse.json({ error: 'Failed to fetch mindmap' }, { status: 500 });
  }
}

import { Mindmap } from '../types/mindmap';
import { Quiz } from '../types/quiz';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

export function getAllMindmaps(): Mindmap[] {
  const mindmapsDir = path.join(DATA_DIR, 'mindmaps');
  
  if (!fs.existsSync(mindmapsDir)) {
    return [];
  }

  const files = fs.readdirSync(mindmapsDir).filter(file => file.endsWith('.json'));
  
  return files.map(file => {
    const filePath = path.join(mindmapsDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as Mindmap;
  });
}

export function getMindmapById(id: string): Mindmap | null {
  const mindmaps = getAllMindmaps();
  return mindmaps.find(m => m.id === id) || null;
}

export function getAllQuizzes(): Quiz[] {
  const quizzesDir = path.join(DATA_DIR, 'quizzes');
  
  if (!fs.existsSync(quizzesDir)) {
    return [];
  }

  const files = fs.readdirSync(quizzesDir).filter(file => file.endsWith('.json'));
  
  return files.map(file => {
    const filePath = path.join(quizzesDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as Quiz;
  });
}

export function getQuizById(id: string): Quiz | null {
  const quizzes = getAllQuizzes();
  return quizzes.find(q => q.id === id) || null;
}

export interface Reference {
  type: 'url' | 'book' | 'article' | 'internal';
  title: string;
  link?: string;
  page?: string;
  author?: string;
}

export interface MindmapNode {
  id: string;
  title: string;
  content: {
    summary: string;
    detailed: string;
    examples?: string[];
    keyPoints?: string[];
    references?: Reference[];
  };
  children: MindmapNode[];
  metadata: {
    level: number;
    tags?: string[];
    createdAt: string;
    source?: string;
    importance?: 'low' | 'medium' | 'high';
  };
}

export interface Mindmap {
  id: string;
  title: string;
  description: string;
  rootNode: MindmapNode;
  metadata: {
    createdAt: string;
    updatedAt: string;
    sourceFile: string;
    totalNodes: number;
    maxDepth: number;
    tags: string[];
    version: string;
  };
}

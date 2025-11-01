# Implementation Plan: QuizMe - Study Buddy Platform

## 🎯 Project Overview

**QuizMe** is a production-ready personal study buddy platform with two core features:
1. **Mindmap Creator** - Visual, interactive knowledge maps with expandable nodes
2. **Quiz Creator** - AI-generated quizzes from study materials with multiple question types

## 🎨 Design System

### Color Palette
- **Primary Blue (Bitwarden)**: `#175DDC`
- **Accent Orange (Classical Sun)**: `#FF6B35`
- **Background**: White/Light Gray
- **Text**: Dark Gray/Black
- **Accents**: Gradient combinations of blue and orange

## 📁 Project Structure

```
quizme/
├── app/
│   ├── (routes)/
│   │   ├── mindmap/
│   │   │   ├── page.tsx           # Mindmap viewer/list
│   │   │   └── [id]/
│   │   │       └── page.tsx       # Individual mindmap view
│   │   ├── quiz/
│   │   │   ├── page.tsx           # Quiz list
│   │   │   └── [id]/
│   │   │       ├── page.tsx       # Quiz taking interface
│   │   │       └── results/
│   │   │           └── page.tsx  # Quiz results
│   │   └── generate/
│   │       └── page.tsx           # Upload slide → Generate MD
│   ├── components/
│   │   ├── mindmap/
│   │   │   ├── MindmapViewer.tsx
│   │   │   ├── MindmapNode.tsx
│   │   │   └── NodeDetailPanel.tsx
│   │   ├── quiz/
│   │   │   ├── QuizCard.tsx
│   │   │   ├── QuestionRenderer.tsx
│   │   │   ├── MultipleChoice.tsx
│   │   │   ├── TrueFalse.tsx
│   │   │   └── Matching.tsx
│   │   └── shared/
│   │       ├── Layout.tsx
│   │       ├── Header.tsx
│   │       └── FileUpload.tsx
│   ├── lib/
│   │   ├── utils/
│   │   │   ├── mindmap.ts         # Mindmap parsing/processing
│   │   │   ├── quiz.ts            # Quiz parsing/scoring
│   │   │   └── fileHandler.ts     # File operations
│   │   └── types/
│   │       ├── mindmap.ts         # TypeScript types for mindmap
│   │       └── quiz.ts            # TypeScript types for quiz
│   └── api/
│       └── generate/
│           └── route.ts           # API route for Claude generation
├── mind-map-content/              # Input: MD files from Claude
├── data/
│   ├── mindmaps/                  # Output: Generated mindmap JSON files (separate from quizzes)
│   └── quizzes/                   # Output: Generated quiz JSON files (separate from mindmaps)
├── prompts/
│   ├── claude-slide-processor.md  # Prompt for Claude to process slides
│   ├── cli-mindmap-generator.md   # System prompt for MD → Mindmap JSON conversion
│   └── cli-quiz-generator.md      # System prompt for MD → Quiz JSON conversion
├── scripts/
│   ├── generate-mindmap.ts        # CLI script: Convert MD → Mindmap JSON
│   └── generate-quiz.ts           # CLI script: Convert MD → Quiz JSON
└── public/
    └── assets/
```

## 📊 JSON Schema: Mindmap Structure

### Mindmap JSON Structure

```typescript
interface MindmapNode {
  id: string;                    // Unique identifier (UUID)
  title: string;                 // Node title/heading
  content: {
    summary: string;              // Brief 1-2 sentence summary
    detailed: string;             // Comprehensive explanation
    examples?: string[];          // Array of example strings
    keyPoints?: string[];         // Array of key takeaways
    references?: Reference[];     // Optional citations/sources
  };
  children: MindmapNode[];        // Nested child nodes (hierarchical)
  metadata: {
    level: number;                // Depth level (0 = root)
    tags?: string[];              // Optional categorization tags
    createdAt: string;            // ISO 8601 timestamp
    source?: string;              // Source slide/material reference
    importance?: 'low' | 'medium' | 'high'; // Optional importance marker
  };
}

interface Reference {
  type: 'url' | 'book' | 'article' | 'internal';
  title: string;
  link?: string;
  page?: string;
  author?: string;
}

interface Mindmap {
  id: string;                    // Unique mindmap identifier
  title: string;                 // Main topic/subject
  description: string;           // Overall description
  rootNode: MindmapNode;         // Root node containing entire tree
  metadata: {
    createdAt: string;           // ISO 8601 timestamp
    updatedAt: string;           // ISO 8601 timestamp
    sourceFile: string;          // Reference to original MD file
    totalNodes: number;          // Total count of all nodes
    maxDepth: number;            // Maximum nesting depth
    tags: string[];              // Global tags
    version: string;             // Version identifier
  };
}
```

### Example Mindmap JSON

```json
{
  "id": "mm-001",
  "title": "Introduction to Machine Learning",
  "description": "Comprehensive overview of ML fundamentals",
  "rootNode": {
    "id": "node-root",
    "title": "Machine Learning",
    "content": {
      "summary": "Machine learning is a subset of AI that enables systems to learn from data.",
    "detailed": "Machine learning algorithms build mathematical models based on training data to make predictions or decisions without being explicitly programmed...",
      "keyPoints": [
        "Learns from data patterns",
        "Three main types: supervised, unsupervised, reinforcement"
      ],
      "examples": [
        "Email spam detection",
        "Image recognition"
      ]
    },
    "children": [
      {
        "id": "node-001",
        "title": "Supervised Learning",
        "content": {
          "summary": "Learning with labeled training data",
          "detailed": "Supervised learning uses labeled datasets to train algorithms...",
          "keyPoints": ["Requires labeled data", "Used for classification and regression"],
          "examples": ["Predicting house prices", "Image classification"]
        },
        "children": [
          {
            "id": "node-001-001",
            "title": "Classification",
            "content": {
              "summary": "Categorizing inputs into classes",
              "detailed": "Classification algorithms predict discrete labels...",
              "examples": ["Spam vs not spam", "Cat vs dog"]
            },
            "children": [],
            "metadata": {
              "level": 2,
              "importance": "high"
            }
          }
        ],
        "metadata": {
          "level": 1,
          "tags": ["learning-type"],
          "importance": "high"
        }
      }
    ],
    "metadata": {
      "level": 0,
      "createdAt": "2024-01-15T10:00:00Z"
    }
  },
  "metadata": {
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:00:00Z",
    "sourceFile": "ml-intro.md",
    "totalNodes": 25,
    "maxDepth": 4,
    "tags": ["ai", "machine-learning", "data-science"],
    "version": "1.0.0"
  }
}
```

## 📝 JSON Schema: Quiz Structure

### Quiz JSON Structure

```typescript
interface Quiz {
  id: string;                    // Unique quiz identifier
  title: string;                 // Quiz title
  description: string;           // Quiz description/instructions
  subject: string;               // Subject/topic area
  questions: Question[];         // Array of questions
  metadata: {
    createdAt: string;           // ISO 8601 timestamp
    sourceFile: string;          // Reference to original MD file
    totalQuestions: number;      // Total question count
    estimatedTime: number;       // Estimated time in minutes
    difficultyDistribution: {
      easy: number;
      medium: number;
      hard: number;
      expert: number;
    };
    tags: string[];              // Subject tags
    version: string;             // Version identifier
  };
  settings: {
    shuffleQuestions: boolean;   // Randomize question order
    shuffleAnswers: boolean;     // Randomize answer options
    timeLimit?: number;          // Optional time limit in minutes
    passingScore: number;        // Minimum score to pass (0-100)
  };
}

interface Question {
  id: string;                    // Unique question identifier
  type: 'multiple-choice' | 'true-false' | 'matching';
  question: string;               // Question text/prompt
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  points: number;                 // Points awarded for correct answer
  explanation?: string;           // Explanation shown after answering
  metadata: {
    tags?: string[];              // Question-specific tags
    relatedNodeId?: string;       // Optional link to mindmap node
  };
}

// Multiple Choice Question
interface MultipleChoiceQuestion extends Question {
  type: 'multiple-choice';
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
}

// True/False Question
interface TrueFalseQuestion extends Question {
  type: 'true-false';
  correctAnswer: boolean;        // true or false
}

// Matching Question
interface MatchingQuestion extends Question {
  type: 'matching';
  leftItems: {
    id: string;
    text: string;
  }[];
  rightItems: {
    id: string;
    text: string;
    correctMatchId: string;      // ID of correct left item
  }[];
}
```

### Example Quiz JSON

```json
{
  "id": "quiz-001",
  "title": "Machine Learning Fundamentals Quiz",
  "description": "Test your understanding of ML core concepts",
  "subject": "Machine Learning",
  "questions": [
    {
      "id": "q-001",
      "type": "multiple-choice",
      "question": "What is the primary goal of supervised learning?",
      "difficulty": "easy",
      "points": 10,
      "options": [
        {
          "id": "opt-1",
          "text": "To learn patterns from unlabeled data",
          "isCorrect": false
        },
        {
          "id": "opt-2",
          "text": "To predict outcomes using labeled training data",
          "isCorrect": true
        },
        {
          "id": "opt-3",
          "text": "To maximize rewards through trial and error",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "To cluster similar data points together",
          "isCorrect": false
        }
      ],
      "explanation": "Supervised learning uses labeled datasets where each training example has a corresponding output label. The algorithm learns to map inputs to outputs.",
      "metadata": {
        "tags": ["supervised-learning", "basics"],
        "relatedNodeId": "node-001"
      }
    },
    {
      "id": "q-002",
      "type": "true-false",
      "question": "Machine learning models always improve with more training data.",
      "difficulty": "medium",
      "points": 15,
      "correctAnswer": false,
      "explanation": "While more data often helps, there are diminishing returns and potential issues like overfitting or poor quality data that can harm performance.",
      "metadata": {
        "tags": ["data-quality"]
      }
    },
    {
      "id": "q-003",
      "type": "matching",
      "question": "Match each learning type with its characteristic:",
      "difficulty": "hard",
      "points": 20,
      "leftItems": [
        {
          "id": "left-1",
          "text": "Supervised Learning"
        },
        {
          "id": "left-2",
          "text": "Unsupervised Learning"
        },
        {
          "id": "left-3",
          "text": "Reinforcement Learning"
        }
      ],
      "rightItems": [
        {
          "id": "right-1",
          "text": "Uses labeled data",
          "correctMatchId": "left-1"
        },
        {
          "id": "right-2",
          "text": "Discovers hidden patterns",
          "correctMatchId": "left-2"
        },
        {
          "id": "right-3",
          "text": "Learns through rewards",
          "correctMatchId": "left-3"
        }
      ],
      "explanation": "Each learning paradigm has distinct characteristics and use cases.",
      "metadata": {
        "tags": ["comparison", "learning-types"]
      }
    }
  ],
  "metadata": {
    "createdAt": "2024-01-15T10:00:00Z",
    "sourceFile": "ml-intro.md",
    "totalQuestions": 15,
    "estimatedTime": 30,
    "difficultyDistribution": {
      "easy": 5,
      "medium": 6,
      "hard": 3,
      "expert": 1
    },
    "tags": ["machine-learning", "fundamentals"],
    "version": "1.0.0"
  },
  "settings": {
    "shuffleQuestions": true,
    "shuffleAnswers": true,
    "timeLimit": 45,
    "passingScore": 70
  }
}
```

## 🔄 Workflow & Data Flow

### Complete User Flow

1. **Upload Slide Content**
   - User uploads slide file (PDF, images, or text)
   - Frontend sends to `/api/generate` endpoint
   - Server calls Claude API with `prompts/claude-slide-processor.md`
   - Claude returns structured markdown
   - User downloads/saves MD file to `mind-map-content/`

2. **Generate JSON via CLI (Separate Commands)**
   - **For Mindmap**: User runs `npm run generate:mindmap <file.md>`
     - Reads MD file from `mind-map-content/`
     - Uses system prompt from `prompts/cli-mindmap-generator.md`
     - Generates mindmap JSON only
     - Saves to `data/mindmaps/<filename>-mindmap.json`
   - **For Quiz**: User runs `npm run generate:quiz <file.md>` (separate command)
     - Reads MD file from `mind-map-content/`
     - Uses system prompt from `prompts/cli-quiz-generator.md`
     - Generates quiz JSON only
     - Saves to `data/quizzes/<filename>-quiz.json`
   - **Note**: Mindmaps and quizzes are completely separate files, generated independently

3. **View & Interact**
   - Mindmap: Interactive visualization with zoom/pan/expand
   - Quiz: Take quiz, view results, see explanations

## 🛠️ Technical Stack Decisions

### Frontend
- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS 4**

### Mindmap Visualization
- **React Flow** (`reactflow`) - Modern, performant, supports zoom/pan/custom nodes
- **Alternative considered**: D3.js (more complex, lower-level)

### Quiz UI
- Custom React components with Tailwind styling

### File Processing
- **PDF**: `pdf-parse` or `pdfjs-dist`
- **Images**: Native Next.js Image or OCR if needed
- **Markdown**: `remark` or `marked` for parsing

### AI Integration
- **Anthropic Claude API** (`@anthropic-ai/sdk`)
- Environment variable for API key

### CLI/Generation Scripts
- **Purpose**: The `scripts/` folder contains Node.js scripts you run manually from terminal
  - These are NOT part of the web application
  - They're utility scripts for converting MD files to JSON when you're ready
  
- **Why Scripts Folder?**
  - Keeps generation logic separate from web app code
  - You control when/how generation happens (run on-demand from terminal)
  - Can be run independently without starting the Next.js server
  - Simple, focused purpose: read MD file → call Claude API → save JSON
  
- **Scripts**:
  - `scripts/generate-mindmap.ts` - Converts MD → Mindmap JSON (uses `prompts/cli-mindmap-generator.md`)
  - `scripts/generate-quiz.ts` - Converts MD → Quiz JSON (uses `prompts/cli-quiz-generator.md`)
  - Both use `tsx` to run TypeScript directly
  
- **Alternative Approach** (if you prefer):
  - Could integrate into web app via API routes (`/api/generate/mindmap`, `/api/generate/quiz`)
  - Would allow generation directly from web interface
  - Current approach (scripts folder) gives you more control and keeps things simple

### File Management
- Node.js `fs` module for file operations
- JSON validation with `zod` for type safety

## 📋 Implementation Steps

### Phase 1: Foundation & Setup
1. ✅ Project structure creation
2. ✅ Color theme configuration (Tailwind custom colors)
3. ✅ TypeScript type definitions
4. ✅ Basic layout components
5. ✅ Folder structure (`mind-map-content/`, `data/`, `prompts/`, `cli/`)

### Phase 2: Prompt Engineering
1. ✅ Create `prompts/claude-slide-processor.md` (for slide → MD conversion)
2. ✅ Create `prompts/cli-mindmap-generator.md` (for MD → Mindmap JSON conversion)
3. ✅ Create `prompts/cli-quiz-generator.md` (for MD → Quiz JSON conversion)
4. ✅ Document prompt usage instructions

### Phase 3: Mindmap Feature
1. ✅ JSON schema implementation
2. ✅ React Flow integration
3. ✅ Mindmap viewer component (zoom/pan/expand)
4. ✅ Node detail panel for expanded content
5. ✅ Mindmap list page
6. ✅ Individual mindmap view page

### Phase 4: Quiz Feature
1. ✅ JSON schema implementation
2. ✅ Question renderers (MC, TF, Matching)
3. ✅ Quiz taking interface
4. ✅ Scoring & results page
5. ✅ Quiz list page

### Phase 5: Generation Workflow
1. ✅ File upload component
2. ✅ API route for Claude integration (`/api/generate`)
3. ✅ CLI tool for MD → JSON conversion
4. ✅ File system utilities

### Phase 6: Polish & Production
1. ✅ Error handling
2. ✅ Loading states
3. ✅ Responsive design
4. ✅ Performance optimization
5. ✅ Production build testing

## 🎯 Key Features to Implement

### Mindmap Viewer
- ✅ Zoom controls (mouse wheel, buttons)
- ✅ Pan (drag canvas)
- ✅ Expand/collapse nodes (click to toggle)
- ✅ Node detail modal/sidebar
- ✅ Search functionality
- ✅ Export options (optional)

### Quiz Interface
- ✅ Question navigation
- ✅ Answer selection (radio, checkbox, matching)
- ✅ Progress indicator
- ✅ Timer (if time limit set)
- ✅ Submit & score calculation
- ✅ Results page with explanations
- ✅ Review mode (see correct answers)

## 🔐 Environment Variables

```env
ANTHROPIC_API_KEY=your_key_here
```

## 📦 Dependencies to Add

```json
{
  "reactflow": "^11.x",
  "@anthropic-ai/sdk": "^0.x",
  "zod": "^3.x",
  "remark": "^15.x",
  "pdf-parse": "^1.x",
  "uuid": "^9.x",
  "@types/uuid": "^9.x",
  "tsx": "^4.x"
}
```

## 🚀 CLI Commands

```bash
# Generate mindmap from MD file (separate command)
npm run generate:mindmap mind-map-content/my-file.md
# Output: data/mindmaps/my-file-mindmap.json

# Generate quiz from MD file (separate command, separate file)
npm run generate:quiz mind-map-content/my-file.md
# Output: data/quizzes/my-file-quiz.json

# Note: Mindmaps and quizzes are completely separate files and generated independently
```

## 📝 Next Steps

After approval of this plan, I will:
1. Create the prompt engineering files
2. Set up the project structure
3. Implement core components
4. Build the mindmap viewer
5. Build the quiz interface
6. Integrate AI generation workflow
7. Create CLI tool

---

**Status**: Ready for implementation once approved.

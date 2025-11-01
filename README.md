# QuizMe - Your Personal Study Buddy 🎓

**QuizMe** is a production-ready Next.js application that transforms your slide presentations into powerful study tools: interactive mindmaps and comprehensive AI-generated quizzes.

![QuizMe](https://img.shields.io/badge/Next.js-16-black) ![React](https://img.shields.io/badge/React-19-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## ✨ Features

### 🗺️ Interactive Mindmaps
- **Zoom & Pan**: Navigate large knowledge structures effortlessly
- **Expandable Nodes**: Click to expand/collapse branches
- **Rich Content**: View summaries, detailed explanations, key points, and examples
- **Visual Hierarchy**: Color-coded nodes based on depth level
- **Node Details Panel**: Comprehensive information for each concept

### 📝 AI-Generated Quizzes
- **Multiple Question Types**: 
  - Multiple Choice (4 options)
  - True/False
  - Matching (term-definition pairs)
- **Difficulty Levels**: Easy, Medium, Hard, Expert
- **Question Explanations**: Learn from detailed explanations after each answer
- **Score Tracking**: See your progress with detailed results
- **Shuffle Options**: Randomized questions and answers for practice variety

### 🤖 AI-Powered Generation
- **Slide Processing**: Upload slides to Claude for structured extraction
- **Automatic Generation**: Convert markdown to mindmaps or quizzes with simple CLI commands
- **Structured Output**: Well-organized JSON files ready for visualization

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Anthropic Claude API key ([Get one here](https://www.anthropic.com/api))

### Installation

1. **Clone the repository** (if applicable) or navigate to the project directory:
   ```bash
   cd quizme
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   # Create .env.local file
   echo "ANTHROPIC_API_KEY=your_api_key_here" > .env.local
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage Guide

### Complete Workflow

#### Step 1: Process Your Slides

1. **Copy the slide processor prompt**:
   - Open `prompts/claude-slide-processor.md`
   - Copy the entire content

2. **Use Claude** (via website or API):
   - Paste the prompt as system prompt/message
   - Upload or paste your slide content
   - Claude will generate structured markdown

3. **Save the markdown**:
   ```bash
   # Create mind-map-content directory if it doesn't exist
   mkdir -p mind-map-content
   
   # Save Claude's output to a file
   # Example: mind-map-content/my-topic.md
   ```

#### Step 2: Generate Mindmap or Quiz

**Generate Mindmap:**
```bash
npm run generate:mindmap mind-map-content/my-topic.md
```

**Generate Quiz:**
```bash
npm run generate:quiz mind-map-content/my-topic.md
```

**Note**: You can generate both independently from the same MD file!

#### Step 3: View and Study

1. **Start the app** (if not running):
   ```bash
   npm run dev
   ```

2. **View Mindmaps**:
   - Navigate to `/mindmap` or click "Mindmaps" in navigation
   - Click on any mindmap to view it
   - **Interact with the mindmap**:
     - **Zoom**: Scroll with mouse wheel or use zoom buttons
     - **Pan**: Click and drag the canvas
     - **Expand**: Click a node to expand/collapse children
     - **Details**: Click again to see comprehensive information panel

3. **Take Quizzes**:
   - Navigate to `/quiz` or click "Quizzes" in navigation
   - Select a quiz to start
   - Answer questions and track your progress
   - Submit to see results with explanations

## 📁 Project Structure

```
quizme/
├── app/
│   ├── components/
│   │   ├── mindmap/          # Mindmap visualization components
│   │   ├── quiz/             # Quiz interface components
│   │   └── shared/           # Shared components (Header, Layout)
│   ├── lib/
│   │   ├── types/            # TypeScript type definitions
│   │   └── utils/            # Utility functions
│   ├── mindmap/              # Mindmap pages
│   │   ├── page.tsx          # Mindmap list
│   │   └── [id]/             # Individual mindmap view
│   ├── quiz/                 # Quiz pages
│   │   ├── page.tsx          # Quiz list
│   │   └── [id]/             # Quiz taking & results
│   └── page.tsx              # Home page
├── data/
│   ├── mindmaps/             # Generated mindmap JSON files
│   └── quizzes/              # Generated quiz JSON files
├── mind-map-content/         # Input: MD files from Claude
├── prompts/                 # AI prompts for generation
│   ├── claude-slide-processor.md
│   ├── cli-mindmap-generator.md
│   └── cli-quiz-generator.md
├── scripts/                  # CLI generation scripts
│   ├── generate-mindmap.ts
│   └── generate-quiz.ts
└── public/                   # Static assets
```

## 🎨 Design

- **Primary Color**: Bitwarden Blue (#175DDC)
- **Accent Color**: Classical Sun Orange (#FF6B35)
- **Framework**: Next.js 16 with App Router
- **Styling**: Tailwind CSS 4
- **Visualization**: React Flow for mindmaps

## 📚 Example Files

The project includes example files to help you get started:

### Mindmaps:
- `data/mindmaps/machine-learning-mindmap.json` - ML fundamentals
- `data/mindmaps/cell-biology-mindmap.json` - Cell biology concepts

### Quizzes:
- `data/quizzes/machine-learning-quiz.json` - ML quiz with 10 questions
- `data/quizzes/cell-biology-quiz.json` - Biology quiz with 10 questions

You can view these immediately after starting the app!

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Generation
npm run generate:mindmap <file.md>   # Generate mindmap from MD
npm run generate:quiz <file.md>      # Generate quiz from MD
```

### Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **Visualization**: React Flow 11
- **AI**: Anthropic Claude API
- **Validation**: Zod

## 📝 JSON Schemas

### Mindmap Structure

```typescript
{
  id: string;
  title: string;
  description: string;
  rootNode: {
    id: string;
    title: string;
    content: {
      summary: string;
      detailed: string;
      keyPoints?: string[];
      examples?: string[];
      references?: Reference[];
    };
    children: MindmapNode[];
    metadata: {
      level: number;
      tags?: string[];
      createdAt: string;
      importance?: 'low' | 'medium' | 'high';
    };
  };
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
```

### Quiz Structure

```typescript
{
  id: string;
  title: string;
  description: string;
  subject: string;
  questions: Question[];
  metadata: {
    createdAt: string;
    sourceFile: string;
    totalQuestions: number;
    estimatedTime: number;
    difficultyDistribution: {
      easy: number;
      medium: number;
      hard: number;
      expert: number;
    };
    tags: string[];
    version: string;
  };
  settings: {
    shuffleQuestions: boolean;
    shuffleAnswers: boolean;
    timeLimit?: number;
    passingScore: number;
  };
}
```

See `IMPLEMENTATION_PLAN.md` for detailed schema documentation.

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file:

```env
ANTHROPIC_API_KEY=your_claude_api_key_here
```

### Customization

- **Colors**: Edit `app/globals.css` to change color scheme
- **Prompts**: Modify files in `prompts/` to customize AI generation
- **Components**: All components in `app/components/` can be customized

## 🐛 Troubleshooting

### Common Issues

**Issue**: CLI generation fails with "API key not set"
- **Solution**: Ensure `ANTHROPIC_API_KEY` is set in your environment or `.env.local`

**Issue**: Mindmaps/quizzes don't appear
- **Solution**: Check that JSON files are in `data/mindmaps/` or `data/quizzes/` directories

**Issue**: "Module not found" errors
- **Solution**: Run `npm install` to ensure all dependencies are installed

**Issue**: Mindmap viewer not rendering
- **Solution**: Ensure React Flow styles are imported. Check browser console for errors.

### Getting Help

1. Check the console for error messages
2. Verify JSON files are valid (use a JSON validator)
3. Ensure all dependencies are installed
4. Review `IMPLEMENTATION_PLAN.md` for detailed architecture

## 📖 Documentation

- **IMPLEMENTATION_PLAN.md** - Complete technical architecture and design decisions
- **USER_SCENARIOS.md** - Detailed user workflows and use cases
- **QUICK_START.md** - Quick reference guide
- **CLARIFICATIONS.md** - Answers to common questions

## 🎯 Use Cases

### Study Sessions
1. Generate mindmap from lecture slides
2. Explore concepts visually
3. Take quiz to test understanding
4. Review results and study weak areas

### Exam Preparation
1. Process multiple topics
2. Generate quizzes for each
3. Practice repeatedly (shuffled questions)
4. Use mindmaps for quick review

### Concept Learning
1. Upload complex topic slides
2. Visualize relationships in mindmap
3. Understand hierarchy and connections
4. Test comprehension with quizzes

## 🤝 Contributing

This is a personal study tool, but suggestions are welcome! Feel free to:
- Report bugs
- Suggest features
- Improve documentation
- Share your use cases

## 📄 License

This project is for personal use. Feel free to adapt it for your needs.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Visualization powered by [React Flow](https://reactflow.dev/)
- AI powered by [Anthropic Claude](https://www.anthropic.com/)

---

**Happy Studying! 🚀**

For questions or issues, check the documentation files or review the code comments.

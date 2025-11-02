# QuizMe Automated Workflow Rules

## Content Creation Workflow

### 1. Creating Content from Slides

When creating educational content from slides or presentations:

- **Storage Location**: All generated content is stored in the `content/` folder
- **Required Prompt**: Use `@prompts/claude-slide-processor.md`
- **Output Format**: Structured markdown file with hierarchical topics

**Workflow**:
1. Reference the prompt: `@prompts/claude-slide-processor.md`
2. Provide the slide content to be processed
3. The system will generate a comprehensive markdown document with:
   - Overview section
   - Hierarchical topic structure (### for Level 1, #### for Level 2, etc.)
   - Summaries, detailed content, key points, and examples for each topic
   - Quiz generation notes categorized by difficulty
4. Save the output to `content/{topic-name}.md`

---

## Mindmap Generation Workflow

### 2. Generating Mindmaps from Content

To create interactive mindmaps from processed content:

- **Input Source**: Markdown files from `content/` folder
- **Required Prompt**: Use `@prompts/cli-mindmap-generator.md`
- **Output Location**: `data/mindmaps/`
- **Output Format**: JSON file following the mindmap schema

**Workflow**:
1. Ensure content exists in `content/` folder (created via workflow #1)
2. Reference the prompt: `@prompts/cli-mindmap-generator.md`
3. Provide the markdown content file
4. The system will generate a mindmap JSON with:
   - Hierarchical node structure (unlimited depth)
   - Root node with children representing topics and subtopics
   - Each node contains: summary, detailed content, key points, examples
   - Metadata including total nodes, max depth, and tags
5. Save to `data/mindmaps/{source-filename}-mindmap.json`

**Key Principles**:
- **No depth limit**: Create as many hierarchical levels as needed
- **Display information in nodes**: Important properties, attributes, and components should appear as child nodes
- **Visible structure**: The mindmap should be self-explanatory from the node hierarchy alone

---

## Quiz Generation Workflow

### 3. Generating Quizzes from Content

To create interactive quizzes from processed content:

- **Input Source**: Markdown files from `content/` folder
- **Required Prompt**: Use `@prompts/cli-quiz-generator.md`
- **Output Location**: `data/quizzes/`
- **Output Format**: JSON file following the quiz schema

**Workflow**:
1. Ensure content exists in `content/` folder (created via workflow #1)
2. Reference the prompt: `@prompts/cli-quiz-generator.md`
3. Provide the markdown content file
4. The system will generate a quiz JSON with:
   - Multiple question types: Multiple Choice (50-60%), True/False (20-30%), Matching (10-20%)
   - Difficulty levels: Easy (30%), Medium (40%), Hard (25%), Expert (5%)
   - 10-20 questions total (aim for 15)
   - Complete metadata including time estimates and difficulty distribution
5. Save to `data/quizzes/{source-filename}-quiz.json`

**Question Types**:
- **Multiple Choice**: 4 options, 1 correct answer, 3 plausible distractors
- **True/False**: Clear statements with explanations
- **Matching**: 4-6 pairs of related concepts

---

## Complete End-to-End Workflow

### From Slides to Interactive Learning Materials

**Step 1: Process Slides → Content**
```
Input: Raw slide content
Prompt: @prompts/claude-slide-processor.md
Output: content/{topic-name}.md
```

**Step 2: Content → Mindmap**
```
Input: content/{topic-name}.md
Prompt: @prompts/cli-mindmap-generator.md
Output: data/mindmaps/{topic-name}-mindmap.json
```

**Step 3: Content → Quiz**
```
Input: content/{topic-name}.md
Prompt: @prompts/cli-quiz-generator.md
Output: data/quizzes/{topic-name}-quiz.json
```

---

## Required File Structure

```
quizme/
├── content/                    # Processed markdown content
│   └── {topic-name}.md
├── data/
│   ├── mindmaps/              # Generated mindmap JSON files
│   │   └── {topic-name}-mindmap.json
│   └── quizzes/               # Generated quiz JSON files
│       └── {topic-name}-quiz.json
└── prompts/                   # System prompts for AI processing
    ├── claude-slide-processor.md
    ├── cli-mindmap-generator.md
    └── cli-quiz-generator.md
```

---

## Best Practices

1. **Always start with content creation** using the slide processor prompt
2. **Generate both mindmaps AND quizzes** from the same content for comprehensive learning materials
3. **Validate JSON output** before deploying to ensure proper schema compliance
4. **Use consistent naming** across content, mindmap, and quiz files (same base filename)
5. **Review generated questions** to ensure they accurately reflect the content
6. **Check mindmap depth** to ensure all hierarchical information is properly represented

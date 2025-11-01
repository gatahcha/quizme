# User Scenarios - How QuizMe Works

This document explains how users interact with QuizMe, from uploading study materials to viewing mindmaps and taking quizzes.

---

## 🎯 Overview

QuizMe helps students transform their slide presentations into two powerful study tools:
1. **Interactive Mindmaps** - Visual, hierarchical knowledge maps
2. **Practice Quizzes** - AI-generated questions with explanations

---

## 📚 Typical User Journey

### Scenario 1: Sarah Studies for Her Machine Learning Exam

**Sarah's Situation:**
- Has 50+ slides from her ML course
- Needs to understand concepts visually
- Wants to test her knowledge with practice questions

#### Step-by-Step Workflow

**Step 1: Upload Slides to Claude**
- Sarah opens Claude (via website or app)
- Copies the content from `prompts/claude-slide-processor.md` as the system prompt
- Uploads or pastes her 50 ML slides
- Claude analyzes and structures the content
- Claude returns a comprehensive markdown document

**Step 2: Save Structured Content**
- Sarah copies Claude's markdown output
- Creates a file: `mind-map-content/machine-learning-final.md`
- Saves the structured markdown file

**Step 3: Generate Mindmap**
- Sarah opens terminal in the QuizMe project
- Runs: `npm run generate:mindmap mind-map-content/machine-learning-final.md`
- Script processes the MD file using Claude API
- Creates: `data/mindmaps/machine-learning-final-mindmap.json`
- ✅ Mindmap JSON is ready!

**Step 4: Generate Quiz**
- Sarah runs: `npm run generate:quiz mind-map-content/machine-learning-final.md`
- Script processes the same MD file
- Creates: `data/quizzes/machine-learning-final-quiz.json`
- ✅ Quiz JSON is ready!

**Step 5: View Mindmap**
- Sarah starts QuizMe: `npm run dev`
- Opens browser: `http://localhost:3000`
- Navigates to `/mindmap`
- Sees list of available mindmaps
- Clicks on "Machine Learning Final"
- Views interactive mindmap:
  - **Zooms** in/out with mouse wheel
  - **Pans** by dragging the canvas
  - **Clicks nodes** to expand/collapse branches
  - **Clicks nodes** again to see detailed information panel
  - Explores hierarchical structure visually
  - Studies concepts with examples and key points

**Step 6: Take Quiz**
- Navigates to `/quiz`
- Sees list of available quizzes
- Clicks on "Machine Learning Final Quiz"
- Starts quiz:
  - Sees 15 questions with difficulty indicators
  - Answers multiple choice questions
  - Marks true/false statements
  - Matches concepts with definitions
  - Tracks progress with progress bar
  - Submits when done
- Views results:
  - Sees score: 85/100 (85%)
  - Reviews each question with correct answer
  - Reads explanations for learning
  - Identifies weak areas (supervised learning concepts)

**Step 7: Study & Improve**
- Goes back to mindmap
- Focuses on nodes about supervised learning
- Reads detailed explanations and examples
- Retakes quiz to improve score

---

### Scenario 2: Alex Prepares for History Exam

**Alex's Situation:**
- Has lecture slides about World War II
- Wants chronological mindmap to see relationships
- Needs to memorize key dates and events

#### Step-by-Step Workflow

**Step 1: Process Slides**
- Alex uploads WW2 slides to Claude with the slide processor prompt
- Gets structured markdown: `world-war-2.md`
- Saves to `mind-map-content/`

**Step 2: Generate Both Tools**
- Generates mindmap: `npm run generate:mindmap mind-map-content/world-war-2.md`
- Generates quiz: `npm run generate:quiz mind-map-content/world-war-2.md`

**Step 3: Study Timeline Visually**
- Opens mindmap in QuizMe
- Views chronological flow:
  - Root: "World War II"
    - Child: "1939-1941: Early Events"
      - Child: "Invasion of Poland"
        - Detailed info: Date, countries involved, consequences
      - Child: "Battle of Britain"
    - Child: "1942-1943: Turning Points"
    - Child: "1944-1945: Final Stages"
- Zooms into specific time periods
- Expands nodes to read detailed information
- Understands cause-and-effect relationships

**Step 4: Test Knowledge**
- Takes quiz with matching questions:
  - Matches dates with events
  - Matches leaders with countries
- Answers multiple choice about key battles
- Reviews true/false statements about causes

---

### Scenario 3: Maria Reviews Biology Notes

**Maria's Situation:**
- Has cell biology slides
- Wants quick visual reference
- Needs comprehensive quiz to prepare for final

#### Step-by-Step Workflow

**Step 1: Quick Generation**
- Processes slides → saves `cell-biology.md`
- Generates both mindmap and quiz in one session

**Step 2: Quick Review**
- Opens mindmap to see overall structure:
  - Main concepts at top level
  - Detailed explanations when needed
  - Uses search to find specific topics quickly

**Step 3: Comprehensive Quiz Practice**
- Takes quiz multiple times (shuffled questions each time)
- Studies explanations after each attempt
- Identifies consistently missed topics
- Returns to mindmap for focused study

---

## 🔄 Complete Workflow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    USER WORKFLOW                              │
└─────────────────────────────────────────────────────────────┘

1. UPLOAD TO CLAUDE
   ├─ Copy prompt from prompts/claude-slide-processor.md
   ├─ Upload slides to Claude (website/app)
   └─ Receive structured markdown output
       │
       ↓

2. SAVE MARKDOWN
   └─ Save MD file to mind-map-content/
       │
       ├─ Example: mind-map-content/my-topic.md
       │
       ↓

3. GENERATE JSON FILES (Choose one or both)
   ├─ Generate Mindmap:
   │  └─ npm run generate:mindmap mind-map-content/my-topic.md
   │     └─ Creates: data/mindmaps/my-topic-mindmap.json
   │
   └─ Generate Quiz:
      └─ npm run generate:quiz mind-map-content/my-topic.md
         └─ Creates: data/quizzes/my-topic-quiz.json

4. USE IN WEB APP
   ├─ Start app: npm run dev
   │
   ├─ VIEW MINDMAP:
   │  ├─ Navigate to /mindmap
   │  ├─ Select mindmap from list
   │  ├─ Interact:
   │  │  ├─ Zoom in/out
   │  │  ├─ Pan canvas
   │  │  ├─ Expand/collapse nodes
   │  │  └─ View detailed information
   │  └─ Study visually
   │
   └─ TAKE QUIZ:
      ├─ Navigate to /quiz
      ├─ Select quiz from list
      ├─ Answer questions:
      │  ├─ Multiple choice
      │  ├─ True/False
      │  └─ Matching
      ├─ Submit answers
      └─ Review results with explanations
```

---

## 💡 Use Cases

### Use Case 1: First-Time Study Session

**Goal:** Understand new material comprehensively

**Process:**
1. Upload course slides → get structured MD
2. Generate mindmap first (visual understanding)
3. Explore mindmap to grasp overall structure
4. Generate quiz later for testing
5. Use both tools together for comprehensive study

**Why:** Mindmap provides visual overview before testing knowledge

---

### Use Case 2: Quick Review Before Exam

**Goal:** Rapid review and quick practice

**Process:**
1. Already have MD file from previous session
2. Generate quiz quickly
3. Take quiz to identify weak areas
4. Reference mindmap for specific topics
5. Retake quiz to confirm understanding

**Why:** Quiz reveals gaps, mindmap provides targeted learning

---

### Use Case 3: Collaborative Study (Future Enhancement)

**Goal:** Share study materials with classmates

**Potential Process:**
1. Generate mindmap and quiz
2. Share JSON files (via cloud, email, etc.)
3. Classmates import into their QuizMe
4. Everyone uses same study materials
5. Compare quiz scores

**Note:** Currently single-user, but JSON files are portable

---

### Use Case 4: Multiple Subjects

**Goal:** Manage multiple courses

**Process:**
1. Create separate MD files for each subject:
   - `mind-map-content/biology.md`
   - `mind-map-content/chemistry.md`
   - `mind-map-content/math.md`
2. Generate mindmaps and quizzes for each
3. All appear in `/mindmap` and `/quiz` lists
4. Switch between subjects easily
5. Track progress across subjects

---

## 🎮 Interactive Features Explained

### Mindmap Interactions

**Zoom:**
- **Mouse wheel**: Scroll up to zoom in, down to zoom out
- **Zoom buttons**: Click + to zoom in, - to zoom out
- **Purpose**: Focus on specific sections or see overview

**Pan:**
- **Drag**: Click and drag canvas to move around
- **Purpose**: Navigate large mindmaps that extend beyond viewport

**Expand/Collapse:**
- **Click node**: First click expands to show children
- **Click again**: Shows detailed information panel
- **Purpose**: Progressive disclosure - see what you need, when you need it

**Node Information Panel:**
- Shows: Summary, detailed explanation, key points, examples
- **Purpose**: Deep dive into concepts without leaving context

---

### Quiz Interactions

**Question Navigation:**
- **Next/Previous buttons**: Move through questions
- **Question list**: Jump to specific question
- **Progress bar**: Visual indicator of completion

**Answer Selection:**
- **Multiple Choice**: Click one option (radio buttons)
- **True/False**: Select True or False
- **Matching**: Drag left items to right items, or select from dropdown

**Timer (if enabled):**
- Shows countdown in corner
- Warning when time is low
- Auto-submit when time expires

**Results Review:**
- See all questions with your answers
- Correct answers highlighted in green
- Incorrect answers in red with correct answer shown
- Explanations for learning
- Score breakdown by difficulty level

---

## 📋 Step-by-Step: First Time Setup

### For Complete Beginners

**Step 1: Prepare Your Slides**
- Gather all slides for one subject/topic
- Ensure they're in a format Claude can read (text, PDF, images)
- Have them ready to copy/upload

**Step 2: Get Claude Output**
1. Go to Claude website (or use API)
2. Copy entire content of `prompts/claude-slide-processor.md`
3. Paste as system prompt/message
4. Upload or paste your slides
5. Wait for Claude to process
6. Copy Claude's markdown output

**Step 3: Save to Project**
```bash
# In your QuizMe project directory
cd /Users/charisma/project/quizme

# Create mind-map-content folder if it doesn't exist
mkdir -p mind-map-content

# Create and save MD file
# (Paste Claude's output into the file)
nano mind-map-content/my-first-topic.md
# Or use your favorite editor
```

**Step 4: Generate Mindmap**
```bash
npm run generate:mindmap mind-map-content/my-first-topic.md
```

**What happens:**
- Script reads your MD file
- Sends to Claude API with mindmap generation prompt
- Claude converts MD to mindmap JSON
- Saves to `data/mindmaps/my-first-topic-mindmap.json`

**Step 5: Generate Quiz**
```bash
npm run generate:quiz mind-map-content/my-first-topic.md
```

**What happens:**
- Script reads same MD file
- Sends to Claude API with quiz generation prompt
- Claude creates questions from content
- Saves to `data/quizzes/my-first-topic-quiz.json`

**Step 6: Start Web App**
```bash
npm run dev
```

**Step 7: View Your Content**
- Open browser: `http://localhost:3000`
- Click "Mindmaps" → see your mindmap
- Click "Quizzes" → see your quiz
- Start studying!

---

## 🔁 Typical Study Session Workflow

### Session 1: Initial Learning (2-3 hours)

1. **Morning**: Upload slides, generate mindmap
2. **Midday**: Explore mindmap, understand structure
3. **Afternoon**: Generate quiz, take first attempt
4. **Evening**: Review quiz results, focus on weak areas

### Session 2: Review & Practice (1-2 hours)

1. **Quick mindmap review**: Refresh memory on structure
2. **Retake quiz**: Test improvement
3. **Targeted study**: Use mindmap for missed topics
4. **Final quiz**: Confirm readiness

### Session 3: Exam Day Prep (30 minutes)

1. **Quick mindmap scan**: Visual reminder of key concepts
2. **Practice quiz**: Last-minute confidence check
3. **Review explanations**: Reinforce understanding

---

## 🎯 Success Metrics (User Goals)

**Effective Usage Indicators:**
- ✅ Can navigate mindmap and find information quickly
- ✅ Quiz score improves on retakes
- ✅ Understands relationships between concepts (from mindmap)
- ✅ Can explain concepts (from quiz explanations)
- ✅ Feels confident before exam

**Study Efficiency:**
- Less time re-reading slides (mindmap is faster)
- Targeted practice (quiz identifies gaps)
- Visual memory aid (mindmap structure)
- Active recall practice (quizzes)

---

## 🚀 Advanced Usage Scenarios

### Scenario: Multiple Related Topics

**Example:** Organic Chemistry - Separate chapters

**Approach:**
1. Create separate MD files:
   - `organic-chemistry-alcohols.md`
   - `organic-chemistry-aldehydes.md`
   - `organic-chemistry-ketones.md`
2. Generate mindmap/quiz for each
3. Study each chapter separately
4. Use quiz results to identify which chapters need more work

**Benefit:** Modular study, focused practice

---

### Scenario: Cumulative Review

**Example:** Semester-long course with multiple topics

**Approach:**
1. Generate mindmaps/quizzes for each major topic
2. Before final exam:
   - Review all mindmaps in sequence
   - Take quiz from each topic
   - Create combined study session

**Benefit:** Systematic review of entire course

---

### Scenario: Concept Comparison

**Example:** Compare different algorithms in ML course

**Approach:**
1. Generate mindmap showing all algorithms
2. Use mindmap to visually compare:
   - Hierarchical structure shows relationships
   - Node details show differences
   - Examples illustrate use cases
3. Generate quiz with matching questions comparing concepts

**Benefit:** Understand similarities and differences visually

---

## ❓ Common Questions (FAQ for Users)

**Q: Do I need to generate both mindmap and quiz?**
A: No, you can generate just one if you prefer. However, they complement each other well.

**Q: Can I edit the generated mindmap or quiz?**
A: Currently no - they're generated from your MD files. To change them, update the MD file and regenerate.

**Q: How long does generation take?**
A: Depends on content size and Claude API response time. Typically 10-30 seconds per file.

**Q: Can I use the same MD file for multiple generations?**
A: Yes! Each generation creates fresh content, so you can regenerate anytime.

**Q: What if Claude's output isn't quite right?**
A: You can refine the MD file manually before generating JSON, or adjust the prompts.

**Q: Can I share my mindmaps/quizzes?**
A: Yes! The JSON files are portable. You can share them with others who use QuizMe.

**Q: How many mindmaps/quizzes can I have?**
A: As many as you want! They're stored as files, so storage is only limited by your disk space.

---

## 📝 Summary

QuizMe transforms static slides into:
- **Visual learning** via interactive mindmaps
- **Active practice** via AI-generated quizzes
- **Efficient study** with targeted, structured content

The workflow is simple:
1. Slides → Claude → Structured MD
2. MD → Scripts → JSON files
3. JSON → Web App → Interactive study tools

**Result:** Better understanding, efficient practice, improved exam performance.

---

**Ready to start studying? Follow the workflows above and transform your slides into powerful study tools!** 🚀

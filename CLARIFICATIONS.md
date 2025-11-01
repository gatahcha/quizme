# Clarifications & Updates

## ✅ Issue 1: Mindmap and Quiz Separation

**Status**: ✅ RESOLVED

### What Changed:
- **Separate files**: Mindmaps save to `data/mindmaps/`, quizzes save to `data/quizzes/`
- **Separate commands**: 
  - `npm run generate:mindmap` → generates ONLY mindmap JSON
  - `npm run generate:quiz` → generates ONLY quiz JSON
- **Separate prompts**: 
  - `prompts/cli-mindmap-generator.md` (mindmap-specific)
  - `prompts/cli-quiz-generator.md` (quiz-specific)
- **Independent generation**: You can generate one without the other, or both separately from the same MD file

### File Structure:
```
data/
├── mindmaps/              # All mindmap JSON files here
│   └── my-file-mindmap.json
└── quizzes/               # All quiz JSON files here (separate)
    └── my-file-quiz.json
```

---

## ✅ Issue 2: Purpose of scripts/ Folder

**Status**: ✅ CLARIFIED

### What It Is:
The `scripts/` folder contains **utility scripts** (not web app code) that you run manually from terminal.

### Why It Exists:
1. **Separation of concerns**: Generation logic separate from web app
2. **On-demand control**: Run only when you have MD files ready to convert
3. **Independence**: Can run without starting Next.js server
4. **Simplicity**: Focused scripts that do one thing well

### What's Inside:
- `scripts/generate-mindmap.ts` - Converts MD → Mindmap JSON
- `scripts/generate-quiz.ts` - Converts MD → Quiz JSON

### How It Works:
```bash
# You run these manually when ready
npm run generate:mindmap mind-map-content/my-file.md
npm run generate:quiz mind-map-content/my-file.md
```

### Alternative (if preferred):
If you'd rather generate from the web interface, we could:
- Add API routes: `/api/generate/mindmap` and `/api/generate/quiz`
- Create UI buttons to trigger generation
- Show progress/status in the browser

**Current approach** (scripts folder) is simpler and gives you more control. We can switch to web-based generation later if needed.

---

## Summary

- ✅ **Mindmaps and quizzes are completely separate** - different files, different folders, different generation commands
- ✅ **scripts/ folder purpose clarified** - utility scripts for manual MD → JSON conversion, separate from web app

Both issues are resolved. Ready to proceed with implementation!

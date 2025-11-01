#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

if (!process.env.ANTHROPIC_API_KEY) {
  console.error('Error: ANTHROPIC_API_KEY environment variable is not set');
  console.error('Please set it with: export ANTHROPIC_API_KEY=your_key_here');
  process.exit(1);
}

async function generateQuiz(mdFilePath: string) {
  const fullPath = path.resolve(mdFilePath);
  
  if (!fs.existsSync(fullPath)) {
    console.error(`Error: File not found: ${fullPath}`);
    process.exit(1);
  }

  const mdContent = fs.readFileSync(fullPath, 'utf-8');
  const promptPath = path.join(process.cwd(), 'prompts', 'cli-quiz-generator.md');
  const systemPrompt = fs.readFileSync(promptPath, 'utf-8');

  console.log('📖 Reading markdown file...');
  console.log('🤖 Generating quiz JSON with Claude...');

  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: `Please convert the following markdown content into a quiz JSON file:\n\n${mdContent}`,
        },
      ],
    });

    const response = message.content[0];
    if (response.type !== 'text') {
      throw new Error('Unexpected response type from Claude');
    }

    const jsonText = response.text.trim();
    // Extract JSON from markdown code blocks if present
    const jsonMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || [null, jsonText];
    const jsonContent = jsonMatch[1].trim();

    // Validate JSON
    const quiz = JSON.parse(jsonContent);

    // Save to data/quizzes/
    const filename = path.basename(mdFilePath, path.extname(mdFilePath));
    const outputDir = path.join(process.cwd(), 'data', 'quizzes');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.join(outputDir, `${filename}-quiz.json`);
    fs.writeFileSync(outputPath, JSON.stringify(quiz, null, 2), 'utf-8');

    console.log(`✅ Quiz generated successfully!`);
    console.log(`📁 Saved to: ${outputPath}`);
  } catch (error) {
    console.error('❌ Error generating quiz:', error);
    process.exit(1);
  }
}

// Get file path from command line args
const mdFile = process.argv[2];

if (!mdFile) {
  console.error('Usage: npm run generate:quiz <path-to-md-file>');
  console.error('Example: npm run generate:quiz mind-map-content/my-topic.md');
  process.exit(1);
}

generateQuiz(mdFile).catch(console.error);

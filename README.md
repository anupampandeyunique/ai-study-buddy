# AI Study Buddy

An AI-powered revision tool built directly on the Claude API. Enter any topic and get an instant, exam-style multiple-choice quiz — generated live, not pre-written.

## Why

Built for the **AI in Education & Skilling** track — the idea is simple: students spend hours making their own revision questions. Claude can generate them instantly, tailored to any subject, at zero setup cost.

## What it does

- Type any topic (e.g. "Operating Systems — Deadlocks", "React Hooks")
- Claude generates 4 unique MCQs with explanations, on the fly
- Answer, check your score, and get instant feedback with reasoning for each answer

## Tech

- **React** (functional components, hooks)
- **Claude API** (`claude-sonnet-4-6`) — structured JSON generation from natural language prompts
- No backend, no database — pure client-side calls to the API

## How it works

1. User submits a topic
2. A prompt asks Claude to return a quiz strictly as JSON
3. The app parses and renders it as an interactive quiz UI
4. Answers are checked client-side and explained using Claude's own reasoning

## Status

Built as a working prototype — next steps: difficulty levels, topic history, and spaced-repetition scheduling for weak areas.

---
**Author:** Anupam Pandey
[GitHub](https://github.com/anupampandeyunique) · [LinkedIn](https://linkedin.com/in/anupampandeyunique)

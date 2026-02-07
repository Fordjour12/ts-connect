# Contributing Guide

First off — thank you for taking interest in contributing 🙌
This project values **thoughtful engineering**, **human-centered design**, and **explainable intelligence**.

We welcome contributions that make the system:

- clearer
- safer
- more useful
- more humane

---

## 🧭 Project Values

Before contributing, please align with these principles:

1. **Human-first**
   - This app exists to help people regain control, not feel judged.
   - Avoid dark patterns, pressure tactics, or shame-based UX.

2. **Explainable over clever**
   - A simple rule + clear explanation beats a complex black box.
   - If the app detects a problem, it must be able to explain it.

3. **Safety by default**
   - No risky financial advice.
   - No encouragement of gambling, debt abuse, or speculation.
   - AI suggestions must always be conservative and practical.

4. **Progress over perfection**
   - Small wins matter more than ideal budgets.
   - Design for bad months, burnout, and real life.

---

## 🛠 Ways to Contribute

You can contribute in many ways:

### Code

- Features
- Bug fixes
- Performance improvements
- Refactors (with clear justification)

### Intelligence & Logic

- Decline detection rules
- Analytics accuracy
- AI prompt improvements
- Signal-to-noise reduction

### UX / Product

- Flow improvements
- Copywriting (especially AI tone)
- Accessibility improvements
- Simplification of complex views

### Documentation

- README improvements
- Architecture explanations
- Inline comments where logic is non-obvious

---

## 📦 Project Setup

### Requirements

- Node.js (LTS recommended)
- pnpm
- PostgreSQL (Neon recommended)

### Install

```bash
pnpm install
```

### Environment Variables

Create a `.env` file:

```env
DATABASE_URL=postgresql://...
AI_API_KEY=...
AUTH_SECRET=...
```

### Run locally

```bash
pnpm dev
```

---

## 🗂 Project Structure (Quick Guide)

```
src/
  db/          → Drizzle schema & DB connection
  server/      → server-only logic (auth, AI, analytics)
  routes/      → TanStack Start routes (UI)
  ui/          → shared components
```

**Important rule:**
Do not mix server-only logic into UI routes.

---

## 🧠 Working With AI Features

When contributing to AI-related code:

- Always ground AI responses in **real user data**
- Prefer rules for detection, AI for explanation
- Keep prompts:
  - calm
  - non-judgmental
  - concise

- Limit clarifying questions (max 1 unless unavoidable)

If adding a new AI feature, include:

- purpose
- inputs
- failure cases
- safety considerations

---

## 🧪 Testing Philosophy

This project prioritizes **logic correctness** over pixel perfection.

Please ensure:

- decline detection rules are testable
- summaries produce consistent results
- AI prompts degrade gracefully with missing data
- no crashes on empty or partial datasets

If you add a rule or analytic:

- include a short test case or example

---

## 🧹 Code Style Guidelines

- Prefer clarity over brevity
- Use meaningful variable names
- Avoid “magic numbers” without explanation
- Comment _why_, not _what_
- Keep functions small and composable

Formatting:

- Follow existing formatting
- Don’t introduce a new style guide unless discussed

---

## 🔐 Security & Privacy

- Never log sensitive financial data
- Never expose user data across sessions
- Always scope DB queries by `userId`
- Avoid storing raw AI prompts with personal data unless required

If you find a security issue:

- Do **not** open a public issue
- Contact the maintainer privately

---

## 🧩 Submitting Changes

### 1. Fork & Branch

```bash
git checkout -b feature/your-feature-name
```

### 2. Make Changes

Keep commits focused and descriptive.

### 3. Test Locally

Ensure the app runs and core flows still work.

### 4. Open a Pull Request

Your PR should include:

- what problem it solves
- why the change is needed
- screenshots or examples (if UI-related)
- any trade-offs or limitations

---

## ❌ What Not to Do

- Introduce shaming language
- Add speculative or risky financial advice
- Over-engineer early-stage features
- Add AI features without guardrails
- Break backward compatibility without discussion

---

## 💬 Communication

- Be respectful and constructive
- Assume good intent
- Disagree with ideas, not people
- Ask questions early

---

## 🌱 Final Note

This project aims to help people build **financial stability**, not just dashboards.

If your contribution makes the app:

- calmer
- clearer
- more forgiving
- more empowering

…it’s probably a good contribution.

Thank you for being here ❤️

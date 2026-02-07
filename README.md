# 🧠 Financial Intelligence Web App

A modern, AI-powered web application that helps users **track financial progress**, **detect decline early**, and **receive actionable guidance** to curb unhealthy spending patterns — without guilt, pressure, or complexity.

This is **not just a finance tracker**.
It’s a **financial self-regulation system**.

---

## ✨ What This App Does

- Tracks income, expenses, savings, debt, and goals
- Detects early signs of financial decline
- Explains _why_ things are changing, not just _what_ changed
- Uses AI to suggest practical, safe curb actions
- Lets users apply recommendations with one click
- Adapts to bad months, burnout, and real human behavior

---

## 🧩 Core Philosophy

Most finance apps:

> Track → Show charts → Stop

This app:

> Track → Detect → Explain → Suggest → Apply → Adapt

The goal is **financial stability**, not perfection.

---

## 🛠 Tech Stack

### Frontend

- **TanStack Start** – full-stack React framework
- **TanStack Router** – routing & data loading
- **coss-ui** – consistent UI components

### Backend

- **TanStack Start server functions**
- **Drizzle ORM**
- **Neon Postgres** (serverless PostgreSQL)

### Authentication

- **better-auth** (session-based, secure, simple)

### AI

- **Vercel AI SDK**
- Streaming responses
- Tool / function calling
- Rules + AI hybrid intelligence

### Tools

- **Oxlint** - Oxlint + Oxfmt (linting & formatting)
- **Turborepo** - Optimized monorepo build system

---

## 🧠 Feature Overview

### 1. Financial Tracking

- Accounts (cash, bank, savings, debt, investment)
- Transactions (income, expense, transfer, savings, debt payment)
- Categories (system + custom)
- Monthly budgets
- Financial goals

---

### 2. Awareness & Analytics

- Monthly & weekly summaries
- Savings rate & budget adherence
- Trend analysis (MoM, volatility)
- Financial Health Score (0–100)
- Early-warning forecasts

---

### 3. Decline Detection Engine

Rules-based signals such as:

- Spending spikes
- Savings rate drops
- Category leakage
- Income dips
- Debt stagnation
- Tracking inactivity

Each signal includes:

- Severity level
- Explanation
- Supporting data

---

### 4. AI Intelligence Layer

Powered by **Vercel AI SDK**.

- AI Coach (streaming chat)
- “What changed?” one-click explanations
- Curb suggestions (budgets, swaps, habits)
- Weekly financial standups
- What-if simulations

AI is **supportive, practical, and safe** — no risky advice.

---

### 5. Action System

- Apply AI recommendations instantly
- Auto-create:
  - budget changes
  - tasks
  - reminders

- Micro-challenges (short, optional)
- Progress feedback loop

---

### 6. Behavior & Psychology

- Expense confidence tagging (worth it / regret)
- Money mood tracking
- Friction budgeting (soft limits)
- Personalized nudges

---

### 7. Safety & Retention

- Bad Month Mode
- Burnout detection
- Plan reset flows
- Reduced-pressure UI states

---

## 🗂 Project Structure (Simplified)

```
src/
  db/
    schema.ts
    index.ts
  server/
    auth.ts
    analytics/
      summaries.ts
      decline.ts
    ai/
      coach.ts
    routes/
      ai.coach.ts
      insights.ts
  routes/
    dashboard.tsx
    coach.tsx
    transactions.tsx
  ui/
    components/
```

- **`db/`** → database schema & connection
- **`server/`** → server-only logic
- **`routes/`** → TanStack Start pages
- **`ui/`** → reusable UI components

---

## 🔐 Authentication

- Session-based auth via **better-auth**
- Server-side `requireUser` guards
- All financial data is user-scoped
- No cross-user data access

---

## 🧠 AI Design Principles

- AI never acts alone — always grounded in user data
- Rules detect problems, AI explains and guides
- No gambling, scams, or risky financial advice
- Ask at most **one** clarifying question
- Focus on **small, achievable actions**

---

## 🧪 Development Status

- [ ] Auth & onboarding
- [ ] Transactions & categories
- [ ] Budgets & goals
- [ ] Decline detection engine
- [ ] AI coach endpoint
- [ ] Action system
- [ ] Safety modes

---

## 🚀 Getting Started

### 1. Clone

```bash
git clone <repo-url>
cd financial-intelligence-app
```

### 2. Install

```bash
pnpm install
```

### 3. Environment Variables

```env
DATABASE_URL=postgresql://...
AI_API_KEY=...
AUTH_SECRET=...
```

### 4. Run

- `bun run dev`: Start all applications in development mode
- `bun run build`: Build all applications
- `bun run check-types`: Check TypeScript types across all apps
- `bun run db:push`: Push schema changes to database
- `bun run db:generate`: Generate database client/types
- `bun run db:migrate`: Run database migrations
- `bun run db:studio`: Open database studio UI
- `bun run check`: Run Oxlint and Oxfmt

---

## 🧭 Long-Term Vision

This app can evolve into a **Life OS financial layer**, connecting:

- money ↔ habits
- money ↔ calendar
- money ↔ energy & mood
- money ↔ long-term identity

---

## 🤝 Contributing

Contributions are welcome, especially around:

- analytics accuracy
- AI prompt quality
- UX for behavior change
- performance & scalability

Please keep changes:

- privacy-first
- human-centered
- explainable

---

## 📜 License

MIT (or your preferred license)

---

If you want, next I can:

- turn this README into a **Notion PRD**
- write a **CONTRIBUTING.md**
- create **API docs**
- or generate a **launch pitch**

Just say the word.

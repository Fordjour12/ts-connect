# Financial Intelligence App - Phased Roadmap

This roadmap turns the full feature vision into shippable phases:

- `MVP`: prove core value and retention baseline.
- `v1`: deliver strong financial awareness and action loop.
- `v2`: add AI depth, behavioral intelligence, and advanced tooling.

## Current Delivery Status

- ✅ `MVP` is done (core value + retention baseline established).
- 🔜 `v1` is next (strong financial awareness + action loop delivery).
- ⏸️ `v2` remains future scope after `v1` completion.

## v1 Kickoff (Now)

To start v1 execution immediately, use this order:

1. **Ship baseline analytics + score first**
   - Implement period-over-period summaries, trend metrics, and health score states.
2. **Enable signal generation + persistence**
   - Add rule-based decline signals with metadata and insight timeline state.
3. **Close the action loop in-product**
   - Let users apply at least one corrective action directly from an insight.
4. **Run on schedule + observe quality**
   - Add daily/weekly jobs and monitor signal freshness, reliability, and usage.

### v1 Kickoff Definition of Done

- First weekly v1 release includes: score, trend comparison, and at least 3 signal types.
- Insight cards include explanation + supporting data + one direct action.
- Scheduled jobs run automatically and are visible in operational monitoring.

Guiding product statement:

> Build a financial self-regulation system, not just a transaction tracker.

## Phase 1: MVP (Core + Usable Daily Flow)

### Goal

Ship a stable product where users can set up their profile, track money manually, and manage month-to-month control.

### Scope

1. Foundation

- Authentication and session management (Better Auth).
- User setup: currency, financial start date, optional income range.
- Privacy-first defaults.

1. Money Tracking Core

- Accounts: create, archive/hide, balance tracking, manual adjustment with reason.
- Transactions: add/edit/delete with types (income, expense, transfer, savings, debt payment).
- Categories: system categories + custom categories.

1. Planning Core

- Budgets: monthly budgets by category, over-budget detection, budget vs actual view.
- Goals: savings/debt goals, progress tracking, pause/archive.

1. Basic Awareness

- Monthly and weekly summary cards:
  - income total
  - expense total
  - net savings
  - savings rate
  - budget adherence

1. Essential UX + Reliability

- Loading/skeleton states for async pages.
- Empty states for first-time users.
- Basic error toasts and validation.

### Exit Criteria

- New user can onboard and reach dashboard in under 2 minutes median.
- User can complete one full monthly cycle manually (track -> budget -> review).
- Core data CRUD is reliable and scoped to authenticated user.

### Deferred to v1

- Financial health score.
- Trend analysis and warnings.
- AI chat and recommendations.
- Task/reminder system.

## Phase 2: v1 (Awareness -> Action Loop)

### Goal

Help users understand changes in behavior and take practical corrective actions.

### Scope

1. Stronger Analysis

- Full monthly/weekly summaries with period-over-period comparison.
- Trend analysis:
  - month-over-month changes
  - rolling averages
  - volatility and spike detection
  - income irregularity detection

1. Financial Health Layer

- Financial health score (0-100).
- Label states: Stable, Improving, Drifting, At Risk.
- Historical score trend graph.

1. Rule-Based Signal Engine

- Decline signals:
  - spending spike
  - savings rate drop
  - budget leakage
  - category anomaly
  - income dip
  - debt growth
  - transaction silence
- Signal metadata: severity, explanation, supporting data.
- Insight store: persistence, timeline, deduping, active/resolved states.

1. Early Warning System

- Projected budget overrun alerts.
- Savings depletion forecasts.
- Debt stagnation alerts.

1. Action System

- Apply recommendation actions:
  - update budget
  - adjust goal
  - create task/reminder
- Tasks and reminders with due date + completion tracking.

1. Quality + Observability

- Background jobs for daily/weekly insight refresh.
- Observability for insight quality and feature usage.

### Exit Criteria

- Users receive understandable explanations for monthly change.
- At least one in-app action can be taken directly from an insight.
- Signals and warnings are generated reliably on schedule.

### Deferred to v2

- AI coach and deep conversational experience.
- What-if simulation.
- Behavioral psychology features (mood/confidence/challenges).
- Advanced exports/benchmarks/subscription intelligence.

## Phase 3: v2 (Intelligence + Behavioral Differentiation)

### Goal

Move from awareness to guided behavior change with adaptive AI and personal context.

### Scope

1. AI Intelligence Layer

- AI Coach chat with streaming responses.
- "What changed?" one-click AI explanation.
- AI curb suggestions with category-specific actions and short plans.
- Weekly AI standup report.
- What-if simulation with projected impact and risk.

1. Behavioral and Psychology Layer

- Expense confidence tagging (worth it, neutral, regret).
- Money mood tracking and spending correlation.
- Friction controls (soft warnings, pause-and-confirm, nudges).
- Micro-challenges (3-7 day habit challenges).

1. Identity and Reflection

- Financial identity profile (planning style, risk tolerance, weak categories).
- Financial timeline/story (milestones, streaks, turning points).

1. Safety and Retention Modes

- Bad Month Mode (reduced pressure UX).
- Burnout detection and simplified UI fallback.
- Plan reset with history retention and AI-guided restart.

1. Power Features

- Subscription tracker and leakage detection.
- Emergency fund predictor (runway + risk).
- Benchmarks (privacy-safe, optional).
- Exports and reports (PDF, CSV, shareable summary).

### Exit Criteria

- AI features provide actionable guidance tied to user data context.
- Behavioral tools increase follow-through on budgets/goals.
- Retention safety systems reduce churn during financial stress periods.

## Cross-Phase Architecture Requirements

These apply from MVP onward:

- Auth-gated server functions with strict user ownership checks.
- Privacy-by-default data model and telemetry opt-in pattern.
- Typed validation on all financial inputs.
- Event instrumentation for onboarding, insights, actions, and retention.
- Background job capability for scheduled analysis.

## Prioritization Rules

Use these rules when new ideas are proposed:

1. If it improves onboarding completion or data integrity, prioritize for `MVP`.
2. If it turns insights into immediate user actions, prioritize for `v1`.
3. If it requires personalization or AI context depth, prioritize for `v2`.
4. If scope competes with reliability, cut scope and protect phase exit criteria.

## Feature-to-Phase Mapping Summary

- `MVP`: 1-7 (core setup, accounts, transactions, categories, budgets, goals, basic summaries).
- `v1`: 8-12, 22-23, 33-34 (score/trends/warnings/signals/insights/action system/ops).
- `v2`: 13-21, 24-32 (AI + behavior + identity + safety + advanced reports/tools).

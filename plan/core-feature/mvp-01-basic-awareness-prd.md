# MVP-01 PRD: Basic Awareness Dashboard

## 1) Objective

Ship the first daily-useful MVP surface after auth/onboarding: a dashboard that gives users immediate visibility into money movement and budget control.

Primary outcome: users can answer "How am I doing this month?" in under 10 seconds.

## 2) Scope

### In Scope

- Monthly summary cards:
  - income total
  - expense total
  - net savings
  - savings rate
  - budget adherence
- Budget snapshot by category with over-budget detection.
- Goal snapshot with progress visualization.
- Recent activity list (latest manual transactions).
- Quick actions entry points to complete core MVP loop.

### Out of Scope

- AI recommendations and insights.
- Trend analysis and period-over-period comparison.
- Automated transaction sync.
- Forecasting and alerts.

## 3) Target Users

- New users who completed onboarding and want an immediate overview.
- Returning users checking weekly/monthly financial status.

## 4) User Stories

1. As a user, I can see income, expense, and net savings for the current period.
2. As a user, I can quickly identify if any budget category is over limit.
3. As a user, I can see savings/debt goal progress at a glance.
4. As a user, I can access quick actions to continue setup and data entry.

## 5) Functional Requirements

### 5.1 Summary Metrics

- Display 5 cards:
  - `incomeTotal`
  - `expenseTotal`
  - `netSavings`
  - `savingsRate`
  - `budgetAdherence`
- Derived formulas:
  - `netSavings = incomeTotal - expenseTotal`
  - `savingsRate = (netSavings / incomeTotal) * 100` (when income > 0)
  - `budgetAdherence = (withinBudgetCategories / totalBudgetCategories) * 100`

### 5.2 Budget Snapshot

- Render category rows with `spent`, `limit`, and progress bar.
- Mark rows where `spent > limit` as `Over Budget`.
- Show remaining amount when still within budget.

### 5.3 Goal Snapshot

- Render each goal with `target`, `current`, and progress percentage.
- Support at least savings and debt-payoff goal labels.

### 5.4 Recent Activity

- Show latest transactions with:
  - title
  - category
  - date
  - amount
  - type (income/expense)

### 5.5 Quick Actions

- Provide action buttons for:
  - add transaction
  - set budgets
  - update goals
- In MVP-01 these can point to existing routes/placeholders.

## 6) UX Requirements

- No empty shell: each section must render meaningful fallback content.
- Color semantics follow design tokens:
  - success for positive trend/progress
  - warning for over-budget state
  - muted for secondary metadata
- Mobile-first layout that scales to desktop card grid.

## 7) Data Contract (Frontend MVP)

Temporary typed client-side model until APIs are completed:

- `SummaryMetrics`
- `BudgetItem[]`
- `GoalItem[]`
- `TransactionItem[]`

This contract will later map to server functions and DB entities without changing dashboard component structure.

## 8) Success Metrics

- User can identify current net savings and budget risk in one screen view.
- Dashboard first paint includes all 4 sections (summary, budgets, goals, activity).
- No runtime errors for authenticated sessions.

## 9) Acceptance Criteria

1. Dashboard displays 5 summary cards with derived values.
2. At least one budget item can show `Over Budget` status.
3. Goal rows show progress bars and percentages.
4. Recent activity distinguishes income vs expense visually.
5. Layout is responsive on mobile and desktop.
6. UI uses existing `components/ui` primitives and semantic design tokens.

## 10) Implementation Notes

- Implement in `apps/web/src/routes/dashboard.tsx`.
- Keep domain calculations in small pure helpers inside the route file for now.
- Replace local data with real API loader data in MVP-02.

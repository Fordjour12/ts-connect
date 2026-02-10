# PRD: v1 Kickoff — Awareness to Action Loop (Phase 1 Implementation)

## 1) Objective

Start v1 by replacing mocked financial intelligence flows with real data-backed behavior so users can:

1. See an actual financial health score.
2. Understand period-over-period movement.
3. Receive generated insights/signals.
4. Take direct action from insights (resolve or create task).

## 2) Scope (Kickoff Slice)

### In Scope

- Wire server functions from mock responses to DB-backed service implementations:
  - `getFinancialHealth`
  - `getPeriodSummary`
  - `getInsights`
  - `resolveInsight`
  - `createTaskFromInsight`
- Keep existing dashboard UI and insight/action UI; power it with live data.
- Keep auth-gated user ownership checks.

### Out of Scope

- AI chat/coach flows.
- Advanced anomaly explainers.
- New visual redesign.
- Full background job orchestration UI.

## 3) User Stories

- As a user, I want my health score based on my own transactions so I can trust the dashboard.
- As a user, I want month-over-month summary deltas so I can see if I am improving or drifting.
- As a user, I want active insights generated from my behavior so I can catch issues early.
- As a user, I want to mark an insight resolved/dismissed or create a task so I can close the loop.

## 4) Functional Requirements

1. Health score endpoint returns calculated score/components from DB services.
2. Period summary endpoint returns current month vs previous month metrics and trend labels.
3. Insight endpoint triggers signal generation then returns active insights for the user.
4. Resolve endpoint updates insight status (`resolved`/`dismissed`) with ownership checks.
5. Task endpoint creates a task from an insight using task management service.

## 5) Success Criteria (Kickoff)

- No mocked payloads in the five v1 endpoints above.
- End-to-end insight action loop works on real records.
- All endpoints remain auth-gated and user-scoped.

## 6) Implementation Plan

- Phase A (this PR): wire server functions + update dependency graph.
- Phase B: add endpoint-level tests for auth/ownership/error paths.
- Phase C: add scheduled refresh triggers and observability counters.

## 7) Risks & Mitigations

- Risk: sparse transaction data can generate weak/empty signals.
  - Mitigation: graceful empty state and conservative thresholds.
- Risk: repeated insight generation could duplicate records.
  - Mitigation: rely on signal engine dedupe behavior and validate in follow-up tests.

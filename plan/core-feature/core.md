# v1 Financial Intelligence - Core Feature PRD

## 1) Purpose

Transform the foundation MVP into an intelligent financial awareness and action system that helps users understand behavioral changes and take practical corrective actions.

This PRD covers the intelligence layer that analyzes user data, generates insights, and provides actionable recommendations. Users should understand what changed in their financial behavior and be able to take immediate corrective actions.

## 2) Product Goals

- Provide clear explanations for month-over-month financial changes.
- Generate actionable insights that lead to specific user behaviors.
- Create a financial health scoring system (0-100) with trend tracking.
- Enable users to take direct actions from insights (update budgets, create tasks).
- Ensure reliable daily/weekly background analysis and signal generation.

## 3) Non-Goals (For This Phase)

- AI conversational coaching or deep personalization.
- What-if simulation capabilities.
- Advanced behavioral psychology features (mood tracking, friction controls).
- Subscription tracking and leakage detection.
- Emergency fund prediction and benchmarks.

## 4) Core User Stories

1. As a user, I want to see month-over-month changes in income, expenses, and savings with clear explanations.
2. As a user, I want a financial health score that reflects my overall financial stability.
3. As a user, I want to receive warnings when my spending patterns indicate potential problems.
4. As a user, I want to take immediate actions (update budget, create reminder) directly from insights.
5. As a user, I want automated daily analysis that runs in the background without manual intervention.
6. As a user, I want to track my progress on financial goals and see trend improvements/declines.

## 5) Functional Requirements

### 5.1 Enhanced Analysis Engine

**Monthly/Weekly Summaries:**
- Generate comprehensive period summaries with period-over-period comparisons
- Calculate rolling averages for income and expenses
- Detect spending volatility and unusual spikes
- Identify income irregularity patterns

**Trend Analysis:**
- Month-over-month percentage changes for all major categories
- Rolling 3-month averages to smooth volatility
- Spike detection with configurable thresholds
- Income stability scoring and irregularity flags

### 5.2 Financial Health Scoring

**Health Score Calculation (0-100):**
- Score components:
  - Savings rate (25% weight)
  - Budget adherence (25% weight)
  - Income stability (20% weight)
  - Expense volatility (15% weight)
  - Goal progress (15% weight)

**Health State Labels:**
- Stable: Score 80-100, consistent positive trends
- Improving: Score 60-79, upward trajectory
- Drifting: Score 40-59, mixed or flat trends
- At Risk: Score 0-39, declining trends or negative patterns

**Historical Tracking:**
- Store daily score snapshots
- Generate trend graphs showing 30/90-day score history
- Identify score trend direction (improving/stable/declining)

### 5.3 Rule-Based Signal Engine

**Decline Signals:**
- **Spending Spike**: >30% increase over 3-month average in any category
- **Savings Rate Drop**: >20% decrease month-over-month
- **Budget Leakage**: >25% over budget in any category for 2+ consecutive months
- **Category Anomaly**: Unusual spending in non-recurring categories
- **Income Dip**: >20% decrease in income vs. 3-month average
- **Debt Growth**: Debt payments increasing while savings decreasing
- **Transaction Silence**: No transactions for >7 days (potential tracking abandonment)

**Signal Metadata:**
- Severity level (low/medium/high/critical)
- Detailed explanation with supporting data
- Triggering transactions or patterns
- Recommended actions

**Insight Store:**
- Persist all signals with timestamps
- Deduplicate similar signals within time windows
- Track active vs. resolved states
- Signal timeline with status changes

### 5.4 Early Warning System

**Budget Overrun Alerts:**
- Projected month-end totals vs. budget allocations
- Alert when projected overruns >15% with 5+ days remaining in month
- Category-specific warnings with actionable advice

**Savings Depletion Forecasts:**
- Project runway based on current savings rate
- Alert when projected depletion <3 months
- Contextual advice for increasing savings rate

**Debt Stagnation Alerts:**
- Flag when debt payments decrease while overall debt stays flat
- Alert when debt-to-income ratio increases month-over-month

### 5.5 Action System

**Direct Insight Actions:**
- Update budget allocations based on spending patterns
- Adjust goal targets based on progress trends
- Create tasks/reminders with due dates
- Archive or modify recurring transactions

**Task and Reminder Management:**
- Create tasks directly from insights with one click
- Set due dates, priorities, and completion tracking
- Task types: Budget adjustment, Goal review, Spending review, Payment reminder
- Integration with user's task system

### 5.6 Quality and Observability

**Background Processing:**
- Daily insight refresh (recommended: 6 AM user local time)
- Weekly trend analysis (Sunday nights)
- Real-time signal processing for critical alerts

**Observability:**
- Track insight generation success/failure rates
- Monitor user engagement with insights
- Signal quality metrics (false positives, resolution rates)
- Background job performance monitoring

## 6) Data Model Extensions

### 6.1 Analysis Tables

**Financial Health Scores:**
```sql
- userId (FK)
- score (integer 0-100)
- healthState (enum: stable/improving/driftiong/at_risk)
- scoreComponents (jsonb: savings_rate, budget_adherence, etc.)
- trendDirection (enum: improving/stable/declining)
- calculatedAt (timestamp)
```

**Insights and Signals:**
```sql
- userId (FK)
- insightType (enum: spending_spike, savings_drop, budget_leakage, etc.)
- severity (enum: low/medium/high/critical)
- title (string)
- explanation (text)
- supportingData (jsonb)
- status (enum: active/resolved/dismissed)
- createdAt (timestamp)
- resolvedAt (timestamp)
```

**Trend Analysis:**
```sql
- userId (FK)
- periodType (enum: daily/weekly/monthly)
- periodStart (date)
- periodEnd (date)
- metrics (jsonb: income_total, expense_total, savings_rate, etc.)
- comparisons (jsonb: vs_previous_period, vs_3month_avg)
```

### 6.2 Task System

**User Tasks:**
```sql
- userId (FK)
- title (string)
- description (text)
- taskType (enum: budget_adjustment, goal_review, spending_review, payment_reminder)
- priority (enum: low/medium/high)
- dueDate (timestamp)
- status (enum: open/in_progress/completed/dismissed)
- sourceInsightId (FK to insights)
- createdAt (timestamp)
- completedAt (timestamp)
```

## 7) API Requirements

### 7.1 Analysis APIs

- `getFinancialHealth` - Current score and trend
- `getPeriodSummary` - Monthly/weekly comparison data
- `getTrendAnalysis` - Rolling averages and volatility metrics
- `getInsights` - Active signals and recommendations

### 7.2 Action APIs

- `updateBudgetFromInsight` - Apply insight recommendations
- `createTaskFromInsight` - Generate tasks from signals
- `resolveInsight` - Mark insights as addressed
- `dismissInsight` - Dismiss unwanted signals

### 7.3 Background Processing

- `triggerAnalysisRefresh` - Manual trigger for testing
- `getBackgroundJobStatus` - Monitor processing health

## 8) UX Requirements

### 8.1 Insight Presentation

- Clear visual hierarchy: critical → high → medium → low severity
- One-click actions for common recommendations
- "Why am I seeing this?" explanations for all signals
- Progress indicators for ongoing trends

### 8.2 Financial Health Dashboard

- Prominent health score display with trend arrow
- Color-coded health states (green/yellow/orange/red)
- 30-day score history graph
- Component breakdown showing what affects the score

### 8.3 Action Integration

- Inline action buttons on each insight
- Quick action templates for common scenarios
- Task creation flow with minimal friction
- Action history and completion tracking

## 9) Success Metrics

- **Insight Engagement**: >=60% of insights viewed within 24 hours
- **Action Conversion**: >=30% of insights lead to at least one action
- **Health Score Improvement**: >=40% of users show improving trends within 60 days
- **Signal Accuracy**: >=85% of high-severity signals are legitimate concerns
- **Background Job Reliability**: >=99% successful daily analysis completion

## 10) Acceptance Criteria

1. Users can view their financial health score with component breakdown and trend.
2. All decline signals generate with proper severity levels and explanations.
3. Insights can be resolved or dismissed with status tracking.
4. Direct actions (budget updates, task creation) work seamlessly from insights.
5. Daily background analysis completes successfully for 95%+ of active users.
6. Month-over-month comparisons display accurate percentage changes.
7. Early warning alerts trigger appropriately based on spending projections.
8. Users can track task completion and see action history.

## 11) Implementation Phases

### Phase 1: Analysis Foundation
- Implement trend analysis engine and period comparisons
- Build financial health scoring algorithm
- Create data model for scores and trends

### Phase 2: Signal Generation
- Build rule-based signal detection system
- Implement insight persistence and deduplication
- Create signal severity classification

### Phase 3: User Interface
- Design and build insight presentation components
- Create financial health dashboard
- Implement action buttons and workflows

### Phase 4: Action System
- Build task creation and management
- Implement direct insight-to-action flows
- Add action history and tracking

### Phase 5: Background Processing
- Set up daily/weekly analysis jobs
- Implement early warning system
- Add observability and monitoring

## 12) Dependencies

- Existing MVP user data (profiles, transactions, budgets, goals)
- Background job infrastructure for daily analysis
- Notification system for alerts and warnings
- Database optimization for time-series analysis queries

## 13) Risks and Mitigations

- **Risk**: Analysis complexity leads to slow performance
  - **Mitigation**: Implement data aggregation and caching strategies
- **Risk**: Signal noise overwhelms users
  - **Mitigation**: Strict severity thresholds and user preference controls
- **Risk**: False positive alerts damage trust
  - **Mitigation**: Conservative initial thresholds with user feedback iteration

## 14) Open Questions

1. What should be the minimum data requirements before generating insights?
2. How should we handle users with insufficient transaction history?
3. Should insights be real-time or batched for better user experience?
4. What notification channels should be supported for early warnings?
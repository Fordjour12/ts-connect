import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, decimal, integer, boolean, index, jsonb, date, pgEnum } from "drizzle-orm/pg-core";
import { user } from "./auth";

// User Financial Profile
export const userProfile = pgTable("user_profile", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  currency: text("currency").notNull(), // ISO currency code
  financialStartDate: date("financial_start_date").notNull(),
  monthlyIncomeMin: decimal("monthly_income_min", { precision: 10, scale: 2 }),
  monthlyIncomeMax: decimal("monthly_income_max", { precision: 10, scale: 2 }),
  privacyMode: text("privacy_mode").default("private").notNull(),
  telemetryOptIn: boolean("telemetry_opt_in").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
}, (table) => ({
  userIdx: index("user_profile_user_idx").on(table.userId),
}));

// Accounts
export const accountType = pgEnum("account_type", [
  "checking",
  "savings",
  "credit",
  "cash",
  "investment",
  "loan",
  "other",
]);

export const account = pgTable("financial_account", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  type: accountType("type").notNull(),
  balance: decimal("balance", { precision: 12, scale: 2 }).default("0").notNull(),
  isArchived: boolean("is_archived").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
}, (table) => ({
  userIdx: index("financial_account_user_idx").on(table.userId),
  typeIdx: index("financial_account_type_idx").on(table.type),
}));

// Transaction Categories
export const categoryType = pgEnum("category_type", [
  "income",
  "expense",
  "transfer",
  "savings",
  "debt_payment",
]);

export const category = pgTable("category", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  type: categoryType("type").notNull(),
  color: text("color").default("#6366f1"),
  icon: text("icon"),
  isSystem: boolean("is_system").default(false).notNull(),
  parentCategoryId: text("parent_category_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
}, (table) => ({
  userIdx: index("category_user_idx").on(table.userId),
  typeIdx: index("category_type_idx").on(table.type),
}));

// Transactions
export const transaction = pgTable("transaction", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accountId: text("account_id")
    .notNull()
    .references(() => account.id, { onDelete: "cascade" }),
  categoryId: text("category_id")
    .references(() => category.id),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  description: text("description"),
  transactionDate: timestamp("transaction_date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
}, (table) => ({
  userIdx: index("transaction_user_idx").on(table.userId),
  accountIdx: index("transaction_financial_account_idx").on(table.accountId),
  categoryIdx: index("transaction_category_idx").on(table.categoryId),
  dateIdx: index("transaction_date_idx").on(table.transactionDate),
  userDateIdx: index("transaction_user_date_idx").on(table.userId, table.transactionDate),
}));

// Budgets
export const budgetPeriod = pgEnum("budget_period", [
  "weekly",
  "monthly",
  "quarterly",
  "yearly",
]);

export const budget = pgTable("budget", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  categoryId: text("category_id")
    .notNull()
    .references(() => category.id),
  period: budgetPeriod("period").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
}, (table) => ({
  userIdx: index("budget_user_idx").on(table.userId),
  categoryIdx: index("budget_category_idx").on(table.categoryId),
}));

// Goals
export const goalType = pgEnum("goal_type", [
  "savings",
  "debt_payoff",
  "investment",
  "emergency_fund",
  "other",
]);

export const goalStatus = pgEnum("goal_status", [
  "active",
  "paused",
  "completed",
  "cancelled",
]);

export const goal = pgTable("goal", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  type: goalType("type").notNull(),
  targetAmount: decimal("target_amount", { precision: 12, scale: 2 }).notNull(),
  currentAmount: decimal("current_amount", { precision: 12, scale: 2 }).default("0").notNull(),
  targetDate: date("target_date"),
  status: goalStatus("status").default("active").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
}, (table) => ({
  userIdx: index("goal_user_idx").on(table.userId),
  typeIdx: index("goal_type_idx").on(table.type),
  statusIdx: index("goal_status_idx").on(table.status),
}));

// Financial Health Scores
export const healthState = pgEnum("health_state", [
  "stable",
  "improving",
  "drifting",
  "at_risk",
]);

export const trendDirection = pgEnum("trend_direction", [
  "improving",
  "stable",
  "declining",
]);

export const financialHealthScore = pgTable("financial_health_score", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  score: integer("score").notNull(), // 0-100
  healthState: healthState("health_state").notNull(),
  scoreComponents: jsonb("score_components").$type<{
    savingsRate: number;
    budgetAdherence: number;
    incomeStability: number;
    expenseVolatility: number;
    goalProgress: number;
  }>(),
  trendDirection: trendDirection("trend_direction").notNull(),
  calculatedAt: timestamp("calculated_at").defaultNow().notNull(),
}, (table) => ({
  userIdx: index("health_score_user_idx").on(table.userId),
  calculatedIdx: index("health_score_calculated_idx").on(table.calculatedAt),
}));

// Insights and Signals
export const insightType = pgEnum("insight_type", [
  "spending_spike",
  "savings_drop",
  "budget_leakage",
  "category_anomaly",
  "income_dip",
  "debt_growth",
  "transaction_silence",
  "goal_milestone",
  "positive_trend",
]);

export const signalSeverity = pgEnum("signal_severity", [
  "low",
  "medium",
  "high",
  "critical",
]);

export const insightStatus = pgEnum("insight_status", [
  "active",
  "resolved",
  "dismissed",
  "escalated",
]);

export const insight = pgTable("insight", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  insightType: insightType("insight_type").notNull(),
  severity: signalSeverity("severity").notNull(),
  title: text("title").notNull(),
  explanation: text("explanation").notNull(),
  supportingData: jsonb("supporting_data"),
  status: insightStatus("status").default("active").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  resolvedAt: timestamp("resolved_at"),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
}, (table) => ({
  userIdx: index("insight_user_idx").on(table.userId),
  typeIdx: index("insight_type_idx").on(table.insightType),
  severityIdx: index("insight_severity_idx").on(table.severity),
  statusIdx: index("insight_status_idx").on(table.status),
  createdIdx: index("insight_created_idx").on(table.createdAt),
}));

// Trend Analysis
export const periodType = pgEnum("period_type", [
  "daily",
  "weekly",
  "monthly",
]);

export const trendAnalysis = pgTable("trend_analysis", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  periodType: periodType("period_type").notNull(),
  periodStart: date("period_start").notNull(),
  periodEnd: date("period_end").notNull(),
  metrics: jsonb("metrics").$type<{
    incomeTotal: number;
    expenseTotal: number;
    savingsTotal: number;
    savingsRate: number;
    transactionCount: number;
    averageTransaction: number;
  }>(),
  comparisons: jsonb("comparisons").$type<{
    vsPreviousPeriod: number;
    vs3MonthAverage: number;
    vs6MonthAverage: number;
  }>(),
  calculatedAt: timestamp("calculated_at").defaultNow().notNull(),
}, (table) => ({
  userIdx: index("trend_analysis_user_idx").on(table.userId),
  periodIdx: index("trend_analysis_period_idx").on(table.periodType, table.periodStart),
  calculatedIdx: index("trend_analysis_calculated_idx").on(table.calculatedAt),
}));

// Tasks
export const taskType = pgEnum("task_type", [
  "budget_adjustment",
  "goal_review",
  "spending_review",
  "payment_reminder",
  "account_review",
  "category_cleanup",
]);

export const taskPriority = pgEnum("task_priority", [
  "low",
  "medium",
  "high",
  "urgent",
]);

export const taskStatus = pgEnum("task_status", [
  "open",
  "in_progress",
  "completed",
  "dismissed",
  "archived",
]);

export const task = pgTable("task", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  sourceInsightId: text("source_insight_id")
    .references(() => insight.id),
  title: text("title").notNull(),
  description: text("description"),
  taskType: taskType("task_type").notNull(),
  priority: taskPriority("priority").default("medium").notNull(),
  status: taskStatus("status").default("open").notNull(),
  dueDate: timestamp("due_date"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
}, (table) => ({
  userIdx: index("task_user_idx").on(table.userId),
  sourceIdx: index("task_source_idx").on(table.sourceInsightId),
  statusIdx: index("task_status_idx").on(table.status),
  priorityIdx: index("task_priority_idx").on(table.priority),
  dueIdx: index("task_due_idx").on(table.dueDate),
}));

// Relations
export const userProfileRelations = relations(userProfile, ({ one }) => ({
  user: one(user, {
    fields: [userProfile.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one, many }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
  transactions: many(transaction),
}));

export const categoryRelations = relations(category, ({ one, many }) => ({
  user: one(user, {
    fields: [category.userId],
    references: [user.id],
  }),
  parentCategory: one(category, {
    fields: [category.parentCategoryId!],
    references: [category.id],
  }),
  childCategories: many(category),
  transactions: many(transaction),
  budgets: many(budget),
}));

export const transactionRelations = relations(transaction, ({ one }) => ({
  user: one(user, {
    fields: [transaction.userId],
    references: [user.id],
  }),
  account: one(account, {
    fields: [transaction.accountId],
    references: [account.id],
  }),
  category: one(category, {
    fields: [transaction.categoryId],
    references: [category.id],
  }),
}));

export const budgetRelations = relations(budget, ({ one }) => ({
  user: one(user, {
    fields: [budget.userId],
    references: [user.id],
  }),
  category: one(category, {
    fields: [budget.categoryId],
    references: [category.id],
  }),
}));

export const goalRelations = relations(goal, ({ one }) => ({
  user: one(user, {
    fields: [goal.userId],
    references: [user.id],
  }),
}));

export const financialHealthScoreRelations = relations(financialHealthScore, ({ one }) => ({
  user: one(user, {
    fields: [financialHealthScore.userId],
    references: [user.id],
  }),
}));

export const insightRelations = relations(insight, ({ one, many }) => ({
  user: one(user, {
    fields: [insight.userId],
    references: [user.id],
  }),
  sourceTasks: many(task),
}));

export const trendAnalysisRelations = relations(trendAnalysis, ({ one }) => ({
  user: one(user, {
    fields: [trendAnalysis.userId],
    references: [user.id],
  }),
}));

export const taskRelations = relations(task, ({ one }) => ({
  user: one(user, {
    fields: [task.userId],
    references: [user.id],
  }),
  sourceInsight: one(insight, {
    fields: [task.sourceInsightId],
    references: [insight.id],
  }),
}));
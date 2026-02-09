import { db } from '../index';
import { FinancialHealthCalculator } from '../services/financial-health';
import { TrendAnalysisEngine } from '../services/trend-analysis';
import { SignalDetectionEngine } from '../services/signal-detection';
import { EarlyWarningSystem } from '../services/early-warning';
import { TaskManagementSystem } from '../services/task-management';

// Test database connection (using existing db)
export function getTestDatabase() {
  return db;
}

// Test data generators
export function generateTestUser() {
  return {
    id: 'test-user-id',
    email: 'test@example.com',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export function generateTestAccount(userId: string = 'test-user-id') {
  return {
    id: 'test-account-id',
    userId,
    name: 'Test Checking Account',
    type: 'checking',
    balance: 1000.00,
    currency: 'USD',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export function generateTestTransaction(accountId: string, amount: number, type: 'income' | 'expense' = 'expense') {
  return {
    id: `test-transaction-${Date.now()}`,
    accountId,
    amount: Math.abs(amount),
    type,
    category: type === 'expense' ? 'food' : 'salary',
    description: `Test ${type} transaction`,
    date: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export function generateTestBudget(userId: string, category: string = 'food', limit: number = 500) {
  return {
    id: 'test-budget-id',
    userId,
    category,
    limit,
    period: 'monthly',
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

// Service test helpers
export function createTestServices() {
  return {
    healthCalculator: FinancialHealthCalculator,
    trendAnalyzer: TrendAnalysisEngine,
    signalDetector: SignalDetectionEngine,
    earlyWarning: EarlyWarningSystem,
    taskManager: TaskManagementSystem,
  };
}

// Mock authentication for tests
export function mockAuth() {
  return {
    user: {
      id: 'test-user-id',
      email: 'test@example.com',
    },
  };
}
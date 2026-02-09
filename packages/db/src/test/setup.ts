import { afterEach, afterAll, vi } from 'vitest';

// Set up test environment variables
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test_db';

// Mock the database module to avoid connection issues
vi.mock('../index', () => ({
  db: {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    values: vi.fn().mockReturnThis(),
    returning: vi.fn().mockResolvedValue([]),
  }
}));

// Mock schema modules
vi.mock('../schema/financial', () => ({
  financialHealthScore: { $inferSelect: {}, $inferInsert: {} },
  transaction: { $inferSelect: {}, $inferInsert: {} },
  trendAnalysis: { $inferSelect: {}, $inferInsert: {} },
  insight: { $inferSelect: {}, $inferInsert: {} },
  alert: { $inferSelect: {}, $inferInsert: {} },
  task: { $inferSelect: {}, $inferInsert: {} },
  goal: { $inferSelect: {}, $inferInsert: {} },
}));

// Clean up after each test
afterEach(async () => {
  vi.clearAllMocks();
});

// Cleanup after all tests
afterAll(async () => {
  vi.restoreAllMocks();
});
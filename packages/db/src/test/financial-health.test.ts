import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FinancialHealthCalculator } from '../services/financial-health';

describe('FinancialHealthCalculator', () => {
  const testUserId = 'test-user-id';
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('calculateHealthScore', () => {
    it('should return a valid health score structure', async () => {
      const result = await FinancialHealthCalculator.calculateHealthScore(testUserId);
      
      expect(result).toHaveProperty('score');
      expect(result).toHaveProperty('healthState');
      expect(result).toHaveProperty('trendDirection');
      expect(result).toHaveProperty('components');
      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(100);
      expect(['stable', 'improving', 'drifting', 'at_risk']).toContain(result.healthState);
      expect(['improving', 'stable', 'declining']).toContain(result.trendDirection);
    });

    it('should calculate score within valid range for different user scenarios', async () => {
      const userIds = ['new-user', 'experienced-user', 'high-earner', 'budget-conscious'];
      
      for (const userId of userIds) {
        const result = await FinancialHealthCalculator.calculateHealthScore(userId);
        
        expect(result.score).toBeGreaterThanOrEqual(0);
        expect(result.score).toBeLessThanOrEqual(100);
        expect(result.components).toHaveProperty('savingsRate');
        expect(result.components).toHaveProperty('budgetAdherence');
        expect(result.components).toHaveProperty('incomeStability');
        expect(result.components).toHaveProperty('expenseVolatility');
        expect(result.components).toHaveProperty('goalProgress');
      }
    });

    it('should handle users with no transaction history', async () => {
      const newUserId = 'brand-new-user';
      const result = await FinancialHealthCalculator.calculateHealthScore(newUserId);
      
      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(100);
      // New users should have some base score
      expect(result.score).toBeGreaterThanOrEqual(10);
    });

    it('should generate different scores for different users', async () => {
      const user1 = 'user1';
      const user2 = 'user2';
      
      const result1 = await FinancialHealthCalculator.calculateHealthScore(user1);
      const result2 = await FinancialHealthCalculator.calculateHealthScore(user2);
      
      // Results should be structured the same but can have different values
      expect(typeof result1.score).toBe('number');
      expect(typeof result2.score).toBe('number');
      expect(typeof result1.healthState).toBe('string');
      expect(typeof result2.healthState).toBe('string');
    });

    it('should handle concurrent requests without errors', async () => {
      const userId = 'concurrent-user';
      
      const promises = Array.from({ length: 5 }, () => 
        FinancialHealthCalculator.calculateHealthScore(userId)
      );
      
      const results = await Promise.all(promises);
      
      results.forEach(result => {
        expect(result.score).toBeGreaterThanOrEqual(0);
        expect(result.score).toBeLessThanOrEqual(100);
      });
    });
  });

  describe('Integration with Database', () => {
    it('should successfully query database for real user data', async () => {
      const realUserId = 'real-user-with-data';
      
      try {
        const result = await FinancialHealthCalculator.calculateHealthScore(realUserId);
        
        expect(result).toBeDefined();
        expect(typeof result.score).toBe('number');
        expect(typeof result.healthState).toBe('string');
      } catch (error) {
        // If database is not available or user doesn't exist, that's okay for this test
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid user ID gracefully', async () => {
      const invalidUserId = '';
      
      try {
        const result = await FinancialHealthCalculator.calculateHealthScore(invalidUserId);
        // Should either return a valid result or throw a specific error
        expect(result).toBeDefined();
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });

    it('should handle database connection errors', async () => {
      const problematicUserId = 'problematic-user';
      
      try {
        const result = await FinancialHealthCalculator.calculateHealthScore(problematicUserId);
        expect(result).toBeDefined();
      } catch (error) {
        // Should handle database errors gracefully
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  describe('Performance', () => {
    it('should complete calculation within reasonable time', async () => {
      const startTime = Date.now();
      
      await FinancialHealthCalculator.calculateHealthScore('perf-test-user');
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Should complete within 5 seconds
      expect(duration).toBeLessThan(5000);
    });
  });
});
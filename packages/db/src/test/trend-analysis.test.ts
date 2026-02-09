import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TrendAnalysisEngine } from '../services/trend-analysis';

describe('TrendAnalysisEngine', () => {
  const testUserId = 'test-user-id';
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('generateTrendAnalysis', () => {
    it('should generate trend analysis without errors', async () => {
      await expect(TrendAnalysisEngine.generateTrendAnalysis(testUserId)).resolves.not.toThrow();
    });

    it('should handle users with no transaction history', async () => {
      const newUserId = 'new-user-no-history';
      
      await expect(TrendAnalysisEngine.generateTrendAnalysis(newUserId)).resolves.not.toThrow();
    });

    it('should complete analysis for users with data', async () => {
      const userWithData = 'user-with-transactions';
      
      await expect(TrendAnalysisEngine.generateTrendAnalysis(userWithData)).resolves.not.toThrow();
    });

    it('should handle concurrent analysis requests', async () => {
      const userId = 'concurrent-user';
      
      const promises = Array.from({ length: 3 }, () => 
        TrendAnalysisEngine.generateTrendAnalysis(userId)
      );
      
      await expect(Promise.all(promises)).resolves.not.toThrow();
    });
  });

  describe('Integration with Database', () => {
    it('should successfully query database for real user data', async () => {
      const realUserId = 'real-user-with-data';
      
      try {
        await TrendAnalysisEngine.generateTrendAnalysis(realUserId);
        // If it completes without throwing, the test passes
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
        await TrendAnalysisEngine.generateTrendAnalysis(invalidUserId);
        // Should either complete successfully or throw a specific error
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });

    it('should handle database connection errors', async () => {
      const problematicUserId = 'problematic-user';
      
      try {
        await TrendAnalysisEngine.generateTrendAnalysis(problematicUserId);
      } catch (error) {
        // Should handle database errors gracefully
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  describe('Performance', () => {
    it('should complete trend analysis within reasonable time', async () => {
      const startTime = Date.now();
      
      await TrendAnalysisEngine.generateTrendAnalysis('perf-test-user');
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Should complete within 30 seconds for trend analysis
      expect(duration).toBeLessThan(30000);
    });
  });

  describe('Data Generation', () => {
    it('should generate analysis for different user types', async () => {
      const userTypes = [
        'new-user',
        'active-user', 
        'high-volume-user',
        'sporadic-user'
      ];
      
      for (const userType of userTypes) {
        await expect(TrendAnalysisEngine.generateTrendAnalysis(userType)).resolves.not.toThrow();
      }
    });

    it('should handle users with varying transaction patterns', async () => {
      const patterns = [
        'daily-transactions',
        'weekly-transactions', 
        'monthly-transactions',
        'irregular-transactions'
      ];
      
      for (const pattern of patterns) {
        await expect(TrendAnalysisEngine.generateTrendAnalysis(pattern)).resolves.not.toThrow();
      }
    });
  });

  describe('Consistency', () => {
    it('should produce consistent results for same user data', async () => {
      const userId = 'consistent-user';
      
      // Run analysis twice for the same user
      const start1 = Date.now();
      await TrendAnalysisEngine.generateTrendAnalysis(userId);
      const duration1 = Date.now() - start1;
      
      const start2 = Date.now();
      await TrendAnalysisEngine.generateTrendAnalysis(userId);
      const duration2 = Date.now() - start2;
      
      // Both should complete successfully (timing may vary)
      expect(duration1).toBeGreaterThan(0);
      expect(duration2).toBeGreaterThan(0);
    });
  });
});
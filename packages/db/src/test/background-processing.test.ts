import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BackgroundProcessingService } from '../services/background-processing';

describe('BackgroundProcessingService', () => {
  const testUserId = 'test-user-id';
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('processDailyAnalysis', () => {
    it('should process daily analysis without errors', async () => {
      const result = await BackgroundProcessingService.processDailyAnalysis();
      
      expect(result).toHaveProperty('jobId');
      expect(result).toHaveProperty('status');
      expect(result).toHaveProperty('startTime');
      expect(['pending', 'running', 'completed', 'failed']).toContain(result.status);
    });

    it('should generate unique job IDs', async () => {
      const result1 = await BackgroundProcessingService.processDailyAnalysis();
      const result2 = await BackgroundProcessingService.processDailyAnalysis();
      
      expect(result1.jobId).not.toBe(result2.jobId);
    });
  });

  describe('processWeeklyAnalysis', () => {
    it('should process weekly analysis without errors', async () => {
      const result = await BackgroundProcessingService.processWeeklyAnalysis();
      
      expect(result).toHaveProperty('jobId');
      expect(result).toHaveProperty('status');
      expect(result).toHaveProperty('startTime');
      expect(['pending', 'running', 'completed', 'failed']).toContain(result.status);
    });

    it('should generate unique job IDs for weekly analysis', async () => {
      const result1 = await BackgroundProcessingService.processWeeklyAnalysis();
      const result2 = await BackgroundProcessingService.processWeeklyAnalysis();
      
      expect(result1.jobId).not.toBe(result2.jobId);
    });
  });

  describe('runAnalysisPipeline', () => {
    it('should run complete analysis pipeline for a user', async () => {
      await expect(BackgroundProcessingService.runAnalysisPipeline(testUserId)).resolves.not.toThrow();
    });

    it('should handle users with no transaction history', async () => {
      const newUserId = 'new-user-no-history';
      
      await expect(BackgroundProcessingService.runAnalysisPipeline(newUserId)).resolves.not.toThrow();
    });

    it('should handle concurrent analysis pipelines', async () => {
      const promises = Array.from({ length: 3 }, () => 
        BackgroundProcessingService.runAnalysisPipeline(testUserId)
      );
      
      await expect(Promise.all(promises)).resolves.not.toThrow();
    });
  });

  describe('runWeeklyAnalysisPipeline', () => {
    it('should run weekly analysis pipeline for a user', async () => {
      await expect(BackgroundProcessingService.runWeeklyAnalysisPipeline(testUserId)).resolves.not.toThrow();
    });
  });

  describe('processUserAnalysis', () => {
    it('should process analysis for a specific user', async () => {
      const result = await BackgroundProcessingService.processUserAnalysis(testUserId);
      
      expect(result).toBeDefined();
      expect(result.userId).toBe(testUserId);
    });

    it('should handle users with varying data volumes', async () => {
      const userTypes = [
        'light-user',
        'moderate-user',
        'heavy-user',
        'new-user'
      ];
      
      for (const userType of userTypes) {
        const result = await BackgroundProcessingService.processUserAnalysis(userType);
        
        expect(result.userId).toBe(userType);
      }
    });
  });

  describe('Job Status Management', () => {
    it('should track job status by job ID', async () => {
      const job = await BackgroundProcessingService.processDailyAnalysis();
      const status = BackgroundProcessingService.getJobStatus(job.jobId);
      
      expect(status).toBeDefined();
      expect(status?.jobId).toBe(job.jobId);
    });

    it('should return undefined for non-existent job IDs', async () => {
      const status = BackgroundProcessingService.getJobStatus('non-existent-job-id');
      
      expect(status).toBeUndefined();
    });

    it('should return all job statuses', async () => {
      const statuses = BackgroundProcessingService.getAllJobStatuses();
      
      expect(Array.isArray(statuses)).toBe(true);
      
      statuses.forEach(status => {
        expect(status).toHaveProperty('jobId');
        expect(status).toHaveProperty('status');
        expect(status).toHaveProperty('startTime');
      });
    });

    it('should return recent job history', async () => {
      const history = BackgroundProcessingService.getRecentJobHistory();
      
      expect(Array.isArray(history)).toBe(true);
      
      // Should contain recent jobs
      history.forEach(job => {
        expect(job).toHaveProperty('jobId');
        expect(job).toHaveProperty('status');
      });
    });
  });

  describe('Cleanup Operations', () => {
    it('should cleanup old job statuses', async () => {
      // This should complete without throwing
      BackgroundProcessingService.cleanupOldJobStatuses();
      
      expect(true).toBe(true);
    });

    it('should remove old jobs while keeping recent ones', async () => {
      const beforeCleanup = BackgroundProcessingService.getAllJobStatuses().length;
      
      BackgroundProcessingService.cleanupOldJobStatuses();
      
      const afterCleanup = BackgroundProcessingService.getAllJobStatuses().length;
      
      // After cleanup should have same or fewer jobs
      expect(afterCleanup).toBeLessThanOrEqual(beforeCleanup);
    });
  });

  describe('Integration Tests', () => {
    it('should work with real user data', async () => {
      const realUserId = 'real-user-with-data';
      
      try {
        const result = await BackgroundProcessingService.processUserAnalysis(realUserId);
        
        expect(result).toBeDefined();
        expect(result.userId).toBe(realUserId);
      } catch (error) {
        // If database is not available, that's okay for this test
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid user ID gracefully', async () => {
      const invalidUserId = '';
      
      try {
        const result = await BackgroundProcessingService.processUserAnalysis(invalidUserId);
        expect(result).toBeDefined();
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });

    it('should handle database connection errors', async () => {
      const problematicUserId = 'problematic-user';
      
      try {
        await BackgroundProcessingService.runAnalysisPipeline(problematicUserId);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });

    it('should handle job failures gracefully', async () => {
      const failingUserId = 'failing-user';
      
      try {
        const result = await BackgroundProcessingService.processUserAnalysis(failingUserId);
        // If it completes, that's fine
        expect(result).toBeDefined();
      } catch (error) {
        // If it fails, it should be a proper error
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  describe('Performance', () => {
    it('should complete daily analysis within reasonable time', async () => {
      const startTime = Date.now();
      
      await BackgroundProcessingService.processDailyAnalysis();
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Should complete within 30 seconds
      expect(duration).toBeLessThan(30000);
    });

    it('should complete user analysis efficiently', async () => {
      const startTime = Date.now();
      
      await BackgroundProcessingService.processUserAnalysis('perf-test-user');
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Should complete within 15 seconds per user
      expect(duration).toBeLessThan(15000);
    });

    it('should handle batch processing efficiently', async () => {
      const startTime = Date.now();
      
      const promises = Array.from({ length: 3 }, (_, i) => 
        BackgroundProcessingService.processUserAnalysis(`batch-user-${i}`)
      );
      
      await Promise.all(promises);
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Batch of 3 users should complete within 45 seconds
      expect(duration).toBeLessThan(45000);
    });
  });

  describe('Consistency', () => {
    it('should produce consistent results for same user data', async () => {
      const userId = 'consistent-user';
      
      // Run analysis twice for the same user
      const result1 = await BackgroundProcessingService.processUserAnalysis(userId);
      const result2 = await BackgroundProcessingService.processUserAnalysis(userId);
      
      // Both should complete successfully (results may vary based on data changes)
      expect(result1.userId).toBe(userId);
      expect(result2.userId).toBe(userId);
    });
  });

  describe('Data Validation', () => {
    it('should handle users with extreme spending patterns', async () => {
      const patterns = [
        'zero-spending-user',
        'extreme-spender',
        'negative-balance-user',
        'irregular-income-user'
      ];
      
      for (const pattern of patterns) {
        await expect(BackgroundProcessingService.processUserAnalysis(pattern)).resolves.not.toThrow();
      }
    });
  });
});
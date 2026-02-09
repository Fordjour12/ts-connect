import { db } from "../index";
import { FinancialHealthCalculator } from "./financial-health";
import { TrendAnalysisEngine } from "./trend-analysis";
import { SignalDetectionEngine } from "./signal-detection";
import { EarlyWarningSystem } from "./early-warning";
import { user } from "../schema/auth";

export interface ProcessingResult {
  userId: string;
  success: boolean;
  error?: string;
  duration: number;
  timestamp: Date;
}

export interface BackgroundJobStatus {
  jobId: string;
  type: "daily" | "weekly" | "manual";
  status: "pending" | "running" | "completed" | "failed";
  startedAt: Date;
  completedAt?: Date;
  results: ProcessingResult[];
  error?: string;
}

export class BackgroundProcessingService {
  private static jobStatuses = new Map<string, BackgroundJobStatus>();

  /**
   * Process daily analysis for all active users
   */
  static async processDailyAnalysis(): Promise<BackgroundJobStatus> {
    const jobId = `daily-${Date.now()}`;
    const jobStatus: BackgroundJobStatus = {
      jobId,
      type: "daily",
      status: "pending",
      startedAt: new Date(),
      results: []
    };

    this.jobStatuses.set(jobId, jobStatus);

    try {
      jobStatus.status = "running";
      
      // Get all active users
      const activeUsers = await db.select().from(user);
      
      console.log(`Starting daily analysis for ${activeUsers.length} users`);

      for (const userRecord of activeUsers) {
        const startTime = Date.now();
        
        try {
          // Run analysis pipeline for each user
          await this.runAnalysisPipeline(userRecord.id);
          
          const duration = Date.now() - startTime;
          jobStatus.results.push({
            userId: userRecord.id,
            success: true,
            duration,
            timestamp: new Date()
          });

        } catch (error) {
          const duration = Date.now() - startTime;
          jobStatus.results.push({
            userId: userRecord.id,
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
            duration,
            timestamp: new Date()
          });

          console.error(`Failed to process user ${userRecord.id}:`, error);
        }
      }

      jobStatus.status = "completed";
      jobStatus.completedAt = new Date();
      
      console.log(`Daily analysis completed. Success: ${jobStatus.results.filter(r => r.success).length}, Failed: ${jobStatus.results.filter(r => !r.success).length}`);
      
    } catch (error) {
      jobStatus.status = "failed";
      jobStatus.error = error instanceof Error ? error.message : "Unknown error";
      jobStatus.completedAt = new Date();
      
      console.error("Daily analysis job failed:", error);
    }

    return jobStatus;
  }

  /**
   * Process weekly analysis for all active users
   */
  static async processWeeklyAnalysis(): Promise<BackgroundJobStatus> {
    const jobId = `weekly-${Date.now()}`;
    const jobStatus: BackgroundJobStatus = {
      jobId,
      type: "weekly",
      status: "pending",
      startedAt: new Date(),
      results: []
    };

    this.jobStatuses.set(jobId, jobStatus);

    try {
      jobStatus.status = "running";
      
      // Get all active users
      const activeUsers = await db.select().from(user);
      
      console.log(`Starting weekly analysis for ${activeUsers.length} users`);

      for (const userRecord of activeUsers) {
        const startTime = Date.now();
        
        try {
          // Run enhanced weekly analysis
          await this.runWeeklyAnalysisPipeline(userRecord.id);
          
          const duration = Date.now() - startTime;
          jobStatus.results.push({
            userId: userRecord.id,
            success: true,
            duration,
            timestamp: new Date()
          });

        } catch (error) {
          const duration = Date.now() - startTime;
          jobStatus.results.push({
            userId: userRecord.id,
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
            duration,
            timestamp: new Date()
          });

          console.error(`Failed to process weekly analysis for user ${userRecord.id}:`, error);
        }
      }

      jobStatus.status = "completed";
      jobStatus.completedAt = new Date();
      
      console.log(`Weekly analysis completed. Success: ${jobStatus.results.filter(r => r.success).length}, Failed: ${jobStatus.results.filter(r => !r.success).length}`);
      
    } catch (error) {
      jobStatus.status = "failed";
      jobStatus.error = error instanceof Error ? error.message : "Unknown error";
      jobStatus.completedAt = new Date();
      
      console.error("Weekly analysis job failed:", error);
    }

    return jobStatus;
  }

  /**
   * Run analysis pipeline for a specific user
   */
  static async runAnalysisPipeline(userId: string): Promise<void> {
    // 1. Calculate financial health score
    await FinancialHealthCalculator.calculateHealthScore(userId);

    // 2. Generate trend analysis
    await TrendAnalysisEngine.generateTrendAnalysis(userId);

    // 3. Detect and generate signals
    await SignalDetectionEngine.generateSignals(userId);

    // 4. Generate early warning alerts
    await EarlyWarningSystem.generateAlerts(userId);
  }

  /**
   * Run enhanced weekly analysis pipeline
   */
  static async runWeeklyAnalysisPipeline(userId: string): Promise<void> {
    // Weekly analysis includes all daily analysis plus additional weekly-specific processing
    await this.runAnalysisPipeline(userId);
    
    // Additional weekly-specific processing could include:
    // - Weekly summary generation
    // - Weekly goal progress updates
    // - Weekly budget reconciliation
    // - Long-term trend analysis
    
    console.log(`Weekly analysis completed for user ${userId}`);
  }

  /**
   * Process analysis for a single user (manual trigger)
   */
  static async processUserAnalysis(userId: string): Promise<ProcessingResult> {
    const startTime = Date.now();
    
    try {
      await this.runAnalysisPipeline(userId);
      
      return {
        userId,
        success: true,
        duration: Date.now() - startTime,
        timestamp: new Date()
      };
    } catch (error) {
      return {
        userId,
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        duration: Date.now() - startTime,
        timestamp: new Date()
      };
    }
  }

  /**
   * Get job status by ID
   */
  static getJobStatus(jobId: string): BackgroundJobStatus | undefined {
    return this.jobStatuses.get(jobId);
  }

  /**
   * Get all job statuses
   */
  static getAllJobStatuses(): BackgroundJobStatus[] {
    return Array.from(this.jobStatuses.values());
  }

  /**
   * Get recent job history (last 24 hours)
   */
  static getRecentJobHistory(): BackgroundJobStatus[] {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return this.getAllJobStatuses().filter(job => job.startedAt > twentyFourHoursAgo);
  }

  /**
   * Clean up old job statuses (older than 7 days)
   */
  static cleanupOldJobStatuses(): void {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    for (const [jobId, jobStatus] of this.jobStatuses.entries()) {
      if (jobStatus.startedAt < sevenDaysAgo) {
        this.jobStatuses.delete(jobId);
      }
    }
  }

  /**
   * Schedule daily analysis to run at a specific time
   */
  static scheduleDailyAnalysis(hour: number = 6): void {
    // This would typically integrate with a job scheduler like:
    // - Node.js: node-cron, agenda
    // - Cloud: AWS Lambda, Cloudflare Workers cron
    // - Database: pg_cron (PostgreSQL)
    
    const now = new Date();
    const nextRun = new Date();
    nextRun.setHours(hour, 0, 0, 0);
    
    // If the time has passed today, schedule for tomorrow
    if (now.getHours() >= hour) {
      nextRun.setDate(nextRun.getDate() + 1);
    }
    
    const timeUntilNextRun = nextRun.getTime() - now.getTime();
    
    console.log(`Daily analysis scheduled for ${nextRun.toISOString()} (${Math.round(timeUntilNextRun / (1000 * 60 * 60))} hours from now)`);
    
    // In a real implementation, you would set up a proper scheduler here
    setTimeout(async () => {
      await this.processDailyAnalysis();
      // Schedule the next run
      this.scheduleDailyAnalysis(hour);
    }, timeUntilNextRun);
  }

  /**
   * Schedule weekly analysis to run on Sundays at a specific time
   */
  static scheduleWeeklyAnalysis(hour: number = 2): void {
    const now = new Date();
    const daysUntilSunday = (7 - now.getDay()) % 7;
    const nextRun = new Date();
    nextRun.setDate(now.getDate() + (daysUntilSunday || 7));
    nextRun.setHours(hour, 0, 0, 0);
    
    const timeUntilNextRun = nextRun.getTime() - now.getTime();
    
    console.log(`Weekly analysis scheduled for ${nextRun.toISOString()} (${Math.round(timeUntilNextRun / (1000 * 60 * 60 * 24))} days from now)`);
    
    // In a real implementation, you would set up a proper scheduler here
    setTimeout(async () => {
      await this.processWeeklyAnalysis();
      // Schedule the next run
      this.scheduleWeeklyAnalysis(hour);
    }, timeUntilNextRun);
  }

  /**
   * Get processing statistics
   */
  static getProcessingStatistics(): {
    totalJobs: number;
    successfulJobs: number;
    failedJobs: number;
    averageDuration: number;
    totalUsersProcessed: number;
  } {
    const recentJobs = this.getRecentJobHistory();
    
    const totalJobs = recentJobs.length;
    const successfulJobs = recentJobs.filter(job => job.status === "completed").length;
    const failedJobs = recentJobs.filter(job => job.status === "failed").length;
    
    const totalDuration = recentJobs.reduce((sum, job) => 
      sum + job.results.reduce((jobSum, result) => jobSum + result.duration, 0), 0
    );
    
    const averageDuration = totalJobs > 0 ? totalDuration / totalJobs : 0;
    
    const totalUsersProcessed = recentJobs.reduce((sum, job) => 
      sum + job.results.filter(result => result.success).length, 0
    );
    
    return {
      totalJobs,
      successfulJobs,
      failedJobs,
      averageDuration,
      totalUsersProcessed
    };
  }
}
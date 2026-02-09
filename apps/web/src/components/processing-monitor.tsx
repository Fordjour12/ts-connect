import { useEffect, useState } from "react";
import { Activity, Clock, CheckCircle, XCircle, AlertTriangle, BarChart3 } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface ProcessingJob {
  jobId: string;
  type: "daily" | "weekly" | "manual";
  status: "pending" | "running" | "completed" | "failed";
  startedAt: string;
  completedAt?: string;
  results: ProcessingResult[];
  error?: string;
}

interface ProcessingResult {
  userId: string;
  success: boolean;
  duration: number;
  timestamp: string;
  error?: string;
}

interface ProcessingStatistics {
  totalJobs: number;
  successfulJobs: number;
  failedJobs: number;
  averageDuration: number;
  totalUsersProcessed: number;
}

export function ProcessingMonitor() {
  const [jobs, setJobs] = useState<ProcessingJob[]>([]);
  const [statistics, setStatistics] = useState<ProcessingStatistics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMonitoringData();
    // Refresh every 30 seconds
    const interval = setInterval(fetchMonitoringData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchMonitoringData = async () => {
    try {
      setLoading(true);
      
      // Mock data for demonstration
      const mockJobs: ProcessingJob[] = [
        {
          jobId: "daily-1736371200000",
          type: "daily",
          status: "completed",
          startedAt: new Date(Date.now() - 3600000).toISOString(),
          completedAt: new Date(Date.now() - 3000000).toISOString(),
          results: [
            { userId: "user1", success: true, duration: 1200, timestamp: new Date().toISOString() },
            { userId: "user2", success: true, duration: 890, timestamp: new Date().toISOString() },
            { userId: "user3", success: false, duration: 500, timestamp: new Date().toISOString(), error: "Database timeout" }
          ]
        },
        {
          jobId: "weekly-1736284800000",
          type: "weekly",
          status: "completed",
          startedAt: new Date(Date.now() - 86400000).toISOString(),
          completedAt: new Date(Date.now() - 86000000).toISOString(),
          results: [
            { userId: "user1", success: true, duration: 2100, timestamp: new Date().toISOString() },
            { userId: "user2", success: true, duration: 1890, timestamp: new Date().toISOString() },
            { userId: "user3", success: true, duration: 1650, timestamp: new Date().toISOString() }
          ]
        }
      ];

      const mockStats: ProcessingStatistics = {
        totalJobs: 24,
        successfulJobs: 22,
        failedJobs: 2,
        averageDuration: 1450,
        totalUsersProcessed: 156
      };

      setJobs(mockJobs);
      setStatistics(mockStats);
    } catch (error) {
      console.error("Failed to fetch monitoring data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "failed": return <XCircle className="h-4 w-4 text-red-500" />;
      case "running": return <Activity className="h-4 w-4 text-blue-500 animate-pulse" />;
      case "pending": return <Clock className="h-4 w-4 text-yellow-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-500";
      case "failed": return "bg-red-500";
      case "running": return "bg-blue-500";
      case "pending": return "bg-yellow-500";
      default: return "bg-gray-500";
    }
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Processing Monitor</CardTitle>
          <CardDescription>Loading monitoring data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Overview */}
      {statistics && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Processing Statistics (Last 24h)
            </CardTitle>
            <CardDescription>
              Overview of background processing performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              <div className="space-y-2">
                <div className="text-2xl font-bold">{statistics.totalJobs}</div>
                <p className="text-xs text-muted-foreground">Total Jobs</p>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-green-600">{statistics.successfulJobs}</div>
                <p className="text-xs text-muted-foreground">Successful</p>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-red-600">{statistics.failedJobs}</div>
                <p className="text-xs text-muted-foreground">Failed</p>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold">{formatDuration(statistics.averageDuration)}</div>
                <p className="text-xs text-muted-foreground">Avg Duration</p>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold">{statistics.totalUsersProcessed}</div>
                <p className="text-xs text-muted-foreground">Users Processed</p>
              </div>
            </div>
            
            {/* Success Rate */}
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Success Rate</span>
                <span>{((statistics.successfulJobs / statistics.totalJobs) * 100).toFixed(1)}%</span>
              </div>
              <Progress 
                value={(statistics.successfulJobs / statistics.totalJobs) * 100} 
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Jobs */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Processing Jobs</CardTitle>
          <CardDescription>
            Background job execution history and status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {jobs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="h-8 w-8 mx-auto mb-2" />
                <p>No recent processing jobs</p>
              </div>
            ) : (
              jobs.map((job) => (
                <div key={job.jobId} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(job.status)}
                      <div>
                        <div className="font-medium capitalize">{job.type} Analysis</div>
                        <div className="text-sm text-muted-foreground">
                          {formatRelativeTime(job.startedAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm">
                        {job.results.filter(r => r.success).length} / {job.results.length} users
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {job.completedAt && formatDuration(
                          new Date(job.completedAt).getTime() - new Date(job.startedAt).getTime()
                        )}
                      </div>
                    </div>
                    
                    <Badge variant={
                      job.status === "completed" ? "success" :
                      job.status === "failed" ? "error" :
                      job.status === "running" ? "default" : "secondary"
                    }>
                      {job.status}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* System Health */}
      <Card>
        <CardHeader>
          <CardTitle>System Health</CardTitle>
          <CardDescription>
            Current system status and alerts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Database Connection</span>
              </div>
              <Badge variant="success">Healthy</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Background Jobs</span>
              </div>
              <Badge variant="success">Running</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <span className="text-sm">Error Rate</span>
              </div>
              <Badge variant="warning">8.3% (24h)</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">API Response Time</span>
              </div>
              <Badge variant="success">< 200ms</Badge>
            </div>
          </div>
          
          <div className="mt-6 flex gap-2">
            <Button variant="outline" size="sm" onClick={fetchMonitoringData}>
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
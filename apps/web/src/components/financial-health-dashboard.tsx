import { useEffect, useState } from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  DollarSign,
  PiggyBank,
  Target,
  Activity,
  Clock,
  AlertCircle
} from "lucide-react";

import { getFinancialHealth } from "@/functions/get-financial-health";
import { getInsights } from "@/functions/get-insights";
import { getPeriodSummary } from "@/functions/get-period-summary";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";

export interface FinancialHealthData {
  score: number;
  healthState: "stable" | "improving" | "drifting" | "at_risk";
  trendDirection: "improving" | "stable" | "declining";
  components: {
    savingsRate: number;
    budgetAdherence: number;
    incomeStability: number;
    expenseVolatility: number;
    goalProgress: number;
  };
  previousScore?: number;
}

export interface Insight {
  id: string;
  type: string;
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  explanation: string;
  supportingData: any;
  status: string;
  createdAt: string;
}

export interface PeriodSummary {
  currentPeriod: {
    income: number;
    expenses: number;
    savings: number;
    savingsRate: number;
    transactionCount: number;
    period: string;
  };
  previousPeriod: {
    income: number;
    expenses: number;
    savings: number;
    savingsRate: number;
    transactionCount: number;
    period: string;
  };
  comparison: {
    incomeChange: number;
    expenseChange: number;
    savingsChange: number;
    savingsRateChange: number;
    transactionChange: number;
  };
  trends: {
    incomeTrend: "stable" | "increasing" | "decreasing";
    expenseTrend: "stable" | "increasing" | "decreasing";
    savingsTrend: "stable" | "increasing" | "decreasing";
  };
}

export function FinancialHealthDashboard() {
  const [healthData, setHealthData] = useState<FinancialHealthData | null>(null);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [periodSummary, setPeriodSummary] = useState<PeriodSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch all dashboard data in parallel
        const [healthResponse, insightsResponse, summaryResponse] = await Promise.all([
          getFinancialHealth(),
          getInsights(),
          getPeriodSummary()
        ]);

        if (healthResponse.success) {
          setHealthData(healthResponse.data);
        }
        
        if (insightsResponse.success) {
          const typedInsights = insightsResponse.data.map((insight: any) => ({
            ...insight,
            severity: insight.severity as "low" | "medium" | "high" | "critical"
          }));
          setInsights(typedInsights);
        }
        
        if (summaryResponse.success) {
          const typedSummary = {
            ...summaryResponse.data,
            trends: {
              incomeTrend: summaryResponse.data.trends.incomeTrend as "stable" | "increasing" | "decreasing",
              expenseTrend: summaryResponse.data.trends.expenseTrend as "stable" | "increasing" | "decreasing",
              savingsTrend: summaryResponse.data.trends.savingsTrend as "stable" | "increasing" | "decreasing"
            }
          };
          setPeriodSummary(typedSummary);
        }
      } catch (err) {
        setError("Failed to load dashboard data");
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Loading...</CardTitle>
                <div className="h-4 w-4 bg-muted rounded" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">...</div>
                <p className="text-xs text-muted-foreground">Loading...</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  const getHealthStateIcon = (state: string) => {
    switch (state) {
      case "stable": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "improving": return <TrendingUp className="h-4 w-4 text-blue-600" />;
      case "drifting": return <Activity className="h-4 w-4 text-yellow-600" />;
      case "at_risk": return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  return (
    <div className="space-y-6">
      {/* Health Score Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Financial Health Score</CardTitle>
              <CardDescription>
                Your overall financial wellness based on key metrics
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">{healthData?.score || 0}</div>
              <div className="flex items-center gap-2 mt-1">
                {healthData && getHealthStateIcon(healthData.healthState)}
                <span className="text-sm font-medium capitalize">
                  {healthData?.healthState.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Savings Rate</span>
                <span>{healthData?.components.savingsRate.toFixed(0) || 0}%</span>
              </div>
              <Progress value={healthData?.components.savingsRate || 0} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Budget Adherence</span>
                <span>{healthData?.components.budgetAdherence.toFixed(0) || 0}%</span>
              </div>
              <Progress value={healthData?.components.budgetAdherence || 0} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Income Stability</span>
                <span>{healthData?.components.incomeStability.toFixed(0) || 0}%</span>
              </div>
              <Progress value={healthData?.components.incomeStability || 0} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Expense Control</span>
                <span>{healthData?.components.expenseVolatility.toFixed(0) || 0}%</span>
              </div>
              <Progress value={healthData?.components.expenseVolatility || 0} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Goal Progress</span>
                <span>{healthData?.components.goalProgress.toFixed(0) || 0}%</span>
              </div>
              <Progress value={healthData?.components.goalProgress || 0} className="h-2" />
            </div>
          </div>
          
          {healthData?.previousScore && (
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              {healthData.score > healthData.previousScore ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
              <span>
                {healthData.score > healthData.previousScore ? 'Improved' : 'Declined'} by{' '}
                {Math.abs(healthData.score - healthData.previousScore)} points from last month
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {periodSummary && formatCurrency(periodSummary.currentPeriod.income)}
            </div>
            {periodSummary && (
              <p className="text-xs text-muted-foreground">
                <span className={periodSummary.comparison.incomeChange >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {formatPercentage(periodSummary.comparison.incomeChange)}
                </span>{' '}
                from last month
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Expenses</CardTitle>
            <PiggyBank className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {periodSummary && formatCurrency(periodSummary.currentPeriod.expenses)}
            </div>
            {periodSummary && (
              <p className="text-xs text-muted-foreground">
                <span className={periodSummary.comparison.expenseChange >= 0 ? 'text-red-600' : 'text-green-600'}>
                  {formatPercentage(periodSummary.comparison.expenseChange)}
                </span>{' '}
                from last month
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Savings</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {periodSummary && formatCurrency(periodSummary.currentPeriod.savings)}
            </div>
            {periodSummary && (
              <p className="text-xs text-muted-foreground">
                <span className={periodSummary.comparison.savingsChange >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {formatPercentage(periodSummary.comparison.savingsChange)}
                </span>{' '}
                from last month
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Savings Rate</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {periodSummary && `${periodSummary.currentPeriod.savingsRate.toFixed(1)}%`}
            </div>
            {periodSummary && (
              <p className="text-xs text-muted-foreground">
                <span className={periodSummary.comparison.savingsRateChange >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {formatPercentage(periodSummary.comparison.savingsRateChange)}
                </span>{' '}
                from last month
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Active Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Financial Insights</CardTitle>
          <CardDescription>
            AI-generated insights and recommendations based on your financial data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insights.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                <p>No active insights - your finances are looking good!</p>
              </div>
            ) : (
              insights.map((insight) => (
                <div key={insight.id} className="flex items-start gap-4 p-4 rounded-lg border">
                  <div className="mt-1">
                    {insight.severity === "critical" && <AlertTriangle className="h-5 w-5 text-red-500" />}
                    {insight.severity === "high" && <AlertCircle className="h-5 w-5 text-orange-500" />}
                    {insight.severity === "medium" && <Clock className="h-5 w-5 text-yellow-500" />}
                    {insight.severity === "low" && <Activity className="h-5 w-5 text-blue-500" />}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">{insight.title}</h4>
                      <Badge variant="default">
                        {insight.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{insight.explanation}</p>
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" variant="outline">View Details</Button>
                      <Button size="sm" variant="ghost">Create Task</Button>
                      <Button size="sm" variant="ghost">Dismiss</Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
"use client"

import { createFileRoute } from "@tanstack/react-router";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Circle,
} from "lucide-react";
import {
  FinancialTrendChart,
  ExpenseChartCard,
  Metric,
  ScoreBar,
  InsightRow,
  TodoRow,
  ResourceRow,
} from "@/components/route-5";

export const Route = createFileRoute("/5")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="space-y-4 p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-4xl tracking-tight [font-family:Fraunces,serif]">
              Overview
            </h2>
            <div className="flex items-center gap-2">
              <Badge variant="success" className="text-xs">
                <TrendingUp className="w-3 h-3 mr-1" />
                Healthy
              </Badge>
            </div>
          </div>

          {/* Main Financial Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl [font-family:Fraunces,serif]">
                € 6,245.01
              </CardTitle>
              <CardDescription className="flex items-center gap-2">
                <span className="text-success">€ 242.53</span>
                <span>vs prev. month</span>
                <Badge variant="success">+3.34%</Badge>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FinancialTrendChart />
              <div className="grid gap-4 sm:grid-cols-2">
                <Metric
                  label="Income"
                  value="€ 8,234.94"
                  tone="success"
                  trend="+5.2%"
                />
                <Metric
                  label="Expenses"
                  value="€ 1,989.93"
                  tone="warning"
                  trend="-2.1%"
                />
              </div>
            </CardContent>
          </Card>

          {/* Financial Health Score */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="[font-family:Fraunces,serif]">
                  Financial Health Score
                </span>
                <Badge variant="success" className="ml-auto">
                  85/100
                </Badge>
              </CardTitle>
              <CardDescription>
                Your overall financial wellness based on key metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <ScoreBar label="Savings Rate" value={78} />
                <ScoreBar label="Budget Adherence" value={92} />
                <ScoreBar label="Income Stability" value={88} />
                <ScoreBar label="Expense Control" value={76} />
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
            {/* Expense Breakdown Chart */}
            <ExpenseChartCard />

            {/* Recent Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="[font-family:Fraunces,serif]">
                  Recent Insights
                </CardTitle>
                <CardDescription>
                  AI-generated recommendations based on your financial data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <InsightRow
                  type="success"
                  icon={TrendingUp}
                  title="Great savings progress!"
                  detail="Your savings rate increased by 15% this month."
                />
                <InsightRow
                  type="warning"
                  icon={AlertTriangle}
                  title="Dining expenses trending up"
                  detail="Consider reviewing your restaurant budget for next month."
                />
                <InsightRow
                  type="info"
                  icon={Circle}
                  title="Goal milestone reached"
                  detail="You're 75% towards your emergency fund goal."
                />
              </CardContent>
            </Card>
          </div>

          {/* Action Items and Resources */}
          <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
            <Card>
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle className="">Action Items</CardTitle>
                <ArrowRight className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="space-y-2">
                <TodoRow
                  title="Review monthly budget allocation"
                  detail="Adjust categories based on recent spending patterns."
                />
                <TodoRow
                  title="Update emergency fund goal"
                  detail="Increase target based on improved savings rate."
                />
                <TodoRow
                  title="Analyze dining expense increase"
                  detail="Review restaurant and food delivery spending."
                />
                <TodoRow
                  title="Set quarterly financial review"
                  detail="Schedule comprehensive financial health check."
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="">Recommended Resources</CardTitle>
                <CardDescription>
                  Resources matched to your financial goals
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <ResourceRow
                  title="Budget Optimization Guide"
                  subtitle="Strategies to improve your savings rate by 10-15%."
                />
                <ResourceRow
                  title="Emergency Fund Calculator"
                  subtitle="Determine the right emergency fund size for your situation."
                />
                <ResourceRow
                  title="Expense Tracking Best Practices"
                  subtitle="Learn effective methods to monitor and control spending."
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
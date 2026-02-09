"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Pie, PieChart } from "recharts";
import { TrendingUp } from "lucide-react";
import { expenseData, chartConfig } from "./data";

export function ExpenseChartCard() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Expense Breakdown</CardTitle>
        <CardDescription>Current month spending by category</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={expenseData}
              dataKey="amount"
              labelLine={false}
              outerRadius={80}
              innerRadius={40}
              paddingAngle={2}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          <TrendingUp className="h-4 w-4" />
          €3,500 total expenses this month
        </div>
        <div className="text-muted-foreground leading-none">
          12% decrease from last month
        </div>
      </CardFooter>
    </Card>
  );
}
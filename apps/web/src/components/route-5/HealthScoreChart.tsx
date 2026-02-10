"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Rectangle } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const chartData = [
  { label: "Savings Rate", value: 78, color: "var(--color-success)" },
  { label: "Budget Adherence", value: 92, color: "var(--color-success)" },
  { label: "Income Stability", value: 88, color: "var(--color-success)" },
  { label: "Expense Control", value: 76, color: "var(--color-warning)" },
]

const chartConfig = {
  value: {
    label: "Score",
  },
} satisfies ChartConfig

export function HealthScoreChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="">
            Financial Health Score
          </span>
        </CardTitle>
        <CardDescription>
          Your overall financial wellness based on key metrics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          >
            <CartesianGrid horizontal={false} stroke="var(--color-border)" />
            <XAxis type="number" domain={[0, 100]} hide />
            <YAxis
              dataKey="label"
              type="category"
              tickLine={false}
              axisLine={false}
              width={120}
              tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
            />
            <ChartTooltip
              cursor={{ fill: "var(--color-muted)", opacity: 0.2 }}
              content={
                <ChartTooltipContent
                  formatter={(value: unknown) => [`${value}/100` as string, "Score"]}
                />
              }
            />
            <Bar
              dataKey="value"
              radius={[0, 4, 4, 0,]}
              maxBarSize={30}
              fill="var(--color-chart-1)"
            />
            {/*<Bar
              dataKey="visitors"
              strokeWidth={2}
              radius={8}
              activeIndex={2}
              activeBar={({ ...props }) => {
                return (
                  <Rectangle
                    {...props}
                    fillOpacity={0.8}
                    stroke={props.payload.fill}
                    strokeDasharray={4}
                    strokeDashoffset={4}
                  />
                )
              }}
            />*/}
          </BarChart>


        </ChartContainer>
        <div className="mt-4 text-center">
          <span className="text-3xl font-bold text-success">85</span>
          <span className="text-muted-foreground">/100</span>
        </div>
      </CardContent>
    </Card >
  )
}

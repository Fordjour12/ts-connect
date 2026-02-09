"use client"

import { Badge } from "@/components/ui/badge";

export function Metric({
  label,
  value,
  tone,
  trend,
}: {
  label: string;
  value: string;
  tone: "success" | "warning";
  trend?: string;
}) {
  return (
    <div className="rounded-lg border bg-background p-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        {trend && (
          <Badge
            variant={tone === "success" ? "success" : "warning"}
            className="text-xs"
          >
            {trend}
          </Badge>
        )}
      </div>
      <p
        className={
          tone === "success"
            ? "text-xl font-semibold text-success"
            : "text-xl font-semibold text-warning"
        }
      >
        {value}
      </p>
    </div>
  );
}
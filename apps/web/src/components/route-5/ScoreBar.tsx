"use client"

export function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span className="text-muted-foreground">{value}%</span>
      </div>
      <div className="w-full bg-secondary rounded-full h-2">
        <div
          className={`h-2 rounded-full ${
            value >= 80
              ? "bg-success"
              : value >= 60
                ? "bg-warning"
                : "bg-destructive"
          }`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
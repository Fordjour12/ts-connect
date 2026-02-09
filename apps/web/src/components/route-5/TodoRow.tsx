"use client"

import { Circle } from "lucide-react";

export function TodoRow({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border bg-background p-3">
      <Circle className="mt-0.5 size-4 text-muted-foreground" />
      <div>
        <p className="font-medium text-sm">{title}</p>
        <p className="text-xs text-muted-foreground">{detail}</p>
      </div>
    </div>
  );
}
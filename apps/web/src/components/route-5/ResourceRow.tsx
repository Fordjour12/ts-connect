"use client"

import { Inbox } from "lucide-react";

export function ResourceRow({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="rounded-xl border bg-secondary p-3">
      <div className="mb-1 flex items-center gap-2">
        <Inbox className="size-4 text-muted-foreground" />
        <p className="font-medium text-sm">{title}</p>
      </div>
      <p className="text-xs text-muted-foreground">{subtitle}</p>
    </div>
  );
}
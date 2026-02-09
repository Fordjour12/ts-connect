"use client"

export function InsightRow({
  type,
  icon: Icon,
  title,
  detail,
}: {
  type: "success" | "warning" | "info";
  icon: any;
  title: string;
  detail: string;
}) {
  const typeStyles = {
    success: "border-success/20 bg-success/5",
    warning: "border-warning/20 bg-warning/5",
    info: "border-info/20 bg-info/5",
  };

  return (
    <div
      className={`flex items-start gap-3 rounded-xl border p-3 ${typeStyles[type]}`}
    >
      <Icon
        className={`mt-0.5 size-4 ${
          type === "success"
            ? "text-success"
            : type === "warning"
              ? "text-warning"
              : "text-info"
        }`}
      />
      <div>
        <p className="font-medium text-sm">{title}</p>
        <p className="text-xs text-muted-foreground">{detail}</p>
      </div>
    </div>
  );
}
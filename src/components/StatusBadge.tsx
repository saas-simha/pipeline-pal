import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "success" | "failed" | "running" | "pending";
  className?: string;
}

const statusConfig = {
  success: { label: "Success", dotClass: "status-dot status-success", textClass: "text-[hsl(var(--success))]" },
  failed: { label: "Failed", dotClass: "status-dot status-failed", textClass: "text-destructive" },
  running: { label: "Running", dotClass: "status-dot status-running", textClass: "text-[hsl(var(--warning))]" },
  pending: { label: "Pending", dotClass: "status-dot bg-muted-foreground", textClass: "text-muted-foreground" },
};

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={config.dotClass} />
      <span className={cn("text-xs font-medium font-mono", config.textClass)}>{config.label}</span>
    </div>
  );
}

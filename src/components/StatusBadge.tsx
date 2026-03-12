import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "success" | "failed" | "running" | "pending";
  className?: string;
}

const statusConfig = {
  success: {
    label: "Success",
    dotClass: "status-dot status-success",
    textClass: "text-success",
    bgClass: "bg-success/10",
  },
  failed: {
    label: "Failed",
    dotClass: "status-dot status-failed",
    textClass: "text-destructive",
    bgClass: "bg-destructive/10",
  },
  running: {
    label: "Running",
    dotClass: "status-dot status-running",
    textClass: "text-warning",
    bgClass: "bg-warning/10",
  },
  pending: {
    label: "Pending",
    dotClass: "status-dot status-pending",
    textClass: "text-muted-foreground",
    bgClass: "bg-muted",
  },
};

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <div className={cn("flex items-center gap-2 px-2.5 py-1 rounded-full", config.bgClass, className)}>
      <div className={config.dotClass} />
      <span className={cn("text-[11px] font-medium font-mono", config.textClass)}>{config.label}</span>
    </div>
  );
}

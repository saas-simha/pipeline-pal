import { FolderGit2, Workflow, Server, CheckCircle2, Loader2, Circle, XCircle, ChevronRight } from "lucide-react";

export type StageStatus = "idle" | "running" | "success" | "failed";

interface PipelineFlowBarProps {
  sourceStatus: StageStatus;
  pipelineStatus: StageStatus;
  targetStatus: StageStatus;
  activeStage: "source" | "pipeline" | "target";
  onStageClick: (stage: "source" | "pipeline" | "target") => void;
}

function StageIcon({ status }: { status: StageStatus }) {
  if (status === "success") return <CheckCircle2 className="h-4 w-4 text-success" />;
  if (status === "running") return <Loader2 className="h-4 w-4 text-warning animate-spin" />;
  if (status === "failed") return <XCircle className="h-4 w-4 text-destructive" />;
  return <Circle className="h-4 w-4 text-muted-foreground" />;
}

function connectorClass(leftStatus: StageStatus, rightStatus: StageStatus) {
  if (leftStatus === "success" && (rightStatus === "running" || rightStatus === "success"))
    return "bg-success";
  if (leftStatus === "success") return "bg-success/40";
  return "bg-border";
}

export default function PipelineFlowBar({
  sourceStatus,
  pipelineStatus,
  targetStatus,
  activeStage,
  onStageClick,
}: PipelineFlowBarProps) {
  const stages = [
    { key: "source" as const, label: "Source", sublabel: "Repository", icon: FolderGit2, status: sourceStatus },
    { key: "pipeline" as const, label: "Pipeline", sublabel: "Build & Test", icon: Workflow, status: pipelineStatus },
    { key: "target" as const, label: "Target", sublabel: "Deploy", icon: Server, status: targetStatus },
  ];

  return (
    <div className="flex items-center justify-center gap-0 py-2">
      {stages.map((stage, i) => (
        <div key={stage.key} className="flex items-center">
          <button
            onClick={() => onStageClick(stage.key)}
            className={`relative flex items-center gap-3 px-6 py-3.5 rounded-lg bg-card border-2 transition-all hover:shadow-md cursor-pointer ${
              activeStage === stage.key
                ? "border-primary shadow-[0_0_16px_hsl(var(--primary)/0.15)]"
                : stage.status === "success"
                ? "border-success/30"
                : stage.status === "running"
                ? "border-warning/40"
                : stage.status === "failed"
                ? "border-destructive/30"
                : "border-border hover:border-muted-foreground/30"
            }`}
          >
            <div className={`p-2 rounded-md ${
              activeStage === stage.key ? "bg-primary/10" : "bg-secondary"
            }`}>
              <stage.icon className={`h-4 w-4 ${
                activeStage === stage.key ? "text-primary" : "text-muted-foreground"
              }`} />
            </div>
            <div className="text-left">
              <span className="text-sm font-semibold block">{stage.label}</span>
              <span className="text-[10px] text-muted-foreground">{stage.sublabel}</span>
            </div>
            <StageIcon status={stage.status} />
          </button>
          {i < stages.length - 1 && (
            <div className="flex items-center mx-2">
              <div className={`w-6 h-0.5 transition-colors ${connectorClass(stages[i].status, stages[i + 1].status)}`} />
              <ChevronRight className={`h-4 w-4 -ml-1 ${
                stages[i].status === "success" ? "text-success" : "text-muted-foreground"
              }`} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

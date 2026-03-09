import { FolderGit2, Workflow, Server, CheckCircle2, Loader2, Circle } from "lucide-react";

export type StageStatus = "idle" | "running" | "success" | "failed";

interface PipelineFlowBarProps {
  sourceStatus: StageStatus;
  pipelineStatus: StageStatus;
  targetStatus: StageStatus;
  activeStage: "source" | "pipeline" | "target";
  onStageClick: (stage: "source" | "pipeline" | "target") => void;
}

function StageIcon({ status }: { status: StageStatus }) {
  if (status === "success") return <CheckCircle2 className="h-4 w-4 text-[hsl(var(--success))]" />;
  if (status === "running") return <Loader2 className="h-4 w-4 text-[hsl(var(--warning))] animate-spin" />;
  if (status === "failed") return <CheckCircle2 className="h-4 w-4 text-destructive" />;
  return <Circle className="h-4 w-4 text-muted-foreground" />;
}

function stageRingClass(status: StageStatus, active: boolean) {
  if (active) return "ring-2 ring-primary border-primary";
  if (status === "success") return "border-[hsl(var(--success)/0.4)]";
  if (status === "running") return "border-[hsl(var(--warning)/0.4)]";
  if (status === "failed") return "border-destructive/40";
  return "border-border";
}

export default function PipelineFlowBar({
  sourceStatus,
  pipelineStatus,
  targetStatus,
  activeStage,
  onStageClick,
}: PipelineFlowBarProps) {
  const stages = [
    { key: "source" as const, label: "Source", icon: FolderGit2, status: sourceStatus },
    { key: "pipeline" as const, label: "Pipeline", icon: Workflow, status: pipelineStatus },
    { key: "target" as const, label: "Target", icon: Server, status: targetStatus },
  ];

  return (
    <div className="flex items-center justify-center gap-0">
      {stages.map((stage, i) => (
        <div key={stage.key} className="flex items-center">
          <button
            onClick={() => onStageClick(stage.key)}
            className={`flex items-center gap-2.5 px-5 py-3 rounded-lg bg-card border transition-all hover:bg-muted/50 cursor-pointer ${stageRingClass(stage.status, activeStage === stage.key)}`}
          >
            <stage.icon className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">{stage.label}</span>
            <StageIcon status={stage.status} />
          </button>
          {i < stages.length - 1 && (
            <div className="w-10 h-px bg-border relative mx-1">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-l-[5px] border-l-muted-foreground border-y-[4px] border-y-transparent" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

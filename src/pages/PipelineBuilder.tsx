import { useState, useCallback } from "react";
import { Play, Save, RotateCcw, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isDemo } from "@/lib/env";
import { demoPipelineSteps } from "@/lib/demo-data";
import SimulatedDeploy from "@/components/SimulatedDeploy";
import SourcePanel, { type SourceConfig } from "@/components/pipeline/SourcePanel";
import TargetPanel, { type TargetConfig } from "@/components/pipeline/TargetPanel";
import PipelineStepsPanel, { type PipelineStep } from "@/components/pipeline/PipelineStepsPanel";
import PipelineFlowBar, { type StageStatus } from "@/components/pipeline/PipelineFlowBar";
import WorkflowPreview from "@/components/pipeline/WorkflowPreview";

export default function PipelineBuilder() {
  const [activeStage, setActiveStage] = useState<"source" | "pipeline" | "target">("pipeline");

  const [steps, setSteps] = useState<PipelineStep[]>(
    isDemo
      ? demoPipelineSteps
      : [{ id: "1", name: "Checkout Repo", command: "actions/checkout@v3", type: "checkout" }]
  );

  const [source, setSource] = useState<SourceConfig>({
    provider: "GitHub",
    repository: "demo/smarttaskpro",
    branch: "main",
    commit: "a83f9c2",
    trigger: "Push",
    autoTrigger: true,
    accessToken: "",
  });

  const [target, setTarget] = useState<TargetConfig>({
    deployType: "cPanel",
    domain: "smarttaskpro-demo.com",
    server: "ftp.demo-server.com",
    port: "21",
    username: "",
    password: "",
    deployPath: "/public_html",
    environment: "Demo",
  });

  const [running, setRunning] = useState(false);
  const [showYaml, setShowYaml] = useState(false);
  const [stageStatuses, setStageStatuses] = useState<{
    source: StageStatus;
    pipeline: StageStatus;
    target: StageStatus;
  }>({ source: "idle", pipeline: "idle", target: "idle" });

  const handleSourceSave = (config: SourceConfig) => {
    setSource(config);
    setSteps((prev) =>
      prev.map((s) =>
        s.type === "checkout"
          ? {
              ...s,
              name: `Checkout ${config.repository.split("/")[1]} (${config.branch})`,
            }
          : s
      )
    );
  };

  const runPipeline = useCallback(() => {
    setRunning(true);
    setStageStatuses({ source: "running", pipeline: "idle", target: "idle" });

    setTimeout(() => {
      setStageStatuses({ source: "success", pipeline: "running", target: "idle" });
    }, 1200);

    setTimeout(() => {
      setStageStatuses({ source: "success", pipeline: "success", target: "running" });
    }, 4500);
  }, []);

  const handleDeployComplete = useCallback(() => {
    setStageStatuses({ source: "success", pipeline: "success", target: "success" });
    setTimeout(() => {
      setRunning(false);
      setStageStatuses({ source: "idle", pipeline: "idle", target: "idle" });
    }, 2000);
  }, []);

  return (
    <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pipeline Builder</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Design your CI/CD workflow: Source → Pipeline → Target
            {isDemo && <span className="ml-2 text-[hsl(var(--warning))]">(Demo)</span>}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowYaml(!showYaml)}>
            {showYaml ? "Visual" : "YAML"}
          </Button>
          <Button className="gap-2" size="sm">
            <Save className="h-4 w-4" />
            Save
          </Button>
        </div>
      </div>

      {/* Flow Bar */}
      <PipelineFlowBar
        sourceStatus={stageStatuses.source}
        pipelineStatus={stageStatuses.pipeline}
        targetStatus={stageStatuses.target}
        activeStage={activeStage}
        onStageClick={setActiveStage}
      />

      {/* Deployment Controls */}
      <div className="flex items-center justify-center gap-2">
        {isDemo && (
          <>
            <Button
              size="sm"
              className="gap-2"
              onClick={runPipeline}
              disabled={running}
            >
              <Play className="h-4 w-4" />
              Run Pipeline
            </Button>
            <Button variant="outline" size="sm" className="gap-2" disabled={running}>
              <RefreshCw className="h-4 w-4" />
              Redeploy
            </Button>
            <Button variant="outline" size="sm" className="gap-2" disabled={running}>
              <RotateCcw className="h-4 w-4" />
              Rollback
            </Button>
          </>
        )}
      </div>

      {/* Simulated Deploy */}
      {running && (
        <SimulatedDeploy
          projectName={source.repository.split("/")[1] || "Pipeline"}
          onComplete={handleDeployComplete}
        />
      )}

      {/* Stage Panels */}
      {showYaml ? (
        <WorkflowPreview source={source} target={target} steps={steps} />
      ) : (
        <div className="space-y-6">
          {activeStage === "source" && (
            <SourcePanel source={source} onSave={handleSourceSave} />
          )}

          {activeStage === "pipeline" && (
            <PipelineStepsPanel steps={steps} onChange={setSteps} />
          )}

          {activeStage === "target" && (
            <TargetPanel target={target} onSave={setTarget} />
          )}
        </div>
      )}
    </div>
  );
}

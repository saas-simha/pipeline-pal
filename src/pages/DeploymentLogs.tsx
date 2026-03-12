import { CheckCircle2, XCircle, Clock, ChevronDown, GitCommit, GitBranch, Terminal } from "lucide-react";
import { useState } from "react";
import StatusBadge from "@/components/StatusBadge";
import { isDemo } from "@/lib/env";
import { demoDeploymentHistory } from "@/lib/demo-data";

function formatLogLine(log: string) {
  return log.split("\n").map((line, i) => {
    let className = "log-dim";
    if (line.startsWith("✓") || line.includes("passed") || line.includes("complete") || line.includes("uploaded"))
      className = "log-success";
    else if (line.startsWith("ERROR") || line.includes("failed") || line.includes("error"))
      className = "log-error";
    else if (line.includes("npm") || line.includes("Cloning") || line.includes("Uploading"))
      className = "log-info";
    return (
      <div key={i} className={className}>
        <span className="log-dim select-none mr-3">{String(i + 1).padStart(2, "0")}</span>
        {line}
      </div>
    );
  });
}

export default function DeploymentLogs() {
  const deployLogs = demoDeploymentHistory;
  const [expanded, setExpanded] = useState<string | null>(deployLogs[0]?.id ?? null);

  return (
    <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Deployment Logs</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Monitor your deployment pipeline execution
          {isDemo && <span className="ml-2 text-warning">(Demo Data)</span>}
        </p>
      </div>

      <div className="space-y-3">
        {deployLogs.map((log) => (
          <div key={log.id} className="bg-card border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => setExpanded(expanded === log.id ? null : log.id)}
              className="w-full flex items-center gap-4 px-5 py-4 hover:bg-muted/30 transition-colors text-left"
            >
              <StatusBadge status={log.status} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">
                  {log.project}
                  <span className="text-muted-foreground font-normal ml-2">#{log.id}</span>
                </p>
                <div className="flex items-center gap-3 mt-0.5">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground font-mono">
                    <GitBranch className="h-3 w-3" />
                    {log.branch}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground font-mono">
                    <GitCommit className="h-3 w-3" />
                    {log.commit}
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs text-muted-foreground">{log.time}</p>
                <p className="text-xs font-mono text-muted-foreground mt-0.5">{log.duration}</p>
              </div>
              <ChevronDown
                className={`h-4 w-4 text-muted-foreground transition-transform ${
                  expanded === log.id ? "rotate-180" : ""
                }`}
              />
            </button>

            {expanded === log.id && (
              <div className="border-t border-border animate-fade-in">
                {/* Step progress bar */}
                <div className="flex items-center gap-0 px-5 py-3 border-b border-border bg-muted/20">
                  {log.steps.map((step, i) => (
                    <div key={i} className="flex items-center">
                      <div className="flex items-center gap-1.5">
                        {step.status === "success" && <CheckCircle2 className="h-3.5 w-3.5 text-success" />}
                        {step.status === "failed" && <XCircle className="h-3.5 w-3.5 text-destructive" />}
                        {step.status === "running" && <Clock className="h-3.5 w-3.5 text-warning animate-pulse" />}
                        <span className="text-[11px] font-mono text-muted-foreground">{step.name}</span>
                        <span className="text-[10px] font-mono text-muted-foreground/60 ml-1">{step.duration}</span>
                      </div>
                      {i < log.steps.length - 1 && <div className="w-4 h-px bg-border mx-2" />}
                    </div>
                  ))}
                </div>

                {/* Log output */}
                <div className="px-5 py-4 space-y-3">
                  {log.steps.map((step, i) => (
                    <div key={i}>
                      <div className="flex items-center gap-2 mb-2">
                        {step.status === "success" && <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0" />}
                        {step.status === "failed" && <XCircle className="h-3.5 w-3.5 text-destructive shrink-0" />}
                        {step.status === "running" && <Clock className="h-3.5 w-3.5 text-warning animate-pulse shrink-0" />}
                        <span className="text-xs font-semibold">{step.name}</span>
                        <span className="text-[10px] font-mono text-muted-foreground ml-auto">{step.duration}</span>
                      </div>
                      {step.log && (
                        <div className="terminal-output ml-5 mb-3">
                          {formatLogLine(step.log)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

import { CheckCircle2, XCircle, Clock, ChevronDown, GitCommit, GitBranch } from "lucide-react";
import { useState } from "react";
import StatusBadge from "@/components/StatusBadge";
import { isDemo } from "@/lib/env";
import { demoDeploymentHistory } from "@/lib/demo-data";

export default function DeploymentLogs() {
  const deployLogs = demoDeploymentHistory;
  const [expanded, setExpanded] = useState<string | null>(deployLogs[0]?.id ?? null);

  return (
    <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Deployment Logs</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Monitor your deployment pipeline execution
          {isDemo && <span className="ml-2 text-[hsl(var(--warning))]">(Demo Data)</span>}
        </p>
      </div>

      <div className="space-y-3">
        {deployLogs.map((log) => (
          <div key={log.id} className="bg-card border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => setExpanded(expanded === log.id ? null : log.id)}
              className="w-full flex items-center gap-4 px-5 py-4 hover:bg-secondary/20 transition-colors text-left"
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
              <div className="border-t border-border/30 px-5 py-4 space-y-2 animate-fade-in">
                {log.steps.map((step, i) => (
                  <div key={i}>
                    <div className="flex items-center gap-3 py-2">
                      {step.status === "success" && <CheckCircle2 className="h-4 w-4 text-[hsl(var(--success))] shrink-0" />}
                      {step.status === "failed" && <XCircle className="h-4 w-4 text-destructive shrink-0" />}
                      {step.status === "running" && <Clock className="h-4 w-4 text-[hsl(var(--warning))] animate-pulse shrink-0" />}
                      <span className="text-sm flex-1">{step.name}</span>
                      <span className="text-xs font-mono text-muted-foreground">{step.duration}</span>
                    </div>
                    {step.log && (
                      <div className="ml-7 mb-2 p-3 rounded bg-background/50 border border-border/30">
                        <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap leading-relaxed">
                          {step.log}
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

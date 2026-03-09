import { CheckCircle2, XCircle, Clock, ChevronDown, GitCommit, GitBranch } from "lucide-react";
import { useState } from "react";
import StatusBadge from "@/components/StatusBadge";

interface LogEntry {
  id: string;
  project: string;
  branch: string;
  commit: string;
  status: "success" | "failed" | "running";
  time: string;
  duration: string;
  steps: { name: string; status: "success" | "failed" | "running"; duration: string; log?: string }[];
}

const deployLogs: LogEntry[] = [
  {
    id: "1",
    project: "SmartTaskPro",
    branch: "main",
    commit: "a3f8c2d",
    status: "success",
    time: "3 min ago",
    duration: "1m 42s",
    steps: [
      { name: "Checkout Repo", status: "success", duration: "2s", log: "Cloning repository...\nChecked out branch 'main' at a3f8c2d" },
      { name: "Install Dependencies", status: "success", duration: "34s", log: "npm install\nadded 1423 packages in 34s" },
      { name: "Build", status: "success", duration: "48s", log: "npm run build\n✓ 142 modules transformed\n✓ built in 48s" },
      { name: "Deploy to FTP", status: "success", duration: "18s", log: "Uploading to ftp.example.com\n142 files uploaded\nDeploy complete!" },
    ],
  },
  {
    id: "2",
    project: "EcommerceAPI",
    branch: "staging",
    commit: "f1e9b4a",
    status: "running",
    time: "8 min ago",
    duration: "1m 12s",
    steps: [
      { name: "Checkout Repo", status: "success", duration: "2s" },
      { name: "Install Dependencies", status: "success", duration: "28s" },
      { name: "Build", status: "running", duration: "42s", log: "Building Docker image...\nStep 3/7 : RUN npm run build" },
      { name: "Deploy to Docker", status: "running", duration: "-" },
    ],
  },
  {
    id: "3",
    project: "PortfolioSite",
    branch: "main",
    commit: "c7d2e1f",
    status: "failed",
    time: "25 min ago",
    duration: "0m 52s",
    steps: [
      { name: "Checkout Repo", status: "success", duration: "2s" },
      { name: "Install Dependencies", status: "success", duration: "22s" },
      { name: "Build", status: "failed", duration: "28s", log: "npm run build\nERROR: Module not found: ./components/Header\nBuild failed with 1 error" },
      { name: "Deploy", status: "failed", duration: "-" },
    ],
  },
];

export default function DeploymentLogs() {
  const [expanded, setExpanded] = useState<string | null>("1");

  return (
    <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Deployment Logs</h1>
        <p className="text-muted-foreground text-sm mt-1">Monitor your deployment pipeline execution</p>
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
                <p className="text-sm font-medium">{log.project}</p>
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
                      {step.status === "success" && <CheckCircle2 className="h-4 w-4 text-success shrink-0" />}
                      {step.status === "failed" && <XCircle className="h-4 w-4 text-destructive shrink-0" />}
                      {step.status === "running" && <Clock className="h-4 w-4 text-warning animate-pulse shrink-0" />}
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

import { useState, useEffect, useCallback, useRef } from "react";
import { CheckCircle2, Loader2, Circle, XCircle, Terminal } from "lucide-react";
import { demoDeploymentSteps } from "@/lib/demo-data";
import { isDemo } from "@/lib/env";

interface SimulatedDeployProps {
  projectName: string;
  onComplete: () => void;
}

interface LogLine {
  text: string;
  type: "info" | "success" | "error" | "warn" | "dim";
  timestamp: string;
}

const stepLogs: Record<string, LogLine[]> = {
  "Cloning repository": [
    { text: "Initializing workflow run...", type: "dim", timestamp: "" },
    { text: "[INFO] Preparing runner environment", type: "info", timestamp: "" },
    { text: "[INFO] Cloning repository demo/project@main", type: "info", timestamp: "" },
    { text: "  → Fetching refs/heads/main", type: "dim", timestamp: "" },
    { text: "  → Resolving HEAD to commit a83f9c2", type: "dim", timestamp: "" },
    { text: "[SUCCESS] Repository cloned successfully", type: "success", timestamp: "" },
  ],
  "Installing dependencies": [
    { text: "[INFO] Running npm install", type: "info", timestamp: "" },
    { text: "  → Resolving dependency tree", type: "dim", timestamp: "" },
    { text: "  → Downloading packages...", type: "dim", timestamp: "" },
    { text: "  → added 1,423 packages in 12.4s", type: "dim", timestamp: "" },
    { text: "[SUCCESS] Dependencies installed", type: "success", timestamp: "" },
  ],
  "Running build": [
    { text: "[INFO] Running npm run build", type: "info", timestamp: "" },
    { text: "  → vite v5.4.1 building for production...", type: "dim", timestamp: "" },
    { text: "  → transforming (142 modules)...", type: "dim", timestamp: "" },
    { text: "  → rendering chunks...", type: "dim", timestamp: "" },
    { text: "  → dist/assets/index-Dk4f2.js   245.12 kB │ gzip: 78.33 kB", type: "dim", timestamp: "" },
    { text: "  → dist/assets/index-Ba9e1.css    18.44 kB │ gzip:  4.21 kB", type: "dim", timestamp: "" },
    { text: "[SUCCESS] Build completed in 4.2s", type: "success", timestamp: "" },
  ],
  "Running tests": [
    { text: "[INFO] Running npm test", type: "info", timestamp: "" },
    { text: "  → vitest v2.0.4", type: "dim", timestamp: "" },
    { text: "  ✓ src/test/auth.test.ts (4 tests) 120ms", type: "success", timestamp: "" },
    { text: "  ✓ src/test/pipeline.test.ts (8 tests) 340ms", type: "success", timestamp: "" },
    { text: "  ✓ src/test/deploy.test.ts (6 tests) 210ms", type: "success", timestamp: "" },
    { text: "[SUCCESS] 18 tests passed | 0 failed", type: "success", timestamp: "" },
  ],
  "Deploying files to server": [
    { text: "[INFO] Connecting to ftp.server.com:21", type: "info", timestamp: "" },
    { text: "  → Authenticating...", type: "dim", timestamp: "" },
    { text: "  → Mirroring dist/ → /public_html", type: "dim", timestamp: "" },
    { text: "  → Uploading 24 files (342.5 kB)", type: "dim", timestamp: "" },
    { text: "  → Cleaning old files...", type: "dim", timestamp: "" },
    { text: "[SUCCESS] Files deployed successfully", type: "success", timestamp: "" },
  ],
  "Deployment successful": [
    { text: "[SUCCESS] ✓ Pipeline completed successfully", type: "success", timestamp: "" },
    { text: "[INFO] Live at https://project.example.com", type: "info", timestamp: "" },
  ],
};

function getTimestamp(): string {
  const now = new Date();
  return now.toTimeString().slice(0, 8);
}

export default function SimulatedDeploy({ projectName, onComplete }: SimulatedDeployProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [done, setDone] = useState(false);
  const [logs, setLogs] = useState<LogLine[]>([]);
  const logRef = useRef<HTMLDivElement>(null);

  const addLogs = useCallback(async (stepLabel: string) => {
    const lines = stepLogs[stepLabel] || [
      { text: `[INFO] Executing: ${stepLabel}`, type: "info" as const, timestamp: "" },
      { text: "[SUCCESS] Step completed", type: "success" as const, timestamp: "" },
    ];

    for (const line of lines) {
      await new Promise((r) => setTimeout(r, 80 + Math.random() * 120));
      setLogs((prev) => [...prev, { ...line, timestamp: getTimestamp() }]);
    }
  }, []);

  const runSteps = useCallback(async () => {
    setLogs([
      { text: `━━━ DevDeploy Pipeline: ${projectName} ━━━`, type: "info", timestamp: getTimestamp() },
      { text: "", type: "dim", timestamp: "" },
    ]);

    for (let i = 0; i < demoDeploymentSteps.length; i++) {
      setCurrentStep(i);
      await addLogs(demoDeploymentSteps[i].label);
      await new Promise((r) => setTimeout(r, demoDeploymentSteps[i].duration * 0.4));
    }
    setDone(true);
    setTimeout(onComplete, 2500);
  }, [onComplete, projectName, addLogs]);

  useEffect(() => {
    runSteps();
  }, [runSteps]);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border">
        <div className="flex items-center gap-2.5">
          <Terminal className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">
            Deploying <span className="text-primary">{projectName}</span>
            {isDemo && <span className="text-warning ml-2 text-xs font-normal">(Simulated)</span>}
          </h3>
        </div>
        {done ? (
          <span className="text-xs text-success font-medium flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Complete
          </span>
        ) : (
          <span className="text-xs text-warning font-medium flex items-center gap-1.5">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Running
          </span>
        )}
      </div>

      {/* Steps */}
      <div className="px-5 py-3 border-b border-border">
        <div className="flex items-center gap-1">
          {demoDeploymentSteps.map((step, i) => (
            <div key={i} className="flex items-center">
              <div className="flex items-center gap-1.5">
                {i < currentStep || done ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0" />
                ) : i === currentStep && !done ? (
                  <Loader2 className="h-3.5 w-3.5 text-warning animate-spin shrink-0" />
                ) : (
                  <Circle className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                )}
                <span
                  className={`text-[11px] font-mono hidden sm:inline ${
                    i < currentStep || done
                      ? "text-foreground"
                      : i === currentStep
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {i < demoDeploymentSteps.length - 1 && (
                <div className={`w-4 h-px mx-1 ${i < currentStep || done ? "bg-success" : "bg-border"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Terminal Logs */}
      <div
        ref={logRef}
        className="terminal-output max-h-64 overflow-y-auto rounded-none border-0"
      >
        {logs.map((log, i) => (
          <div key={i} className="flex gap-2">
            {log.timestamp && (
              <span className="log-dim shrink-0 select-none">{log.timestamp}</span>
            )}
            <span className={`log-${log.type}`}>{log.text}</span>
          </div>
        ))}
        {!done && (
          <div className="flex items-center gap-1 mt-1">
            <span className="log-dim">▍</span>
          </div>
        )}
      </div>
    </div>
  );
}

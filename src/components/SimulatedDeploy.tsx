import { useState, useEffect, useCallback } from "react";
import { CheckCircle2, Loader2, Circle } from "lucide-react";
import { demoDeploymentSteps } from "@/lib/demo-data";
import { isDemo } from "@/lib/env";

interface SimulatedDeployProps {
  projectName: string;
  onComplete: () => void;
}

export default function SimulatedDeploy({ projectName, onComplete }: SimulatedDeployProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [done, setDone] = useState(false);

  const runSteps = useCallback(async () => {
    for (let i = 0; i < demoDeploymentSteps.length; i++) {
      setCurrentStep(i);
      await new Promise((r) => setTimeout(r, demoDeploymentSteps[i].duration));
    }
    setDone(true);
    setTimeout(onComplete, 2000);
  }, [onComplete]);

  useEffect(() => {
    runSteps();
  }, [runSteps]);

  return (
    <div className="bg-card border border-border rounded-lg p-5 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold">
          Deploying <span className="text-primary">{projectName}</span>
          {isDemo && <span className="text-[hsl(var(--warning))] ml-2">(Simulated)</span>}
        </h3>
        {done && (
          <span className="text-xs text-[hsl(var(--success))] font-medium">Complete</span>
        )}
      </div>
      <div className="space-y-2">
        {demoDeploymentSteps.map((step, i) => (
          <div key={i} className="flex items-center gap-3 py-1.5">
            {i < currentStep || done ? (
              <CheckCircle2 className="h-4 w-4 text-[hsl(var(--success))] shrink-0" />
            ) : i === currentStep && !done ? (
              <Loader2 className="h-4 w-4 text-primary animate-spin shrink-0" />
            ) : (
              <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
            )}
            <span
              className={`text-sm font-mono ${
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
        ))}
      </div>
    </div>
  );
}

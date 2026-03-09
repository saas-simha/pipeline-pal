import { useState } from "react";
import { Plus, Trash2, GripVertical, Play, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PipelineStep {
  id: string;
  name: string;
  command: string;
  type: "checkout" | "install" | "build" | "test" | "deploy" | "custom";
}

const stepTypes = [
  { type: "checkout" as const, label: "Checkout", defaultCmd: "actions/checkout@v3" },
  { type: "install" as const, label: "Install Deps", defaultCmd: "npm install" },
  { type: "build" as const, label: "Build", defaultCmd: "npm run build" },
  { type: "test" as const, label: "Test", defaultCmd: "npm test" },
  { type: "deploy" as const, label: "Deploy", defaultCmd: "deploy script" },
  { type: "custom" as const, label: "Custom", defaultCmd: "" },
];

const typeColors: Record<string, string> = {
  checkout: "bg-info/10 text-info border-info/20",
  install: "bg-primary/10 text-primary border-primary/20",
  build: "bg-warning/10 text-warning border-warning/20",
  test: "bg-accent/10 text-accent border-accent/20",
  deploy: "bg-success/10 text-success border-success/20",
  custom: "bg-secondary text-secondary-foreground border-border",
};

export default function PipelineBuilder() {
  const [steps, setSteps] = useState<PipelineStep[]>([
    { id: "1", name: "Checkout Repo", command: "actions/checkout@v3", type: "checkout" },
    { id: "2", name: "Install Dependencies", command: "npm install", type: "install" },
    { id: "3", name: "Build", command: "npm run build", type: "build" },
    { id: "4", name: "Deploy", command: "lftp deploy", type: "deploy" },
  ]);

  const [showYaml, setShowYaml] = useState(false);

  const addStep = (type: PipelineStep["type"], label: string, cmd: string) => {
    setSteps([...steps, { id: Date.now().toString(), name: label, command: cmd, type }]);
  };

  const removeStep = (id: string) => {
    setSteps(steps.filter((s) => s.id !== id));
  };

  const updateStep = (id: string, field: "name" | "command", value: string) => {
    setSteps(steps.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const generateYaml = () => {
    const stepsYaml = steps
      .map((s) => {
        if (s.type === "checkout") {
          return `      - name: ${s.name}\n        uses: ${s.command}`;
        }
        return `      - name: ${s.name}\n        run: ${s.command}`;
      })
      .join("\n\n");

    return `name: Deploy Application

on:
  push:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
${stepsYaml}`;
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pipeline Builder</h1>
          <p className="text-muted-foreground text-sm mt-1">Design your CI/CD workflow visually</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowYaml(!showYaml)}>
            {showYaml ? "Visual" : "YAML Preview"}
          </Button>
          <Button className="gap-2">
            <Save className="h-4 w-4" />
            Save & Push
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Steps Panel */}
        <div className="lg:col-span-2 space-y-3">
          {/* Pipeline visualization */}
          <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
            {steps.map((step, i) => (
              <div key={step.id} className="flex items-center gap-2 shrink-0">
                <div className={`px-3 py-1.5 rounded-md text-xs font-mono border ${typeColors[step.type]}`}>
                  {step.name}
                </div>
                {i < steps.length - 1 && (
                  <div className="w-6 h-px bg-border relative">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-l-[4px] border-l-muted-foreground border-y-[3px] border-y-transparent" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {showYaml ? (
            <div className="glass-card p-5">
              <pre className="text-sm font-mono text-secondary-foreground leading-relaxed whitespace-pre-wrap overflow-x-auto">
                {generateYaml()}
              </pre>
            </div>
          ) : (
            <div className="space-y-2">
              {steps.map((step, i) => (
                <div
                  key={step.id}
                  className="glass-card p-4 flex items-center gap-3 group hover:glow-border transition-all"
                >
                  <GripVertical className="h-4 w-4 text-muted-foreground shrink-0 cursor-grab" />
                  <span className="text-xs font-mono text-muted-foreground w-5 shrink-0">{i + 1}</span>
                  <div className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider border shrink-0 ${typeColors[step.type]}`}>
                    {step.type}
                  </div>
                  <Input
                    value={step.name}
                    onChange={(e) => updateStep(step.id, "name", e.target.value)}
                    className="bg-secondary border-border text-sm h-8 flex-1"
                  />
                  <Input
                    value={step.command}
                    onChange={(e) => updateStep(step.id, "command", e.target.value)}
                    className="bg-secondary border-border text-sm font-mono h-8 flex-1"
                    placeholder="command"
                  />
                  <button
                    onClick={() => removeStep(step.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Steps */}
        <div className="glass-card p-5 h-fit">
          <h3 className="text-sm font-semibold mb-4">Add Step</h3>
          <div className="space-y-2">
            {stepTypes.map((st) => (
              <button
                key={st.type}
                onClick={() => addStep(st.type, st.label, st.defaultCmd)}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md text-sm hover:bg-secondary/80 transition-colors text-left"
              >
                <Plus className="h-3.5 w-3.5 text-primary" />
                <span>{st.label}</span>
                <span className="ml-auto text-xs text-muted-foreground font-mono">{st.type}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

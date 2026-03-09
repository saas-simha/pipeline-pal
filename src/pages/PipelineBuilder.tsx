import { useState } from "react";
import {
  Plus,
  Trash2,
  GripVertical,
  Play,
  Save,
  GitBranch,
  GitCommit,
  Github,
  Pencil,
  X,
  Zap,
  FolderGit2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { isDemo } from "@/lib/env";
import { demoPipelineSteps } from "@/lib/demo-data";
import SimulatedDeploy from "@/components/SimulatedDeploy";

interface PipelineStep {
  id: string;
  name: string;
  command: string;
  type: "checkout" | "install" | "build" | "test" | "deploy" | "custom";
}

interface SourceConfig {
  provider: string;
  repository: string;
  branch: string;
  commit: string;
  trigger: string;
  autoTrigger: boolean;
  accessToken: string;
}

// Demo GitHub data
const demoRepos = [
  "demo/smarttaskpro",
  "demo/ecommerce-api",
  "demo/portfolio-site",
  "demo/chat-app",
  "demo/analytics-dash",
  "demo/blog-platform",
];

const demoBranches: Record<string, string[]> = {
  "demo/smarttaskpro": ["main", "develop", "feature/auth", "fix/header"],
  "demo/ecommerce-api": ["main", "staging", "feature/docker", "hotfix/payment"],
  "demo/portfolio-site": ["main", "redesign", "fix/responsive"],
  "demo/chat-app": ["main", "develop", "feature/websocket"],
  "demo/analytics-dash": ["main", "develop"],
  "demo/blog-platform": ["main", "feature/comments"],
};

const demoCommits: Record<string, string> = {
  "demo/smarttaskpro": "a83f9c2",
  "demo/ecommerce-api": "b73d9e1",
  "demo/portfolio-site": "c4e2a7f",
  "demo/chat-app": "d9f1b3c",
  "demo/analytics-dash": "e5a2d8f",
  "demo/blog-platform": "f2c7b4e",
};

const stepTypes = [
  { type: "checkout" as const, label: "Checkout", defaultCmd: "actions/checkout@v3" },
  { type: "install" as const, label: "Install Deps", defaultCmd: "npm install" },
  { type: "build" as const, label: "Build", defaultCmd: "npm run build" },
  { type: "test" as const, label: "Test", defaultCmd: "npm test" },
  { type: "deploy" as const, label: "Deploy", defaultCmd: "deploy script" },
  { type: "custom" as const, label: "Custom", defaultCmd: "" },
];

const typeColors: Record<string, string> = {
  checkout: "bg-[hsl(var(--info)/0.1)] text-[hsl(var(--info))] border-[hsl(var(--info)/0.2)]",
  install: "bg-primary/10 text-primary border-primary/20",
  build: "bg-[hsl(var(--warning)/0.1)] text-[hsl(var(--warning))] border-[hsl(var(--warning)/0.2)]",
  test: "bg-accent/10 text-accent-foreground border-border",
  deploy: "bg-[hsl(var(--success)/0.1)] text-[hsl(var(--success))] border-[hsl(var(--success)/0.2)]",
  custom: "bg-secondary text-secondary-foreground border-border",
};

export default function PipelineBuilder() {
  const [steps, setSteps] = useState<PipelineStep[]>(
    isDemo
      ? demoPipelineSteps
      : [{ id: "1", name: "Checkout Repo", command: "actions/checkout@v3", type: "checkout" }]
  );

  const [showYaml, setShowYaml] = useState(false);
  const [running, setRunning] = useState(false);
  const [editingSource, setEditingSource] = useState(false);

  const [source, setSource] = useState<SourceConfig>({
    provider: "GitHub",
    repository: "demo/smarttaskpro",
    branch: "main",
    commit: "a83f9c2",
    trigger: "Push",
    autoTrigger: true,
    accessToken: "",
  });

  const [editSource, setEditSource] = useState<SourceConfig>(source);

  const availableBranches = isDemo
    ? demoBranches[editSource.repository] || ["main"]
    : ["main"];

  const handleSaveSource = () => {
    const commit = isDemo
      ? demoCommits[editSource.repository] || "0000000"
      : editSource.commit;
    const updated = { ...editSource, commit };
    setSource(updated);
    setEditingSource(false);

    // Update checkout step command to reflect new source
    setSteps((prev) =>
      prev.map((s) =>
        s.type === "checkout"
          ? {
              ...s,
              command: `actions/checkout@v3`,
              name: `Checkout ${updated.repository.split("/")[1]} (${updated.branch})`,
            }
          : s
      )
    );
  };

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
          return `      - name: ${s.name}\n        uses: ${s.command}\n        with:\n          repository: ${source.repository}\n          ref: ${source.branch}`;
        }
        return `      - name: ${s.name}\n        run: ${s.command}`;
      })
      .join("\n\n");

    return `name: Deploy Application

on:
  push:
    branches:
      - ${source.branch}

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
${stepsYaml}`;
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pipeline Builder</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Design your CI/CD workflow visually
            {isDemo && <span className="ml-2 text-[hsl(var(--warning))]">(Demo)</span>}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowYaml(!showYaml)}>
            {showYaml ? "Visual" : "YAML Preview"}
          </Button>
          {isDemo && (
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => setRunning(true)}
              disabled={running}
            >
              <Play className="h-4 w-4" />
              Run Pipeline
            </Button>
          )}
          <Button className="gap-2">
            <Save className="h-4 w-4" />
            Save & Push
          </Button>
        </div>
      </div>

      {/* Source Configuration */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
          <div className="flex items-center gap-2">
            <FolderGit2 className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold">Source</h2>
          </div>
          {!editingSource && (
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 h-7 text-xs"
              onClick={() => {
                setEditSource(source);
                setEditingSource(true);
              }}
            >
              <Pencil className="h-3 w-3" />
              Edit Source
            </Button>
          )}
        </div>

        {editingSource ? (
          <div className="p-5 space-y-4 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs">Repository Provider</Label>
                <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-secondary border border-border text-sm">
                  <Github className="h-4 w-4" />
                  <span>GitHub</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Repository</Label>
                <select
                  value={editSource.repository}
                  onChange={(e) =>
                    setEditSource({
                      ...editSource,
                      repository: e.target.value,
                      branch:
                        (isDemo ? demoBranches[e.target.value]?.[0] : "main") || "main",
                    })
                  }
                  className="w-full h-9 px-3 rounded-md bg-secondary border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {(isDemo ? demoRepos : [editSource.repository]).map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs">Branch</Label>
                <select
                  value={editSource.branch}
                  onChange={(e) =>
                    setEditSource({ ...editSource, branch: e.target.value })
                  }
                  className="w-full h-9 px-3 rounded-md bg-secondary border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {availableBranches.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Access Token</Label>
                <Input
                  type="password"
                  placeholder={isDemo ? "Not required in demo mode" : "ghp_xxxxxxxxxxxx"}
                  value={editSource.accessToken}
                  onChange={(e) =>
                    setEditSource({ ...editSource, accessToken: e.target.value })
                  }
                  className="bg-secondary border-border text-sm h-9 font-mono"
                  disabled={isDemo}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-3">
                <Switch
                  checked={editSource.autoTrigger}
                  onCheckedChange={(checked) =>
                    setEditSource({ ...editSource, autoTrigger: checked })
                  }
                />
                <Label className="text-sm">Auto-trigger on push</Label>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingSource(false)}
                  className="gap-1.5"
                >
                  <X className="h-3 w-3" />
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSaveSource} className="gap-1.5">
                  Save Source
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-5">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              <div>
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">
                  Provider
                </p>
                <div className="flex items-center gap-1.5 text-sm font-medium">
                  <Github className="h-3.5 w-3.5" />
                  {source.provider}
                </div>
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">
                  Repository
                </p>
                <p className="text-sm font-mono font-medium truncate">
                  {source.repository.split("/")[1] || source.repository}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">
                  Branch
                </p>
                <div className="flex items-center gap-1.5 text-sm font-mono">
                  <GitBranch className="h-3.5 w-3.5 text-muted-foreground" />
                  {source.branch}
                </div>
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">
                  Commit
                </p>
                <div className="flex items-center gap-1.5 text-sm font-mono">
                  <GitCommit className="h-3.5 w-3.5 text-muted-foreground" />
                  {source.commit}
                </div>
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">
                  Trigger
                </p>
                <div className="flex items-center gap-1.5 text-sm">
                  <Zap className="h-3.5 w-3.5 text-[hsl(var(--warning))]" />
                  {source.autoTrigger ? "Push" : "Manual"}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Simulated Deploy */}
      {running && (
        <SimulatedDeploy
          projectName={source.repository.split("/")[1] || "Pipeline"}
          onComplete={() => setRunning(false)}
        />
      )}

      {/* Pipeline Steps & Add Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {/* Pipeline visualization */}
          <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
            {steps.map((step, i) => (
              <div key={step.id} className="flex items-center gap-2 shrink-0">
                <div
                  className={`px-3 py-1.5 rounded-md text-xs font-mono border ${typeColors[step.type]}`}
                >
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
            <div className="bg-card border border-border rounded-lg p-5">
              <pre className="text-sm font-mono text-secondary-foreground leading-relaxed whitespace-pre-wrap overflow-x-auto">
                {generateYaml()}
              </pre>
            </div>
          ) : (
            <div className="space-y-2">
              {steps.map((step, i) => (
                <div
                  key={step.id}
                  className="bg-card border border-border rounded-lg p-4 flex items-center gap-3 group hover:bg-muted/50 transition-all"
                >
                  <GripVertical className="h-4 w-4 text-muted-foreground shrink-0 cursor-grab" />
                  <span className="text-xs font-mono text-muted-foreground w-5 shrink-0">
                    {i + 1}
                  </span>
                  <div
                    className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider border shrink-0 ${typeColors[step.type]}`}
                  >
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
        <div className="bg-card border border-border rounded-lg p-5 h-fit">
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
                <span className="ml-auto text-xs text-muted-foreground font-mono">
                  {st.type}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

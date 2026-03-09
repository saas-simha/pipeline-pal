import { Plus, Trash2, GripVertical } from "lucide-react";
import { Input } from "@/components/ui/input";

export interface PipelineStep {
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
  checkout: "bg-[hsl(var(--info)/0.1)] text-[hsl(var(--info))] border-[hsl(var(--info)/0.2)]",
  install: "bg-primary/10 text-primary border-primary/20",
  build: "bg-[hsl(var(--warning)/0.1)] text-[hsl(var(--warning))] border-[hsl(var(--warning)/0.2)]",
  test: "bg-accent/10 text-accent-foreground border-border",
  deploy: "bg-[hsl(var(--success)/0.1)] text-[hsl(var(--success))] border-[hsl(var(--success)/0.2)]",
  custom: "bg-secondary text-secondary-foreground border-border",
};

interface PipelineStepsPanelProps {
  steps: PipelineStep[];
  onChange: (steps: PipelineStep[]) => void;
}

export default function PipelineStepsPanel({ steps, onChange }: PipelineStepsPanelProps) {
  const addStep = (type: PipelineStep["type"], label: string, cmd: string) => {
    onChange([...steps, { id: Date.now().toString(), name: label, command: cmd, type }]);
  };

  const removeStep = (id: string) => {
    onChange(steps.filter((s) => s.id !== id));
  };

  const updateStep = (id: string, field: "name" | "command", value: string) => {
    onChange(steps.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-2">
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
  );
}

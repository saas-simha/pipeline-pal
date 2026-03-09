import { useState } from "react";
import { FileCode2, Copy, Check, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateActionYaml, generateWorkflowYaml, ftpSecretsMapping } from "@/lib/github-actions";
import type { SourceConfig } from "@/components/pipeline/SourcePanel";
import type { TargetConfig } from "@/components/pipeline/TargetPanel";
import type { PipelineStep } from "@/components/pipeline/PipelineStepsPanel";

type YamlTab = "workflow" | "action" | "secrets";

interface WorkflowPreviewProps {
  source: SourceConfig;
  target: TargetConfig;
  steps: PipelineStep[];
}

export default function WorkflowPreview({ source, target, steps }: WorkflowPreviewProps) {
  const [activeTab, setActiveTab] = useState<YamlTab>("workflow");
  const [copied, setCopied] = useState(false);

  const workflowYaml = generateWorkflowYaml(source, target, steps);
  const actionYaml = generateActionYaml();

  const isFtpTarget =
    target.deployType === "FTP" ||
    target.deployType === "cPanel" ||
    target.deployType === "SFTP";

  const handleCopy = () => {
    const text = activeTab === "workflow" ? workflowYaml : actionYaml;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs: { id: YamlTab; label: string; path: string }[] = [
    { id: "workflow", label: "Workflow", path: ".github/workflows/deploy.yml" },
    ...(isFtpTarget
      ? [{ id: "action" as YamlTab, label: "FTP Action", path: ".github/actions/ftp-deploy/action.yml" }]
      : []),
    { id: "secrets", label: "Secrets", path: "GitHub Repository Secrets" },
  ];

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Tab bar */}
      <div className="flex items-center justify-between border-b border-border px-4">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-xs font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {activeTab !== "secrets" && (
          <Button variant="ghost" size="sm" className="gap-1.5 h-7 text-xs" onClick={handleCopy}>
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            {copied ? "Copied" : "Copy"}
          </Button>
        )}
      </div>

      {/* File path indicator */}
      <div className="flex items-center gap-2 px-4 py-2 bg-secondary/50 border-b border-border">
        <FileCode2 className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-xs font-mono text-muted-foreground">
          {tabs.find((t) => t.id === activeTab)?.path}
        </span>
      </div>

      {/* Content */}
      <div className="p-5">
        {activeTab === "secrets" ? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground mb-4">
              Configure these secrets in your GitHub repository under{" "}
              <span className="font-mono text-foreground">Settings → Secrets → Actions</span>
            </p>
            {ftpSecretsMapping.map((secret) => {
              const value = target[secret.targetField] as string;
              return (
                <div
                  key={secret.key}
                  className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 border border-border"
                >
                  <Key className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-sm font-mono font-medium flex-1">{secret.key}</span>
                  <span className="text-xs text-muted-foreground font-mono">
                    {secret.masked ? "••••••••" : value || "—"}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <pre className="text-sm font-mono text-secondary-foreground leading-relaxed whitespace-pre-wrap overflow-x-auto">
            {activeTab === "workflow" ? workflowYaml : actionYaml}
          </pre>
        )}
      </div>
    </div>
  );
}

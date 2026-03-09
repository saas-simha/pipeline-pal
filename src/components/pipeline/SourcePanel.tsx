import { useState } from "react";
import {
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

export interface SourceConfig {
  provider: string;
  repository: string;
  branch: string;
  commit: string;
  trigger: string;
  autoTrigger: boolean;
  accessToken: string;
}

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

interface SourcePanelProps {
  source: SourceConfig;
  onSave: (config: SourceConfig) => void;
}

export default function SourcePanel({ source, onSave }: SourcePanelProps) {
  const [editing, setEditing] = useState(false);
  const [editSource, setEditSource] = useState<SourceConfig>(source);

  const availableBranches = isDemo
    ? demoBranches[editSource.repository] || ["main"]
    : ["main"];

  const handleSave = () => {
    const commit = isDemo
      ? demoCommits[editSource.repository] || "0000000"
      : editSource.commit;
    onSave({ ...editSource, commit });
    setEditing(false);
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
        <div className="flex items-center gap-2">
          <FolderGit2 className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold">Source</h2>
        </div>
        {!editing && (
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 h-7 text-xs"
            onClick={() => {
              setEditSource(source);
              setEditing(true);
            }}
          >
            <Pencil className="h-3 w-3" />
            Edit Source
          </Button>
        )}
      </div>

      {editing ? (
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
                onClick={() => setEditing(false)}
                className="gap-1.5"
              >
                <X className="h-3 w-3" />
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave} className="gap-1.5">
                Save Source
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-5">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <div>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">Provider</p>
              <div className="flex items-center gap-1.5 text-sm font-medium">
                <Github className="h-3.5 w-3.5" />
                {source.provider}
              </div>
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">Repository</p>
              <p className="text-sm font-mono font-medium truncate">
                {source.repository.split("/")[1] || source.repository}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">Branch</p>
              <div className="flex items-center gap-1.5 text-sm font-mono">
                <GitBranch className="h-3.5 w-3.5 text-muted-foreground" />
                {source.branch}
              </div>
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">Commit</p>
              <div className="flex items-center gap-1.5 text-sm font-mono">
                <GitCommit className="h-3.5 w-3.5 text-muted-foreground" />
                {source.commit}
              </div>
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">Trigger</p>
              <div className="flex items-center gap-1.5 text-sm">
                <Zap className="h-3.5 w-3.5 text-[hsl(var(--warning))]" />
                {source.autoTrigger ? "Push" : "Manual"}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

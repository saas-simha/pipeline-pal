import { useState } from "react";
import { Server, Globe, FolderOpen, Pencil, X, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isDemo } from "@/lib/env";

export interface TargetConfig {
  deployType: string;
  domain: string;
  server: string;
  port: string;
  username: string;
  password: string;
  deployPath: string;
  environment: string;
}

const deployTypes = ["FTP", "SFTP", "Docker", "VPS", "cPanel"];
const environments = ["Demo", "Production", "Staging"];

interface TargetPanelProps {
  target: TargetConfig;
  onSave: (config: TargetConfig) => void;
}

export default function TargetPanel({ target, onSave }: TargetPanelProps) {
  const [editing, setEditing] = useState(false);
  const [editTarget, setEditTarget] = useState<TargetConfig>(target);

  const handleSave = () => {
    onSave(editTarget);
    setEditing(false);
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
        <div className="flex items-center gap-2">
          <Server className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold">Target</h2>
        </div>
        {!editing && (
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 h-7 text-xs"
            onClick={() => {
              setEditTarget(target);
              setEditing(true);
            }}
          >
            <Pencil className="h-3 w-3" />
            Edit Target
          </Button>
        )}
      </div>

      {editing ? (
        <div className="p-5 space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs">Deployment Type</Label>
              <select
                value={editTarget.deployType}
                onChange={(e) =>
                  setEditTarget({ ...editTarget, deployType: e.target.value })
                }
                className="w-full h-9 px-3 rounded-md bg-secondary border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {deployTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Domain</Label>
              <Input
                value={editTarget.domain}
                onChange={(e) =>
                  setEditTarget({ ...editTarget, domain: e.target.value })
                }
                className="bg-secondary border-border text-sm h-9"
                placeholder="example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-xs">Server Host</Label>
              <Input
                value={editTarget.server}
                onChange={(e) =>
                  setEditTarget({ ...editTarget, server: e.target.value })
                }
                className="bg-secondary border-border text-sm h-9 font-mono"
                placeholder="ftp.server.com"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Port</Label>
              <Input
                value={editTarget.port}
                onChange={(e) =>
                  setEditTarget({ ...editTarget, port: e.target.value })
                }
                className="bg-secondary border-border text-sm h-9 font-mono"
                placeholder="21"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Deployment Path</Label>
              <Input
                value={editTarget.deployPath}
                onChange={(e) =>
                  setEditTarget({ ...editTarget, deployPath: e.target.value })
                }
                className="bg-secondary border-border text-sm h-9 font-mono"
                placeholder="/public_html"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-xs">Username</Label>
              <Input
                value={editTarget.username}
                onChange={(e) =>
                  setEditTarget({ ...editTarget, username: e.target.value })
                }
                className="bg-secondary border-border text-sm h-9 font-mono"
                placeholder={isDemo ? "demo-user" : "username"}
                disabled={isDemo}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Password</Label>
              <Input
                type="password"
                value={editTarget.password}
                onChange={(e) =>
                  setEditTarget({ ...editTarget, password: e.target.value })
                }
                className="bg-secondary border-border text-sm h-9 font-mono"
                placeholder={isDemo ? "Not required in demo" : "••••••••"}
                disabled={isDemo}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Environment</Label>
              <select
                value={editTarget.environment}
                onChange={(e) =>
                  setEditTarget({ ...editTarget, environment: e.target.value })
                }
                className="w-full h-9 px-3 rounded-md bg-secondary border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {environments.map((env) => (
                  <option key={env} value={env}>{env}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
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
              Save Target
            </Button>
          </div>
        </div>
      ) : (
        <div className="p-5">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <div>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">Type</p>
              <div className="flex items-center gap-1.5 text-sm font-medium">
                <Shield className="h-3.5 w-3.5" />
                {target.deployType}
              </div>
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">Domain</p>
              <div className="flex items-center gap-1.5 text-sm font-mono">
                <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                {target.domain}
              </div>
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">Server</p>
              <p className="text-sm font-mono truncate">{target.server}</p>
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">Path</p>
              <div className="flex items-center gap-1.5 text-sm font-mono">
                <FolderOpen className="h-3.5 w-3.5 text-muted-foreground" />
                {target.deployPath}
              </div>
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">Environment</p>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                {target.environment}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FolderGit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const deployTypes = ["FTP", "SFTP", "Docker", "VPS", "cPanel"];

export default function CreateProject() {
  const navigate = useNavigate();
  const [deployType, setDeployType] = useState("FTP");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/projects");
  };

  return (
    <div className="p-6 lg:p-8 max-w-2xl animate-fade-in">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 rounded-lg bg-primary/10">
          <FolderGit2 className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create Project</h1>
          <p className="text-sm text-muted-foreground">Configure a new deployment pipeline</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-card border border-border rounded-lg p-6 space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Repository</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name</Label>
              <Input id="name" placeholder="SmartTaskPro" className="bg-secondary border-border" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="branch">Branch</Label>
              <Input id="branch" placeholder="main" defaultValue="main" className="bg-secondary border-border" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="repo">Git Repository URL</Label>
            <Input id="repo" placeholder="https://github.com/user/project" className="bg-secondary border-border font-mono text-sm" />
          </div>
        </div>

        <div className="glass-card p-6 space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Build Settings</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="build">Build Command</Label>
              <Input id="build" placeholder="npm run build" className="bg-secondary border-border font-mono text-sm" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deploy-cmd">Deploy Command</Label>
              <Input id="deploy-cmd" placeholder="npm run deploy" className="bg-secondary border-border font-mono text-sm" />
            </div>
          </div>
        </div>

        <div className="glass-card p-6 space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Deployment Target</h2>

          <div className="space-y-2">
            <Label>Deployment Type</Label>
            <div className="flex flex-wrap gap-2">
              {deployTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setDeployType(type)}
                  className={`px-3 py-1.5 rounded-md text-xs font-mono uppercase tracking-wider transition-all ${
                    deployType === type
                      ? "bg-primary text-primary-foreground shadow-[0_0_12px_hsl(var(--primary)/0.3)]"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="host">Server Host</Label>
              <Input id="host" placeholder="ftp.example.com" className="bg-secondary border-border font-mono text-sm" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Server Username</Label>
              <Input id="username" placeholder="deploy-user" className="bg-secondary border-border font-mono text-sm" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password">Server Password</Label>
              <Input id="password" type="password" placeholder="••••••••" className="bg-secondary border-border" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="path">Deployment Path</Label>
              <Input id="path" placeholder="public_html" className="bg-secondary border-border font-mono text-sm" />
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="submit" className="flex-1">
            Create Project
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

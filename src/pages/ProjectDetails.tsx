import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, GitBranch, ExternalLink, Play, Settings, FileText, Workflow, Clock, Server, Globe, Activity, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/StatusBadge";
import { isDemo } from "@/lib/env";
import { demoProjects, demoDeploymentHistory } from "@/lib/demo-data";
import { useState } from "react";
import SimulatedDeploy from "@/components/SimulatedDeploy";

export default function ProjectDetails() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [deploying, setDeploying] = useState(false);

  const project = demoProjects.find(
    (p) => p.name.toLowerCase().replace(/\s+/g, "") === projectId
  );

  if (!project) {
    return (
      <div className="p-6 lg:p-8 space-y-4 animate-fade-in">
        <div className="bg-card border border-border rounded-lg p-8 text-center">
          <p className="text-muted-foreground mb-4">Project not found.</p>
          <Link to="/projects">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Projects
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const projectDeployments = demoDeploymentHistory.filter(
    (d) => d.project === project.name
  );

  return (
    <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link to="/projects">
          <Button variant="ghost" size="icon" className="shrink-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">{project.name}</h1>
            <StatusBadge status={project.status} />
          </div>
          <div className="flex items-center gap-2 mt-1 text-muted-foreground text-sm">
            <ExternalLink className="h-3 w-3" />
            <span className="font-mono">{project.repo}</span>
            <span className="text-border">•</span>
            <GitBranch className="h-3 w-3" />
            <span className="font-mono">{project.branch}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            className="gap-2"
            onClick={() => setDeploying(true)}
            disabled={deploying}
          >
            <Play className="h-4 w-4" /> {deploying ? "Deploying..." : "Deploy"}
          </Button>
          <Link to="/pipelines">
            <Button variant="outline" className="gap-2">
              <Workflow className="h-4 w-4" /> Pipeline
            </Button>
          </Link>
          <Link to="/logs">
            <Button variant="outline" className="gap-2">
              <FileText className="h-4 w-4" /> Logs
            </Button>
          </Link>
        </div>
      </div>

      {deploying && (
        <SimulatedDeploy
          projectName={project.name}
          onComplete={() => setDeploying(false)}
        />
      )}

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Repository Info */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="px-5 py-3 border-b border-border bg-muted/20">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <GitBranch className="h-3.5 w-3.5" />
              Repository
            </h3>
          </div>
          <div className="p-5 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Provider</span>
              <span className="font-mono font-medium">GitHub</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Repository</span>
              <span className="font-mono font-medium">{project.repo}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Branch</span>
              <span className="font-mono font-medium">{project.branch}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Commits</span>
              <span className="font-mono font-medium">{project.commits}</span>
            </div>
          </div>
        </div>

        {/* Deployment Target */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="px-5 py-3 border-b border-border bg-muted/20">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Server className="h-3.5 w-3.5" />
              Deployment Target
            </h3>
          </div>
          <div className="p-5 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Type</span>
              <span className="font-mono font-medium">{project.deployType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Domain</span>
              <span className="font-mono font-medium">{project.domain}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Server</span>
              <span className="font-mono font-medium">{project.server}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Path</span>
              <span className="font-mono font-medium">{project.deployPath}</span>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="px-5 py-3 border-b border-border bg-muted/20">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Activity className="h-3.5 w-3.5" />
              Status
            </h3>
          </div>
          <div className="p-5 space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Current</span>
              <StatusBadge status={project.status} />
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last Deploy</span>
              <span className="font-mono font-medium">{project.lastDeploy}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Environment</span>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                {isDemo ? "Demo" : "Production"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Deployments */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Hash className="h-3.5 w-3.5 text-muted-foreground" />
            Recent Deployments
          </h3>
          <Link to="/logs" className="text-xs text-primary hover:underline">View all</Link>
        </div>
        {projectDeployments.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-muted-foreground">No deployments yet for this project.</p>
            <Button className="gap-2 mt-4" size="sm" onClick={() => setDeploying(true)}>
              <Play className="h-4 w-4" /> Run First Deploy
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {projectDeployments.map((d) => (
              <div
                key={d.id}
                className="flex items-center justify-between px-5 py-3.5 hover:bg-muted/30 transition-colors cursor-pointer"
                onClick={() => navigate("/logs")}
              >
                <div className="flex items-center gap-3">
                  <StatusBadge status={d.status} />
                  <span className="font-mono text-xs text-muted-foreground">#{d.id}</span>
                  <span className="font-mono text-xs">{d.commit}</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="font-mono">{d.duration}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {d.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

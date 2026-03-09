import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, GitBranch, ExternalLink, Play, Settings, FileText, Workflow, Clock, Server, Globe } from "lucide-react";
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
        <p className="text-muted-foreground">Project not found.</p>
        <Link to="/projects">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Projects
          </Button>
        </Link>
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
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">{project.name}</h1>
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
            <Play className="h-4 w-4" /> Deploy
          </Button>
          <Link to="/pipelines">
            <Button variant="outline" className="gap-2">
              <Workflow className="h-4 w-4" /> View Pipeline
            </Button>
          </Link>
          <Link to="/logs">
            <Button variant="outline" className="gap-2">
              <FileText className="h-4 w-4" /> View Logs
            </Button>
          </Link>
          <Link to="/settings">
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
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
        <div className="bg-card border border-border rounded-lg p-5 space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Repository</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Provider</span>
              <span className="font-mono">GitHub</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Repository</span>
              <span className="font-mono">{project.repo}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Branch</span>
              <span className="font-mono">{project.branch}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Commits</span>
              <span className="font-mono">{project.commits}</span>
            </div>
          </div>
        </div>

        {/* Deployment Target */}
        <div className="bg-card border border-border rounded-lg p-5 space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Deployment Target</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Type</span>
              <span className="font-mono">{project.deployType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Domain</span>
              <span className="font-mono">{project.domain}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Server</span>
              <span className="font-mono">{project.server}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Path</span>
              <span className="font-mono">{project.deployPath}</span>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="bg-card border border-border rounded-lg p-5 space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Status</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Current</span>
              <StatusBadge status={project.status} />
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last Deploy</span>
              <span className="font-mono">{project.lastDeploy}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Environment</span>
              <span className="font-mono">{isDemo ? "Demo" : "Production"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Deployments */}
      <div className="bg-card border border-border rounded-lg p-5 space-y-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Recent Deployments</h3>
        {projectDeployments.length === 0 ? (
          <p className="text-sm text-muted-foreground">No deployments yet.</p>
        ) : (
          <div className="space-y-3">
            {projectDeployments.map((d) => (
              <div
                key={d.id}
                className="flex items-center justify-between py-2 border-b border-border/30 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <StatusBadge status={d.status} />
                  <span className="font-mono text-xs text-muted-foreground">#{d.id}</span>
                  <span className="font-mono text-xs">{d.commit}</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{d.duration}</span>
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

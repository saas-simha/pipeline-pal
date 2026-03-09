import { Link } from "react-router-dom";
import { Plus, GitBranch, Clock, ExternalLink, MoreVertical, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/StatusBadge";
import { isDemo } from "@/lib/env";
import { demoProjects } from "@/lib/demo-data";
import { useState } from "react";
import SimulatedDeploy from "@/components/SimulatedDeploy";

export default function Projects() {
  const projects = demoProjects;
  const [deployingProject, setDeployingProject] = useState<string | null>(null);

  return (
    <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {projects.length} projects configured
            {isDemo && <span className="ml-2 text-[hsl(var(--warning))]">(Demo)</span>}
          </p>
        </div>
        <Link to="/projects/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </Link>
      </div>

      {deployingProject && (
        <SimulatedDeploy
          projectName={deployingProject}
          onComplete={() => setDeployingProject(null)}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {projects.map((project) => (
          <div
            key={project.name}
            className="bg-card border border-border rounded-lg p-5 hover:bg-muted/50 transition-all duration-300 group"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-base">{project.name}</h3>
                <div className="flex items-center gap-1.5 mt-1 text-muted-foreground">
                  <ExternalLink className="h-3 w-3" />
                  <span className="text-xs font-mono">{project.repo}</span>
                </div>
              </div>
              <button className="text-muted-foreground hover:text-foreground transition-colors opacity-0 group-hover:opacity-100">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center gap-4 mt-4 text-xs">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <GitBranch className="h-3 w-3" />
                <span className="font-mono">{project.branch}</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-secondary text-secondary-foreground font-mono text-[10px] uppercase tracking-wider">
                {project.deployType}
              </span>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/30">
              <StatusBadge status={project.status} />
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {project.lastDeploy}
                </div>
                {isDemo && (
                  <button
                    onClick={() => setDeployingProject(project.name)}
                    className="flex items-center gap-1 text-xs text-primary hover:underline"
                    disabled={!!deployingProject}
                  >
                    <Play className="h-3 w-3" />
                    Deploy
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

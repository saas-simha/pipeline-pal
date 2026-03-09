import { GitPullRequest, GitMerge, MessageSquare, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/StatusBadge";
import { isDemo } from "@/lib/env";
import { demoPullRequests } from "@/lib/demo-data";

export default function PullRequests() {
  const pullRequests = demoPullRequests;

  return (
    <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Pull Requests</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Review and manage pull requests
          {isDemo && <span className="ml-2 text-[hsl(var(--warning))]">(Demo)</span>}
        </p>
      </div>

      <div className="space-y-3">
        {pullRequests.map((pr) => (
          <div key={pr.id} className="bg-card border border-border rounded-lg p-5 hover:bg-muted/50 transition-all duration-300">
            <div className="flex items-start gap-4">
              <GitPullRequest className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-medium text-sm">
                      {pr.title}
                      <span className="text-muted-foreground font-normal ml-2">#{pr.id}</span>
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      <span className="text-primary">{pr.project}</span> · {pr.author} · {pr.time}
                    </p>
                  </div>
                  <StatusBadge status={pr.status} />
                </div>

                <div className="flex items-center gap-4 mt-3">
                  <span className="text-xs font-mono text-muted-foreground px-2 py-0.5 bg-secondary rounded">
                    {pr.branch} → {pr.target}
                  </span>
                  <div className="flex items-center gap-1 text-xs">
                    <span className="text-primary font-mono">+{pr.additions}</span>
                    <span className="text-destructive font-mono">-{pr.deletions}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MessageSquare className="h-3 w-3" />
                    {pr.comments}
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button size="sm" className="gap-1.5 h-8 text-xs">
                    <GitMerge className="h-3 w-3" />
                    Merge
                  </Button>
                  <Button size="sm" variant="outline" className="gap-1.5 h-8 text-xs">
                    <Check className="h-3 w-3" />
                    Approve
                  </Button>
                  <Button size="sm" variant="ghost" className="gap-1.5 h-8 text-xs text-destructive hover:text-destructive">
                    <X className="h-3 w-3" />
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

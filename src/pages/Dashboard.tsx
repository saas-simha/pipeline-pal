import {
  Activity,
  GitCommit,
  Rocket,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUpRight,
  GitBranch,
} from "lucide-react";
import { Link } from "react-router-dom";
import StatusBadge from "@/components/StatusBadge";

const stats = [
  { label: "Total Projects", value: "12", icon: Rocket, change: "+2 this week" },
  { label: "Deployments", value: "148", icon: Activity, change: "+23 this week" },
  { label: "Success Rate", value: "94.6%", icon: CheckCircle2, change: "+1.2%" },
  { label: "Avg Deploy Time", value: "2m 34s", icon: Clock, change: "-12s" },
];

const recentDeployments = [
  { project: "SmartTaskPro", branch: "main", commit: "a3f8c2d", status: "success" as const, time: "3 min ago", user: "john" },
  { project: "EcommerceAPI", branch: "staging", commit: "f1e9b4a", status: "running" as const, time: "8 min ago", user: "sarah" },
  { project: "PortfolioSite", branch: "main", commit: "c7d2e1f", status: "failed" as const, time: "25 min ago", user: "john" },
  { project: "ChatApp", branch: "develop", commit: "b5a3c8e", status: "success" as const, time: "1 hour ago", user: "mike" },
  { project: "AnalyticsDash", branch: "main", commit: "e2f4a7b", status: "success" as const, time: "2 hours ago", user: "sarah" },
];

const recentActivity = [
  { action: "Deployed", project: "SmartTaskPro", detail: "to production", time: "3 min ago" },
  { action: "Pipeline updated", project: "EcommerceAPI", detail: "added test step", time: "15 min ago" },
  { action: "PR merged", project: "PortfolioSite", detail: "#42 fix header", time: "30 min ago" },
  { action: "Project created", project: "ChatApp", detail: "new repository", time: "1 hour ago" },
];

export default function Dashboard() {
  return (
    <div className="p-6 lg:p-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Overview of your deployment pipeline</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="glass-card p-5 group hover:glow-border transition-all duration-300">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{stat.label}</p>
                <p className="text-3xl font-bold mt-1 tracking-tight">{stat.value}</p>
              </div>
              <stat.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <p className="text-xs text-primary font-mono mt-3">{stat.change}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Deployments */}
        <div className="lg:col-span-2 glass-card">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
            <h2 className="text-sm font-semibold">Recent Deployments</h2>
            <Link to="/logs" className="text-xs text-primary hover:underline flex items-center gap-1">
              View all <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-border/30">
            {recentDeployments.map((dep, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-3.5 hover:bg-secondary/30 transition-colors">
                <StatusBadge status={dep.status} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{dep.project}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <GitBranch className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground font-mono">{dep.branch}</span>
                    <GitCommit className="h-3 w-3 text-muted-foreground ml-1" />
                    <span className="text-xs text-muted-foreground font-mono">{dep.commit}</span>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{dep.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="glass-card">
          <div className="px-5 py-4 border-b border-border/50">
            <h2 className="text-sm font-semibold">Recent Activity</h2>
          </div>
          <div className="p-4 space-y-4">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex gap-3">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                <div>
                  <p className="text-sm">
                    <span className="font-medium">{item.action}</span>{" "}
                    <span className="text-primary">{item.project}</span>{" "}
                    <span className="text-muted-foreground">{item.detail}</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

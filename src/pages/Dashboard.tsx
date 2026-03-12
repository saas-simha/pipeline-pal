import {
  Activity,
  GitCommit,
  Rocket,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  GitBranch,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import StatusBadge from "@/components/StatusBadge";
import { isDemo } from "@/lib/env";
import { demoStats, demoDeploymentHistory, demoRecentActivity } from "@/lib/demo-data";

const statIcons = [Rocket, Activity, CheckCircle2, Clock];
const statAccents = [
  "from-primary/10 to-primary/5",
  "from-info/10 to-info/5",
  "from-success/10 to-success/5",
  "from-warning/10 to-warning/5",
];

export default function Dashboard() {
  const stats = demoStats;
  const recentDeployments = demoDeploymentHistory;
  const recentActivity = demoRecentActivity;

  return (
    <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Overview of your deployment pipeline
            {isDemo && <span className="ml-2 text-warning">(Demo Data)</span>}
          </p>
        </div>
        <Link to="/projects/new">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
            <Rocket className="h-4 w-4" />
            New Deploy
          </button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = statIcons[i];
          return (
            <div
              key={stat.label}
              className={`bg-card border border-border rounded-lg p-5 transition-all hover:shadow-md bg-gradient-to-br ${statAccents[i]}`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold mt-1.5 tracking-tight">{stat.value}</p>
                </div>
                <div className="p-2 rounded-lg bg-background/60">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <div className="flex items-center gap-1.5 mt-3">
                <TrendingUp className="h-3 w-3 text-success" />
                <p className="text-xs text-success font-medium">{stat.change}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Deployments */}
        <div className="lg:col-span-2 bg-card border border-border rounded-lg">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
            <h2 className="text-sm font-semibold">Recent Deployments</h2>
            <Link to="/logs" className="text-xs text-primary hover:underline flex items-center gap-1">
              View all <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {recentDeployments.map((dep) => (
              <Link
                key={dep.id}
                to="/logs"
                className="flex items-center gap-4 px-5 py-3.5 hover:bg-muted/50 transition-colors"
              >
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
                <div className="text-right shrink-0">
                  <span className="text-xs text-muted-foreground">{dep.time}</span>
                  <p className="text-xs font-mono text-muted-foreground mt-0.5">{dep.duration}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-card border border-border rounded-lg">
          <div className="px-5 py-3.5 border-b border-border">
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

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  GitBranch,
  ScrollText,
  Settings,
  ChevronLeft,
  Rocket,
  Plus,
  Workflow,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: FolderKanban, label: "Projects", path: "/projects" },
  { icon: Workflow, label: "Pipelines", path: "/pipelines" },
  { icon: ScrollText, label: "Deploy Logs", path: "/logs" },
  { icon: GitBranch, label: "Pull Requests", path: "/pull-requests" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export default function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={cn(
        "flex flex-col h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 sticky top-0",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 h-14 border-b border-sidebar-border">
        <Rocket className="h-6 w-6 text-primary shrink-0" />
        {!collapsed && (
          <span className="text-lg font-bold tracking-tight text-foreground">
            Dev<span className="text-gradient">Deploy</span>
          </span>
        )}
      </div>

      {/* New Project */}
      <div className="px-3 pt-4 pb-2">
        <Link
          to="/projects/new"
          className={cn(
            "flex items-center gap-2 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-medium text-sm",
            collapsed ? "justify-center p-2.5" : "px-3 py-2"
          )}
        >
          <Plus className="h-4 w-4 shrink-0" />
          {!collapsed && "New Project"}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-2.5 rounded-md text-sm transition-colors",
                collapsed ? "justify-center p-2.5" : "px-3 py-2",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {!collapsed && item.label}
              {isActive && !collapsed && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_6px_hsl(var(--primary)/0.6)]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="px-3 pb-4">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "flex items-center gap-2 rounded-md text-sm text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors w-full",
            collapsed ? "justify-center p-2.5" : "px-3 py-2"
          )}
        >
          <ChevronLeft
            className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")}
          />
          {!collapsed && "Collapse"}
        </button>
      </div>
    </aside>
  );
}

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
        <div className="p-1 rounded-md bg-primary/10">
          <Rocket className="h-4 w-4 text-primary shrink-0" />
        </div>
        {!collapsed && (
          <span className="text-base font-bold tracking-tight text-foreground">
            Dev<span className="text-primary">Deploy</span>
          </span>
        )}
      </div>

      {/* New Project */}
      <div className="px-3 pt-4 pb-2">
        <Link
          to="/projects/new"
          className={cn(
            "flex items-center gap-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium text-sm",
            collapsed ? "justify-center p-2.5" : "px-3 py-2"
          )}
        >
          <Plus className="h-4 w-4 shrink-0" />
          {!collapsed && "New Project"}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-0.5">
        {navItems.map((item) => {
          const isActive =
            item.path === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-2.5 rounded-md text-sm transition-all duration-200",
                collapsed ? "justify-center p-2.5" : "px-3 py-2",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium shadow-sm"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className={cn("h-4 w-4 shrink-0", isActive && "text-primary")} />
              {!collapsed && item.label}
            </Link>
          );
        })}
      </nav>

      {/* Version & Collapse */}
      <div className="px-3 pb-4 space-y-2">
        {!collapsed && (
          <div className="px-3 py-2">
            <p className="text-[10px] text-muted-foreground font-mono">v1.0.0 • DevDeploy</p>
          </div>
        )}
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

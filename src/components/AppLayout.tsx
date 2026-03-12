import { Outlet, Navigate } from "react-router-dom";
import AppSidebar from "./AppSidebar";
import { useTheme } from "./ThemeProvider";
import { useAuth } from "@/lib/auth";
import EnvBadge from "./EnvBadge";
import { Sun, Moon, LogOut, User } from "lucide-react";

export default function AppLayout() {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col overflow-auto">
        <header className="flex items-center justify-end gap-2 px-6 h-14 border-b border-border shrink-0 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
          <EnvBadge />
          <div className="h-5 w-px bg-border mx-1" />
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            {theme === "dark" ? "Light" : "Dark"}
          </button>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">admin</span>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </header>
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

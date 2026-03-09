import { Outlet, Navigate } from "react-router-dom";
import AppSidebar from "./AppSidebar";
import { useTheme } from "./ThemeProvider";
import { useAuth } from "@/lib/auth";
import EnvBadge from "./EnvBadge";
import { Sun, Moon, LogOut } from "lucide-react";

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
        <header className="flex items-center justify-end gap-3 px-6 h-14 border-b border-border shrink-0">
          <EnvBadge />
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm text-muted-foreground hover:bg-secondary transition-colors"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            {theme === "dark" ? "Light" : "Dark"}
          </button>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm text-muted-foreground hover:bg-secondary transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </header>
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

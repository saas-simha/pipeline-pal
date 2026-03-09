import { useState } from "react";
import { Github, Key, Bell, Shield, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "github", label: "GitHub", icon: Github },
  { id: "secrets", label: "Secrets", icon: Key },
  { id: "notifications", label: "Notifications", icon: Bell },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your account and integrations</p>
      </div>

      <div className="flex gap-6">
        {/* Tabs */}
        <div className="w-48 shrink-0 space-y-1 hidden md:block">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors ${
                activeTab === tab.id
                  ? "bg-secondary text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 max-w-xl">
          {activeTab === "profile" && (
            <div className="bg-card border border-border rounded-lg p-6 space-y-5">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Profile</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="display-name">Display Name</Label>
                  <Input id="display-name" defaultValue="John Doe" className="bg-secondary border-border" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="settings-email">Email</Label>
                  <Input id="settings-email" defaultValue="john@example.com" className="bg-secondary border-border" />
                </div>
                <Button>Save Changes</Button>
              </div>
            </div>
          )}

          {activeTab === "github" && (
            <div className="bg-card border border-border rounded-lg p-6 space-y-5">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">GitHub Integration</h2>
              <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50 border border-border/30">
                <Github className="h-8 w-8 text-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">GitHub Account</p>
                  <p className="text-xs text-muted-foreground">Connect your GitHub account to manage repositories</p>
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <Github className="h-4 w-4" />
                  Connect
                </Button>
              </div>
              <div className="space-y-2">
                <Label htmlFor="pat">Personal Access Token</Label>
                <Input id="pat" type="password" placeholder="ghp_xxxxxxxxxxxx" className="bg-secondary border-border font-mono text-sm" />
                <p className="text-xs text-muted-foreground">Required for pushing workflow files and managing PRs</p>
              </div>
              <Button>Save Token</Button>
            </div>
          )}

          {activeTab === "secrets" && (
            <div className="bg-card border border-border rounded-lg p-6 space-y-5">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Environment Secrets</h2>
              <p className="text-sm text-muted-foreground">Manage secrets used in your deployment pipelines</p>
              {["FTP_PASSWORD", "DOCKER_TOKEN", "SSH_KEY"].map((secret) => (
                <div key={secret} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 border border-border/30">
                  <Shield className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-sm font-mono flex-1">{secret}</span>
                  <span className="text-xs text-muted-foreground">••••••••</span>
                  <Button variant="ghost" size="sm" className="text-xs">Edit</Button>
                </div>
              ))}
              <Button variant="outline" size="sm" className="gap-2">
                <Key className="h-3.5 w-3.5" />
                Add Secret
              </Button>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="glass-card p-6 space-y-5">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Notifications</h2>
              {[
                { label: "Deployment success", desc: "Get notified when a deployment succeeds" },
                { label: "Deployment failure", desc: "Get notified when a deployment fails" },
                { label: "PR created", desc: "Get notified when a PR is created" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

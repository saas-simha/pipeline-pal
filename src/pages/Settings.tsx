import { useState } from "react";
import { Github, Key, Bell, Shield, User, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "github", label: "GitHub", icon: Github },
  { id: "secrets", label: "Secrets", icon: Key },
  { id: "notifications", label: "Notifications", icon: Bell },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const { toast } = useToast();

  const handleSave = (section: string) => {
    toast({ title: "Settings saved", description: `${section} settings updated successfully.` });
  };

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
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md text-sm transition-all ${
                activeTab === tab.id
                  ? "bg-secondary text-foreground font-medium shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              <tab.icon className={`h-4 w-4 ${activeTab === tab.id ? "text-primary" : ""}`} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 max-w-xl">
          {activeTab === "profile" && (
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="px-6 py-3 border-b border-border bg-muted/20">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Profile</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="display-name">Display Name</Label>
                  <Input id="display-name" defaultValue="John Doe" className="bg-secondary border-border" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="settings-email">Email</Label>
                  <Input id="settings-email" defaultValue="john@example.com" className="bg-secondary border-border" />
                </div>
                <Button className="gap-2" onClick={() => handleSave("Profile")}>
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </div>
          )}

          {activeTab === "github" && (
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="px-6 py-3 border-b border-border bg-muted/20">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">GitHub Integration</h2>
              </div>
              <div className="p-6 space-y-5">
                <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50 border border-border">
                  <div className="p-2 rounded-md bg-foreground/5">
                    <Github className="h-6 w-6 text-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">GitHub Account</p>
                    <p className="text-xs text-muted-foreground">Connect to manage repositories</p>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Github className="h-4 w-4" />
                    Connect
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pat">Personal Access Token</Label>
                  <Input id="pat" type="password" placeholder="ghp_xxxxxxxxxxxx" className="bg-secondary border-border font-mono text-sm" />
                  <p className="text-xs text-muted-foreground">Required for workflow management and PRs</p>
                </div>
                <Button className="gap-2" onClick={() => handleSave("GitHub")}>
                  <Save className="h-4 w-4" />
                  Save Token
                </Button>
              </div>
            </div>
          )}

          {activeTab === "secrets" && (
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="px-6 py-3 border-b border-border bg-muted/20">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Environment Secrets</h2>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-sm text-muted-foreground">Secrets used in deployment pipelines</p>
                {["FTP_PASSWORD", "DOCKER_TOKEN", "SSH_KEY"].map((secret) => (
                  <div key={secret} className="flex items-center gap-3 p-3.5 rounded-lg bg-secondary/50 border border-border">
                    <Shield className="h-4 w-4 text-primary shrink-0" />
                    <span className="text-sm font-mono flex-1">{secret}</span>
                    <span className="text-xs text-muted-foreground font-mono">••••••••</span>
                    <Button variant="ghost" size="sm" className="text-xs h-7">Edit</Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="gap-2">
                  <Key className="h-3.5 w-3.5" />
                  Add Secret
                </Button>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="px-6 py-3 border-b border-border bg-muted/20">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Notifications</h2>
              </div>
              <div className="p-6 space-y-1">
                {[
                  { label: "Deployment success", desc: "Notify when a deployment succeeds" },
                  { label: "Deployment failure", desc: "Notify when a deployment fails" },
                  { label: "PR created", desc: "Notify when a PR is created" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-3.5 border-b border-border/30 last:border-0">
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

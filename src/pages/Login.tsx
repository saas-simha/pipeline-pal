import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Rocket, Github, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left - Branding */}
      <div className="hidden lg:flex flex-1 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="relative z-10 text-center px-12 animate-fade-in">
          <Rocket className="h-16 w-16 text-primary mx-auto mb-6" />
          <h1 className="text-5xl font-bold tracking-tight mb-4">
            Dev<span className="text-gradient">Deploy</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto leading-relaxed">
            Your deployment control center. Build pipelines, push workflows, and ship with confidence.
          </p>
          <div className="mt-12 flex items-center gap-6 justify-center text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="status-dot status-success" />
              <span>Pipeline Builder</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="status-dot status-success" />
              <span>GitHub Actions</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="status-dot status-success" />
              <span>Multi-target Deploy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md animate-fade-in">
          <div className="lg:hidden flex items-center gap-2.5 mb-10">
            <Rocket className="h-7 w-7 text-primary" />
            <span className="text-2xl font-bold">Dev<span className="text-gradient">Deploy</span></span>
          </div>

          <h2 className="text-2xl font-bold mb-1">Welcome back</h2>
          <p className="text-muted-foreground mb-8">Sign in to your deployment dashboard</p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="dev@example.com" className="bg-secondary border-border" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="bg-secondary border-border pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center"><span className="bg-background px-3 text-xs text-muted-foreground">or</span></div>
          </div>

          <Button variant="outline" className="w-full gap-2">
            <Github className="h-4 w-4" />
            Continue with GitHub
          </Button>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don&apos;t have an account?{" "}
            <button className="text-primary hover:underline font-medium">Sign up</button>
          </p>
        </div>
      </div>
    </div>
  );
}

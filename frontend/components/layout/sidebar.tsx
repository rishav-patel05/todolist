"use client";

import { CheckCircle2, LayoutDashboard, LogOut } from "lucide-react";
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const Sidebar = (): JSX.Element => {
  const { user, clear } = useAuthStore();
  const router = useRouter();

  const handleLogout = async (): Promise<void> => {
    await authApi.logout();
    clear();
    toast.success("Logged out");
    router.push("/login");
  };

  return (
    <aside className="w-full rounded-2xl border border-white/20 bg-card/70 p-4 backdrop-blur md:w-72" aria-label="Sidebar navigation">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">SaaS Todo</p>
          <h1 className="text-xl font-semibold">Control Panel</h1>
        </div>
        <ThemeToggle />
      </div>

      <nav className="space-y-2">
        <a className="flex items-center gap-3 rounded-lg bg-muted/60 px-3 py-2 text-sm" href="#dashboard">
          <LayoutDashboard className="h-4 w-4" /> Dashboard
        </a>
        <a className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-muted/60" href="#todos">
          <CheckCircle2 className="h-4 w-4" /> Todos
        </a>
      </nav>

      <div className="mt-8 rounded-lg border p-3">
        <p className="text-sm font-medium">{user?.name}</p>
        <p className="text-xs text-muted-foreground">{user?.email}</p>
      </div>

      <Button variant="outline" className="mt-6 w-full justify-start" onClick={() => void handleLogout()}>
        <LogOut className="mr-2 h-4 w-4" /> Logout
      </Button>
    </aside>
  );
};

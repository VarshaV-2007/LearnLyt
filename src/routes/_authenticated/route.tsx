import { createFileRoute, Link, Outlet, redirect, useNavigate, useLocation } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { LayoutDashboard, ListChecks, BarChart3, Map, BookOpen, Bot, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuButton,
  SidebarMenuItem, SidebarProvider, SidebarTrigger,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: "/auth" });
  },
  component: AppLayout,
});

const nav = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/skills", label: "My Skills", icon: ListChecks },
  { to: "/gap", label: "Skill Gap Analysis", icon: BarChart3 },
  { to: "/roadmap", label: "Learning Roadmap", icon: Map },
  { to: "/resources", label: "Resources", icon: BookOpen },
  { to: "/assistant", label: "AI Assistant", icon: Bot },
] as const;

function AppLayout() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="p-4"><Logo /></SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              {nav.map((n) => (
                <SidebarMenuItem key={n.to}>
                  <SidebarMenuButton asChild isActive={pathname.startsWith(n.to)}>
                    <Link to={n.to}><n.icon /> <span>{n.label}</span></Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={signOut}><LogOut /> <span>Sign out</span></SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <main className="min-w-0 flex-1 bg-soft">
        <div className="flex items-center gap-2 border-b bg-background/70 px-4 py-3 backdrop-blur md:hidden">
          <SidebarTrigger /><span className="font-display font-semibold">Learnlyt</span>
        </div>
        <div className="mx-auto max-w-6xl p-4 md:p-8"><Outlet /></div>
      </main>
    </SidebarProvider>
  );
}

import type { TenantConfig } from "@/features/tenants/types";
import { AppTopBar } from "./app-top-bar";
import { FloatingBottomNavigation } from "./floating-bottom-navigation";

export interface AppShellUser { email: string; name?: string | null; image?: string | null }

export function AppShell({tenant,user,children,demo=false}:{tenant:TenantConfig;user:AppShellUser;children:React.ReactNode;demo?:boolean}) {
  return <div className="app-shell">
    <AppTopBar tenant={tenant} user={user} demo={demo}/>
    <main className="main">{children}</main>
    <FloatingBottomNavigation/>
  </div>;
}

import { AppShell } from "@/components/app-shell"; import { getTenant } from "@/features/tenants/server";
export default async function ExperienceLayout({children}:{children:React.ReactNode}){const tenant=await getTenant();return <AppShell tenant={tenant}>{children}</AppShell>}

import { AppShell } from "@/components/app-shell";import { getTenant } from "@/features/tenants/server";
export default async function DemoLayout({children}:{children:React.ReactNode}){const tenant=await getTenant();return <AppShell tenant={tenant} user={{email:"maria@demo.local",name:"María"}} demo>{children}</AppShell>}

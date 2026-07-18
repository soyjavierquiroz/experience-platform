import type { TenantConfig } from "@/features/tenants/types";
import Image from "next/image";
import Link from "next/link";
import type { AppShellUser } from "./app-shell";
import { StudentAvatar } from "./student-avatar";

export function AppTopBar({tenant,user,demo=false}:{tenant:TenantConfig;user:AppShellUser;demo?:boolean}){
  const logo=tenant.branding.assets.logo;
  return <header className="app-top-bar"><div className="app-top-bar-inner">
    <div className="tenant-identity">
      <span className="tenant-logo" aria-hidden="true">{logo?<Image src={logo} alt="" width={36} height={36} unoptimized/>:<span>{tenant.shortName.slice(0,1)}</span>}</span>
      <span className="tenant-product">{tenant.productName}</span>
    </div>
    <div className="top-actions">{demo&&<Link className="real-access-link" href="/acceso">Acceso real</Link>}<StudentAvatar {...user}/></div>
  </div></header>;
}

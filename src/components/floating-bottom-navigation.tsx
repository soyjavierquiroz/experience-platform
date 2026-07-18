"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CommunityIcon,HomeIcon,ProfileIcon,RouteIcon } from "./icons";

const appItems=[{href:"/app",label:"Hoy",Icon:HomeIcon},{href:"/app/ruta",label:"Ruta",Icon:RouteIcon},{href:"/app/comunidad",label:"Comunidad",Icon:CommunityIcon},{href:"/app/perfil",label:"Perfil",Icon:ProfileIcon}];
const demoItems=[{href:"/",label:"Hoy",Icon:HomeIcon},{href:"/demo/ruta",label:"Ruta",Icon:RouteIcon},{href:"/demo/comunidad",label:"Comunidad",Icon:CommunityIcon},{href:"/demo/perfil",label:"Perfil",Icon:ProfileIcon}];
export function FloatingBottomNavigation(){const pathname=usePathname();const items=pathname==="/"||pathname.startsWith("/demo")?demoItems:appItems;return <nav className="floating-bottom-nav" aria-label="Navegación principal"><div className="floating-bottom-nav-inner">{items.map(({href,label,Icon})=>{const active=href==="/"?pathname===href:href==="/app"?pathname===href:pathname.startsWith(href);return <Link key={href} href={href} className={`nav-item ${active?"active":""}`} aria-current={active?"page":undefined}><Icon/><span>{label}</span></Link>})}</div></nav>}

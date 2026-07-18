"use client";
import Link from "next/link"; import { usePathname } from "next/navigation";
const items=[{href:"/app",label:"Hoy",icon:"●"},{href:"/app/ruta",label:"Ruta",icon:"◇"},{href:"/app/sos",label:"SOS",icon:"!"},{href:"/app/perfil",label:"Perfil",icon:"○"}];
export function BottomNav(){const pathname=usePathname();return <nav className="bottom-nav" aria-label="Navegación principal">{items.map(({href,label,icon})=>{const active=href==="/app"?pathname===href:pathname.startsWith(href);return <Link key={href} href={href} className={`nav-item ${active?"active":""}`} aria-current={active?"page":undefined}><span className="nav-icon" aria-hidden="true">{icon}</span>{label}</Link>})}</nav>}

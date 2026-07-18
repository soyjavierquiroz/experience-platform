import type { SVGProps } from "react";

type IconProps=SVGProps<SVGSVGElement>;
const base={width:22,height:22,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:1.8,strokeLinecap:"round" as const,strokeLinejoin:"round" as const,"aria-hidden":true};
export function HomeIcon(props:IconProps){return <svg {...base} {...props}><path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10M9 20v-6h6v6"/></svg>}
export function RouteIcon(props:IconProps){return <svg {...base} {...props}><circle cx="6" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><path d="M8 18h3a3 3 0 0 0 3-3v-6a3 3 0 0 1 3-3"/></svg>}
export function CommunityIcon(props:IconProps){return <svg {...base} {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
export function ProfileIcon(props:IconProps){return <svg {...base} {...props}><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>}
export function PauseIcon(props:IconProps){return <svg {...base} {...props}><path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z"/><path d="M9 9v6M15 9v6"/></svg>}
export function ArrowIcon(props:IconProps){return <svg {...base} {...props}><path d="M5 12h14M13 6l6 6-6 6"/></svg>}
export function PlayIcon(props:IconProps){return <svg {...base} {...props}><path d="m9 7 8 5-8 5V7Z"/></svg>}

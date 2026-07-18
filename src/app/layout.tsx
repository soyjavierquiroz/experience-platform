import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { brandingToCssVariables } from "@/features/tenants/branding";
import { getTenant } from "@/features/tenants/server";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> { const tenant=await getTenant(); return { title:{default:tenant.productName,template:`%s · ${tenant.productName}`},description:tenant.branding.tagline,manifest:"/manifest.webmanifest",appleWebApp:{capable:true,statusBarStyle:"default",title:tenant.shortName},icons:{icon:tenant.branding.assets.icon||"/icons/icon.svg",apple:tenant.branding.assets.icon||"/icons/icon-maskable.svg"} }; }
export async function generateViewport(): Promise<Viewport> { const tenant=await getTenant(); return {themeColor:tenant.branding.colors.primary,colorScheme:"light"}; }

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const tenant=await getTenant();
  return <html lang="es" style={brandingToCssVariables(tenant.branding)}><body><div className="site">{children}</div><Script id="sw-register" strategy="afterInteractive">{`if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js'));`}</Script></body></html>;
}

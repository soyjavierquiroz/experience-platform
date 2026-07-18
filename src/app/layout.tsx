import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = { title: { default: "Mujer, No Le Escribas", template: "%s · Mujer, No Le Escribas" }, description: "Siete días para pausar, comprender y volver a elegirte.", manifest: "/manifest.webmanifest", appleWebApp: { capable: true, statusBarStyle: "default", title: "MNLE" }, icons: { icon: "/icons/icon.svg", apple: "/icons/icon-maskable.svg" } };
export const viewport: Viewport = { themeColor: "#533b43", colorScheme: "light" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body><div className="site">{children}</div><Script id="sw-register" strategy="afterInteractive">{`if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js'));`}</Script></body></html>;
}

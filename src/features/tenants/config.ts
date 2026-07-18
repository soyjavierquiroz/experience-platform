import type { TenantConfig } from "./types";
import { tenantBrandingSchema } from "./branding";

export const tenants: TenantConfig[] = [{
  id: "mnle", slug: "mnle", productName: "Mujer, No Le Escribas", shortName: "MNLE",
  branding: tenantBrandingSchema.parse({
    colors: { background:"#f8f4e8",surface:"#fffdf7",surfaceMuted:"#f0e9f6",primary:"#452750",primaryForeground:"#fffdf7",secondary:"#d7c2ec",secondaryForeground:"#35203d",accent:"#b86f4b",accentForeground:"#1f1722",text:"#281f2b",textMuted:"#706575",border:"#d8cbdc",success:"#52765b",warning:"#b67a28",danger:"#9a3f4c" },
    typography: { headingFont:"Georgia, 'Times New Roman', serif",bodyFont:"Arial, Helvetica, sans-serif" },
    radius: { card:"24px",button:"16px" },
    assets: { logo:"",icon:"/icons/icon.svg",cover:"" },
    supportEmail: "soporte@sayk.us",
    tagline: "Siete días para pausar, comprender y volver a elegirte.",
  }),
  domains: [{ hostname: "mnle.sayk.us", primary: true }, { hostname: "mnle.localhost", primary: false }],
  journey: [
    { day: 1, title: "Reconoce el ciclo", objective: "Identificar qué ocurre antes, durante y después del impulso de escribirle.", available: true },
    { day: 2, title: "Haz espacio", objective: "Crear distancia entre el impulso y la acción.", available: false },
    { day: 3, title: "Escucha la necesidad", objective: "Nombrar lo que realmente estás buscando.", available: false },
    { day: 4, title: "Vuelve a los hechos", objective: "Separar la esperanza de la evidencia.", available: false },
    { day: 5, title: "Sostén el límite", objective: "Proteger la decisión que te devuelve calma.", available: false },
    { day: 6, title: "Recupera tu energía", objective: "Dirigir tu atención de vuelta hacia ti.", available: false },
    { day: 7, title: "Elígete de nuevo", objective: "Cerrar la semana con un plan consciente.", available: false },
  ],
}];

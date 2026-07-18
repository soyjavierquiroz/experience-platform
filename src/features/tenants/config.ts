import type { TenantConfig } from "./types";

export const tenants: TenantConfig[] = [{
  id: "mnle", slug: "mnle", productName: "Mujer, No Le Escribas", shortName: "MNLE",
  branding: { primary: "#533b43", accent: "#b97863", background: "#f7f2ed", themeColor: "#533b43", tagline: "Siete días para pausar, comprender y volver a elegirte." },
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

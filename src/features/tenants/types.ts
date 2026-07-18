import type { TenantBranding } from "./branding";
export type { TenantBranding } from "./branding";

export interface TenantDomain { hostname: string; primary: boolean }

export interface TenantDay { day: number; title: string; objective: string; available: boolean }

export interface TenantConfig {
  id: string;
  slug: string;
  productName: string;
  shortName: string;
  branding: TenantBranding;
  domains: TenantDomain[];
  journey: TenantDay[];
}

export interface TenantResolver { resolve(hostname?: string | null): Promise<TenantConfig | null> }

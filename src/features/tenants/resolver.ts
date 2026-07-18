import { env } from "@/lib/env";
import { tenants } from "./config";
import type { TenantConfig, TenantResolver } from "./types";

export function normalizeHostname(value?: string | null): string {
  return (value ?? "").split(":")[0].trim().toLowerCase().replace(/\.$/, "");
}

export class StaticTenantResolver implements TenantResolver {
  constructor(private readonly entries: TenantConfig[], private readonly fallbackSlug?: string) {}
  async resolve(hostname?: string | null): Promise<TenantConfig | null> {
    const host = normalizeHostname(hostname);
    const byDomain = this.entries.find((tenant) => tenant.domains.some((domain) => domain.hostname === host));
    if (byDomain) return byDomain;
    if (host === "localhost" || host === "127.0.0.1" || !host) return this.entries.find((tenant) => tenant.slug === this.fallbackSlug) ?? null;
    return null;
  }
}

export const tenantResolver = new StaticTenantResolver(tenants, env.DEFAULT_TENANT_SLUG);

import type { TenantConfig } from "@/features/tenants/types";
export function Brand({ tenant, compact = false }: { tenant: TenantConfig; compact?: boolean }) { return <div className="brand"><span className="brand-mark" aria-hidden="true">M</span>{!compact && <span>{tenant.productName}</span>}</div> }

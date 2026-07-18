import { eq } from "drizzle-orm";
import type { AppDatabase } from "@/db/client";
import { programDays, programs, tenantDomains, tenants } from "@/db/schema";
import { normalizeHostname } from "./resolver";
import type { TenantConfig, TenantResolver } from "./types";
import { tenantBrandingSchema } from "./branding";

export class DatabaseTenantResolver implements TenantResolver {
  constructor(private readonly db: AppDatabase,private readonly fallbackSlug="mnle") {}
  async resolve(hostname?: string | null): Promise<TenantConfig | null> {
    const host=normalizeHostname(hostname); if(!host)return null;
    const rows=await this.db.select({tenant:tenants}).from(tenantDomains).innerJoin(tenants,eq(tenantDomains.tenantId,tenants.id)).where(eq(tenantDomains.hostname,host)).limit(1);
    let row=rows[0];
    if(!row&&(host==="localhost"||host==="127.0.0.1")){const fallback=(await this.db.select().from(tenants).where(eq(tenants.slug,this.fallbackSlug)).limit(1))[0];if(fallback)row={tenant:fallback};}
    if(!row || row.tenant.status!=="active")return null;
    const program=await this.db.select().from(programs).where(eq(programs.tenantId,row.tenant.id)).limit(1);
    const days=program[0]?await this.db.select().from(programDays).where(eq(programDays.programId,program[0].id)).orderBy(programDays.dayNumber):[];
    return { id:row.tenant.id,slug:row.tenant.slug,productName:row.tenant.productName,shortName:row.tenant.shortName,branding:tenantBrandingSchema.parse(row.tenant.branding),domains:[{hostname:host,primary:true}],journey:days.map((day)=>({day:day.dayNumber,title:day.title,objective:day.objective,available:day.status==="available"})) };
  }
}

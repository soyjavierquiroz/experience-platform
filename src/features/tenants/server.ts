import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { tenantResolver } from "./resolver";
import { DatabaseTenantResolver } from "./database-resolver";
import { getDb } from "@/db/client";

export async function getTenant() {
  const requestHeaders = await headers();
  const forwarded = requestHeaders.get("x-forwarded-host")?.split(",")[0];
  const hostname=forwarded ?? requestHeaders.get("host");
  const hasDatabase=Boolean(process.env.DATABASE_URL || process.env.DATABASE_URL_FILE);
  if(process.env.NODE_ENV==="production" && !hasDatabase && process.env.NEXT_PHASE!=="phase-production-build") throw new Error("Database configuration is required in production");
  const resolver=hasDatabase?new DatabaseTenantResolver(getDb()):tenantResolver;
  const tenant = await resolver.resolve(hostname);
  if (!tenant) notFound();
  return tenant;
}

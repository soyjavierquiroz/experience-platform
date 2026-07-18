import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { tenantResolver } from "./resolver";

export async function getTenant() {
  const requestHeaders = await headers();
  const forwarded = requestHeaders.get("x-forwarded-host")?.split(",")[0];
  const tenant = await tenantResolver.resolve(forwarded ?? requestHeaders.get("host"));
  if (!tenant) notFound();
  return tenant;
}

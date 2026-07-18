import { describe, expect, it } from "vitest";
import { tenants } from "./config";
import { normalizeHostname, StaticTenantResolver } from "./resolver";

describe("StaticTenantResolver",()=>{const resolver=new StaticTenantResolver(tenants,"mnle");it("resolves the production hostname",async()=>expect((await resolver.resolve("mnle.sayk.us"))?.slug).toBe("mnle"));it("resolves hostname with a port",async()=>expect((await resolver.resolve("mnle.localhost:3000"))?.id).toBe("mnle"));it("uses configured fallback for localhost",async()=>expect((await resolver.resolve("localhost:3000"))?.slug).toBe("mnle"));it("does not leak a tenant to unknown hosts",async()=>expect(await resolver.resolve("unknown.example.com")).toBeNull());it("normalizes host casing and trailing dot",()=>expect(normalizeHostname("MNLE.SAYK.US.")).toBe("mnle.sayk.us"))});

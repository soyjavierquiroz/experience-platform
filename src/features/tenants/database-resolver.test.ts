import { describe,expect,it } from "vitest";
import type { AppDatabase } from "@/db/client";
import { DatabaseTenantResolver } from "./database-resolver";

function fakeDb(results:unknown[][]){let call=0;return {select:()=>{const rows=results[call++];const chain={from:()=>chain,innerJoin:()=>chain,where:()=>chain,limit:()=>Promise.resolve(rows),orderBy:()=>Promise.resolve(rows)};return chain;}} as unknown as AppDatabase;}
describe("DatabaseTenantResolver",()=>{it("maps an active tenant and its journey",async()=>{const tenant={id:"mnle",slug:"mnle",productName:"Mujer, No Le Escribas",shortName:"MNLE",status:"active",branding:{primary:"#533b43"}};const resolver=new DatabaseTenantResolver(fakeDb([[{tenant}],[{id:"program"}],[{dayNumber:1,title:"Reconoce el ciclo",objective:"Observar",status:"available"}]]));expect((await resolver.resolve("MNLE.SAYK.US:443"))?.journey[0]).toMatchObject({day:1,available:true});});it("does not resolve an inactive tenant",async()=>{const resolver=new DatabaseTenantResolver(fakeDb([[{tenant:{status:"inactive"}}]]));expect(await resolver.resolve("mnle.sayk.us")).toBeNull();});});

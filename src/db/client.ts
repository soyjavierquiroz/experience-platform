import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { requireRuntimeValue } from "@/lib/secrets";
import * as schema from "./schema";

let pool: Pool | undefined;
export function getPool() { const connectionString=process.env.NEXT_PHASE==="phase-production-build"?"postgresql://build:build@127.0.0.1/build":requireRuntimeValue("DATABASE_URL"); pool ??= new Pool({ connectionString, max: 10, idleTimeoutMillis: 30_000, connectionTimeoutMillis: 5_000 }); return pool; }
export function getDb() { return drizzle(getPool(), { schema }); }
export type AppDatabase = ReturnType<typeof getDb>;

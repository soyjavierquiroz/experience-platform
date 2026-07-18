import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import pg from "pg";
import { requiredValue } from "./runtime-config.mjs";

const pool=new pg.Pool({connectionString:requiredValue("DATABASE_URL"),max:1});
try {
  await pool.query("CREATE TABLE IF NOT EXISTS app_migrations (name text PRIMARY KEY, checksum text NOT NULL, applied_at timestamptz NOT NULL DEFAULT now())");
  for(const name of (await readdir(new URL("../drizzle/",import.meta.url))).filter((item)=>item.endsWith(".sql")).sort()){
    const sql=await readFile(new URL(`../drizzle/${name}`,import.meta.url),"utf8"); const checksum=createHash("sha256").update(sql).digest("hex");
    const existing=await pool.query("SELECT checksum FROM app_migrations WHERE name=$1",[name]);
    if(existing.rowCount){if(existing.rows[0].checksum!==checksum)throw new Error(`Migration checksum mismatch: ${name}`);continue;}
    const client=await pool.connect(); try{await client.query("BEGIN");await client.query(sql);await client.query("INSERT INTO app_migrations(name,checksum) VALUES($1,$2)",[name,checksum]);await client.query("COMMIT");}catch(error){await client.query("ROLLBACK");throw error;}finally{client.release();}
  }
} finally { await pool.end(); }

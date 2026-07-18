import { readFileSync } from "node:fs";

export function readRuntimeValue(name: string, source: Record<string,string|undefined> = process.env): string | undefined {
  const direct = source[name]?.trim();
  if (direct) return direct;
  const file = source[`${name}_FILE`]?.trim();
  if (!file) return undefined;
  return readFileSync(file, "utf8").trim();
}

export function requireRuntimeValue(name: string, source: Record<string,string|undefined> = process.env): string {
  const value = readRuntimeValue(name, source);
  if (!value) throw new Error(`Missing required runtime configuration: ${name} or ${name}_FILE`);
  return value;
}

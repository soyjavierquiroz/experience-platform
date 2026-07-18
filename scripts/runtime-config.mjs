import { readFileSync } from "node:fs";
export function runtimeValue(name) { const direct=process.env[name]?.trim(); if(direct)return direct; const file=process.env[`${name}_FILE`]?.trim(); return file?readFileSync(file,"utf8").trim():undefined; }
export function requiredValue(name){const value=runtimeValue(name);if(!value)throw new Error(`Missing required runtime configuration: ${name}`);return value;}

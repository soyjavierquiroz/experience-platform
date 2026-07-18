import { spawn } from "node:child_process";
import { runtimeValue } from "./runtime-config.mjs";
for(const name of ["DATABASE_URL","BETTER_AUTH_SECRET","AWS_ACCESS_KEY_ID","AWS_SECRET_ACCESS_KEY"]){const value=runtimeValue(name);if(value)process.env[name]=value;}
if(process.env.EMAIL_PROVIDER==="test"&&(process.env.NODE_ENV==="production"||process.env.ALLOW_TEST_EMAIL_PROVIDER!=="true"))throw new Error("Unsafe test email provider is forbidden");
for(const script of ["migrate.mjs","seed.mjs"]){const child=spawn(process.execPath,[new URL(script,import.meta.url).pathname],{stdio:"inherit",env:process.env});const code=await new Promise((resolve)=>child.on("exit",resolve));if(code!==0)process.exit(typeof code==="number"?code:1);}
const server=spawn(process.execPath,[new URL("../server.js",import.meta.url).pathname],{stdio:"inherit",env:process.env});
for(const signal of ["SIGTERM","SIGINT"])process.on(signal,()=>server.kill(signal));
server.on("exit",(code)=>process.exit(code??0));

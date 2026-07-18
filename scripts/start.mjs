import { spawn } from "node:child_process";
import { runtimeValue } from "./runtime-config.mjs";
for(const name of ["DATABASE_URL","BETTER_AUTH_SECRET"]){const value=runtimeValue(name);if(value)process.env[name]=value;}
if(process.env.EMAIL_PROVIDER==="test"&&process.env.NODE_ENV!=="test")throw new Error("Test email provider is forbidden outside tests");
if(process.env.EMAIL_PROVIDER==="ses"){
  for(const name of ["AWS_REGION","SES_FROM_EMAIL","AWS_ACCESS_KEY_ID_FILE","AWS_SECRET_ACCESS_KEY_FILE"])if(!process.env[name]?.trim())throw new Error(`Missing required SES configuration: ${name}`);
  for(const name of ["AWS_ACCESS_KEY_ID","AWS_SECRET_ACCESS_KEY"]){const value=runtimeValue(name);if(!value)throw new Error("Missing required SES credentials");process.env[name]=value;}
}
for(const script of ["migrate.mjs","seed.mjs"]){const child=spawn(process.execPath,[new URL(script,import.meta.url).pathname],{stdio:"inherit",env:process.env});const code=await new Promise((resolve)=>child.on("exit",resolve));if(code!==0)process.exit(typeof code==="number"?code:1);}
const publisher=spawn(process.execPath,[new URL("../content-publish.mjs",import.meta.url).pathname,"publish"],{stdio:"inherit",env:process.env});
const publishCode=await new Promise((resolve)=>publisher.on("exit",resolve));
if(publishCode!==0)process.exit(typeof publishCode==="number"?publishCode:1);
const server=spawn(process.execPath,[new URL("../server.js",import.meta.url).pathname],{stdio:"inherit",env:process.env});
for(const signal of ["SIGTERM","SIGINT"])process.on(signal,()=>server.kill(signal));
server.on("exit",(code)=>process.exit(code??0));

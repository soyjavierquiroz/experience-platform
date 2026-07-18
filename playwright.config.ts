import { defineConfig, devices } from "@playwright/test";
const externalBaseUrl=process.env.E2E_BASE_URL;
export default defineConfig({testDir:"./tests/e2e",fullyParallel:false,retries:1,reporter:"line",use:{baseURL:externalBaseUrl??"http://127.0.0.1:3100",trace:"retain-on-failure"},webServer:externalBaseUrl?undefined:{command:"HOSTNAME=127.0.0.1 PORT=3100 node .next/standalone/server.js",url:"http://127.0.0.1:3100/api/health",reuseExistingServer:false,timeout:120_000},projects:[{name:"mobile-chromium",use:{...devices["iPhone 13"],browserName:"chromium"}}]});

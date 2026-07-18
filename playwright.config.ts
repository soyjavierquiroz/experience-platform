import { defineConfig,devices } from "@playwright/test";
const externalBaseUrl=process.env.E2E_BASE_URL;
export default defineConfig({testDir:"./tests/e2e",timeout:90_000,fullyParallel:false,retries:1,reporter:"line",use:{baseURL:externalBaseUrl??"http://127.0.0.1:3100",trace:"retain-on-failure"},webServer:externalBaseUrl?undefined:{command:"pnpm build && pnpm exec next start -H 127.0.0.1 -p 3100",url:"http://127.0.0.1:3100/api/health",reuseExistingServer:false,timeout:180_000},projects:[{name:"mobile-chromium",use:{...devices["iPhone 13"],browserName:"chromium"}}]});

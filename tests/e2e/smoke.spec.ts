import { readFileSync } from "node:fs";
import { expect,test,type Page } from "@playwright/test";
import pg from "pg";

const email=`e2e-${Date.now()}@example.test`;
async function latestOtp(){const file=process.env.TEST_OTP_FILE;if(file){for(const line of readFileSync(file,"utf8").split("\n").reverse()){try{const row=JSON.parse(line) as {email:string;otp:string};if(row.email===email)return row.otp;}catch{continue;}}}if(process.env.DATABASE_URL){const client=new pg.Client({connectionString:process.env.DATABASE_URL});try{await client.connect();const result=await client.query<{otp:string}>("SELECT otp FROM test_email_otp WHERE email=$1",[email]);return result.rows[0]?.otp;}catch{return undefined;}finally{await client.end().catch(()=>undefined);}}return undefined;}
async function fillLatestOtp(page:Page,previous?:string){await expect.poll(async()=>{const value=await latestOtp();return value&&value!==previous?value:undefined;}).toMatch(/^\d{6}$/);const value=(await latestOtp())!;await page.getByLabel("Código de acceso").fill(value);return value;}

test("protected persistent OTP journey",async({page})=>{
  await page.goto("/app");await expect(page).toHaveURL(/\/acceso$/);
  await page.getByLabel("Email").fill(email);await page.getByRole("button",{name:"Enviarme el código"}).click();const firstOtp=await fillLatestOtp(page);await page.getByRole("button",{name:"Entrar"}).click();
  await expect(page.getByText("0 de 7")).toBeVisible();await page.getByRole("link",{name:"Empezar el Día 1"}).click();
  const reflection=page.getByLabel("Tu reflexión");await reflection.fill("Antes del impulso siento ansiedad y busco una respuesta inmediata.");await expect(page.getByText("Guardado",{exact:true})).toBeVisible();await page.reload();await expect(reflection).toHaveValue(/ansiedad/);
  await page.getByRole("button",{name:"Completar el Día 1"}).click();await expect(page.getByText("Día 1 completado")).toBeVisible();await page.goto("/app");await expect(page.getByText("1 de 7")).toBeVisible();
  await page.goto("/app/perfil");await page.getByRole("button",{name:"Cerrar sesión"}).click();await expect(page).toHaveURL(/\/acceso$/);
  await page.getByLabel("Email").fill(email);await page.getByRole("button",{name:"Enviarme el código"}).click();await fillLatestOtp(page,firstOtp);await page.getByRole("button",{name:"Entrar"}).click();await expect(page.getByText("1 de 7")).toBeVisible();
});
test("health includes database",async({request})=>{const response=await request.get("/api/health");expect(response.ok()).toBe(true);expect(await response.json()).toEqual({status:"ok",service:"experience-platform",database:"ok",tenant:"mnle"});});

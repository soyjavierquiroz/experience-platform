import { expect,test,type Page } from "@playwright/test";

const email=`e2e-${Date.now()}@example.test`;
async function fillTestOtp(page:Page){const code=process.env.TEST_OTP_CODE;if(!code)throw new Error("TEST_OTP_CODE is required for E2E");await page.getByLabel("Código de acceso").fill(code);}

test("protected persistent OTP journey",async({page})=>{
  await page.goto("/app");await expect(page).toHaveURL(/\/acceso$/);
  await page.getByLabel("Email").fill(email);await page.getByRole("button",{name:"Enviarme el código"}).click();await fillTestOtp(page);await page.getByRole("button",{name:"Entrar"}).click();
  await expect(page.getByText("0 de 7")).toBeVisible();await page.getByRole("link",{name:"SOS"}).click();await page.getByLabel("¿Qué quieres escribirle?").fill("Quiero saber si todavía piensa en mí.");await page.getByLabel("¿Qué esperas recibir al enviarlo?").fill("Una respuesta que me dé alivio.");await page.getByRole("button",{name:"Finalizar esta pausa"}).click();await expect(page.getByText("Pausa finalizada y guardada.")).toBeVisible();await page.goto("/app");await expect(page.getByText("0 de 7")).toBeVisible();await page.getByRole("link",{name:"Empezar el Día 1"}).click();
  const reflection=page.getByLabel("Tu reflexión");await reflection.fill("Antes del impulso siento ansiedad y busco una respuesta inmediata.");await page.getByLabel("¿Qué intensidad tiene hoy el impulso?").fill("7");for(const label of ["Identifiqué el detonante","Nombré la emoción","Reconocí la necesidad"])await page.getByLabel(label).check();await page.getByLabel("Confirmo mi acción").check();await expect(page.getByText("Guardado",{exact:true})).toBeVisible();await page.reload();await expect(reflection).toHaveValue(/ansiedad/);await expect(page.getByLabel("Confirmo mi acción")).toBeChecked();
  await page.getByRole("button",{name:"Completar el Día 1"}).click();await expect(page.getByText("Día 1 completado")).toBeVisible();await page.goto("/app");await expect(page.getByText("1 de 7")).toBeVisible();
  await page.goto("/app/perfil");await page.getByRole("button",{name:"Cerrar sesión"}).click();await expect(page).toHaveURL(/\/acceso$/);
  await page.getByLabel("Email").fill(email);await page.getByRole("button",{name:"Enviarme el código"}).click();await fillTestOtp(page);await page.getByRole("button",{name:"Entrar"}).click();await expect(page.getByText("1 de 7")).toBeVisible();
});
test("health includes database",async({request})=>{const response=await request.get("/api/health");expect(response.ok()).toBe(true);expect(await response.json()).toEqual({status:"ok",service:"experience-platform",database:"ok",tenant:"mnle"});});

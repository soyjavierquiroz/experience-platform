import { expect,test,type Page } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import pg from "pg";

const email=`e2e-${Date.now()}@example.test`;
async function fillTestOtp(page:Page){const code=process.env.TEST_OTP_CODE;if(!code)throw new Error("TEST_OTP_CODE is required for E2E");await page.getByLabel("Código de acceso").fill(code);}

test("protected persistent OTP journey",async({page})=>{
  await page.goto("/app");await expect(page).toHaveURL(/\/acceso$/);
  await page.getByLabel("Email").fill(email);await page.getByRole("button",{name:"Enviarme el código"}).click();await fillTestOtp(page);await page.getByRole("button",{name:"Entrar"}).click();
  await expect(page.getByText("Tu primer paso está listo.")).toBeVisible();await page.getByRole("link",{name:/Hacer mi P.A.U.S.A./}).click();await expect(page.getByRole("heading",{name:"No le escribas todavía."})).toBeVisible();await page.getByRole("button",{name:"Continuar sin audio"}).click();await page.getByLabel("En este momento quiero escribirle porque…").fill("Busco alivio inmediato.");await page.getByRole("button",{name:"Ya hice la pausa"}).click();await expect(page.getByRole("heading",{name:"Ponle nombre a lo que sientes."})).toBeVisible();await page.reload();await expect(page.getByRole("button",{name:"Ansiedad"})).toBeVisible();await page.goto("/app");await page.getByRole("link",{name:"Comenzar la experiencia"}).click();
  const reflection=page.getByLabel("Tu reflexión");await reflection.fill("Antes del impulso siento ansiedad y busco una respuesta inmediata.");await expect(page.getByText("Guardado",{exact:true})).toBeVisible();await page.getByLabel("¿Qué intensidad tiene hoy el impulso?").fill("7");for(const label of ["Identifiqué el detonante","Nombré la emoción","Reconocí la necesidad"])await page.getByLabel(label).check();await page.getByLabel("Confirmo mi acción").check();await expect(page.getByText("Guardado",{exact:true})).toBeVisible();await page.reload();await expect(reflection).toHaveValue(/ansiedad/);await expect(page.getByLabel("Confirmo mi acción")).toBeChecked();
  await page.getByRole("button",{name:"Completar el Día 1"}).click();await expect(page.getByText("Día 1 completado")).toBeVisible();await page.goto("/app");await expect(page.getByText("1 de 7")).toBeVisible();
  await page.goto("/app/perfil");await page.getByRole("button",{name:"Cerrar sesión"}).click();await expect(page).toHaveURL(/\/acceso$/);
  await page.getByLabel("Email").fill(email);await page.getByRole("button",{name:"Enviarme el código"}).click();await fillTestOtp(page);await page.getByRole("button",{name:"Entrar"}).click();await expect(page.getByText("1 de 7")).toBeVisible();
});

test("health includes database",async({request})=>{const response=await request.get("/api/health");expect(response.ok()).toBe(true);expect(await response.json()).toEqual({status:"ok",service:"experience-platform",database:"ok",tenant:"mnle"});});

test("public demo is fully navigable and keeps interactions locally",async({page})=>{
  const pool=new pg.Pool({connectionString:process.env.DATABASE_URL});const before=Number((await pool.query("select count(*) from sos_executions")).rows[0].count);
  await page.goto("/");await expect(page.getByRole("heading",{name:"Hola, María."})).toBeVisible();await page.getByRole("link",{name:/Hacer mi P.A.U.S.A./}).click();await expect(page).toHaveURL(/\/demo\/sos$/);
  const audio=await page.request.get("/media/mnle/00-sos/audio-emergencia.mp3");expect(audio.ok()).toBe(true);expect(audio.headers()["content-type"]).toContain("audio");await page.getByRole("button",{name:"Continuar sin audio"}).click();
  await page.getByLabel("En este momento quiero escribirle porque…").fill("Necesito sentir claridad antes de actuar.");await page.getByRole("button",{name:"Ya hice la pausa"}).click();await page.getByRole("button",{name:"Ansiedad"}).click();await page.getByRole("slider",{name:"Intensidad inicial"}).fill("8");await page.getByRole("button",{name:"Calma"}).click();await page.getByRole("button",{name:"Continuar"}).click();
  await page.getByLabel("Lo que realmente pasó").fill("No respondió mi último mensaje.");await page.getByLabel("Lo que mi ansiedad está imaginando").fill("Nunca le importé.");await page.getByRole("button",{name:"Mi miedo"}).click();await page.getByRole("button",{name:"Continuar"}).click();await page.getByRole("button",{name:"Escribir sin enviar"}).click();await page.getByRole("button",{name:"Elegir esta acción"}).click();
  await page.getByLabel("Lo que yo quería decirle era…").fill("Quería decirte que te extraño.");await page.getByLabel(/Lo que realmente quería/).fill("Que todavía me eliges.");await page.getByRole("button",{name:"Guardar sin enviar"}).click();await expect(page.getByText("Tu emoción salió. El mensaje no fue enviado.")).toBeVisible();await page.reload();await expect(page.getByLabel("Lo que yo quería decirle era…")).toHaveValue(/te extraño/);await page.getByRole("button",{name:"Continuar"}).click();
  await page.getByRole("radio",{name:/Mi paz también/}).click();await page.getByRole("button",{name:"Continuar"}).click();await page.getByRole("slider",{name:"Intensidad final"}).fill("4");await page.getByRole("button",{name:/Puedo esperar/}).click();await page.getByRole("button",{name:"Cerrar mi P.A.U.S.A."}).click();await expect(page.getByRole("heading",{name:"No actuaste en automático."})).toBeVisible();
  const guide=await page.request.get("/media/mnle/00-sos/guia-modulo-0.pdf");expect(guide.ok()).toBe(true);expect(guide.headers()["content-type"]).toContain("pdf");expect(await page.getByRole("link",{name:"Descargar la guía completa"}).getAttribute("href")).toBe("/media/mnle/00-sos/guia-modulo-0.pdf");expect(Number((await pool.query("select count(*) from sos_executions")).rows[0].count)).toBe(before);await pool.end();
  await page.goto("/demo/ruta");await expect(page).toHaveURL(/\/demo\/ruta$/);await page.getByRole("link",{name:"Perfil"}).click();await expect(page.getByRole("heading",{name:"María"})).toBeVisible();
  await page.goto("/acceso");await expect(page.getByRole("link",{name:"Explorar la experiencia demo"})).toHaveAttribute("href","/");await page.getByRole("link",{name:"Explorar la experiencia demo"}).click();await expect(page).toHaveURL(/\/$/);
  await page.context().clearCookies();await page.goto("/app");await expect(page).toHaveURL(/\/acceso$/);
});

test("premium dashboard is responsive, accessible and tenant-driven",async({page})=>{
  const visualEmail=`visual-${Date.now()}@example.test`;
  await page.goto("/acceso");
  await page.getByLabel("Email").fill(visualEmail);await page.getByRole("button",{name:"Enviarme el código"}).click();await fillTestOtp(page);await page.getByRole("button",{name:"Entrar"}).click();
  await expect(page).toHaveURL(/\/app$/);
  await expect(page.getByRole("heading",{name:"Hola, respira."})).toBeVisible();
  await expect(page.getByRole("link",{name:/Comenzar la experiencia/})).toHaveAttribute("href","/app/dia/1");
  await expect(page.getByRole("link",{name:/Hacer mi P.A.U.S.A./})).toHaveAttribute("href","/app/sos");
  await expect(page.getByRole("link",{name:"Hoy"})).toHaveAttribute("aria-current","page");
  await expect(page.locator(".student-avatar")).toHaveText(/^[A-Z0-9]{1,2}$/);
  expect(await page.locator("html").evaluate(element=>getComputedStyle(element).getPropertyValue("--primary").trim())).toMatch(/^#/);

  const reviewDir=resolve(process.cwd(),".tmp/ui-review");
  await mkdir(reviewDir,{recursive:true});
  for(const [width,height,name] of [[390,844,"dashboard-mobile-390x844.png"],[430,932,"dashboard-mobile-430x932.png"],[1440,1000,"dashboard-desktop-1440x1000.png"]] as const){await page.setViewportSize({width,height});await page.screenshot({path:resolve(reviewDir,name),fullPage:true});}
  for(const [width,height] of [[768,1024],[1440,1000]] as const){await page.setViewportSize({width,height});expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);await expect(page.getByRole("link",{name:/Comenzar la experiencia/})).toBeVisible();}
  await page.setViewportSize({width:390,height:844});await page.getByRole("link",{name:/Hacer mi P.A.U.S.A./}).scrollIntoViewIfNeeded();await page.screenshot({path:resolve(reviewDir,"dashboard-sos-visible.png"),fullPage:false});

  await page.locator(".today-hero p").evaluate(element=>{element.textContent="Este es un texto de prueba deliberadamente más largo para comprobar que la experiencia conserva su ritmo, su jerarquía y su legibilidad incluso cuando el contenido necesita ocupar varias líneas en una pantalla móvil."});
  await page.locator(".next-step-card p").evaluate(element=>{element.textContent="Una descripción extensa de prueba que valida cómo responde la tarjeta protagonista cuando el contenido crece sin cortar la llamada a la acción ni desbordar su superficie."});
  await page.screenshot({path:resolve(reviewDir,"dashboard-long-copy.png"),fullPage:true});await page.reload();

  await page.locator("html").evaluate(element=>{const values={"--background":"#eef6f4","--surface":"#ffffff","--surface-muted":"#deeeea","--primary":"#145c57","--primary-foreground":"#ffffff","--secondary":"#b8ddd5","--secondary-foreground":"#123d3a","--accent":"#ba6037","--accent-foreground":"#ffffff","--text":"#153532","--muted":"#55716e","--border":"#c5dcd8","--font-heading":"Palatino, serif","--font-body":"Verdana, sans-serif"};for(const [key,value] of Object.entries(values))element.style.setProperty(key,value);});
  await page.locator(".tenant-product").evaluate(element=>{element.textContent="Calma Contigo"});
  expect(await page.locator("html").evaluate(element=>getComputedStyle(element).getPropertyValue("--primary").trim())).toBe("#145c57");
  expect(await page.locator(".today-hero h1").evaluate(element=>getComputedStyle(element).fontFamily)).toContain("Palatino");
  await page.screenshot({path:resolve(reviewDir,"dashboard-second-tenant.png"),fullPage:true});

  await page.setViewportSize({width:320,height:568});await page.reload();expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
  await expect(page.getByRole("link",{name:/Comenzar la experiencia/})).toBeVisible();await page.getByRole("link",{name:/Comenzar la experiencia/}).focus();expect(await page.getByRole("link",{name:/Comenzar la experiencia/}).evaluate(element=>getComputedStyle(element).outlineStyle)).not.toBe("none");
  await page.emulateMedia({reducedMotion:"reduce"});expect(await page.locator(".today-hero").evaluate(element=>getComputedStyle(element).animationName)).toBe("none");
  await page.getByRole("link",{name:"Ruta"}).click();await expect(page.getByRole("link",{name:"Ruta"})).toHaveAttribute("aria-current","page");
});

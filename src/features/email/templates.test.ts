import { describe,expect,it } from "vitest";
import { tenants } from "@/features/tenants/config";
import { renderEmailTemplate } from "./templates";

describe("email templates",()=>{
  it("auth OTP renders HTML, text, subject and preview",()=>{const email=renderEmailTemplate(tenants[0],"auth-otp",{code:"123456"});expect(email).toMatchObject({subject:`Tu código para entrar a ${tenants[0].productName}`});expect(email.html).toContain("123456");expect(email.text).toContain("123456");expect(email.previewText).toBeTruthy();});
  it("uses each tenant branding without shared product colors",()=>{const other=structuredClone(tenants[0]);other.productName="Producto de prueba";other.branding.colors.primary="#164e63";other.branding.colors.background="#ecfeff";const html=renderEmailTemplate(other,"welcome",{appUrl:"https://example.test"}).html;expect(html).toContain("#164e63");expect(html).toContain("#ecfeff");expect(html).not.toContain("Mujer, No Le Escribas");expect(html).not.toContain(tenants[0].branding.colors.primary);});
});

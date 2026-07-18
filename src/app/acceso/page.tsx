import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { Brand } from "@/components/brand";
import { AccessForm } from "@/components/access-form";
import { getTenant } from "@/features/tenants/server";
import { auth } from "@/lib/auth";
import { emailConfig } from "@/features/email/runtime";

export default async function AccessPage(){const [tenant,session]=await Promise.all([getTenant(),auth.api.getSession({headers:await headers()})]);if(session)redirect("/app");return <main className="access-page"><section className="access-card"><Brand tenant={tenant}/><h1>Tu espacio está aquí</h1>{emailConfig.AUTH_EMAIL_OTP_ENABLED?<><p>Ingresa tu email y te enviaremos un código seguro. No necesitas recordar otra contraseña.</p><AccessForm/></>:<div className="callout" role="status"><strong>El acceso por email se habilitará próximamente.</strong><p>Estamos preparando una entrada segura y sencilla para ti.</p></div>}</section></main>}

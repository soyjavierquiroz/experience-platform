import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { Brand } from "@/components/brand";
import { AccessForm } from "@/components/access-form";
import { getTenant } from "@/features/tenants/server";
import { auth } from "@/lib/auth";

export default async function AccessPage(){const [tenant,session]=await Promise.all([getTenant(),auth.api.getSession({headers:await headers()})]);if(session)redirect("/app");return <main className="access-page"><section className="access-card"><Brand tenant={tenant}/><h1>Tu espacio está aquí</h1><p>Ingresa tu email y te enviaremos un código seguro. No necesitas recordar otra contraseña.</p><AccessForm/></section></main>}

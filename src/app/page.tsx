import Link from "next/link";
import { Brand } from "@/components/brand";
import { getTenant } from "@/features/tenants/server";

export default async function Landing() { const tenant = await getTenant(); return <><header className="container landing-header"><Brand tenant={tenant}/><Link className="text-link" href="/acceso">Acceder</Link></header><main className="container hero"><div className="hero-copy"><span className="eyebrow">Una pausa puede cambiarlo todo</span><h1>Antes de escribirle, vuelve a ti.</h1><p>{tenant.branding.tagline} Una experiencia íntima y práctica para atravesar el impulso con más claridad.</p><Link className="button" href="/acceso">Comenzar la experiencia</Link></div></main></> }

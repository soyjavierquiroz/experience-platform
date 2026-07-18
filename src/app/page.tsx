import { AppShell } from "@/components/app-shell";
import Link from "next/link";
import { NextStepCard,TodayHero } from "@/components/today-dashboard";
import { getTenant } from "@/features/tenants/server";

export default async function Landing(){
  const tenant=await getTenant();
  return <AppShell tenant={tenant} user={{email:"maria@demo.local",name:"María"}} demo>
    <div className="today-dashboard">
      <TodayHero eyebrow="Tu momento de hoy" title="Hola, María." description="Respira. No necesitas resolverlo todo ahora."/>
      <NextStepCard label="Módulo 0 · Siempre disponible" title="P.A.U.S.A." description="Antes de escribirle, vuelve a ti. Date diez minutos para escuchar lo que sientes antes de decidir." href="/demo/sos" action="Comenzar con una P.A.U.S.A."/>
      <Link className="home-day-one-link" href="/demo/dia/1">Ir directamente al Día 1</Link>
    </div>
  </AppShell>;
}

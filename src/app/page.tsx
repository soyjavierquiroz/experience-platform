import { AppShell } from "@/components/app-shell";
import Link from "next/link";
import { NextStepCard,QuickEntryAction,TodayHero } from "@/components/today-dashboard";
import { getTenant } from "@/features/tenants/server";

export default async function Landing(){
  const tenant=await getTenant();
  return <AppShell tenant={tenant} user={{email:"maria@demo.local",name:"María"}} demo>
    <div className="today-dashboard">
      <TodayHero eyebrow="Tu momento de hoy" title="Hola, María." description="Respira. No necesitas resolverlo todo ahora."/>
      <NextStepCard preparation label="Módulo 0" title="Antes de escribirle, vuelve a ti" description="Conoce el método, escucha a tu guía y completa una práctica antes de continuar al Día 1." href="/demo/modulo-0" action="Abrir módulo"/>
      <QuickEntryAction question="¿Estás a punto de escribirle?" subtitle="Haz una pausa breve antes de decidir." action="Hacer una pausa ahora" href="/demo/sos"/>
      <Link className="home-day-one-link" href="/demo/dia/1">Ir directamente al Día 1</Link>
    </div>
  </AppShell>;
}

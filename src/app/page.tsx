import { AppShell } from "@/components/app-shell";
import { NextStepCard,SosQuickAction,TodayHero } from "@/components/today-dashboard";
import { getTenant } from "@/features/tenants/server";

export default async function Landing(){
  const tenant=await getTenant();
  const day=tenant.journey.find(item=>item.day===1)??tenant.journey[0];
  return <AppShell tenant={tenant} user={{email:"maria@demo.local",name:"María"}} demo>
    <div className="today-dashboard">
      <TodayHero eyebrow="Tu momento de hoy" title="Hola, María." description="Respira. No necesitas resolverlo todo ahora."/>
      <NextStepCard label="Siguiente paso" title={day.title} description="Observa qué ocurre antes, durante y después del impulso de escribirle." href="/demo/dia/1" action="Comenzar la experiencia"/>
      <SosQuickAction question="¿Estás a punto de escribirle?" subtitle="Haz una pausa guiada antes de decidir." action="Hacer mi P.A.U.S.A." href="/demo/sos"/>
    </div>
  </AppShell>;
}

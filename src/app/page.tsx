import { AppShell } from "@/components/app-shell";
import { CompactProgress,NextStepCard,SosQuickAction,TodayHero } from "@/components/today-dashboard";
import { getTenant } from "@/features/tenants/server";

export default async function Landing(){
  const tenant=await getTenant();
  const day=tenant.journey.find(item=>item.day===1)??tenant.journey[0];
  return <AppShell tenant={tenant} user={{email:"Tu espacio",name:"Tú"}}>
    <div className="today-dashboard">
      <TodayHero eyebrow="Tu espacio de hoy" title="Hola, respira." description="No necesitas tener todas las respuestas. Solo dar el siguiente paso."/>
      <NextStepCard label="DÍA 1 · SIGUIENTE PASO" title={day.title} description={day.objective} href="/acceso" action="Empezar el Día 1"/>
      <CompactProgress completed={0} total={7} percent={0} message="Tu siguiente paso está listo para cuando tú quieras."/>
      <SosQuickAction question="¿Sientes el impulso de escribirle?" action="Pausar ahora" href="/acceso"/>
    </div>
  </AppShell>;
}

import { getDb } from "@/db/client";
import { CompactProgress,NextStepCard,SosQuickAction,TodayHero } from "@/components/today-dashboard";
import { getProgressSummary } from "@/features/progress/service";
import { getTenant } from "@/features/tenants/server";
import { requireSession } from "@/lib/session";

export default async function TodayPage(){
  const [tenant,session]=await Promise.all([getTenant(),requireSession()]);
  const progress=await getProgressSummary(getDb(),tenant.id,session.user.id);
  const day=tenant.journey.find(item=>item.day===1)??tenant.journey[0];
  const nextDay=tenant.journey.find(item=>item.day===2)??day;
  const complete=progress.completed>0;
  return <div className="today-dashboard">
    <TodayHero eyebrow="Tu espacio de hoy" title="Hola, respira." description={`${session.user.email}. No necesitas tener todas las respuestas. Solo dar el siguiente paso.`}/>
    <NextStepCard label={complete?"PRÓXIMAMENTE · DÍA 2":"DÍA 1 · SIGUIENTE PASO"} title={complete?nextDay.title:day.title} description={complete?"Tu siguiente espacio se abrirá muy pronto.":day.objective} href={complete?undefined:"/app/dia/1"} action={complete?undefined:"Empezar el Día 1"}/>
    <CompactProgress completed={progress.completed} total={progress.total} percent={progress.percent} message={complete?"Ya comenzaste. Tu siguiente espacio estará listo pronto.":"Tu siguiente paso está listo para cuando tú quieras."}/>
    <SosQuickAction question="¿Sientes el impulso de escribirle?" action="Pausar ahora" href="/app/sos"/>
  </div>;
}

import { getDb } from "@/db/client";
import { NextStepCard,QuickEntryAction,TodayHero } from "@/components/today-dashboard";
import { loadContent } from "@/features/content/loader";
import { getProgressSummary } from "@/features/progress/service";
import { getTenant } from "@/features/tenants/server";
import { requireSession } from "@/lib/session";

export default async function TodayPage(){
  const [tenant,session,content]=await Promise.all([getTenant(),requireSession(),loadContent()]);
  const progress=await getProgressSummary(getDb(),tenant.id,session.user.id);
  return <div className="today-dashboard">
    <TodayHero eyebrow="Tu espacio de hoy" title="Hola, respira." description={`${session.user.email}. No necesitas tener todas las respuestas. Solo dar el siguiente paso.`}/>
    <NextStepCard preparation label="Módulo 0" title="Antes de escribirle, vuelve a ti" description="Conoce el método, escucha a tu guía y completa una práctica antes de continuar al Día 1." href="/app/modulo-0" action="Abrir módulo" completed={progress.completed} total={progress.total} percent={progress.percent}/>
    {content.find(item=>item.tenant.tenantSlug===tenant.slug)?.modules.some(module=>module.entryModes.includes("quick"))&&<QuickEntryAction question="¿Estás a punto de escribirle?" subtitle="Haz una pausa guiada antes de decidir." action="Hacer una pausa ahora" href="/app/sos"/>}
  </div>;
}

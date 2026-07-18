import pg from "pg";
import { requiredValue } from "./runtime-config.mjs";

const branding={colors:{background:"#f8f4e8",surface:"#fffdf7",surfaceMuted:"#eee8f5",primary:"#452750",primaryForeground:"#fffdf7",secondary:"#d9cbea",secondaryForeground:"#35203d",accent:"#b18438",accentForeground:"#1f1722",text:"#281f2b",textMuted:"#706575",border:"#ded4df",success:"#467054",warning:"#a56f25",danger:"#9a3f4c"},typography:{headingFont:"Georgia, 'Times New Roman', serif",bodyFont:"Arial, Helvetica, sans-serif"},radius:{card:"24px",button:"16px"},assets:{logo:"",icon:"/icons/icon.svg",cover:""},tagline:"Siete días para pausar, comprender y volver a elegirte."};
const days=[
  [1,"reconoce-el-ciclo","Reconoce el ciclo","Identificar qué ocurre antes, durante y después del impulso de escribirle.","available"],
  [2,"haz-espacio","Haz espacio","Crear distancia entre el impulso y la acción.","coming_soon"],
  [3,"escucha-la-necesidad","Escucha la necesidad","Nombrar lo que realmente estás buscando.","coming_soon"],
  [4,"vuelve-a-los-hechos","Vuelve a los hechos","Separar la esperanza de la evidencia.","coming_soon"],
  [5,"sosten-el-limite","Sostén el límite","Proteger la decisión que te devuelve calma.","coming_soon"],
  [6,"recupera-tu-energia","Recupera tu energía","Dirigir tu atención de vuelta hacia ti.","coming_soon"],
  [7,"eligete-de-nuevo","Elígete de nuevo","Cerrar la semana con un plan consciente.","coming_soon"],
];
const blocks=[
  {id:"intro",type:"richText",paragraphs:["El impulso no aparece de la nada. Suele empezar con un momento, un pensamiento o una sensación que pide alivio inmediato.","Hoy no necesitas resolver toda la historia. Solo observarla con honestidad y sin juzgarte."]},
  {id:"video",type:"video",title:"Antes de enviar: mira el ciclo completo",duration:"4 min"},
  {id:"reflection",type:"reflection",prompt:"¿Qué suele ocurrir justo antes de que sientas el impulso de escribirle?"},
  {id:"action",type:"action",title:"La pausa de hoy",description:"Cuando aparezca el impulso, espera diez minutos. Escribe en una nota: qué pasó, qué sientes y qué necesitas. No tienes que tomar ninguna decisión durante esa pausa."},
  {id:"resource",type:"download",title:"Mapa del impulso",description:"Una guía breve para reconocer detonante, emoción, necesidad y decisión."},
  {id:"close",type:"callout",title:"Recuerda",text:"Pausar también es una decisión. Cada minuto de claridad cuenta.",tone:"calm"},
];
const pool=new pg.Pool({connectionString:requiredValue("DATABASE_URL"),max:1});
try { const client=await pool.connect(); try { await client.query("BEGIN");
  await client.query("INSERT INTO tenants(id,slug,product_name,short_name,status,branding) VALUES('mnle','mnle','Mujer, No Le Escribas','MNLE','active',$1) ON CONFLICT(id) DO UPDATE SET product_name=excluded.product_name,short_name=excluded.short_name,status=excluded.status,branding=excluded.branding,updated_at=now()",[JSON.stringify(branding)]);
  await client.query("INSERT INTO tenant_domains(tenant_id,hostname,is_primary) VALUES('mnle','mnle.sayk.us',true) ON CONFLICT(hostname) DO UPDATE SET tenant_id=excluded.tenant_id,is_primary=excluded.is_primary");
  const program=await client.query("INSERT INTO programs(tenant_id,slug,title,description,total_days,status) VALUES('mnle','reto-7-dias','Mujer, No Le Escribas','Siete días para pausar, comprender y volver a elegirte.',7,'active') ON CONFLICT(tenant_id,slug) DO UPDATE SET title=excluded.title,description=excluded.description,total_days=excluded.total_days,status=excluded.status,updated_at=now() RETURNING id");
  for(const [day,slug,title,objective,status] of days) await client.query("INSERT INTO program_days(program_id,day_number,slug,title,objective,status,content_blocks) VALUES($1,$2,$3,$4,$5,$6,$7) ON CONFLICT(program_id,day_number) DO UPDATE SET slug=excluded.slug,title=excluded.title,objective=excluded.objective,status=excluded.status,content_blocks=excluded.content_blocks,updated_at=now()",[program.rows[0].id,day,slug,title,objective,status,JSON.stringify(day===1?blocks:[])]);
  await client.query("COMMIT"); } catch(error){await client.query("ROLLBACK");throw error;} finally{client.release();}
} finally { await pool.end(); }

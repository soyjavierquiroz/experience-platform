import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { renderEmailTemplate, type EmailTemplateName, type TemplateVariables } from "../src/features/email/templates";
import { tenants } from "../src/features/tenants/config";

const tenant=tenants[0];const output=resolve(".tmp/email-previews");
const previews:Record<EmailTemplateName,TemplateVariables>={
  "auth-otp":{code:"123456"},welcome:{appUrl:"https://example.test/app"},
  "daily-reminder":{name:"Usuaria de prueba",dayTitle:"Día de prueba",action:"Haz una pausa consciente.",appUrl:"https://example.test/app",subject:"Recordatorio de prueba"},
  "event-invitation":{eventName:"Evento de demostración",date:"30 de junio de 2030",time:"18:00",timezone:"America/Mexico_City",description:"Este es un evento ficticio para revisar la plantilla.",eventUrl:"https://example.test/evento"},
  "creator-response":{creatorName:"Creadora de prueba",response:"Esta es una respuesta ficticia y breve.",appUrl:"https://example.test/app"},
};
async function main(){await mkdir(output,{recursive:true});for(const [name,variables] of Object.entries(previews) as [EmailTemplateName,TemplateVariables][]){const rendered=renderEmailTemplate(tenant,name,variables);await writeFile(resolve(output,`${name}.html`),rendered.html,"utf8");}console.log(`Generated ${Object.keys(previews).length} email previews in .tmp/email-previews`);}
void main();

import type { TenantConfig } from "@/features/tenants/types";
import { renderEmailTemplate, type EmailTemplateName, type TemplateVariables } from "./templates";
import type { EmailProvider, EmailSendResult } from "./types";

export class EmailService {
  constructor(private readonly provider: EmailProvider) {}
  async sendTemplate(input:{tenant:TenantConfig;template:EmailTemplateName;recipient:string;variables:TemplateVariables}):Promise<EmailSendResult>{const rendered=renderEmailTemplate(input.tenant,input.template,input.variables);return this.provider.send({to:input.recipient,subject:rendered.subject,html:rendered.html,text:rendered.text,replyTo:input.tenant.branding.supportEmail,tags:{tenant:input.tenant.slug,template:input.template},metadata:{tenantId:input.tenant.id,template:input.template}});}
}

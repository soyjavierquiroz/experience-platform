import { tenants } from "@/features/tenants/config";
import { parseEmailConfig } from "./config";
import { createEmailProvider } from "./providers";
import { EmailService } from "./service";

export const emailConfig = parseEmailConfig();
export const emailProvider = createEmailProvider(emailConfig);
export const emailService = new EmailService(emailProvider);
export const defaultEmailTenant = tenants[0];

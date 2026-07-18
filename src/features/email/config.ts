import { z } from "zod";

const booleanValue = z.preprocess((value) => value === true || value === "true", z.boolean());
const optionalString = z.preprocess((value) => typeof value === "string" && value.trim() === "" ? undefined : value, z.string().min(1).optional());

export const emailConfigSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  EMAIL_ENABLED: booleanValue.default(false),
  EMAIL_PROVIDER: z.enum(["disabled", "ses", "test"]).default("disabled"),
  AUTH_EMAIL_OTP_ENABLED: booleanValue.default(false),
  AWS_REGION: optionalString,
  SES_FROM_EMAIL: optionalString,
  SES_REPLY_TO_EMAIL: optionalString,
  AWS_ACCESS_KEY_ID_FILE: optionalString,
  AWS_SECRET_ACCESS_KEY_FILE: optionalString,
  TEST_OTP_CODE: optionalString,
}).superRefine((config, context) => {
  if (config.EMAIL_PROVIDER === "test" && config.NODE_ENV !== "test") context.addIssue({code:"custom",path:["EMAIL_PROVIDER"],message:"Test email provider is only allowed in NODE_ENV=test"});
  if (config.EMAIL_ENABLED && config.EMAIL_PROVIDER === "disabled") context.addIssue({code:"custom",path:["EMAIL_PROVIDER"],message:"Enabled email requires an active provider"});
  if (config.AUTH_EMAIL_OTP_ENABLED && !config.EMAIL_ENABLED) context.addIssue({code:"custom",path:["AUTH_EMAIL_OTP_ENABLED"],message:"Email OTP requires email to be enabled"});
  if (config.EMAIL_PROVIDER === "ses") {
    for (const key of ["AWS_REGION","SES_FROM_EMAIL","AWS_ACCESS_KEY_ID_FILE","AWS_SECRET_ACCESS_KEY_FILE"] as const) if (!config[key]) context.addIssue({code:"custom",path:[key],message:`${key} is required for SES`});
  }
});

export type EmailConfig = z.infer<typeof emailConfigSchema>;
export function parseEmailConfig(source: Record<string,string|undefined> = process.env): EmailConfig { return emailConfigSchema.parse(source); }

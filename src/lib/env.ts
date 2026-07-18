import { z } from "zod";

const envSchema = z.object({
  APP_URL: z.url().default("http://localhost:3000"),
  DEFAULT_TENANT_SLUG: z.string().min(1).default("mnle"),
  TENANT_RESOLUTION_MODE: z.enum(["hostname"]).default("hostname"),
});

export const env = envSchema.parse({
  APP_URL: process.env.APP_URL,
  DEFAULT_TENANT_SLUG: process.env.DEFAULT_TENANT_SLUG,
  TENANT_RESOLUTION_MODE: process.env.TENANT_RESOLUTION_MODE,
});

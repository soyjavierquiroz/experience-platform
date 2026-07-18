import { z } from "zod";

const base = { id: z.string().min(1) };
export const contentBlockSchema = z.discriminatedUnion("type", [
  z.object({ ...base, type: z.literal("heading"), text: z.string(), level: z.union([z.literal(2), z.literal(3)]) }),
  z.object({ ...base, type: z.literal("richText"), paragraphs: z.array(z.string()).min(1) }),
  z.object({ ...base, type: z.literal("video"), title: z.string(), duration: z.string().optional(), bunnyVideoId: z.string().optional() }),
  z.object({ ...base, type: z.literal("audio"), title: z.string(), src: z.string().optional() }),
  z.object({ ...base, type: z.literal("download"), title: z.string(), description: z.string(), href: z.string().optional() }),
  z.object({ ...base, type: z.literal("reflection"), prompt: z.string() }),
  z.object({ ...base, type: z.literal("action"), title: z.string(), description: z.string() }),
  z.object({ ...base, type: z.literal("callout"), title: z.string().optional(), text: z.string(), tone: z.enum(["calm", "notice"]).default("calm") }),
]);
export type ContentBlock = z.infer<typeof contentBlockSchema>;

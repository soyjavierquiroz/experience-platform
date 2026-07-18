import type { ContentBlock } from "./schema";

export const dayOneBlocks: ContentBlock[] = [
  { id: "intro", type: "richText", paragraphs: ["El impulso no aparece de la nada. Suele empezar con un momento, un pensamiento o una sensación que pide alivio inmediato.", "Hoy no necesitas resolver toda la historia. Solo observarla con honestidad y sin juzgarte."] },
  { id: "video", type: "video", title: "Antes de enviar: mira el ciclo completo", duration: "4 min" },
  { id: "reflection", type: "reflection", prompt: "Piensa en la última vez que quisiste escribirle. ¿Qué ocurrió justo antes y qué esperabas sentir después?" },
  { id: "action", type: "action", title: "La pausa de hoy", description: "Cuando aparezca el impulso, espera diez minutos. Escribe en una nota: qué pasó, qué sientes y qué necesitas. No tienes que tomar ninguna decisión durante esa pausa." },
  { id: "resource", type: "download", title: "Mapa del impulso", description: "Una guía breve para reconocer detonante, emoción, necesidad y decisión." },
  { id: "close", type: "callout", title: "Recuerda", text: "Pausar también es una decisión. Cada minuto de claridad cuenta.", tone: "calm" },
];

import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe,expect,it } from "vitest";
import { CompactProgress,NextStepCard,SosQuickAction } from "./today-dashboard";
import { StudentAvatar } from "./student-avatar";

describe("student experience components",()=>{
  it("renders the avatar fallback and accessible label",()=>{
    const html=renderToStaticMarkup(<StudentAvatar name="Ana López" email="ana@example.test"/>);
    expect(html).toContain("AL");
    expect(html).toContain("Perfil de Ana López");
  });

  it("renders a profile photo with useful alternative text",()=>{
    const html=renderToStaticMarkup(<StudentAvatar name="Ana López" email="ana@example.test" image="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E"/>);
    expect(html).toContain("Foto de perfil de Ana López");
    expect(html).toContain("data:image/svg+xml");
  });

  it("keeps CTA, progress and SOS contracts accessible",()=>{
    const html=renderToStaticMarkup(<><NextStepCard label="DÍA 1" title="Un título" description="Una descripción" href="/app/dia/1" action="Empezar el Día 1"/><CompactProgress completed={1} total={7} percent={14} message="Todo listo"/><SosQuickAction question="¿Necesitas una pausa?" action="Pausar ahora" href="/app/sos"/></>);
    expect(html).toContain('href="/app/dia/1"');
    expect(html).toContain('role="progressbar"');
    expect(html).toContain('aria-valuenow="14"');
    expect(html).toContain('href="/app/sos"');
  });

  it("provides reduced motion and visible focus without tenant-specific colors",()=>{
    const css=readFileSync(new URL("../app/globals.css",import.meta.url),"utf8");
    expect(css).toContain("@media (prefers-reduced-motion:reduce)");
    expect(css).toContain(":focus-visible");
    const premiumCss=css.slice(css.indexOf("/* Premium student experience */"));
    expect(premiumCss).not.toMatch(/#[0-9a-f]{3,8}\b/i);
  });
});

import { describe, expect, it } from "vitest";
import { brandingToCssVariables } from "./branding";
import { tenants } from "./config";

describe("tenant theme", () => {
  it("renders different semantic variables without changing components", () => {
    const first = tenants[0].branding;
    const second = structuredClone(first);
    second.colors.primary = "#164e63";
    second.colors.background = "#ecfeff";

    expect(brandingToCssVariables(first)["--primary"]).toBe("#452750");
    expect(brandingToCssVariables(second)["--primary"]).toBe("#164e63");
    expect(brandingToCssVariables(second)["--background"]).toBe("#ecfeff");
  });
});

import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { readRuntimeValue } from "./secrets";

describe("runtime secret reading", () => {
  it("prefers a normal variable", () => expect(readRuntimeValue("TOKEN", { TOKEN: "direct", TOKEN_FILE: "/missing" })).toBe("direct"));
  it("reads a trimmed FILE value", () => { const dir=mkdtempSync(join(tmpdir(),"secret-test-")); const file=join(dir,"value"); writeFileSync(file,"hidden\n",{mode:0o600}); expect(readRuntimeValue("TOKEN",{TOKEN_FILE:file})).toBe("hidden"); });
  it("returns undefined when neither source exists", () => expect(readRuntimeValue("TOKEN",{})).toBeUndefined());
});

import { describe, expect, it } from "vitest";

import { isEvidenceEditable } from "./utilities";

describe("isEvidenceEditable", () => {
  it("allows updating evidence for rejected requisitions", () => {
    expect(isEvidenceEditable("RECHAZADA")).toBe(true);
  });

  it("keeps approved requisitions read-only", () => {
    expect(isEvidenceEditable("Aprobada")).toBe(false);
  });
});

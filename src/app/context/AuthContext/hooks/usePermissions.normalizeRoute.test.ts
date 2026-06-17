import { describe, expect, it } from "vitest";

import { normalizeRoute } from "./usePermissions";

describe("normalizeRoute", () => {
  it("keeps organigrama routes on their own permission tree", () => {
    expect(normalizeRoute("/main-page/organigrama")).toBe(
      "/main-page/organigrama",
    );
    expect(normalizeRoute("/main-page/organigrama/departments?view=detail&id=1")).toBe(
      "/main-page/organigrama/departments",
    );
  });
});

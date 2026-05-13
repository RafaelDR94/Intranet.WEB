import { describe, expect, it } from "vitest";

import { normalizeRoute } from "./usePermissions";

describe("normalizeRoute", () => {
  it("maps organigrama routes to the organization chart permission tree", () => {
    expect(normalizeRoute("/main-page/organigrama")).toBe(
      "/main-page/humanresources/organizationchart",
    );
    expect(normalizeRoute("/main-page/organigrama/departments?view=detail&id=1")).toBe(
      "/main-page/humanresources/organizationchart/departments",
    );
  });
});

import { describe, expect, it } from "vitest";

import { createEmptyReport } from "./createEmptyReport";

describe("createEmptyReport", () => {
  it("inicializa idSpareParts vacio para reportes nuevos", () => {
    const report = createEmptyReport();

    expect(report.idSpareParts).toEqual([]);
    expect(report.refactions).toEqual([]);
  });
});

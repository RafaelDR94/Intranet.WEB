import { beforeEach, describe, expect, it, vi } from "vitest";

import { fetchLocalReportById } from "./fetchLocalReportById";

const findReportDocumentByFrontIdMock = vi.fn();

vi.mock("../../useReportBuilderStore/utilities/helpers", () => ({
  findReportDocumentByFrontId: (...args: unknown[]) => findReportDocumentByFrontIdMock(...args),
}));

describe("fetchLocalReportById", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("normaliza idSpareParts a un arreglo vacio cuando falta en un reporte local legacy", async () => {
    const setMock = vi.fn();
    const getMock = vi.fn(() => ({ currentReport: null }));

    findReportDocumentByFrontIdMock.mockResolvedValue({
      frontId: "FR-1",
      report: {
        id: "REP-1",
        refactions: [],
      },
    });

    await fetchLocalReportById("FR-1", setMock as any, getMock as any, true);

    expect(setMock).toHaveBeenCalledWith(
      expect.objectContaining({
        currentReport: expect.objectContaining({
          id: "REP-1",
          front_identifier: "FR-1",
          idSpareParts: [],
        }),
      }),
    );
  });
});

import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { createSampleReport } from "../../../../../testUtils/reportFixtures";

import useRefactions from "./useRefactions";

let currentReportMock = createSampleReport({
  refactions: [
    {
      description: "Sensor",
      brand: "Bosch",
      model: "B1",
      serialnumber: "SN-1",
      partnumber: "PN-1",
    },
  ],
});

vi.mock("@/app/stores/useReportsStore/useReportsStore", () => ({
  useReportsStore: (selector?: any) => {
    const state = { currentReport: currentReportMock };
    return typeof selector === "function" ? selector(state) : state;
  },
}));

describe("useRefactions", () => {
  beforeEach(() => {
    currentReportMock = createSampleReport({
      refactions: [
        {
          description: "Sensor",
          brand: "Bosch",
          model: "B1",
          serialnumber: "SN-1",
          partnumber: "PN-1",
        },
      ],
    });
  });

  it("mapea las refacciones del reporte en filas numeradas", () => {
    const { result } = renderHook(() => useRefactions());

    expect(result.current.rows).toEqual([
      {
        id: "1",
        index: 1,
        description: "Sensor",
        brand: "Bosch",
        model: "B1",
        serialnumber: "SN-1",
        partnumber: "PN-1",
      },
    ]);
    expect(result.current.compact).toBe(false);
    expect(result.current.containerRef.current).toBeNull();
  });

  it("devuelve una lista vacia cuando no hay refacciones", () => {
    currentReportMock = createSampleReport({ refactions: [] });

    const { result } = renderHook(() => useRefactions());
    expect(result.current.rows).toEqual([]);
  });
});

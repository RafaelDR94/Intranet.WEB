import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { createSampleReport } from "../../../../../testUtils/reportFixtures";

import useWorkMaps from "./useWorkMaps";

let currentReportMock = createSampleReport({
  maps: [
    {
      title: "Plano",
      description: "Zona A",
      urlimage: "map.png",
      date: "2024-01-01",
    },
  ],
});

vi.mock("@/app/stores/useReportsStore/useReportsStore", () => ({
  useReportsStore: (selector?: any) => {
    const state = { currentReport: currentReportMock };
    return typeof selector === "function" ? selector(state) : state;
  },
}));

describe("useWorkMaps", () => {
  beforeEach(() => {
    currentReportMock = createSampleReport({
      maps: [
        {
          title: "Plano",
          description: "Zona A",
          urlimage: "map.png",
          date: "2024-01-01",
        },
      ],
    });
  });

  it("transforma los mapas del reporte en items de visor", () => {
    const { result } = renderHook(() => useWorkMaps());

    expect(result.current.items).toEqual([
      {
        title: "Plano",
        description: "Zona A",
        image: "map.png",
      },
    ]);
  });

  it("usa valores por defecto cuando faltan titulos", () => {
    currentReportMock = createSampleReport({
      maps: [
        {
          title: undefined,
          description: "",
          urlimage: "map.png",
          date: "2024-01-01",
        },
      ],
    });

    const { result } = renderHook(() => useWorkMaps());

    expect(result.current.items[0].title).toBe("Mapa 1");
    expect(result.current.items[0].description).toBe("");
  });
});

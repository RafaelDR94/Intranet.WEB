import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { createSampleReport } from "../../../../../testUtils/reportFixtures";

import useActivities from "./useActivities";

let currentReportMock = createSampleReport({
  activities: [
    {
      title: undefined,
      description: "Revision",
      urlimage: "img.png",
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

describe("useActivities", () => {
  beforeEach(() => {
    currentReportMock = createSampleReport({
      activities: [
        {
          title: undefined,
          description: "Revision",
          urlimage: "img.png",
          date: "2024-01-01",
        },
      ],
    });
  });

  it("convierte la lista de actividades en items para el visor", () => {
    const { result } = renderHook(() => useActivities());

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0]).toEqual({
      title: "Actividad 1",
      description: "Revision",
      image: "img.png",
    });
  });

  it("retorna un arreglo vacio si no existen actividades", () => {
    currentReportMock = createSampleReport({ activities: [] });
    const { result } = renderHook(() => useActivities());

    expect(result.current.items).toEqual([]);
  });
});

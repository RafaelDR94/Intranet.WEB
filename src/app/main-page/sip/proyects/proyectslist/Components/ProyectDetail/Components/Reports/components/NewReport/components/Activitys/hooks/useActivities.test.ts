import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import useActivities from "./useActivities";

import { createSampleReport } from "@/app/main-page/sip/proyects/proyectslist/Components/ProyectDetail/Components/Reports/testUtils/reportFixtures";

const resetMock = vi.fn();
const setActivitiesMock = vi.fn();
let reportMock = createSampleReport();

vi.mock("@/app/stores/useActivitiesStore/useActivitiesStore", () => ({
  __esModule: true,
  default: (selector?: any) =>
    selector
      ? selector({
          setActivities: setActivitiesMock,
          reset: resetMock,
        })
      : { setActivities: setActivitiesMock, reset: resetMock },
}));

vi.mock("@/app/stores/useReportBuilderStore/useReportBuilderStore", () => ({
  __esModule: true,
  default: (selector?: any) =>
    selector
      ? selector({
          report: reportMock,
        })
      : { report: reportMock },
}));

describe("useActivities", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    reportMock = createSampleReport({
      activities: [
        {
          title: "Visita",
          date: "2024-05-01",
          description: "Revisión general",
          urlimage: "https://cdn.example.com/a.png",
        },
      ],
    });
  });

  it("reinicia la tienda, habilita el flujo y replica las actividades del reporte", async () => {
    const { result } = renderHook(() => useActivities());

    await waitFor(() => {
      expect(result.current.canStart).toBe(true);
    });

    expect(resetMock).toHaveBeenCalledTimes(1);
    expect(setActivitiesMock).toHaveBeenCalledWith(reportMock.activities);
    expect(result.current.report).toEqual(reportMock);
  });

  it("solo inicializa las actividades una unica vez", async () => {
    const { rerender } = renderHook(() => useActivities());

    await waitFor(() => {
      expect(setActivitiesMock).toHaveBeenCalledTimes(1);
    });

    act(() => {
      reportMock = createSampleReport({
        activities: [
          {
            title: "Nueva",
            date: "2024-05-02",
            description: "Cambio de equipo",
            urlimage: "https://cdn.example.com/b.png",
          },
        ],
      });
    });

    rerender();

    expect(setActivitiesMock).toHaveBeenCalledTimes(1);
  });
});

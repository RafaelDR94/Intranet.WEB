import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import useActivities from "./useActivities";

import { createSampleReport } from "@/app/main-page/proyects/proyects/proyectslist/Components/ProyectDetail/Components/Reports/testUtils/reportFixtures";

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

  it("habilita el flujo y replica una vez las actividades del reporte", async () => {
    const { result, unmount } = renderHook(() => useActivities());

    await waitFor(() => {
      expect(result.current.canStart).toBe(true);
    });

    expect(setActivitiesMock).toHaveBeenCalledWith(reportMock.activities);
    expect(result.current.report).toEqual(reportMock);
    expect(resetMock).not.toHaveBeenCalled();

    unmount();
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

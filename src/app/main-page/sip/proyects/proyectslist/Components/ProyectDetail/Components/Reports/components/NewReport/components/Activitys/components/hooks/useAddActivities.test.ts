import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import useAddActivities from "./useAddActivities";

import type { Activities as ActivityModel } from "@/app/mappings/reports/reports.types";
import { createSampleReport } from "@/app/main-page/sip/proyects/proyectslist/Components/ProyectDetail/Components/Reports/testUtils/reportFixtures";

let activitiesData: ActivityModel[] = [];
const addActivityMock = vi.fn((activity: ActivityModel) => {
  activitiesData = [...activitiesData, activity];
  return activitiesData;
});
const updateActivityMock = vi.fn((index: number, activity: ActivityModel) => {
  activitiesData = activitiesData.map((item, idx) => (idx === index ? activity : item));
  return activitiesData;
});
const removeActivityMock = vi.fn((index: number) => {
  activitiesData = activitiesData.filter((_, idx) => idx !== index);
  return activitiesData;
});
const setActivitiesMock = vi.fn((items: ActivityModel[]) => {
  activitiesData = [...items];
  return activitiesData;
});

const updateActivitiesMock = vi.fn();
const reportMock = createSampleReport({ activities: [] });

vi.mock("@/app/stores/useActivitiesStore/useActivitiesStore", () => ({
  __esModule: true,
  useActivitiesStore: (selector?: any) =>
    selector
      ? selector({
          activities: activitiesData,
          addActivity: addActivityMock,
          updateActivity: updateActivityMock,
          removeActivity: removeActivityMock,
          setActivities: setActivitiesMock,
        })
      : {
          activities: activitiesData,
          addActivity: addActivityMock,
          updateActivity: updateActivityMock,
          removeActivity: removeActivityMock,
          setActivities: setActivitiesMock,
        },
}));

vi.mock("@/app/stores/useReportBuilderStore/useReportBuilderStore", () => ({
  __esModule: true,
  default: (selector?: any) =>
    selector
      ? selector({
          report: reportMock,
          updateActivities: updateActivitiesMock,
        })
      : { report: reportMock, updateActivities: updateActivitiesMock },
}));

vi.mock("@/app/utilities/DatesHelper/Dateshelper", () => ({
  currentDate: () => "2024-05-10",
}));

class MockFileReader {
  public result: string | ArrayBuffer | null = null;
  public onload: ((this: FileReader, ev: ProgressEvent<FileReader>) => unknown) | null = null;
  public onerror: ((this: FileReader, ev: ProgressEvent<FileReader>) => unknown) | null = null;

  readAsDataURL(): void {
    this.result = "data:image/png;base64,mock";
    this.onload?.call(this as unknown as FileReader, {} as ProgressEvent<FileReader>);
  }
}

describe("useAddActivities", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    activitiesData = [];
    (globalThis as any).FileReader = MockFileReader;
    reportMock.clientsign = { url: "" };
    reportMock.activities = [];
  });

  it("exponer datos base para iniciar el formulario", () => {
    const { result } = renderHook(() => useAddActivities());

    expect(result.current.isFormValid).toBe(false);
    expect(result.current.viewerItems).toEqual([]);
    expect(result.current.formFields[0]?.value).toBe("Actividad 1");
    expect(result.current.hasSelection).toBe(false);
  });

  it("agrega una actividad nueva y sincroniza la tienda del builder", async () => {
    const { result, rerender } = renderHook(() => useAddActivities());
    const file = new File(["mock"], "actividad.png", { type: "image/png" });

    await act(async () => {
      result.current.handleImage(file);
    });

    expect(result.current.hasSelection).toBe(true);

    await act(async () => {
      await result.current.handleFormSubmit({
        title: "Inspeccion",
        date: "2024-05-11",
        description: "Actividad de prueba",
      });
    });

    expect(addActivityMock).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Inspeccion",
        date: "2024-05-11",
        description: "Actividad de prueba",
        urlimage: "data:image/png;base64,mock",
      })
    );
    expect(updateActivitiesMock).toHaveBeenCalledWith(activitiesData);
    expect(result.current.imagePreview).toBeNull();

    rerender();
    expect(result.current.viewerItems).toHaveLength(1);
  });

  it("permite editar, cancelar y eliminar actividades existentes", async () => {
    // estado inicial con una actividad
    activitiesData = [
      {
        title: "Inicial",
        date: "2024-05-01",
        description: "Descripcion inicial",
        urlimage: "data:image/png;base64,initial",
      },
    ];

    const { result, rerender } = renderHook(() => useAddActivities());

    act(() => {
      result.current.handleActivityEdit({ index: 0, activity: activitiesData[0] });
    });

    expect(result.current.isFormValid).toBe(true);
    expect(result.current.imagePreview).toBe("data:image/png;base64,initial");

    await act(async () => {
      await result.current.handleFormSubmit({
        title: "Actualizada",
        date: "2024-05-12",
        description: "Nueva descripcion",
      });
    });

    expect(updateActivityMock).toHaveBeenCalledWith(
      0,
      expect.objectContaining({ title: "Actualizada" })
    );

    rerender();
    act(() => {
      result.current.handleActivityDelete({ index: 0, activity: activitiesData[0] });
    });
    expect(result.current.pendingDelete).not.toBeNull();

    await act(async () => {
      await result.current.confirmActivityDelete();
    });

    expect(removeActivityMock).toHaveBeenCalledWith(0);
    expect(result.current.pendingDelete).toBeNull();
  });
});

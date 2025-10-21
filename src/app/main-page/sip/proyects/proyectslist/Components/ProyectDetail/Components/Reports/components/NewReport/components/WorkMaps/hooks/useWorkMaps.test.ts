import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import useWorkMaps from "./useWorkMaps";

import { createSampleReport } from "@/app/main-page/sip/proyects/proyectslist/Components/ProyectDetail/Components/Reports/testUtils/reportFixtures";

const updateMapsMock = vi.fn();

const report = createSampleReport({
  maps: [
    {
      title: "Mapa de trabajo",
      date: "2024-05-01",
      description: "Ubicacion actual",
      urlimage: "https://cdn.example.com/map.png",
    },
  ],
});

vi.mock("@/app/stores/useReportBuilderStore/useReportBuilderStore", () => ({
  __esModule: true,
  default: (selector?: any) =>
    selector
      ? selector({
          report,
          isReportHydrated: true,
          updateMaps: updateMapsMock,
        })
      : { report, isReportHydrated: true, updateMaps: updateMapsMock },
}));

vi.mock("@/app/utilities/FilesHelper/FilesHelper", () => ({
  fileToDataUrl: vi.fn(async () => "data:image/png;base64,new-map"),
}));

vi.mock("@/app/utilities/DatesHelper/Dateshelper", () => ({
  currentDate: () => "2024-05-10",
}));

describe("useWorkMaps", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    report.maps = [
      {
        title: "Mapa de trabajo",
        date: "2024-05-01",
        description: "Ubicacion actual",
        urlimage: "https://cdn.example.com/map.png",
      },
    ];
  });

  it("hidrata el estado con el mapa existente del reporte", () => {
    const { result } = renderHook(() => useWorkMaps());

    expect(result.current.isEditing).toBe(false);
    expect(result.current.direction).toBe("Ubicacion actual");
    expect(result.current.imagePreview).toBe("https://cdn.example.com/map.png");
  });

  it("permite seleccionar una nueva imagen y guardar el mapa", async () => {
    const { result } = renderHook(() => useWorkMaps());
    const file = new File(["map"], "map.png", { type: "image/png" });

    await act(async () => {
      await result.current.handleImageSelection(file);
    });

    expect(result.current.imagePreview).toBe("data:image/png;base64,new-map");
    expect(result.current.isEditing).toBe(true);

    act(() => {
      result.current.setDirection("Nueva ubicacion");
    });

    act(() => {
      result.current.handleSave();
    });

    expect(updateMapsMock).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          description: "Nueva ubicacion",
          urlimage: "data:image/png;base64,new-map",
        }),
      ])
    );
    expect(result.current.isEditing).toBe(false);
  });

  it("restaura el estado previo al cancelar la edicion", () => {
    const { result } = renderHook(() => useWorkMaps());

    act(() => {
      result.current.handleCancel();
    });

    expect(result.current.direction).toBe("Ubicacion actual");
    expect(result.current.imagePreview).toBe("https://cdn.example.com/map.png");
    expect(result.current.isEditing).toBe(false);
  });
});

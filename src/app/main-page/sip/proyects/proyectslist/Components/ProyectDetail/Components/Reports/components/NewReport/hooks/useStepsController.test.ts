import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import useStepsController from "./useStepsController";

import type { ReportModelContent } from "../types";

let mockUpdateQuery = vi.fn();
let mockAll: Record<string, unknown> = {};

vi.mock("@/app/hooks/useQuery/useQuery", () => ({
  __esModule: true,
  default: () => ({
    updateQuery: mockUpdateQuery,
    all: mockAll,
  }),
}));

const buildModel = (overrides: Partial<ReportModelContent> = {}): ReportModelContent => ({
  maps: true,
  diagnostic: true,
  solution: true,
  refactions: true,
  clientsign: true,
  ticket: true,
  ...overrides,
});

describe("useStepsController", () => {
  beforeEach(() => {
    mockUpdateQuery = vi.fn();
    mockAll = {};
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("filtra los pasos disponibles segun el modelo activo", () => {
    const model = buildModel({ maps: false, refactions: false, clientsign: true });

    const { result } = renderHook(() => useStepsController({ currentModel: model }));

    expect(result.current.steps.map((step) => step.id)).toEqual([
      "avance",
      "actividades",
      "equipos",
      "firma",
    ]);
  });

  it("sincroniza el paso actual con los query params al cambiarlo manualmente", async () => {
    const { result } = renderHook(() => useStepsController({ currentModel: buildModel() }));

    await waitFor(() => {
      expect(mockUpdateQuery).toHaveBeenCalledWith({ currentStep: "avance" });
    });

    act(() => {
      result.current.handleStepChange("actividades");
    });

    await waitFor(() => {
      expect(mockUpdateQuery).toHaveBeenCalledWith({ currentStep: "actividades" });
    });
    expect(result.current.currentStep).toBe("actividades");
  });

  it("restaura el paso desde la URL y ajusta las banderas de navegacion", async () => {
    mockAll = { currentStep: "firma" };
    const { result } = renderHook(() => useStepsController({ currentModel: buildModel() }));

    await waitFor(() => {
      expect(result.current.currentStep).toBe("firma");
    });
    expect(result.current.isBackValid).toBe(true);
    expect(result.current.isAdvanceValid).toBe(false);

    act(() => {
      result.current.handleStepChange("avance");
    });

    await waitFor(() => {
      expect(result.current.isBackValid).toBe(false);
      expect(result.current.isAdvanceValid).toBe(true);
    });
  });

  it("avanza y retrocede entre pasos disponibles respetando el orden del flujo", () => {
    const { result } = renderHook(() => useStepsController({ currentModel: buildModel() }));

    act(() => {
      result.current.handleStepChange("actividades");
    });

    act(() => {
      result.current.handleNext();
    });
    expect(result.current.currentStep).toBe("equipos");

    act(() => {
      result.current.handleBack();
    });
    expect(result.current.currentStep).toBe("actividades");
  });
});

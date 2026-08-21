import { beforeEach, describe, expect, it, vi } from "vitest";

import { fetchWorkpositionsByDepartment } from "./fetchWorkpositionsByDepartment";

const pGetMock = vi.fn();
const requireGatewayMock = vi.fn();
const normalizeApiErrorMock = vi.fn((err: any) => ({
  message: err?.message ?? "normalized error",
}));

vi.mock("@/app/utilities/Http/promisifyIntranet", () => ({
  pGet: () => pGetMock,
}));

vi.mock("@/app/utilities/Http/requireGateway", () => ({
  requireGateway: (...args: any[]) => requireGatewayMock(...args),
}));

vi.mock("@/app/utilities/Http/normalizeApiError", () => ({
  normalizeApiError: (...args: any[]) => normalizeApiErrorMock(...args),
}));

describe("fetchWorkpositionsByDepartment", () => {
  beforeEach(() => {
    pGetMock.mockReset();
    requireGatewayMock.mockReset();
    normalizeApiErrorMock.mockClear();
  });

  it("obtiene y cachea puestos por departamento", async () => {
    const set = vi.fn();
    const get = vi.fn(() => ({
      workpositionsByDepartment: {},
    }));

    requireGatewayMock.mockReturnValue(vi.fn());
    pGetMock.mockResolvedValue({
      data: {
        data: [{ workposition_id: "wp-1", name: "Developer" }],
      },
    });

    const result = await fetchWorkpositionsByDepartment("dep-1", set, get, false);

    expect(pGetMock).toHaveBeenCalledWith(
      "/Enterprises/WorkPositions/ByIdDepartment/dep-1"
    );
    expect(result).toEqual([{ workposition_id: "wp-1", name: "Developer" }]);
    expect(set).toHaveBeenCalledWith(
      expect.objectContaining({
        loadingWorkpositions: true,
        successGetWorkpositions: false,
        currentDepartmentId: "dep-1",
      })
    );
    expect(set).toHaveBeenLastCalledWith(
      expect.objectContaining({
        loadingWorkpositions: false,
        successGetWorkpositions: true,
        workpositions: [{ workposition_id: "wp-1", name: "Developer" }],
        workpositionsByDepartment: {
          "dep-1": [{ workposition_id: "wp-1", name: "Developer" }],
        },
      })
    );
  });

  it("usa cache cuando existe y force es false", async () => {
    const set = vi.fn();
    const get = vi.fn(() => ({
      workpositionsByDepartment: {
        "dep-1": [{ workposition_id: "wp-1", name: "Developer" }],
      },
    }));

    const result = await fetchWorkpositionsByDepartment("dep-1", set, get, false);

    expect(result).toEqual([{ workposition_id: "wp-1", name: "Developer" }]);
    expect(pGetMock).not.toHaveBeenCalled();
    expect(set).toHaveBeenCalledWith(
      expect.objectContaining({
        workpositions: [{ workposition_id: "wp-1", name: "Developer" }],
        currentDepartmentId: "dep-1",
        successGetWorkpositions: true,
      })
    );
  });

  it("normaliza el error cuando falla la peticion", async () => {
    const set = vi.fn();
    const get = vi.fn(() => ({
      workpositionsByDepartment: {},
    }));

    requireGatewayMock.mockReturnValue(vi.fn());
    pGetMock.mockRejectedValue(new Error("request failed"));

    const result = await fetchWorkpositionsByDepartment("dep-1", set, get, false);

    expect(result).toEqual([]);
    expect(normalizeApiErrorMock).toHaveBeenCalled();
    expect(set).toHaveBeenLastCalledWith(
      expect.objectContaining({
        loadingWorkpositions: false,
        successGetWorkpositions: false,
        error: "request failed",
      })
    );
  });
});

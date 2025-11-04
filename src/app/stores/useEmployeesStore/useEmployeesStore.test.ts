import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Set } from "./types";

const { fetchEmployeesMock, fetchEmployeeByIdMock } = vi.hoisted(() => {
  const employeesMock = vi.fn(async (set: Set) => {
    set({
      employees: [{ id: "1" } as any],
      loading: false,
      successGet: true,
    });
  });

  const employeeByIdMock = vi.fn(async (id: string, set: Set) => {
    set({
      employee: { employee_id: id } as any,
      loadingById: false,
      successGetById: true,
    });
    return { employee_id: id } as any;
  });

  return { fetchEmployeesMock: employeesMock, fetchEmployeeByIdMock: employeeByIdMock };
});

vi.mock("./utilities", () => ({
  fetchEmployees: fetchEmployeesMock,
  fetchActiveEmployees: vi.fn(async () => {}),
  fetchEmployeeById: fetchEmployeeByIdMock,
  createEmployee: vi.fn(async () => null),
  updateEmployee: vi.fn(async () => null),
  deleteEmployee: vi.fn(async () => true),
  activateEmployee: vi.fn(async () => null),
}));

import { useEmployeesStore } from "./useEmployeesStore";

describe("useEmployeesStore", () => {
  beforeEach(() => {
    const { reset, resetFlags } = useEmployeesStore.getState();
    reset();
    resetFlags();
    fetchEmployeesMock.mockClear();
    fetchEmployeeByIdMock.mockClear();
  });

  it("starts with empty collections", () => {
    const state = useEmployeesStore.getState();
    expect(state.employees).toEqual([]);
    expect(state.activeEmployees).toEqual([]);
    expect(state.employee).toBeUndefined();
    expect(state.loading).toBe(false);
    expect(state.loadingById).toBe(false);
  });

  it("fetchEmployees updates list and success flag", async () => {
    await useEmployeesStore.getState().fetchEmployees();
    expect(fetchEmployeesMock).toHaveBeenCalledTimes(1);
    expect(useEmployeesStore.getState().employees).toEqual([{ id: "1" }]);
    expect(useEmployeesStore.getState().successGet).toBe(true);
  });

  it("fetchEmployeeById updates employee detail", async () => {
    const result = await useEmployeesStore
      .getState()
      .fetchEmployeeById("abc");
    expect(fetchEmployeeByIdMock).toHaveBeenCalledWith(
      "abc",
      expect.any(Function),
      expect.any(Function),
      false
    );
    expect(result).toEqual({ employee_id: "abc" });
    expect(useEmployeesStore.getState().employee).toEqual({
      employee_id: "abc",
    });
    expect(useEmployeesStore.getState().successGetById).toBe(true);
  });
});

import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import useNewProyect from "./useNewProyect";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
  useSearchParams: () => ({ get: () => null }),
}));

vi.mock("@/app/context/PrincipalContext/PrincipalContext", () => ({
  usePrincipal: () => ({
    usePrincipalLoading: { showSpinner: vi.fn(), hideSpinner: vi.fn() },
    usePrincipalAlert: { showAlert: vi.fn(), hideAlert: vi.fn() },
  }),
}));

vi.mock("@/app/stores/useEmployeesStore/useEmployeesStore", () => ({
  useEmployeesStore: (selector: (state: unknown) => unknown) =>
    selector({ employees: [], loading: false, error: undefined, fetchEmployees: vi.fn() }),
}));

const createLocation = vi.fn(async () => null);
vi.mock("@/app/stores/useProyectLocationStore/useProyectLocationStore", () => ({
  __esModule: true,
  default: (selector: (state: unknown) => unknown) =>
    selector({
      locations: [],
      loadingLocations: false,
      error: undefined,
      fetchAllLocations: vi.fn(),
      createLocation,
    }),
}));

const createProyect = vi.fn(async () => undefined);
const updateProyect = vi.fn(async () => undefined);
const resetFlags = vi.fn();

vi.mock("@/app/stores/useProyectsStore/useProyectsStore", () => ({
  useProyectsStore: (selector: (state: unknown) => unknown) =>
    selector({
      proyects: [],
      fetchProyects: vi.fn(),
      createProyect,
      updateProyect,
      creating: false,
      updating: false,
      successPost: false,
      successPut: false,
      error: undefined,
      resetFlags,
    }),
}));

describe("useNewProyect hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calcula formReady segun datos obligatorios", () => {
    const { result } = renderHook(() => useNewProyect());

    expect(result.current.formReady).toBe(false);

    act(() => {
      result.current.setClient("Cliente");
      result.current.setName("Proyecto");
      result.current.setProyectKey("PRY");
      result.current.setPendingCollaboratorId("user-1");
    });

    act(() => {
      result.current.addCollaborator();
    });

    expect(result.current.formReady).toBe(true);
    expect(result.current.creating).toBe(false);
  });

  it("submit llama createProyect con payload minimo", async () => {
    const { result } = renderHook(() => useNewProyect());

    act(() => {
      result.current.setClient(" C ");
      result.current.setName(" N ");
      result.current.setProyectKey(" K ");
      result.current.setPendingCollaboratorId("user-99");
    });

    act(() => {
      result.current.addCollaborator();
    });

    await act(async () => {
      await result.current.submit();
    });

    expect(createProyect).toHaveBeenCalledWith({
      client: "C",
      name: "N",
      proyectKey: "K",
      managerId: "user-99",
      collaborators: ["user-99"],
    });
    expect(updateProyect).not.toHaveBeenCalled();
  });
});

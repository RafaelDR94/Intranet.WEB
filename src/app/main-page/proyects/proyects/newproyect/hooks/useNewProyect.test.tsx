import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import useNewProyect from "./useNewProyect";

let searchParamId: string | null = null;
let currentProyectState: Record<string, any> | null = null;
const fetchProyectByIdMock = vi.fn(async () => currentProyectState);
const clearCurrentProyectMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
  useSearchParams: () => ({ get: () => searchParamId }),
}));

vi.mock("@/app/context/PrincipalContext/PrincipalContext", () => ({
  usePrincipal: () => ({
    usePrincipalLoading: { showSpinner: vi.fn(), hideSpinner: vi.fn() },
    usePrincipalAlert: { showAlert: vi.fn(), hideAlert: vi.fn() },
  }),
}));

const employeesState = {
  employees: [] as Array<Record<string, any>>,
  loading: false,
  error: undefined,
  fetchEmployees: vi.fn(),
};

vi.mock("@/app/stores/useEmployeesStore/useEmployeesStore", () => ({
  useEmployeesStore: (selector: (state: unknown) => unknown) =>
    selector(employeesState),
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
      currentProyect: currentProyectState,
      fetchProyectById: fetchProyectByIdMock,
      clearCurrentProyect: clearCurrentProyectMock,
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
    searchParamId = null;
    currentProyectState = null;
    employeesState.employees = [
      {
        id: "emp-1",
        employee_id: "emp-1",
        employee_number: "0001",
        firstname: "Bruno",
        secondname: "",
        lastname: "Mendoza",
        motherlast_name: null,
        gender: "M",
        email: "bruno.mendoza@drsecurity.net",
        phone_number: "55 1111 1111",
        extension: "",
        image_url: "https://cdn.example.com/bruno.png",
        manager_id: "",
        department: {},
        workposition: {},
        user: { user_id: "user-1" },
        is_active: true,
        is_gerence: false,
        dr_fingerprint: false,
        fullname: "Bruno Mendoza",
        workposition_name: "Lead Frontend",
        employee_phone: "55 5555 5555",
        employee_email: "bruno.mendoza@drsecurity.net",
      },
      {
        id: "emp-2",
        employee_id: "emp-2",
        employee_number: "0002",
        firstname: "Rafael",
        secondname: "",
        lastname: "Gomez",
        motherlast_name: null,
        gender: "M",
        email: "rafael.gomez@drsecurity.net",
        phone_number: "55 2222 2222",
        extension: "",
        image_url: "",
        manager_id: "",
        department: {},
        workposition: {},
        user: { user_id: "user-2" },
        is_active: true,
        is_gerence: false,
        dr_fingerprint: false,
        fullname: "Rafael Gomez",
        workposition_name: "Lead Desarrollo",
        employee_phone: "",
        employee_email: "",
      },
    ];
  });

  it("calcula formReady segun datos obligatorios", () => {
    const { result } = renderHook(() => useNewProyect());

    expect(result.current.formReady).toBe(false);

    act(() => {
      result.current.setClient("Cliente");
      result.current.setName("Proyecto");
      result.current.setProyectKey("PRY");
    });

    expect(result.current.formReady).toBe(true);
    expect(result.current.creating).toBe(false);
  });

  it("evita duplicados y permite remover colaboradores", () => {
    const { result } = renderHook(() => useNewProyect());

    act(() => {
      result.current.setPendingCollaboratorId("emp-1");
    });

    act(() => {
      result.current.addCollaborator();
    });

    act(() => {
      result.current.setPendingCollaboratorId("emp-1");
    });

    act(() => {
      result.current.addCollaborator();
    });

    expect(result.current.collaboratorRows).toHaveLength(1);

    act(() => {
      result.current.removeCollaborator("emp-1");
    });

    expect(result.current.collaboratorRows).toHaveLength(0);
  });

  it("expone filas listas para UI con fallbacks", () => {
    const { result } = renderHook(() => useNewProyect());

    act(() => {
      result.current.setPendingCollaboratorId("emp-2");
    });

    act(() => {
      result.current.addCollaborator();
    });

    expect(result.current.collaboratorRows).toEqual([
      {
        id: "emp-2",
        fullname: "Rafael Gomez",
        workPosition: "Lead Desarrollo",
        phone: "55 2222 2222",
        email: "rafael.gomez@drsecurity.net",
        avatarSrc: "",
        avatarInitials: "RG",
      },
    ]);
  });

  it("submit llama createProyect con payload minimo", async () => {
    const { result } = renderHook(() => useNewProyect());

    act(() => {
      result.current.setClient(" C ");
      result.current.setName(" N ");
      result.current.setProyectKey(" K ");
    });

    await act(async () => {
      await result.current.submit();
    });

    expect(createProyect).toHaveBeenCalledWith({
      client: "C",
      name: "N",
      proyectKey: "K",
      managerId: "",
      collaborators: [],
    });
    expect(updateProyect).not.toHaveBeenCalled();
  });

  it("envia collaborators con employee_id y conserva managerId con user_id", async () => {
    const { result } = renderHook(() => useNewProyect());

    act(() => {
      result.current.setClient("Cliente");
      result.current.setName("Proyecto");
      result.current.setProyectKey("PRY");
      result.current.setPendingCollaboratorId("emp-1");
    });

    act(() => {
      result.current.addCollaborator();
    });

    await act(async () => {
      await result.current.submit();
    });

    expect(createProyect).toHaveBeenCalledWith({
      client: "Cliente",
      name: "Proyecto",
      proyectKey: "PRY",
      managerId: "user-1",
      collaborators: ["emp-1"],
    });
  });

  it("hidrata el formulario de update desde fetchProyectById/currentProyect", async () => {
    searchParamId = "proj-1";
    currentProyectState = {
      id: "proj-1",
      client: "Cliente editado",
      name: "Proyecto editado",
      proyectKey: "EDIT",
      collaborators: [employeesState.employees[0], employeesState.employees[1]],
    };

    const { result } = renderHook(() => useNewProyect());

    expect(fetchProyectByIdMock).toHaveBeenCalledWith("proj-1");

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.isEditing).toBe(true);
    expect(result.current.client).toBe("Cliente editado");
    expect(result.current.name).toBe("Proyecto editado");
    expect(result.current.proyectKey).toBe("EDIT");
    expect(result.current.collaboratorRows).toHaveLength(2);
    expect(result.current.collaboratorRows[0]?.id).toBe("emp-1");
    expect(result.current.collaboratorRows[0]?.fullname).toBe("Bruno Mendoza");
  });
});

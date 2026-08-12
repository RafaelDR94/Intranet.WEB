import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import useInternalDevicesAsignationPage from "./useInternalDevicesAsignationPage";

const {
  showAlert,
  showSpinner,
  hideSpinner,
  updateQuery,
  getQueryState,
  setQueryState,
  getEmployeesStoreState,
  setEmployeesStoreState,
  getInternalDevicesStoreState,
  setInternalDevicesStoreState,
  getAuthState,
  setAuthState,
  useInternalDevicesAsignationTableMock,
} = vi.hoisted(() => {
  let queryState: any;
  let employeesStoreState: any;
  let internalDevicesStoreState: any;
  let authState: any;

  return {
    showAlert: vi.fn(),
    showSpinner: vi.fn(),
    hideSpinner: vi.fn(),
    updateQuery: vi.fn(),
    getQueryState: () => queryState,
    setQueryState: (value: any) => {
      queryState = value;
    },
    getEmployeesStoreState: () => employeesStoreState,
    setEmployeesStoreState: (value: any) => {
      employeesStoreState = value;
    },
    getInternalDevicesStoreState: () => internalDevicesStoreState,
    setInternalDevicesStoreState: (value: any) => {
      internalDevicesStoreState = value;
    },
    getAuthState: () => authState,
    setAuthState: (value: any) => {
      authState = value;
    },
    useInternalDevicesAsignationTableMock: vi.fn(),
  };
});

vi.mock("@/app/context/PrincipalContext/PrincipalContext", () => ({
  usePrincipal: () => ({
    usePrincipalAlert: { showAlert },
    usePrincipalLoading: { showSpinner, hideSpinner },
  }),
}));

vi.mock("@/app/context/AuthContext/AuthContext", () => ({
  useAuth: () => getAuthState(),
}));

vi.mock("@/app/context/FirebaseContext/FirebaseContext", () => ({
  useFirebase: () => ({
    firebasestorage: {
      uploadFile: vi.fn(),
    },
  }),
}));

vi.mock("@/app/hooks/useQuery/useQuery", () => ({
  __esModule: true,
  default: () => getQueryState(),
}));

vi.mock(
  "@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery",
  () => ({
    useIsMobile: () => false,
  }),
);

vi.mock("@/tutorials/engine/useTutorialAutoRun", () => ({
  __esModule: true,
  default: vi.fn(),
}));

vi.mock("./useInternalDevicesAsignation", () => ({
  __esModule: true,
  default: () => ({
    deviceAssignments: [],
    handleRefresh: vi.fn(),
  }),
}));

vi.mock("./useInternalDevicesAsignationTable", () => ({
  __esModule: true,
  default: useInternalDevicesAsignationTableMock.mockImplementation(() => ({
    columns: [],
    rows: [],
    searchableKeys: [],
    statusFilter: "all",
    statusFilterOptions: [],
    handleStatusFilterChange: vi.fn(),
  })),
}));

vi.mock("@/app/utilities/PDF/PDF", () => ({
  CreatePDFBlob: vi.fn(),
}));

vi.mock("@/app/stores/useEmployeesStore/useEmployeesStore", () => ({
  useEmployeesStore: (selector: any) => selector(getEmployeesStoreState()),
}));

vi.mock("@/app/stores/useInternalDevicesStore/useInternalDevicesStore", () => ({
  useInternalDevicesStore: (selector: any) =>
    selector(getInternalDevicesStoreState()),
}));

vi.mock(
  "@/app/stores/useDeviceAssignmentResponsiveUrlStore/useDeviceAssignmentResponsiveUrlStore",
  () => ({
    useDeviceAssignmentResponsiveUrlStore: (selector: any) =>
      selector({
        updateDeviceAssignmentResponsiveUrl: vi.fn(),
      }),
  }),
);

describe("useInternalDevicesAsignationPage", () => {
  beforeEach(() => {
    setAuthState({
      user: { idEmployee: "session-employee", fullName: "Usuario actual" },
      currentPagePermissions: undefined,
    });
    setQueryState({
      all: {
        view: "new",
        employeeId: "emp-1",
      },
      updateQuery,
    });

    setEmployeesStoreState({
      activeEmployees: [
        {
          id: "emp-1",
          employee_id: "emp-1",
          fullname: "Katherine Negrete",
        },
      ],
      fetchActiveEmployees: vi.fn().mockResolvedValue([]),
      fetchEmployeeById: vi.fn().mockResolvedValue(null),
      loadingActive: false,
    });

    setInternalDevicesStoreState({
      devices: [],
      unassignedDevices: [],
      deviceStatuses: [],
      fetchDevices: vi.fn().mockResolvedValue([]),
      fetchUnassignedDevices: vi.fn().mockResolvedValue([]),
      fetchDeviceStatuses: vi.fn().mockResolvedValue([]),
      fetchDeviceById: vi.fn().mockResolvedValue(null),
      fetchDeviceAssignmentById: vi.fn().mockResolvedValue(null),
      fetchDeviceAssignments: vi.fn().mockResolvedValue([]),
      createDeviceAssignment: vi.fn().mockResolvedValue(null),
      creatingDeviceAssignment: false,
      successCreateDeviceAssignment: false,
      updatingDevice: false,
      creatingDeviceReview: false,
      successUpdateDevice: false,
      successCreateDeviceReview: false,
      loadingDevices: false,
      loadingUnassignedDevices: false,
      loadingDeviceStatuses: false,
      loadingDeviceAssignment: false,
      deviceAssignment: null,
      device: null,
      error: undefined,
      resetFlags: vi.fn(),
    });

    showAlert.mockClear();
    showSpinner.mockClear();
    hideSpinner.mockClear();
    updateQuery.mockClear();
    useInternalDevicesAsignationTableMock.mockClear();
  });

  it("precarga employee_id cuando employeeId existe en la query y en los empleados activos", () => {
    const { result } = renderHook(() => useInternalDevicesAsignationPage());

    expect(result.current.formValues.employee_id).toBe("emp-1");
  });

  it("limpia employee_id y avisa cuando employeeId no existe en empleados activos", () => {
    setQueryState({
      all: {
        view: "new",
        employeeId: "emp-x",
      },
      updateQuery,
    });

    const { result } = renderHook(() => useInternalDevicesAsignationPage());

    expect(result.current.formValues.employee_id).toBe("");
    expect(showAlert).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "warning",
        title: "Colaborador no disponible",
      }),
    );
  });

  it("mantiene el flujo actual cuando no se recibe employeeId", () => {
    setQueryState({
      all: {
        view: "new",
      },
      updateQuery,
    });

    const { result } = renderHook(() => useInternalDevicesAsignationPage());

    expect(result.current.formValues.employee_id).toBe("");
    expect(showAlert).not.toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Colaborador no disponible",
      }),
    );
  });

  it("abre una nueva asignacion cuando el permiso se carga despues del montaje", () => {
    const { result, rerender } = renderHook(() =>
      useInternalDevicesAsignationPage(),
    );

    setAuthState({
      user: { idEmployee: "session-employee", fullName: "Usuario actual" },
      currentPagePermissions: { createDeviceAssignment: true },
    });
    rerender();

    result.current.handleOpenCreate();

    expect(updateQuery).toHaveBeenCalledWith({ view: "new" });
  });

  it("abre el detalle cuando el permiso se carga despues del montaje", () => {
    const { result, rerender } = renderHook(() =>
      useInternalDevicesAsignationPage(),
    );

    setAuthState({
      user: { idEmployee: "session-employee", fullName: "Usuario actual" },
      currentPagePermissions: { viewDeviceAssignmentDetails: true },
    });
    rerender();

    // El callback se entrega a la tabla; la prueba usa el hook directamente
    // con una fila equivalente a la que recibe la acción "Ver detalle".
    expect(useInternalDevicesAsignationTableMock).toHaveBeenLastCalledWith(
      expect.objectContaining({
        onOpenDetails: expect.any(Function),
      }),
    );
    const lastTableCall = useInternalDevicesAsignationTableMock.mock.calls.at(-1);
    expect(lastTableCall).toBeDefined();
    const { onOpenDetails } = lastTableCall![0];

    onOpenDetails({ assignment_id: "assignment-1", device_id: "device-1" });

    expect(updateQuery).toHaveBeenCalledWith({
      id: "device-1",
      assignmentId: "assignment-1",
      view: null,
    });
  });

  it("regresa a la tabla tras editar un dispositivo asignado", () => {
    setQueryState({
      all: { id: "device-1", assignmentId: "assignment-1", view: "edit" },
      updateQuery,
    });
    setInternalDevicesStoreState({
      ...getInternalDevicesStoreState(),
      successUpdateDevice: true,
    });

    renderHook(() => useInternalDevicesAsignationPage());

    expect(updateQuery).toHaveBeenCalledWith({
      id: null,
      assignmentId: null,
      view: null,
    });
  });

  it("regresa al detalle tras crear una revision de un dispositivo asignado", () => {
    setQueryState({
      all: { id: "device-1", assignmentId: "assignment-1", view: "review" },
      updateQuery,
    });
    setInternalDevicesStoreState({
      ...getInternalDevicesStoreState(),
      successCreateDeviceReview: true,
    });

    renderHook(() => useInternalDevicesAsignationPage());

    expect(updateQuery).toHaveBeenCalledWith({ view: null });
  });
});

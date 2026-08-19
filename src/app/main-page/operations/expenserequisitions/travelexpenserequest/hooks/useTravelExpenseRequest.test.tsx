import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { TravelExpense } from "@/app/mappings/travelExpenses/travelExpenses.types";

import { useTravelExpenseRequest } from "./useTravelExpenseRequest";

const mocks = vi.hoisted(() => ({
  createTravelExpense: vi.fn(),
  fetchDepartments: vi.fn(),
  fetchEmployees: vi.fn(),
  fetchEmployeesWithActiveUser: vi.fn(),
  fetchEmployeesWithCardNumber: vi.fn(),
  fetchEnterprises: vi.fn(),
  fetchProyects: vi.fn(),
  fetchTravelExpenses: vi.fn(),
  hideSpinner: vi.fn(),
  showAlert: vi.fn(),
  showSpinner: vi.fn(),
  saveRequisitionRequestProgress: vi.fn(),
  saveTravelExpenseProgress: vi.fn(),
  resendRequisitionRequestAuthorization: vi.fn(),
  routerPush: vi.fn(),
  sendTravelExpenseAuthorization: vi.fn(),
  updateEmployeeNumberCard: vi.fn(),
}));

const employeesWithCardNumber = [
  {
    employee_id: "employee-1",
    full_name: "Angel Vazquez",
    phone_number: "55550001",
    card_number: "1111",
  },
];

const employeesWithActiveUser = [
  {
    employee_id: "employee-1",
    fullname: "Angel Vazquez",
    phone_number: "55550001",
    card_number: "1111",
  },
  {
    employee_id: "employee-2",
    fullname: "Bruno Mendoza",
    phone_number: "55550002",
    card_number: "2222",
  },
];

const searchParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
  usePathname: () =>
    "/main-page/operations/expenserequisitions/travelexpenserequest",
  useRouter: () => ({ push: mocks.routerPush }),
  useSearchParams: () => searchParams,
}));

vi.mock("@/assets/icons/acciones/cancel.svg", () => ({
  default: () => <span data-testid="cancel-icon" />,
}));

vi.mock("@/app/context/PrincipalContext/PrincipalContext", () => ({
  usePrincipal: () => ({
    usePrincipalAlert: { showAlert: mocks.showAlert },
    usePrincipalLoading: {
      hideSpinner: mocks.hideSpinner,
      showSpinner: mocks.showSpinner,
    },
  }),
}));

vi.mock("@/app/stores/useDepartmentsStore/useDepartmentsStore", () => ({
  useDepartmentsStore: (selector: (state: object) => unknown) =>
    selector({
      departments: [],
      loading: false,
      fetchDepartments: mocks.fetchDepartments,
    }),
}));

vi.mock("@/app/stores/useEmployeesStore/useEmployeesStore", () => ({
  useEmployeesStore: (selector: (state: object) => unknown) =>
    selector({
      employees: [],
      error: "",
      fetchEmployees: mocks.fetchEmployees,
    }),
}));

vi.mock("@/app/stores/useEnterprisesStore/useEnterprisesStore", () => ({
  useEnterprisesStore: (selector: (state: object) => unknown) =>
    selector({ enterprises: [], fetchEnterprises: mocks.fetchEnterprises }),
}));

vi.mock("@/app/stores/useProyectsStore/useProyectsStore", () => ({
  useProyectsStore: (selector: (state: object) => unknown) =>
    selector({
      proyects: [],
      loading: false,
      fetchProyects: mocks.fetchProyects,
    }),
}));

vi.mock("@/app/stores/useUsersStore/useUsersStore", () => ({
  useUsersStore: Object.assign(
    (selector: (state: object) => unknown) =>
      selector({
        employeesWithActiveUser,
        loadingWithActiveUser: false,
        fetchEmployeesWithActiveUser: mocks.fetchEmployeesWithActiveUser,
        updateEmployeeNumberCard: mocks.updateEmployeeNumberCard,
      }),
    { getState: () => ({ error: "" }) },
  ),
}));

vi.mock("@/app/stores/useTravelExpensesStore/useTravelExpensesStore", () => ({
  useTravelExpensesStore: Object.assign(
    (selector: (state: object) => unknown) =>
      selector({
        travelExpenses: [],
        fetchTravelExpenses: mocks.fetchTravelExpenses,
        employeesWithCardNumber,
        loadingEmployeesWithCardNumber: false,
        fetchEmployeesWithCardNumber: mocks.fetchEmployeesWithCardNumber,
        approveTravelExpense: vi.fn(),
        rejectTravelExpense: vi.fn(),
        createTravelExpense: mocks.createTravelExpense,
        saveRequisitionRequestProgress: mocks.saveRequisitionRequestProgress,
        saveTravelExpenseProgress: mocks.saveTravelExpenseProgress,
        resendRequisitionRequestAuthorization:
          mocks.resendRequisitionRequestAuthorization,
        sendTravelExpenseAuthorization: mocks.sendTravelExpenseAuthorization,
        approving: false,
        rejecting: false,
        creating: false,
        updating: false,
        savingProgress: false,
        sendingAuthorization: false,
        savingCalculations: false,
        loading: false,
      }),
    { getState: () => ({ error: "" }) },
  ),
}));

afterEach(() => {
  cleanup();
  searchParams.forEach((_, key) => searchParams.delete(key));
});

const baseValues = {
  responsible: "requester-1",
  project: "project-1",
  area: "area-1",
  enterprise: "enterprise-1",
  startDate: "2026-08-03",
  endDate: "2026-08-04",
  state: "CDMX",
  motive: "Visita de trabajo",
};

const selectedTravelExpense: TravelExpense = {
  id: "travel-1",
  billingrequisition_id: "travel-1",
  employee_id: "employee-1",
  employeename: "Angel Vazquez",
  applicant_id: "requester-1",
  applicant_name: "Requester",
  phone_number: "55550001",
  card_number: "1111",
  project_id: "project-1",
  projectname: "Proyecto Norte",
  proyectkey: "NORTE-001",
  company: "Empresa",
  enterprise_id: "enterprise-1",
  enterprise_name: "Empresa",
  area: "Operaciones",
  department_id: "area-1",
  department_name: "Operaciones",
  status_id: "",
  status_name: "Rechazada",
  status: "Rechazada",
  requisitionkey: "REQ-001",
  assignmentdate: "2026-08-03T00:00:00.000Z",
  enddate: "2026-08-04T00:00:00.000Z",
  state: "CDMX",
  motive: "Visita de trabajo",
  comments: "",
  gt_type: "",
  is_travel_expense: true,
  is_active: true,
  date_created: "",
  updated_date: "",
  created_by: "",
  updated_by: "",
  companions: [],
  requisition_requests: [],
  travel_expenses_calculations: [],
};

describe("useTravelExpenseRequest assigned staff submission", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.createTravelExpense.mockResolvedValue(true);
    mocks.saveRequisitionRequestProgress.mockResolvedValue(true);
    mocks.saveTravelExpenseProgress.mockResolvedValue(selectedTravelExpense);
    mocks.resendRequisitionRequestAuthorization.mockResolvedValue(true);
    mocks.sendTravelExpenseAuthorization.mockResolvedValue(true);
  });

  it("blocks duplicate employees before contact updates or request creation", async () => {
    const { result } = renderHook(() => useTravelExpenseRequest());

    act(() => result.current.handleAddAssignedStaff());

    await act(async () => {
      await result.current.handleCreateSubmit({
        ...baseValues,
        assignedStaff: "employee-1",
        assignedStaff2: "employee-1",
      });
    });

    expect(mocks.showAlert).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "No se pudo crear",
        description: "Un empleado solo puede asignarse una vez.",
      }),
    );
    expect(mocks.updateEmployeeNumberCard).not.toHaveBeenCalled();
    expect(mocks.createTravelExpense).not.toHaveBeenCalled();
  });

  it("creates a request with unique staff in their selected order", async () => {
    const { result } = renderHook(() => useTravelExpenseRequest());

    act(() => result.current.handleAddAssignedStaff());

    await act(async () => {
      await result.current.handleCreateSubmit({
        ...baseValues,
        assignedStaff: "employee-1",
        assignedStaff2: "employee-2",
      });
    });

    expect(mocks.createTravelExpense).toHaveBeenCalledWith({
      applicant_id: "requester-1",
      employee_id: "employee-1",
      companions: [{ employee_id: "employee-2", full_name: "Bruno Mendoza" }],
      project_id: "project-1",
      department_id: "area-1",
      enterprise_id: "enterprise-1",
      assignmentdate: expect.any(String),
      enddate: expect.any(String),
      state: "CDMX",
      motive: "Visita de trabajo",
    });
  });
});

describe("useTravelExpenseRequest requisition progress", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.saveRequisitionRequestProgress.mockResolvedValue(true);
    mocks.saveTravelExpenseProgress.mockResolvedValue(selectedTravelExpense);
    mocks.resendRequisitionRequestAuthorization.mockResolvedValue(true);
    mocks.sendTravelExpenseAuthorization.mockResolvedValue(true);
  });

  it("uses the requisition request endpoint when the editor receives its request id", async () => {
    const { result } = renderHook(() =>
      useTravelExpenseRequest({
        requisitionRequestId: "request-1",
        selectedTravelExpenseOverride: selectedTravelExpense,
        viewOverride: "requisition",
      }),
    );

    await act(async () => {
      await result.current.handleSaveRequisitionProgress();
    });

    expect(mocks.saveRequisitionRequestProgress).toHaveBeenCalledWith(
      expect.objectContaining({
        id_billing_requisition_request: "request-1",
        progress_items: expect.any(Array),
      }),
    );
    expect(mocks.saveTravelExpenseProgress).not.toHaveBeenCalled();
  });

  it("keeps rejected requisitions actionable according to status_name", () => {
    const rejectedTravelExpense = {
      ...selectedTravelExpense,
      status: "Enviada",
      status_name: "RECHAZADO",
    };

    const { result } = renderHook(() =>
      useTravelExpenseRequest({
        requisitionRequestId: "request-1",
        selectedTravelExpenseOverride: rejectedTravelExpense,
        viewOverride: "requisition",
      }),
    );

    expect(result.current.requisitionActionsDisabled).toBe(false);
  });

  it("includes single-beneficiary table changes in the requisition request payload", async () => {
    const { result } = renderHook(() =>
      useTravelExpenseRequest({
        requisitionRequestId: "request-1",
        selectedTravelExpenseOverride: selectedTravelExpense,
        viewOverride: "requisition",
      }),
    );
    const editedRows = result.current.getBeneficiaryViaticsRows("employee-1");

    editedRows[0] = {
      ...editedRows[0],
      nationalQuoted: "275",
      days: "2",
      subtotal: "550",
      observations: "Tarifa actualizada",
    };

    act(() => {
      result.current.handleBeneficiaryViaticsChange("employee-1", editedRows);
    });

    await act(async () => {
      await result.current.handleSaveRequisitionProgress();
    });

    expect(mocks.saveRequisitionRequestProgress).toHaveBeenCalledWith(
      expect.objectContaining({
        id_billing_requisition_request: "request-1",
        progress_items: [
          expect.objectContaining({
            calculation_concepts: expect.arrayContaining([
              expect.objectContaining({
                national_quoted: 275,
                days_number: 2,
                subtotal: 550,
                observations: "Tarifa actualizada",
              }),
            ]),
          }),
        ],
      }),
    );
  });

  it("uses the requisition request endpoint before sending authorization", async () => {
    const { result } = renderHook(() =>
      useTravelExpenseRequest({
        requisitionRequestId: "request-1",
        selectedTravelExpenseOverride: selectedTravelExpense,
        viewOverride: "requisition",
      }),
    );

    act(() => result.current.handleAuthorizerChange(["authorizer-1"]));

    await act(async () => {
      await result.current.handleConfirmAuthorizer();
    });

    expect(mocks.saveRequisitionRequestProgress).toHaveBeenCalledWith(
      expect.objectContaining({
        id_billing_requisition_request: "request-1",
      }),
    );
    expect(mocks.saveTravelExpenseProgress).not.toHaveBeenCalled();
    expect(mocks.resendRequisitionRequestAuthorization).toHaveBeenCalledWith({
      id_billing_requisition_request: "request-1",
      id_authorizer: "authorizer-1",
    });
    expect(mocks.sendTravelExpenseAuthorization).not.toHaveBeenCalled();
  });

  it("saves progress before resending authorization for solicitudviaticos", async () => {
    const calls: string[] = [];
    mocks.saveRequisitionRequestProgress.mockImplementation(async () => {
      calls.push("SaveProgress");
      return true;
    });
    mocks.resendRequisitionRequestAuthorization.mockImplementation(async () => {
      calls.push("ResendAuthorization");
      return true;
    });

    const { result } = renderHook(() =>
      useTravelExpenseRequest({
        requisitionRequestId: "request-1",
        selectedTravelExpenseOverride: selectedTravelExpense,
        viewOverride: "requisition",
      }),
    );

    act(() => result.current.handleAuthorizerChange(["authorizer-1"]));

    await act(async () => {
      await result.current.handleConfirmAuthorizer();
    });

    expect(calls).toEqual(["SaveProgress", "ResendAuthorization"]);
  });

  it("keeps the travel expense endpoint outside solicitudviaticos", async () => {
    const { result } = renderHook(() =>
      useTravelExpenseRequest({
        selectedTravelExpenseOverride: selectedTravelExpense,
        viewOverride: "requisition",
      }),
    );

    await act(async () => {
      await result.current.handleSaveRequisitionProgress();
    });

    expect(mocks.saveTravelExpenseProgress).toHaveBeenCalledWith(
      expect.objectContaining({ id_travel_expense: "travel-1" }),
    );
    expect(mocks.saveRequisitionRequestProgress).not.toHaveBeenCalled();
  });

  it("keeps the travel expense authorization endpoint outside solicitudviaticos", async () => {
    const { result } = renderHook(() =>
      useTravelExpenseRequest({
        selectedTravelExpenseOverride: selectedTravelExpense,
        viewOverride: "requisition",
      }),
    );

    act(() => result.current.handleAuthorizerChange(["authorizer-1"]));

    await act(async () => {
      await result.current.handleConfirmAuthorizer();
    });

    expect(mocks.sendTravelExpenseAuthorization).toHaveBeenCalledWith(
      "travel-1",
      "authorizer-1",
    );
    expect(mocks.resendRequisitionRequestAuthorization).not.toHaveBeenCalled();
  });

  it("blocks requisition actions and redirects after sending authorization", async () => {
    const { result } = renderHook(() =>
      useTravelExpenseRequest({
        selectedTravelExpenseOverride: selectedTravelExpense,
        viewOverride: "requisition",
      }),
    );

    act(() => result.current.handleAuthorizerChange(["authorizer-1"]));

    await act(async () => {
      await result.current.handleConfirmAuthorizer();
    });

    expect(result.current.requisitionActionsDisabled).toBe(true);
    expect(mocks.routerPush).toHaveBeenCalledWith(
      "/main-page/operations/expenserequisitions/solicitudviaticos/",
    );
  });

  it("initializes the project code with proyectkey and falls back to projectname", () => {
    const { result, rerender } = renderHook(
      ({ travelExpense }) =>
        useTravelExpenseRequest({
          selectedTravelExpenseOverride: travelExpense,
          viewOverride: "requisition",
        }),
      { initialProps: { travelExpense: selectedTravelExpense } },
    );

    expect(
      result.current.requisitionSummaryFields.find(
        (field) => field.name === "projectCode",
      )?.value,
    ).toBe("NORTE-001");

    rerender({
      travelExpense: { ...selectedTravelExpense, proyectkey: "" },
    });

    expect(
      result.current.requisitionSummaryFields.find(
        (field) => field.name === "projectCode",
      )?.value,
    ).toBe("Proyecto Norte");
  });
});

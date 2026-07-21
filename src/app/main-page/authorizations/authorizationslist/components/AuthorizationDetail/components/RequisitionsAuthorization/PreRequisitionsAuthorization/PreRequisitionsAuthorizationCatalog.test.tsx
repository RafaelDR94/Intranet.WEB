import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import PreRequisitionsAuthorizationCatalog from "./PreRequisitionsAuthorizationCatalog";

const approveAuthorization = vi.fn();
const rejectAuthorization = vi.fn();
const getAuthorizations = vi.fn();
const getAuthorizationsByIdAuthorizer = vi.fn();
const fetchRequisitionRequestById = vi.fn();
const showSpinner = vi.fn();
const hideSpinner = vi.fn();
const showAlert = vi.fn();
const hideAlert = vi.fn();
const mockTravelExpenseState = vi.hoisted(() => ({ statusName: "Pendiente" }));

vi.mock("next/navigation", () => ({
  useSearchParams: () =>
    new URLSearchParams("authorization_id=auth-1&event_id=travel-1"),
}));

vi.mock("@/app/context/AuthContext/AuthContext", () => ({
  useAuth: () => ({ user: { idEmployee: "authorizer-1" } }),
}));

vi.mock("@/app/stores/useAuthorizationsStore/useAuthorizationsStore", () => ({
  useAuthorizationsStore: (
    selector: (state: {
      authorizations: Array<{
        authorization_id: string;
        authorizer: { employee_id: string };
        event_id: string;
        raw?: Record<string, unknown>;
      }>;
      approveAuthorization: typeof approveAuthorization;
      rejectAuthorization: typeof rejectAuthorization;
      getAuthorizations: typeof getAuthorizations;
      getAuthorizationsByIdAuthorizer: typeof getAuthorizationsByIdAuthorizer;
      updatingStatus: boolean;
    }) => unknown,
  ) =>
    selector({
      authorizations: [
        {
          authorization_id: "auth-1",
          authorizer: { employee_id: "authorizer-1" },
          event_id: "travel-1",
        },
      ],
      approveAuthorization,
      rejectAuthorization,
      getAuthorizations,
      getAuthorizationsByIdAuthorizer,
      updatingStatus: false,
    }),
}));

vi.mock("@/app/stores/useTravelExpensesStore/useTravelExpensesStore", () => ({
  useTravelExpensesStore: (
    selector: (state: {
      currentRequisitionRequest: {
        id: string;
        billingrequisition_id: string;
        requisitionkey: string;
        company: string;
        projectname: string;
        proyectkey: string;
        phone_number: string;
        assignmentdate: string;
        enddate: string;
        employee_id: string;
        employeename: string;
        status_name: string;
        status: string;
        requisition_requests: Array<{ id: string; requisition_code: string }>;
        calculation_concepts_json: Array<{
          requisition_code: string;
          calculation_concepts: never[];
        }>;
      };
      fetchRequisitionRequestById: typeof fetchRequisitionRequestById;
      approving: boolean;
      rejecting: boolean;
      loadingRequisitionRequestDetail: boolean;
    }) => unknown,
  ) =>
    selector({
      currentRequisitionRequest: {
        id: "travel-1",
        billingrequisition_id: "billing-1",
        requisitionkey: "REQ-1",
        company: "DR MEXICO",
        projectname: "Key-001",
        proyectkey: "PY-ORT-001",
        phone_number: "5639728912",
        assignmentdate: "2026-06-26T00:00:00.000Z",
        enddate: "2026-06-26T00:00:00.000Z",
        employee_id: "employee-1",
        employeename: "Frankie Rivers Negrete Aguilar",
        status_name: mockTravelExpenseState.statusName,
        status: mockTravelExpenseState.statusName,
        requisition_requests: [{ id: "request-1", requisition_code: "REQ-1" }],
        calculation_concepts_json: [
          {
            requisition_code: "REQ-1",
            calculation_concepts: [],
          },
        ],
      },
      fetchRequisitionRequestById,
      approving: false,
      rejecting: false,
      loadingRequisitionRequestDetail: false,
    }),
}));

vi.mock("@/app/context/PrincipalContext/PrincipalContext", () => ({
  usePrincipal: () => ({
    usePrincipalLoading: {
      showSpinner,
      hideSpinner,
    },
    usePrincipalAlert: {
      showAlert,
      hideAlert,
    },
  }),
}));

vi.mock("@/app/components/DynamicForm/DynamicForm", () => ({
  default: ({
    dataTestId,
    fields,
  }: {
    dataTestId?: string;
    fields?: Array<{ label: string; value: string }>;
  }) => (
    <div data-testid={dataTestId}>
      DynamicFormMock
      {fields?.map((field) => (
        <div key={field.label}>
          <span>{field.label}</span>
          <span>{field.value}</span>
        </div>
      ))}
    </div>
  ),
}));

vi.mock(
  "@/app/sharedComponents/EditableViaticsTable/EditableViaticsTable",
  () => ({
    EditableViaticsTable: ({ dataTestId }: { dataTestId?: string }) => (
      <div data-testid={dataTestId}>EditableViaticsTableMock</div>
    ),
  }),
);

vi.mock("@/app/components/PopUp/PopUp", () => ({
  PopUp: ({
    open,
    title,
    content,
    children,
    primaryButtonText,
    onPrimaryButtonClick,
  }: {
    open: boolean;
    title?: string;
    content?: string;
    children?: React.ReactNode;
    primaryButtonText?: string;
    onPrimaryButtonClick?: () => void;
  }) =>
    open ? (
      <div>
        {title ? <p>{title}</p> : null}
        {content ? <p>{content}</p> : null}
        {children}
        <button type="button" onClick={onPrimaryButtonClick}>
          {primaryButtonText}
        </button>
      </div>
    ) : null,
}));

vi.mock("@/app/components/SignaturePopUp/SignaturePopUp", () => ({
  default: ({
    open,
    onAuthorization,
    responsibleGuid,
  }: {
    open: boolean;
    onAuthorization: (authorized: {
      state: boolean;
      signature: string | null;
    }) => void;
    responsibleGuid: string;
  }) =>
    open ? (
      <button
        type="button"
        onClick={() => onAuthorization({ state: true, signature: "signed" })}
      >
        Firmar autorizacion {responsibleGuid}
      </button>
    ) : null,
}));

describe("PreRequisitionsAuthorizationCatalog", () => {
  beforeEach(() => {
    approveAuthorization.mockReset();
    rejectAuthorization.mockReset();
    getAuthorizations.mockReset();
    getAuthorizationsByIdAuthorizer.mockReset();
    fetchRequisitionRequestById.mockReset();
    showSpinner.mockReset();
    hideSpinner.mockReset();
    showAlert.mockReset();
    hideAlert.mockReset();
    mockTravelExpenseState.statusName = "Pendiente";
    approveAuthorization.mockResolvedValue(true);
    rejectAuthorization.mockResolvedValue(true);
    getAuthorizations.mockResolvedValue(undefined);
    fetchRequisitionRequestById.mockResolvedValue(undefined);
  });

  it("usa AuthorizationApprove al aprobar", async () => {
    render(<PreRequisitionsAuthorizationCatalog />);

    await waitFor(() => {
      expect(fetchRequisitionRequestById).toHaveBeenCalledWith("travel-1");
    });

    fireEvent.click(screen.getByText("Aprobar"));
    expect(approveAuthorization).not.toHaveBeenCalled();
    fireEvent.click(screen.getByText("Firmar autorizacion authorizer-1"));

    await waitFor(() => {
      expect(approveAuthorization).toHaveBeenCalledWith("auth-1");
    });
    expect(getAuthorizations).toHaveBeenCalledWith(true);
    expect(showAlert).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "success",
        title: "Autorizacion aprobada",
      }),
    );
  });

  it("muestra proyectkey como codigo de proyecto y agrega codigo de requisicion", () => {
    render(<PreRequisitionsAuthorizationCatalog />);

    expect(screen.getByText("Codigo de Proyecto")).toBeInTheDocument();
    expect(screen.getByText("PY-ORT-001")).toBeInTheDocument();
    expect(screen.getByText("Codigo de requisicion")).toBeInTheDocument();
    expect(screen.getAllByText("REQ-1").length).toBeGreaterThan(0);
  });

  it("usa AuthorizationReject con comentario al rechazar", async () => {
    render(<PreRequisitionsAuthorizationCatalog />);

    fireEvent.click(screen.getByText("Rechazar"));
    fireEvent.click(screen.getByText("Firmar autorizacion authorizer-1"));
    expect(screen.getByText("Denegar solicitud")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Esta accion denegara la solicitud. Escribe aqui los motivos de la negativa.",
      ),
    ).toBeInTheDocument();
    fireEvent.change(screen.getByPlaceholderText("Escribir aqui"), {
      target: { value: "No procede" },
    });
    fireEvent.click(screen.getByText("Enviar"));

    await waitFor(() => {
      expect(rejectAuthorization).toHaveBeenCalledWith("auth-1", "No procede");
    });
    expect(getAuthorizations).toHaveBeenCalledWith(true);
    expect(showAlert).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "success",
        title: "Autorizacion rechazada",
      }),
    );
  });

  it("deshabilita acciones cuando la solicitud ya fue aprobada o rechazada", () => {
    mockTravelExpenseState.statusName = "Aprobada";

    render(<PreRequisitionsAuthorizationCatalog />);

    expect(screen.getByText("Aprobar").closest("button")).toBeDisabled();
    expect(screen.getByText("Rechazar").closest("button")).toBeDisabled();
  });
});

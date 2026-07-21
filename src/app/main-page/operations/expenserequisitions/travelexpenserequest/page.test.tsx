import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

import TravelExpenseRequest from "./page";

const mockUseTravelExpenseRequest = vi.fn();

vi.mock("./hooks/useTravelExpenseRequest", () => ({
  useTravelExpenseRequest: () => mockUseTravelExpenseRequest(),
}));

vi.mock("@/app/components/Button/Button", () => ({
  Button: ({ children, hideIcon, dataTestId, ...props }: any) => (
    <button {...props} data-testid={dataTestId}>
      {children}
    </button>
  ),
}));

vi.mock("@/app/components/DynamicForm/DynamicForm", () => ({
  default: ({ fields, dataTestId }: any) => (
    <div data-testid={dataTestId}>
      {fields.map((field: any) => (
        <div key={field.name}>
          <span>{field.label}</span>
          <span>{field.type}</span>
        </div>
      ))}
    </div>
  ),
}));

vi.mock("@/app/components/FormsLayout/FormsLayout", () => ({
  default: ({
    children,
    primaryLabel,
    primaryDisabled,
    showPrimaryButton = true,
    secondaryLabel,
    secondaryDisabled,
    showSecondaryButton,
  }: any) => (
    <div>
      {showPrimaryButton ? (
        <button disabled={primaryDisabled}>{primaryLabel}</button>
      ) : null}
      {showSecondaryButton ? (
        <button disabled={secondaryDisabled}>{secondaryLabel}</button>
      ) : null}
      {children}
    </div>
  ),
}));

vi.mock("@/app/components/FileUploaderexpanded/FileUploaderExpanded", () => ({
  default: () => <div>FileUploader</div>,
}));

vi.mock("@/app/components/Input/Input", () => ({
  Input: () => <input />,
}));

vi.mock("@/app/components/Label/Label", () => ({
  Label: ({ text }: any) => <div>{text}</div>,
}));

vi.mock("@/app/components/PopUp/PopUp", () => ({
  PopUp: ({ children }: any) => <div>{children}</div>,
}));

vi.mock("@/app/components/Select/Select", () => ({
  Select: ({ placeholder }: any) => <div>{placeholder}</div>,
}));

vi.mock(
  "@/app/sharedComponents/EditableViaticsTable/EditableViaticsTable",
  () => ({
    EditableViaticsTable: () => <div>EditableViaticsTable</div>,
  }),
);

vi.mock(
  "./components/TravelExpenseTableSection/TravelExpenseTableSection",
  () => ({
    TravelExpenseTableSection: () => <div>TravelExpenseTableSection</div>,
  }),
);

vi.mock("@/assets/icons/navegacion/nav-arrow-down.svg", () => ({
  default: () => <svg />,
}));

vi.mock("@/assets/icons/navegacion/nav-arrow-up.svg", () => ({
  default: () => <svg />,
}));

vi.mock("@/assets/icons/Users/Users/add-user.svg", () => ({
  default: () => <svg />,
}));

const baseHookReturn = {
  activeBeneficiaryId: "responsible",
  approvingTravelExpense: false,
  authorizerError: null,
  authorizerOptions: [],
  authorizerPopUpOpen: false,
  authorizerSelected: "",
  buildRequisitionFields: () => [],
  createFields: [],
  createFormLayout: {},
  creatingTravelExpense: false,
  departmentsLoading: false,
  detailStatusType: "pending",
  employeesWithActiveUserLoading: false,
  excelFile: null,
  fetchTravelExpenses: vi.fn(),
  formReady: true,
  getBeneficiaryViaticsRows: vi.fn(() => []),
  handleAddAssignedStaff: vi.fn(),
  handleApproveTravelExpense: vi.fn(),
  handleAuthorizerCancel: vi.fn(),
  handleAuthorizerChange: vi.fn(),
  handleBeneficiaryViaticsChange: vi.fn(),
  handleConfirmAuthorizer: vi.fn(),
  handleCreateClick: vi.fn(),
  handleCreateSubmit: vi.fn(),
  handleCreateValuesChange: vi.fn(),
  handleExcelSubmit: vi.fn(),
  handleRejectCommentCancel: vi.fn(),
  handleRejectCommentChange: vi.fn(),
  handleRejectCommentOpen: vi.fn(),
  handleRejectTravelExpense: vi.fn(),
  handleRequisitionValuesChange: vi.fn(),
  handleSaveRequisitionProgress: vi.fn(),
  handleSendRequisitionAuthorization: vi.fn(),
  handleToggleBeneficiary: vi.fn(),
  handleViewDetails: vi.fn(),
  hasCompanions: true,
  isReviewView: false,
  isRequisitionView: true,
  loadingTravelExpenses: false,
  proyectsLoading: false,
  rejectComment: "",
  rejectCommentError: null,
  rejectCommentOpen: false,
  rejectingTravelExpense: false,
  requisitionActionsDisabled: false,
  requisitionReadyForAuthorization: true,
  requisitionBeneficiaries: [
    {
      id: "responsible",
      name: "Angel Vazquez",
      phone: "5555",
      cardNumber: "1111",
    },
  ],
  requisitionFields: [],
  requisitionFormLayout: {},
  requisitionSection: "information",
  requisitionSummaryFields: [],
  requisitionSummaryLayout: {},
  reviewFields: [],
  reviewFormLayout: {},
  savingCalculations: false,
  selectedTravelExpense: {
    status: "Borrador",
  },
  sendingAuthorization: false,
  setExcelFile: vi.fn(),
  setFormReady: vi.fn(),
  setRequisitionSection: vi.fn(),
  setViaticsRows: vi.fn(),
  showRejectedDetail: false,
  submitRef: { current: null },
  travelExpenses: [],
  updatingTravelExpense: false,
  valuesVersion: 0,
  viaticsRows: [],
  view: "requisition",
};

describe("TravelExpenseRequest page", () => {
  it("disables authorization submit while requisition data is incomplete", () => {
    mockUseTravelExpenseRequest.mockReturnValue({
      ...baseHookReturn,
      requisitionReadyForAuthorization: false,
    });

    render(<TravelExpenseRequest />);

    expect(
      screen.getByRole("button", { name: "Enviar a autorizacion" }),
    ).toBeDisabled();
  });

  it("renders companion assigned staff and phone inputs in review mode", () => {
    mockUseTravelExpenseRequest.mockReturnValue({
      ...baseHookReturn,
      isReviewView: true,
      isRequisitionView: false,
      hasCompanions: false,
      reviewFields: [
        {
          type: "input",
          name: "assignedPerson",
          label: "Personal asignado",
          value: "Angel Vazquez",
        },
        {
          type: "input",
          name: "phone",
          label: "Teléfono",
          value: "55 5555 5555",
        },
        {
          type: "input",
          name: "companionAssignedPerson-bruno",
          label: "Personal asignado",
          value: "Bruno Mendoza",
        },
        {
          type: "input",
          name: "companionPhone-bruno",
          label: "Teléfono",
          value: "55 5555 5555",
        },
      ],
    });

    render(<TravelExpenseRequest />);

    expect(screen.getAllByText("Personal asignado")).toHaveLength(2);
    expect(screen.getAllByText("Teléfono")).toHaveLength(2);
    expect(screen.getAllByText("input")).toHaveLength(4);
  });

  it("renders the multiselect field in requisition mode when companions exist", () => {
    mockUseTravelExpenseRequest.mockReturnValue({
      ...baseHookReturn,
      buildRequisitionFields: () => [
        {
          type: "input",
          name: "motive",
          label: "Motivo",
          value: "Instalacion de sistema",
        },
        {
          type: "multiSelect",
          name: "associatedCompanions-responsible",
          label: "Asociar colaborador",
          value: [],
          options: [{ label: "Bruno Mendoza", value: "bruno" }],
        },
      ],
    });

    render(<TravelExpenseRequest />);

    expect(screen.getByText("Asociar colaborador")).toBeInTheDocument();
    expect(screen.getByText("multiSelect")).toBeInTheDocument();
  });

  it("renders BROXEL or Sin asociar in beneficiary headers based on card number", () => {
    mockUseTravelExpenseRequest.mockReturnValue({
      ...baseHookReturn,
      activeBeneficiaryId: "bruno",
      requisitionBeneficiaries: [
        {
          id: "bruno",
          name: "Bruno Mendoza",
          phone: "5555",
          cardNumber: "012 036 0952 50",
        },
        {
          id: "lorena",
          name: "Lorena Leon",
          phone: "5556",
          cardNumber: "",
        },
      ],
      buildRequisitionFields: () => [],
    });

    render(<TravelExpenseRequest />);

    expect(screen.getByText("Bruno Mendoza")).toBeInTheDocument();
    expect(screen.getByText("BROXEL")).toBeInTheDocument();
    expect(screen.getByText("Sin asociar")).toBeInTheDocument();
  });
});

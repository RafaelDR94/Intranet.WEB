import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import NewReport from "./NewReport";

const hookState = {
  canStart: true,
  steps: [
    { id: "avance", label: "Avance" },
    { id: "actividades", label: "Actividades" },
  ],
  typeOptions: [
    { label: "Correctivo", value: "TYPE-1" },
    { label: "Preventivo", value: "TYPE-2" },
  ],
  selectedTypeId: "TYPE-1",
  onTypeChange: vi.fn(),
  loadingTypes: false,
  onStepChange: vi.fn(),
  currentStep: "avance" as const,
  handleNext: vi.fn(),
  submitRef: { current: null as null | (() => void | Promise<void>) },
  currentModelName: "Correctivo",
  isAdvanceValid: true,
  handleCanSaveReport: vi.fn(),
  isSaveValid: true,
  isBackValid: true,
  handleSaveReport: vi.fn(),
  handleBack: vi.fn(),
  report: { clientsign: { url: "" } },
};

vi.mock("./hooks/useNewReport", () => ({
  __esModule: true,
  default: () => hookState,
}));

vi.mock("@/app/components/FormsLayout/FormsLayout", () => ({
  __esModule: true,
  default: ({ title, primaryLabel, primaryDisabled, onPrimaryClick, children }: any) => (
    <div data-testid="forms-layout">
      <span data-testid="layout-title">{title}</span>
      <button
        type="button"
        data-testid="primary-action"
        disabled={primaryDisabled}
        onClick={onPrimaryClick}
      >
        {primaryLabel}
      </button>
      {children}
    </div>
  ),
}));

vi.mock("@/app/components/Select/Select", () => ({
  Select: ({ options, selected, onChange, disabled, label }: any) => (
    <div data-testid="report-type-select" data-disabled={disabled ? "true" : "false"}>
      <span data-testid="select-label">{label}</span>
      <span data-testid="select-selected">{selected?.[0] ?? ""}</span>
      <span data-testid="select-options">{options.length}</span>
      <button type="button" data-testid="select-trigger" onClick={() => onChange(["TYPE-2"])}>
        cambiar
      </button>
    </div>
  ),
}));

vi.mock("@/app/components/Breadcrumbs/Breadcrumbs", () => {
  const Breadcrumbs = ({ activeId, onActiveChange, children }: any) => (
    <div data-testid="breadcrumbs" data-active={activeId}>
      {React.Children.map(children, (child: any) =>
        React.cloneElement(child, {
          onSelect: (id: string) => onActiveChange(id),
        })
      )}
    </div>
  );

  Breadcrumbs.Item = ({ id, label, renderContent, onSelect }: any) => (
    <div data-testid={`item-${id}`}>
      <button type="button" data-testid={`breadcrumb-${id}`} onClick={() => onSelect?.(id)}>
        {label}
      </button>
      <div data-testid={`content-${id}`}>{renderContent?.()}</div>
    </div>
  );

  return { __esModule: true, default: Breadcrumbs };
});

vi.mock("@/app/components/Button/Button", () => ({
  Button: ({ children, onClick, disabled }: any) => (
    <button type="button" disabled={disabled} onClick={onClick}>
      {children}
    </button>
  ),
}));

vi.mock("@/assets/icons/acciones/warning-triangle.svg", () => ({
  __esModule: true,
  default: () => <span data-testid="warning-icon" />,
}));

vi.mock("@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery", () => ({
  useIsMobile: () => false,
}));

vi.mock("./components/Advance/Advance", () => ({
  __esModule: true,
  default: ({ onStepValidChange }: any) => {
    onStepValidChange?.(true);
    return <div data-testid="advance-step" />;
  },
}));

vi.mock("./components/Activitys/Activities", () => ({
  __esModule: true,
  default: () => <div data-testid="activities-step" />,
}));

vi.mock("./components/Devices/Devices", () => ({
  __esModule: true,
  default: () => <div data-testid="devices-step" />,
}));

vi.mock("./components/WorkMaps/WorkMaps", () => ({
  __esModule: true,
  default: () => <div data-testid="workmaps-step" />,
}));

vi.mock("./components/Refactions/Refactions", () => ({
  __esModule: true,
  default: () => <div data-testid="refactions-step" />,
}));

vi.mock("./components/Signatures/Signatures", () => ({
  __esModule: true,
  default: () => <div data-testid="signatures-step" />,
}));

describe("NewReport", () => {
  const baseState = { ...hookState };

  beforeEach(() => {
    Object.assign(hookState, baseState, {
      onTypeChange: vi.fn(),
      onStepChange: vi.fn(),
      handleNext: vi.fn(),
      handleBack: vi.fn(),
      handleSaveReport: vi.fn(),
      handleCanSaveReport: vi.fn(),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("no renderiza nada mientras el hook indica que no puede iniciar", () => {
    hookState.canStart = false;
    const { container } = render(<NewReport />);

    expect(container.firstChild).toBeNull();
  });

  it("muestra el formulario, pasos y advertencias cuando el flujo esta listo", () => {
    hookState.canStart = true;
    hookState.isSaveValid = false;
    hookState.currentStep = "actividades";

    render(<NewReport />);

    expect(screen.getByTestId("forms-layout")).toBeInTheDocument();
    expect(screen.getByTestId("report-type-select")).toHaveAttribute("data-disabled", "false");
    expect(screen.getByText(/Registra aqui un nuevo reporte/i)).toBeInTheDocument();
    expect(screen.getByTestId("warning-icon")).toBeInTheDocument();
    expect(screen.getByText(/guardar tu reporte/i)).toBeInTheDocument();
    expect(screen.getByTestId("advance-step")).toBeInTheDocument();
    expect(screen.getByTestId("activities-step")).toBeInTheDocument();
    expect(hookState.handleCanSaveReport).toHaveBeenCalledWith(true);
  });

  it("deshabilita el selector cuando el reporte ya cuenta con firma del cliente", () => {
    hookState.canStart = true;
    hookState.report = { clientsign: { url: "https://cdn.example.com/sign.png" } };

    render(<NewReport />);

    expect(screen.getByTestId("report-type-select")).toHaveAttribute("data-disabled", "true");
  });

  it("delegates las acciones principales en el hook de NewReport", () => {
    hookState.canStart = true;
    hookState.isSaveValid = true;
    hookState.isAdvanceValid = true;
    hookState.isBackValid = true;

    render(<NewReport />);

    fireEvent.click(screen.getByTestId("primary-action"));
    fireEvent.click(screen.getByRole("button", { name: "Regresar" }));
    fireEvent.click(screen.getByRole("button", { name: "Siguiente" }));
    fireEvent.click(screen.getByTestId("select-trigger"));
    fireEvent.click(screen.getByTestId("breadcrumb-actividades"));

    expect(hookState.handleSaveReport).toHaveBeenCalled();
    expect(hookState.handleBack).toHaveBeenCalled();
    expect(hookState.handleNext).toHaveBeenCalled();
    expect(hookState.onTypeChange).toHaveBeenCalledWith(["TYPE-2"]);
    expect(hookState.onStepChange).toHaveBeenCalledWith("actividades");
  });
});

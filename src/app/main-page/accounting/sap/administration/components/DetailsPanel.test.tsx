import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { DetailsPanelProps } from "../../../invoices/validateinvoices/components/DetailsPanel/types";

import DetailsPanel from "./DetailsPanel";

const useSAPDetailsPanelMock = vi.fn();

vi.mock("@/app/components/Button/Button", () => ({
  Button: ({ children, onClick, disabled }: any) => (
    <button onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
}));

vi.mock("@/app/components/DetailsPanelLayout/DetailsPanelLayout", () => ({
  default: ({ children, actionButton, renderActions, onClose }: any) => (
    <div>
      <div data-testid="action-button">{actionButton}</div>
      <div data-testid="render-actions">{renderActions?.()}</div>
      <button onClick={() => onClose?.()} aria-label="close-panel">
        close
      </button>
      {children}
    </div>
  ),
}));

vi.mock("@/app/components/PopUp/PopUp", () => ({
  PopUp: () => null,
}));

vi.mock("@/app/components/Select/Select", () => ({
  Select: () => <div data-testid="select-mock" />,
}));

vi.mock("@/assets/icons/Docs/page.svg", () => ({ default: "pdf-icon" }));
vi.mock("@/assets/icons/Docs/privacy policy.svg", () => ({ default: "xml-icon" }));

vi.mock("../../common/hooks/useSAPDetailsPanel", () => ({
  useSAPDetailsPanel: (...args: unknown[]) => useSAPDetailsPanelMock(...args),
}));

describe("SAP Administration DetailsPanel", () => {
  const baseSelected = {
    id: 15,
    uuid: "UUID-123",
    fecha: "2025-09-30",
    subtotal: "100",
    iva: "16",
    total: "116",
    conceptos: [
      {
        clave_sat: "001",
        tipo_gasto: "Gasto",
        clavesat_description: "Descripción",
        porcentajeiva: "16%",
      },
    ],
    xml: "http://example.com/invoice.xml",
    pdf: "http://example.com/invoice.pdf",
    requisition: { employeename: "Test User" },
    status: "PENDIENTE",
  } as DetailsPanelProps["selected"];

  const baseHookReturn = {
    labels: { left: "Usuario: Test", right: "Código" },
    setOpenValidInvoice: vi.fn(),
    currentPagePermissions: {
      canValidInvoice: false,
      canSendToSap: false,
    },
    isMobile: false,
    isEditing: false,
    showEditConfirmation: false,
    setShowEditConfirmation: vi.fn(),
    handleSave: vi.fn(),
    handleSendToSap: vi.fn(),
  };

  const renderComponent = (override?: Partial<DetailsPanelProps>) => {
    const props: DetailsPanelProps = {
      panelOpen: true,
      setPanelOpen: vi.fn(),
      selected: baseSelected,
      validInvoice: true,
      sendInvoiceToSap: true,
      operations: false,
      rejectType: true,
      reqisition: undefined,
      ...override,
    };

    return render(<DetailsPanel {...props} />);
  };

  beforeEach(() => {
    baseHookReturn.setOpenValidInvoice.mockClear();
    baseHookReturn.handleSendToSap.mockClear();
    useSAPDetailsPanelMock.mockReturnValue(baseHookReturn);
  });

  it("renders invoice details without action buttons", () => {
    useSAPDetailsPanelMock.mockReturnValue({
      ...baseHookReturn,
      currentPagePermissions: {
        canValidInvoice: true,
        canSendToSap: true,
      },
    });
    renderComponent();

    expect(screen.getByText("UUID-123")).toBeInTheDocument();
    expect(screen.queryByText("Validar Factura")).not.toBeInTheDocument();
    expect(screen.queryByText("Subir a SAP")).not.toBeInTheDocument();
  });

  it("shows an empty state when no record is selected", () => {
    renderComponent({ selected: null });

    expect(
      screen.getByText("Selecciona un registro para ver el detalle."),
    ).toBeInTheDocument();
  });
});

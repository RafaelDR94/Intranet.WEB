import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

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

vi.mock("@/assets/icons/Docs/page.svg", () => ({ default: "pdf-icon" }));
vi.mock("@/assets/icons/Docs/privacy policy.svg", () => ({ default: "xml-icon" }));

vi.mock("../../common/hooks/useSAPDetailsPanel", () => ({
  useSAPDetailsPanel: (...args: unknown[]) => useSAPDetailsPanelMock(...args),
}));

describe("SAP Operations DetailsPanel", () => {
  const selectedRow = {
    id: 21,
    uuid: "UUID-999",
    fecha: "2025-09-30",
    subtotal: "500",
    iva: "80",
    total: "580",
    conceptos: [
      {
        clave_sat: "A1",
        tipo_gasto: "Viaje",
        clavesat_description: "Hotel",
        porcentajeiva: "16%",
      },
    ],
    xml: "http://example.com/op.xml",
    pdf: "http://example.com/op.pdf",
    requisition: { employeename: "Operador" },
    validatedbyoperations: false,
    status: "PENDIENTE",
  } as DetailsPanelProps["selected"];

  const hookReturn = {
    labels: { left: "Usuario: Operador", right: "Solicitud" },
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
      selected: selectedRow,
      validInvoice: true,
      sendInvoiceToSap: true,
      operations: true,
      rejectType: true,
      reqisition: undefined,
      ...override,
    };

    return render(<DetailsPanel {...props} />);
  };

  beforeEach(() => {
    hookReturn.setOpenValidInvoice.mockClear();
    hookReturn.handleSendToSap.mockClear();
    useSAPDetailsPanelMock.mockReturnValue(hookReturn);
  });

  it("renders selected invoice information", () => {
    renderComponent();

    expect(screen.getByText("UUID-999")).toBeInTheDocument();
    expect(screen.getByText("Subir a SAP")).toBeInTheDocument();
  });

  it("disables the validate button when the invoice was already validated by operations", () => {
    renderComponent({ selected: { ...selectedRow, validatedbyoperations: true } });

    expect(screen.getByText("Validar Factura")).toBeDisabled();
  });

  it("invokes the SAP upload handler when clicking the button", () => {
    renderComponent();

    fireEvent.click(screen.getByText("Subir a SAP"));
    expect(hookReturn.handleSendToSap).toHaveBeenCalled();
  });
});

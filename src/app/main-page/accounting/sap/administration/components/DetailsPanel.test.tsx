import { render, screen } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { DetailsPanelProps } from "../../../invoices/validateinvoices/components/DetailsPanel/types";

import DetailsPanel from "./DetailsPanel";

const useSAPDetailsPanelMock = vi.fn();
const sharedDetailsPanelMock = vi.fn(() => <div>SharedDetailsPanel</div>);

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
vi.mock(
  "../../../invoices/validateinvoices/components/DetailsPanel/DetailsPanel",
  () => ({
    __esModule: true,
    default: (props: unknown) => sharedDetailsPanelMock(props),
  }),
);

vi.mock("../../common/hooks/useSAPDetailsPanel", () => ({
  useSAPDetailsPanel: (...args: unknown[]) => useSAPDetailsPanelMock(...args),
}));

describe("SAP Administration DetailsPanel", () => {
  const handleSendToSap = vi.fn();
  const selected = {
    id: 15,
    billingdocument_id: "15",
    uuid: "UUID-123",
    fecha: "2025-09-30",
    requisition: { employeename: "Test User" },
  } as DetailsPanelProps["selected"];

  beforeEach(() => {
    handleSendToSap.mockClear();
    sharedDetailsPanelMock.mockClear();
    useSAPDetailsPanelMock.mockReturnValue({
      currentPagePermissions: {
        canSendToSap: false,
      },
      handleSendToSap,
    });
  });

  it("delegates to the shared SAT details panel with SAP upload behavior", () => {
    const onJsonSapUpdated = vi.fn();
    render(
      <DetailsPanel
        panelOpen
        setPanelOpen={vi.fn()}
        selected={selected}
        sendInvoiceToSap
        validInvoice={false}
        rejectType={false}
        onJsonSapUpdated={onJsonSapUpdated}
      />,
    );

    expect(screen.getByText("SharedDetailsPanel")).toBeInTheDocument();
    expect(sharedDetailsPanelMock).toHaveBeenCalledWith(
      expect.objectContaining({
        selected,
        sendInvoiceToSap: true,
        onSendToSap: handleSendToSap,
        allowSendToSapAction: true,
        onJsonSapUpdated,
      }),
    );
  });

  it("respects SAP permissions when deciding if the send action should be shown", () => {
    useSAPDetailsPanelMock.mockReturnValue({
      currentPagePermissions: {
        canSendToSap: true,
      },
      handleSendToSap,
    });

    render(
      <DetailsPanel
        panelOpen
        setPanelOpen={vi.fn()}
        selected={selected}
        sendInvoiceToSap
        validInvoice={false}
        rejectType={false}
      />,
    );

    expect(sharedDetailsPanelMock).toHaveBeenCalledWith(
      expect.objectContaining({
        allowSendToSapAction: false,
      }),
    );
  });
});

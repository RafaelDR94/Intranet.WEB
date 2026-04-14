import { render, screen } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { DetailsPanelProps } from "../../../invoices/validateinvoices/components/DetailsPanel/types";

import DetailsPanel from "./DetailsPanel";

const useSAPDetailsPanelMock = vi.fn();
const sharedDetailsPanelMock = vi.fn(() => <div>SharedDetailsPanel</div>);

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

describe("SAP Operations DetailsPanel", () => {
  const handleSendToSap = vi.fn();
  const selected = {
    id: 21,
    billingdocument_id: "21",
    uuid: "UUID-999",
    fecha: "2025-09-30",
    requisition: { employeename: "Operador" },
    validatedbyoperations: false,
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

  it("delegates to the shared SAT details panel with the operations SAP handler", () => {
    render(
      <DetailsPanel
        panelOpen
        setPanelOpen={vi.fn()}
        selected={selected}
        sendInvoiceToSap
        validInvoice={false}
        operations
        rejectType={false}
      />,
    );

    expect(screen.getByText("SharedDetailsPanel")).toBeInTheDocument();
    expect(sharedDetailsPanelMock).toHaveBeenCalledWith(
      expect.objectContaining({
        selected,
        operations: true,
        sendInvoiceToSap: true,
        onSendToSap: handleSendToSap,
        allowSendToSapAction: true,
      }),
    );
  });

  it("passes through the permission override for SAP sending", () => {
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
        operations
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

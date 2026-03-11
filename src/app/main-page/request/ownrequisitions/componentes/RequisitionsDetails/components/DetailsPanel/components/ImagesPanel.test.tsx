import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

import ImagesPanel from "./ImagesPanel";

import type { BillingImages } from "@/app/mappings/billingimages/billingimages.types";
import type { Requisition } from "@/app/mappings/requisitions/requisitions.types";

const TicketForm = vi.hoisted(() =>
  vi.fn(
    ({
      onValidChange,
    }: {
      onValidChange?: (isValid: boolean) => void;
    }) => (
      <div>
        <div>TicketFormMock</div>
        <button type="button" onClick={() => onValidChange?.(true)}>
          make-valid
        </button>
        <button type="button" onClick={() => onValidChange?.(false)}>
          make-invalid
        </button>
      </div>
    ),
  ),
);

vi.mock("@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery", () => ({
  useIsMobile: () => false,
}));

vi.mock("@/app/components/DetailsPanelLayout/DetailsPanelLayout", () => ({
  __esModule: true,
  default: ({
    children,
    actionButton,
  }: {
    children: React.ReactNode;
    actionButton?: React.ReactNode;
  }) => (
    <div>
      <div>{actionButton}</div>
      <div>{children}</div>
    </div>
  ),
}));

vi.mock("@/app/components/Label/Label", () => ({
  __esModule: true,
  default: () => <span>LabelMock</span>,
}));

vi.mock("@/app/components/Button/Button", () => ({
  Button: ({
    children,
    disabled,
    onClick,
  }: {
    children?: React.ReactNode;
    disabled?: boolean;
    onClick?: () => void;
  }) => (
    <button disabled={disabled} onClick={onClick}>
      {children}
    </button>
  ),
}));

vi.mock(
  "@/app/main-page/accounting/personalInvoices/invoices/context/InvoicesContext",
  () => ({
    InvoicesProvider: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
  }),
);

vi.mock(
  "@/app/main-page/accounting/personalInvoices/invoices/components/TicketForm/TicketForm",
  () => ({
    __esModule: true,
    default: TicketForm,
  }),
);

const requisition: Requisition = {
  billingrequisition_id: "req-1",
  requisitionkey: "RQ-1",
  id_Employee: "emp-1",
  employeename: "Jane Doe",
  idProject: "proj-1",
  projectname: "Project 1",
  assignmentdate: "2025-01-01",
  endDate: "2025-01-02",
  motive: "Work",
  state: "active",
  status: "pending",
  amountdeposited: "100",
  provenamount: "50",
  amountdifference: "50",
  date_created: "2025-01-01",
  gts_type: "A",
  email: "jane@example.com",
  phone_number: "123",
  period: "2025-01",
  current_days: 1,
  billingDocumentRquisition: [],
};

const selected: BillingImages = {
  billing_image_id: "img-1",
  requisition,
  status: "rechazado",
  images: [{ image: "http://example.com/ticket.jpg" }],
  comments: "Comentario",
  user_comments: "",
  dateCreate: "2025-01-01",
  category: { id_billingcategory: "10", name: "Hospedaje" },
  description: { id_billingdescription: "20", name: "Hotel" },
  numpersons: 1,
  numnights: 1,
};

describe("ImagesPanel", () => {
  it("disables Reenviar until the form becomes valid", () => {
    TicketForm.mockClear();
    render(
      <ImagesPanel
        panelOpen
        setPanelOpen={vi.fn()}
        selected={selected}
      />,
    );

    const resendButton = screen.getByRole("button", { name: "Reenviar" });
    expect(resendButton).toBeDisabled();

    fireEvent.click(screen.getByRole("button", { name: "make-valid" }));
    expect(resendButton).not.toBeDisabled();

    expect(TicketForm).toHaveBeenCalled();
    const lastCallProps = TicketForm.mock.calls.at(-1)?.[0] as {
      suppressInitialTicketImage?: boolean;
    };
    expect(lastCallProps?.suppressInitialTicketImage).not.toBe(true);
  });
});

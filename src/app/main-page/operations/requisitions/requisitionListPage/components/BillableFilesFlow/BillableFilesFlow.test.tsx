import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { BillingImagesTable } from "@/app/mappings/billingimages/billingimages.types";

import BillableFilesFlow from "./BillableFilesFlow";

const useSearchParamsMock = vi.hoisted(() => vi.fn());
const routerPushMock = vi.hoisted(() => vi.fn());
const fetchBillingImagesMock = vi.hoisted(() => vi.fn());
const InvoicesFormMock = vi.hoisted(() =>
  vi.fn((props: { headerContent?: React.ReactNode }) => (
    <div>
      {props.headerContent}
      <div>InvoicesFormMock</div>
    </div>
  )),
);
const TicketFormMock = vi.hoisted(() =>
  vi.fn((props: { headerContent?: React.ReactNode }) => (
    <div>
      {props.headerContent}
      <div>TicketFormMock</div>
    </div>
  )),
);
const TicketsFilesMock = vi.hoisted(() => vi.fn(() => <div>TicketsFilesMock</div>));

vi.mock("next/navigation", () => ({
  usePathname: () => "/main-page/operations/requisitions/requisitionListPage",
  useRouter: () => ({ push: routerPushMock }),
  useSearchParams: () => useSearchParamsMock(),
}));

vi.mock(
  "@/app/main-page/accounting/personalInvoices/invoices/components/InvoicesForm/InvoicesForm",
  () => ({
    __esModule: true,
    default: InvoicesFormMock,
  }),
);

vi.mock(
  "@/app/main-page/accounting/personalInvoices/invoices/components/TicketForm/TicketForm",
  () => ({
    __esModule: true,
    default: TicketFormMock,
  }),
);
vi.mock("@/app/stores/useBillingImagesStore/useBillingImagesStore", () => ({
  useBillingImagesStore: (
    selector: (state: { fetchBillingImages: typeof fetchBillingImagesMock }) => unknown,
  ) => selector({ fetchBillingImages: fetchBillingImagesMock }),
}));

vi.mock("../TicketsFiles/TicketsFiles", () => ({
  __esModule: true,
  default: TicketsFilesMock,
}));

describe("BillableFilesFlow", () => {
  const selectedTicket = {
    billing_image_id: "ticket-1",
    Image: "https://example.com/ticket-1.png",
  } as BillingImagesTable;

  beforeEach(() => {
    routerPushMock.mockClear();
    fetchBillingImagesMock.mockClear();
    InvoicesFormMock.mockClear();
    TicketFormMock.mockClear();
    TicketsFilesMock.mockClear();
    useSearchParamsMock.mockReturnValue(
      new URLSearchParams(
        "id=1&idEmployee=1&idRequisition=req-1&label=Archivos%20Hector&view=billablefiles",
      ),
    );
  });

  it("falls back to invoice section and keeps the ticket selection wiring", () => {
    render(
      <BillableFilesFlow
        selectedTicket={selectedTicket}
        onSelectedTicketChange={vi.fn()}
      />,
    );

    expect(screen.getByText("InvoicesFormMock")).toBeInTheDocument();
    expect(screen.getByText("TicketsFilesMock")).toBeInTheDocument();
    expect(screen.queryByText("TicketFormMock")).not.toBeInTheDocument();
    expect(InvoicesFormMock).toHaveBeenCalledWith(
      expect.objectContaining({
        layoutTitle: "Sube aqui tus archivos",
        headerContent: expect.anything(),
      }),
      undefined,
    );
    expect(TicketsFilesMock).toHaveBeenCalledWith(
      expect.objectContaining({
        eneableSelection: true,
        selectedTicketId: "ticket-1",
      }),
      undefined,
    );
  });

  it("renders the ticket section with the Figma copy overrides", () => {
    useSearchParamsMock.mockReturnValue(
      new URLSearchParams(
        "id=1&idEmployee=1&idRequisition=req-1&label=Archivos%20Hector&view=billablefiles&uploadSection=ticket",
      ),
    );

    render(
      <BillableFilesFlow
        selectedTicket={selectedTicket}
        onSelectedTicketChange={vi.fn()}
      />,
    );

    expect(screen.getByText("TicketFormMock")).toBeInTheDocument();
    expect(screen.queryByText("InvoicesFormMock")).not.toBeInTheDocument();
    expect(screen.getByText("TicketsFilesMock")).toBeInTheDocument();
    expect(TicketFormMock).toHaveBeenCalledWith(
      expect.objectContaining({
        layoutTitle: "Sube aqui tus archivos",
        showInlineEmployeeName: true,
        inlineEmployeeNameValue: "Hector",
        onSubmitSuccess: expect.any(Function),
        uploadFieldButtonLabel: "Seleccionar tickets",
        uploadFieldLabel: "Imagenes de los tickets (JPG o PNG)",
        headerContent: expect.anything(),
      }),
      undefined,
    );
  });

  it("navigates to the ticket section without losing context", () => {
    render(
      <BillableFilesFlow
        selectedTicket={selectedTicket}
        onSelectedTicketChange={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByText("Carga de tickets"));

    expect(routerPushMock).toHaveBeenCalledWith(
      "/main-page/operations/requisitions/requisitionListPage?id=1&idEmployee=1&idRequisition=req-1&label=Archivos+Hector&view=billablefiles&uploadSection=ticket",
    );
  });

  it("navigates back to the invoice section when clicking the first breadcrumb", () => {
    useSearchParamsMock.mockReturnValue(
      new URLSearchParams(
        "id=1&idEmployee=1&idRequisition=req-1&label=Archivos%20Hector&view=billablefiles&uploadSection=ticket",
      ),
    );

    render(
      <BillableFilesFlow
        selectedTicket={selectedTicket}
        onSelectedTicketChange={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByText("Subir una Factura"));

    expect(routerPushMock).toHaveBeenCalledWith(
      "/main-page/operations/requisitions/requisitionListPage?id=1&idEmployee=1&idRequisition=req-1&label=Archivos+Hector&view=billablefiles&uploadSection=invoice",
    );
  });

  it("refreshes the tickets table after a successful ticket submit", () => {
    useSearchParamsMock.mockReturnValue(
      new URLSearchParams(
        "id=1&idEmployee=1&idRequisition=req-1&label=Archivos%20Hector&view=billablefiles&uploadSection=ticket",
      ),
    );

    render(
      <BillableFilesFlow
        selectedTicket={selectedTicket}
        onSelectedTicketChange={vi.fn()}
      />,
    );

    const props = TicketFormMock.mock.calls[0]?.[0];
    props.onSubmitSuccess();

    expect(fetchBillingImagesMock).toHaveBeenCalledWith("1", true);
  });

  it("switches to invoice when a ticket is selected from the lower table", () => {
    useSearchParamsMock.mockReturnValue(
      new URLSearchParams(
        "id=1&idEmployee=1&idRequisition=req-1&label=Archivos%20Hector&view=billablefiles&uploadSection=ticket",
      ),
    );
    const onSelectedTicketChange = vi.fn();

    render(
      <BillableFilesFlow
        selectedTicket={selectedTicket}
        onSelectedTicketChange={onSelectedTicketChange}
      />,
    );

    const props = TicketsFilesMock.mock.calls[0]?.[0];
    props.onSelectedTicketChange(selectedTicket);

    expect(onSelectedTicketChange).toHaveBeenCalledWith(selectedTicket);
    expect(routerPushMock).toHaveBeenCalledWith(
      "/main-page/operations/requisitions/requisitionListPage?id=1&idEmployee=1&idRequisition=req-1&label=Archivos+Hector&view=billablefiles&uploadSection=invoice",
    );
  });
});

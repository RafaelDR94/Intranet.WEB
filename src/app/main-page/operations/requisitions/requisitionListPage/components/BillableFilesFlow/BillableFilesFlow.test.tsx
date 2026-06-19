import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { BillingImagesTable } from "@/app/mappings/billingimages/billingimages.types";

import BillableFilesFlow from "./BillableFilesFlow";

const useSearchParamsMock = vi.hoisted(() => vi.fn());
const routerPushMock = vi.hoisted(() => vi.fn());
const fetchBillingImagesMock = vi.hoisted(() => vi.fn());
const showAlert = vi.hoisted(() => vi.fn());
const hideAlert = vi.hoisted(() => vi.fn());
const showSpinner = vi.hoisted(() => vi.fn());
const hideSpinner = vi.hoisted(() => vi.fn());
const resetFields = vi.hoisted(() => vi.fn());
const invoicePropsByFormId = vi.hoisted(
  () => new Map<string, Record<string, unknown>>(),
);
const InvoicesFormMock = vi.hoisted(() =>
  vi.fn((props: Record<string, unknown>) => {
    invoicePropsByFormId.set(String(props.formId), props);
    return <div data-testid="invoice-form-mock">{String(props.formId)}</div>;
  }),
);
const FormsLayoutMock = vi.hoisted(() =>
  vi.fn(
    ({
      title,
      primaryLabel,
      primaryDisabled,
      onPrimaryClick,
      children,
    }: {
      title: string;
      primaryLabel: string;
      primaryDisabled?: boolean;
      onPrimaryClick?: () => void;
      children: React.ReactNode;
    }) => (
      <div>
        <div>{title}</div>
        <button
          type="button"
          onClick={onPrimaryClick}
          disabled={primaryDisabled}
        >
          {primaryLabel}
        </button>
        {children}
      </div>
    ),
  ),
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

vi.mock("@/app/context/PrincipalContext/PrincipalContext", () => ({
  usePrincipal: () => ({
    usePrincipalAlert: { showAlert, hideAlert },
    usePrincipalLoading: { showSpinner, hideSpinner },
  }),
}));

vi.mock("@/app/components/FormsLayout/FormsLayout", () => ({
  __esModule: true,
  default: FormsLayoutMock,
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

vi.mock("@/app/stores/useFormFieldsStore/useFormFieldsStore", () => ({
  useFormFieldsStore: Object.assign(() => [], {
    getState: () => ({
      resetFields,
    }),
  }),
}));

vi.mock("../TicketsFiles/TicketsFiles", () => ({
  __esModule: true,
  default: TicketsFilesMock,
}));

const getInvoiceProps = (formId: string) => {
  const props = invoicePropsByFormId.get(formId);
  if (!props) {
    throw new Error(`Missing props for form ${formId}`);
  }
  return props;
};

describe("BillableFilesFlow", () => {
  const selectedTicket = {
    billing_image_id: "ticket-1",
    Image: "https://example.com/ticket-1.png",
  } as BillingImagesTable;

  beforeEach(() => {
    routerPushMock.mockClear();
    fetchBillingImagesMock.mockClear();
    showAlert.mockClear();
    hideAlert.mockClear();
    showSpinner.mockClear();
    hideSpinner.mockClear();
    resetFields.mockClear();
    invoicePropsByFormId.clear();
    FormsLayoutMock.mockClear();
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

    expect(screen.getByTestId("invoice-form-mock")).toBeInTheDocument();
    expect(screen.getByText("Factura 1")).toBeInTheDocument();
    expect(screen.getByText("Enviar archivos")).toBeDisabled();
    expect(screen.getByText("TicketsFilesMock")).toBeInTheDocument();
    expect(screen.queryByText("TicketFormMock")).not.toBeInTheDocument();
    expect(FormsLayoutMock).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Si ya cuentas con la factura, sube aqui tus archivos XML y PDF",
        primaryLabel: "Enviar archivos",
        primaryDisabled: true,
      }),
      undefined,
    );
    expect(InvoicesFormMock).toHaveBeenCalledWith(
      expect.objectContaining({
        formId: expect.stringContaining("operations-billable-invoice-form-"),
        externalSubmitRef: expect.anything(),
        submitRequestRef: expect.anything(),
        onValidChange: expect.any(Function),
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
    expect(screen.queryByTestId("invoice-form-mock")).not.toBeInTheDocument();
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

  it("adds another invoice form below the current form", () => {
    render(
      <BillableFilesFlow
        selectedTicket={selectedTicket}
        onSelectedTicketChange={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByText("+ Agregar factura"));

    const forms = screen.getAllByTestId("invoice-form-mock");
    expect(forms).toHaveLength(2);
    expect(screen.getByText("Factura 1")).toBeInTheDocument();
    expect(screen.getByText("Factura 2")).toBeInTheDocument();
    expect(screen.getAllByText("Descartar")).toHaveLength(2);
    expect(InvoicesFormMock).toHaveBeenLastCalledWith(
      expect.objectContaining({
        formId: expect.stringContaining("operations-billable-invoice-form-"),
        billingImages: null,
        externalSubmitRef: expect.anything(),
        submitRequestRef: expect.anything(),
      }),
      undefined,
    );
  });

  it("submits all invoice forms from the single layout button", async () => {
    render(
      <BillableFilesFlow
        selectedTicket={selectedTicket}
        onSelectedTicketChange={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByText("+ Agregar factura"));

    const [firstFormId, secondFormId] = Array.from(invoicePropsByFormId.keys());
    const firstSubmit = vi.fn().mockResolvedValue({ ok: true });
    const secondSubmit = vi.fn().mockResolvedValue({ ok: true });
    const firstProps = getInvoiceProps(firstFormId);
    const secondProps = getInvoiceProps(secondFormId);

    (
      firstProps.submitRequestRef as React.RefObject<
        (() => Promise<{ ok: true }>) | null
      >
    ).current = firstSubmit;
    (
      secondProps.submitRequestRef as React.RefObject<
        (() => Promise<{ ok: true }>) | null
      >
    ).current = secondSubmit;

    await act(async () => {
      (firstProps.onValidChange as (isValid: boolean) => void)(true);
      (secondProps.onValidChange as (isValid: boolean) => void)(true);
    });

    expect(screen.getByText("Enviar archivos")).toBeEnabled();
    fireEvent.click(screen.getByText("Enviar archivos"));

    await waitFor(() => expect(firstSubmit).toHaveBeenCalledTimes(1));
    expect(secondSubmit).toHaveBeenCalledTimes(1);
    expect(showSpinner).toHaveBeenCalledWith({
      message: "Subiendo facturas...",
    });
    expect(hideSpinner).toHaveBeenCalled();
    expect(showAlert).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "success",
        title: "Facturas enviadas",
      }),
    );
  });

  it("discards an added invoice form and clears its stored fields", () => {
    render(
      <BillableFilesFlow
        selectedTicket={selectedTicket}
        onSelectedTicketChange={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByText("+ Agregar factura"));
    const [, secondFormId] = Array.from(invoicePropsByFormId.keys());

    fireEvent.click(screen.getAllByText("Descartar")[1]);

    expect(screen.getAllByTestId("invoice-form-mock")).toHaveLength(1);
    expect(screen.queryByText("Factura 2")).not.toBeInTheDocument();
    expect(resetFields).toHaveBeenCalledWith(secondFormId);
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

    fireEvent.click(screen.getByTestId("breadcrum-invoice"));

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

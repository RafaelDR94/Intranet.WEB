import { render, screen } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useRequisitionsStore } from "@/app/stores/useRequisitionStore/useRequisitionStore";

const useRouter = vi.hoisted(() => vi.fn());

vi.mock("next/navigation", () => ({
  useRouter: () => useRouter(),
}));

const InvoicesProvider = vi.hoisted(() =>
  vi.fn(({ children }: { children: React.ReactNode }) => <>{children}</>),
);
const TicketForm = vi.hoisted(() => vi.fn(() => <div>TicketFormMock</div>));
const BatchInvoicesForms = vi.hoisted(() =>
  vi.fn(() => <div>BatchInvoicesFormsMock</div>),
);

vi.mock(
  "../../../accounting/personalInvoices/invoices/context/InvoicesContext",
  () => ({
    InvoicesProvider,
  }),
);

vi.mock(
  "../../../accounting/personalInvoices/invoices/components/TicketForm/TicketForm",
  () => ({
    __esModule: true,
    default: TicketForm,
  }),
);

vi.mock("./components/BatchInvoicesForms/BatchInvoicesForms", () => ({
  __esModule: true,
  default: BatchInvoicesForms,
}));

import BillableFilesPage from "./page";

describe("ownrequisitions/uploadbillablefiles", () => {
  beforeEach(() => {
    TicketForm.mockClear();
    BatchInvoicesForms.mockClear();
    useRouter.mockReturnValue({ push: vi.fn() });
    useRequisitionsStore.setState({ requisitions: [], loading: false } as any);
  });

  it("muestra empty state si no hay requisiciones activas", () => {
    render(<BillableFilesPage />);

    expect(
      screen.getByText("No cuentas con requisiciones activas."),
    ).toBeInTheDocument();
    expect(TicketForm).not.toHaveBeenCalled();
    expect(BatchInvoicesForms).not.toHaveBeenCalled();
  });

  it("no muestra formularios mientras carga requisiciones", () => {
    useRequisitionsStore.setState({ requisitions: [], loading: true } as any);

    render(<BillableFilesPage />);

    expect(screen.getByText("Cargando requisiciones...")).toBeInTheDocument();
    expect(TicketForm).not.toHaveBeenCalled();
    expect(BatchInvoicesForms).not.toHaveBeenCalled();
  });

  it("renderiza formularios cuando hay requisiciones", () => {
    useRequisitionsStore.setState({
      requisitions: [{ id: "r1" }],
      loading: false,
    } as any);

    render(<BillableFilesPage />);

    expect(
      screen.queryByText("No cuentas con requisiciones activas."),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("Cargando requisiciones..."),
    ).not.toBeInTheDocument();
    expect(screen.getByText("TicketFormMock")).toBeInTheDocument();
    expect(screen.getByText("BatchInvoicesFormsMock")).toBeInTheDocument();
  });
});

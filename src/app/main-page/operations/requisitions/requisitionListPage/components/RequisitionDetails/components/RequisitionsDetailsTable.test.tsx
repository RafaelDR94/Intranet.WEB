import { render, screen } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import RequisitionDetailsTable from "./RequisitionsDetailsTable";

const dataTableMock = vi.hoisted(() => vi.fn(() => <div data-testid="table" />));

vi.mock(
  "@/app/main-page/accounting/personalInvoices/requisitions/componentes/RequisitionsDetails/components/RequisitionDetailsDocuments/hooks/useRequisitionDetailsDocument",
  () => ({
    __esModule: true,
    default: () => ({
      rows: [
        {
          billingdocument_id: "doc-1",
          fecha: "2026-05-14 10:31",
          uuid: "uuid-1",
          status: "Pendiente",
          xmlUrl: "https://example.com/doc.xml",
          pdfUrl: "https://example.com/doc.pdf",
          imageUrl: "https://example.com/doc.jpg",
          authorization: { status: { name: "Pendiente" } },
        },
      ],
      selected: null,
      panelOpen: false,
      downloadRequistionResume: vi.fn(),
      handleOpenDetails: vi.fn(),
      setPanelOpen: vi.fn(),
      requisitionId: "req-1",
      loading: false,
      downloadingDocument: false,
    }),
  }),
);

vi.mock("@/app/components/DataTable/DataTable", () => ({
  DataTable: (props: any) => dataTableMock(props),
}));

vi.mock("@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery", () => ({
  useIsMobile: () => false,
}));

vi.mock("@/app/context/AuthContext/AuthContext", () => ({
  useAuth: () => ({
    currentPagePermissions: {
      downloadDocuments: true,
      sapprofile: false,
    },
  }),
}));

vi.mock("@/app/components/LoadingOverLay/LoadingOverlay", () => ({
  default: () => null,
}));

vi.mock("@/app/main-page/accounting/sap/administration/components/DetailsPanel", () => ({
  __esModule: true,
  default: () => null,
}));

vi.mock("@/app/components/Button/Button", () => ({
  Button: ({
    children,
    iconOnly: _iconOnly,
    hideIcon: _hideIcon,
    icon: _icon,
    ...props
  }: any) => <button {...props}>{children}</button>,
}));

vi.mock("@/app/components/Label/Label", () => ({
  __esModule: true,
  default: ({ text }: any) => <span>{text}</span>,
}));

describe("RequisitionDetailsTable", () => {
  beforeEach(() => {
    dataTableMock.mockClear();
  });

  it("uses fractional width classes instead of fixed pixel basis on desktop columns", () => {
    render(<RequisitionDetailsTable />);

    screen.getByTestId("table");

    const columns = dataTableMock.mock.calls[0][0].tables[0].columns;

    expect(columns).toHaveLength(11);
    columns.forEach((column: { cellClass?: string; headerClass?: string }) => {
      expect(column.cellClass ?? "").not.toContain("basis-[");
      expect(column.headerClass ?? "").not.toContain("basis-[");
    });

    expect(columns[0].cellClass).toContain("w-1/16");
    expect(columns[2].cellClass).toContain("w-3/16");
    expect(columns[9].cellClass).toContain("w-2/16");
    expect(columns[10].cellClass).toContain("w-2/16");
  });
});

import { render, renderHook, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

import useBillableFilesPage from "./useBillableFilesPage";

const actionMenuCellMock = vi.fn(() => <div data-testid="action-menu-cell" />);

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("@/tutorials/engine/useTutorialAutoRun", () => ({
  __esModule: true,
  default: vi.fn(),
}));

vi.mock("@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery", () => ({
  useIsMobile: () => true,
}));

vi.mock("@/app/components/ActionMenuCell/ActionMenuCell", () => ({
  __esModule: true,
  default: (props: any) => actionMenuCellMock(props),
}));

vi.mock("@/app/components/Button/Button", () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));

vi.mock("@/app/components/Label/Label", () => ({
  __esModule: true,
  default: ({ text, className }: any) => <span className={className}>{text}</span>,
}));

vi.mock("@/app/context/AuthContext/AuthContext", () => ({
  useAuth: () => ({
    user: { idEmployee: "emp-1" },
    currentPagePermissions: { read: true },
  }),
}));

vi.mock("@/app/stores/system/useIntranetGatewayStore", () => ({
  useIntranetGatewayStore: (selector: any) => selector({ isReady: true }),
}));

vi.mock("@/app/stores/useBillingAllDocumentsByEmployeeStore/useBillingAllDocumentsByEmployeeStore", () => ({
  useBillingAllDocumentsByEmployeeStore: (selector: any) =>
    selector({
      billingDocumentsByEmployee: [
        {
          id: "row-1",
          requisitonkey: "REQ-123",
          billingdocument: {
            billingrequisition_id: "req-1",
            uuid: "UID-999",
            requisition: {
              requisitionkey: "REQ-123",
            },
          },
          billingimage: null,
          xml: "x",
          pdf: "",
          image: "",
          dateCreated: "2026-05-13",
          category: "Hospedaje",
          proyect: "COMP-OP26-154",
          status: "Validado",
          comments: "ok",
        },
      ],
      loading: false,
      fetchBillingAllDocumentsByEmployee: vi.fn(),
    }),
}));

describe("useBillableFilesPage", () => {
  it("builds compact mobile columns with status and action menu", () => {
    const { result } = renderHook(() => useBillableFilesPage());

    expect(result.current.columns).toHaveLength(3);
    expect(result.current.columns.map((column) => column.label)).toEqual([
      "REQUISICION",
      "ESTATUS",
      "",
    ]);

    const row = result.current.recentRows[0];

    render(<>{result.current.columns[0].render?.(row)}</>);
    expect(screen.getByText("UID-999")).toBeInTheDocument();
    expect(screen.getByText("COMP-OP26-154 - REQ-123")).toBeInTheDocument();

    render(<>{result.current.columns[1].render?.(row)}</>);
    expect(screen.getByText("Validada")).toBeInTheDocument();

    render(<>{result.current.columns[2].render?.(row)}</>);
    expect(actionMenuCellMock).toHaveBeenCalled();
    expect(actionMenuCellMock.mock.calls[0][0]).toMatchObject({
      editLabel: "Ver detalle",
      permissions: { details: true },
    });
  });
});

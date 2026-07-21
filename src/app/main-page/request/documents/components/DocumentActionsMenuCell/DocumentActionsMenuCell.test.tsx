import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import type { ManagementDocumentTableRow } from "@/app/mappings/documents/documents.types";
import DotsIcon from "@/assets/icons/navegacion/more-horiz.svg";

import DocumentActionsMenuCell from "./DocumentActionsMenuCell";

const mockUseDocumentActionsMenu = vi.fn();
const mockUseIsMobile = vi.fn();
const contextMenuMock = vi.fn(({ trigger }: any) => (
  <div data-testid="context-menu">{trigger}</div>
));
const buttonMock = vi.fn(({ icon, iconOnly, ...props }: any) => (
  // the mock keeps parity with the native button semantics used by the real component
  <button data-testid="menu-trigger" {...props} />
));

vi.mock("./hooks/useDocumentActionsMenu", () => ({
  useDocumentActionsMenu: (props: any) => mockUseDocumentActionsMenu(props),
}));

vi.mock(
  "@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery",
  () => ({
    useIsMobile: () => mockUseIsMobile(),
  }),
);

vi.mock("@/app/components/ContextMenu/ContextMenu", () => ({
  __esModule: true,
  default: (props: any) => contextMenuMock(props),
}));

vi.mock("@/app/components/Button/Button", () => ({
  Button: (props: any) => buttonMock(props),
}));

const ROW: ManagementDocumentTableRow = {
  id: "1",
  name: "Documento",
  code: "DOC-01",
  description: "Descripcion",
  datecreated: "2025-10-25",
  documentType: "Tipo",
  department: "Departamento",
  extension: "pdf",
  route: "/route",
  date: "2025-10-25",
};

describe("DocumentActionsMenuCell", () => {
  beforeEach(() => {
    mockUseDocumentActionsMenu.mockReset();
    mockUseIsMobile.mockReset();
    contextMenuMock.mockClear();
    buttonMock.mockClear();
  });

  it("renders a context menu trigger with desktop icon by default", () => {
    const hookReturn = {
      menuItems: [{ label: "Ver Detalle" }],
      menuOpen: false,
      setMenuOpen: vi.fn(),
    };
    mockUseDocumentActionsMenu.mockReturnValue(hookReturn);
    mockUseIsMobile.mockReturnValue(false);

    render(<DocumentActionsMenuCell row={ROW} />);

    expect(mockUseDocumentActionsMenu).toHaveBeenCalledWith({ row: ROW, onView: undefined, onDelete: undefined });
    expect(contextMenuMock).toHaveBeenCalledTimes(1);
    expect(buttonMock).toHaveBeenCalledTimes(1);

    const [[buttonProps]] = buttonMock.mock.calls;
    expect(buttonProps.icon).toBe(DotsIcon);
    expect(screen.getByTestId("menu-trigger")).toBeInTheDocument();
  });

  it("uses the context menu trigger icon on mobile layouts", () => {
    const hookReturn = {
      menuItems: [{ label: "Ver Detalle" }],
      menuOpen: false,
      setMenuOpen: vi.fn(),
    };
    mockUseDocumentActionsMenu.mockReturnValue(hookReturn);
    mockUseIsMobile.mockReturnValue(true);

    render(<DocumentActionsMenuCell row={ROW} />);

    const [[buttonProps]] = buttonMock.mock.calls;
    expect(buttonProps.icon).toBe(DotsIcon);
  });

  it("passes hook state to the context menu", () => {
    const hookReturn = {
      menuItems: [
        { label: "Ver Detalle" },
        { label: "Eliminar" },
      ],
      menuOpen: true,
      setMenuOpen: vi.fn(),
    };
    mockUseDocumentActionsMenu.mockReturnValue(hookReturn);
    mockUseIsMobile.mockReturnValue(false);

    render(<DocumentActionsMenuCell row={ROW} onView={vi.fn()} onDelete={vi.fn()} />);

    const [[contextMenuProps]] = contextMenuMock.mock.calls;
    expect(contextMenuProps.items).toEqual(hookReturn.menuItems);
    expect(contextMenuProps.isOpen).toBe(true);
    expect(contextMenuProps.setIsOpen).toBe(hookReturn.setMenuOpen);
  });
});

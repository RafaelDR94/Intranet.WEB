import { renderHook, act } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import type { ManagementDocumentTableRow } from "@/app/mappings/documents/documents.types";

import { useDocumentActionsMenu } from "./useDocumentActionsMenu";

const mockUseAuth = vi.fn();

vi.mock("@/app/context/AuthContext/AuthContext", () => ({
  useAuth: () => mockUseAuth(),
}));

const ROW: ManagementDocumentTableRow = {
  id: "13",
  name: "Manual de seguridad",
  code: "SEC-13",
  description: "Procedimientos actualizados",
  datecreated: "2025-10-20",
  documentType: "Política",
  department: "Seguridad",
  extension: "pdf",
  route: "/docs/seguridad",
  date: "2025-10-20",
};

describe("useDocumentActionsMenu", () => {
  beforeEach(() => {
    mockUseAuth.mockReset();
  });

  it("includes the view option when permissions allow it", () => {
    const onView = vi.fn();
    mockUseAuth.mockReturnValue({ currentPagePermissions: { details: true } });

    const { result } = renderHook(() => useDocumentActionsMenu({ row: ROW, onView }));

    const viewAction = result.current.menuItems.find(item => item.label === "Ver Detalle");
    expect(viewAction).toBeDefined();

    act(() => {
      result.current.setMenuOpen(true);
    });
    expect(result.current.menuOpen).toBe(true);

    act(() => {
      viewAction?.onClick?.();
    });

    expect(onView).toHaveBeenCalledWith(ROW);
    expect(result.current.menuOpen).toBe(false);
  });

  it("exposes the delete option and closes the menu after using it", () => {
    const onDelete = vi.fn();
    mockUseAuth.mockReturnValue({ currentPagePermissions: { delete: true } });

    const { result } = renderHook(() => useDocumentActionsMenu({ row: ROW, onDelete }));

    const deleteAction = result.current.menuItems.find(item => item.label === "Eliminar");
    expect(deleteAction?.danger).toBe(true);

    act(() => {
      result.current.setMenuOpen(true);
      deleteAction?.onClick?.();
    });

    expect(onDelete).toHaveBeenCalledWith(ROW);
    expect(result.current.menuOpen).toBe(false);
  });

  it("leverages fallback permission keys when delete is undefined", () => {
    const onDelete = vi.fn();
    mockUseAuth.mockReturnValue({
      currentPagePermissions: { cancelVoucher: "yes" },
    });

    const { result } = renderHook(() => useDocumentActionsMenu({ row: ROW, onDelete }));

    const deleteAction = result.current.menuItems.find(item => item.label === "Eliminar");
    expect(deleteAction).toBeDefined();

    act(() => {
      deleteAction?.onClick?.();
    });

    expect(onDelete).toHaveBeenCalledWith(ROW);
  });

  it("returns a disabled placeholder when no actions are available", () => {
    mockUseAuth.mockReturnValue({ currentPagePermissions: { details: false, delete: false } });

    const { result } = renderHook(() => useDocumentActionsMenu({ row: ROW }));

    expect(result.current.menuItems).toEqual([
      expect.objectContaining({ label: "Sin acciones disponibles", disabled: true }),
    ]);
  });
});

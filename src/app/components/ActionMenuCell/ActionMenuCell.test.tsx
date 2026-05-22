import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import DotsIcon from "@/assets/icons/navegacion/more-horiz.svg";
import RightArrowIcon from "@/assets/icons/navegacion/nav-arrow-right.svg";
import type { ActionMenuPermissions } from "./types";

let lastButtonIcon: any = null;

vi.mock("../ContextMenu/ContextMenu", () => ({
  __esModule: true,
  default: ({ items, trigger }: any) => (
    <div>
      <div data-testid="trigger">{trigger}</div>
      <div data-testid="menu">
        {(items || []).map((item: any, index: number) => (
          <button key={index} data-testid={`item-${index}`} onClick={item.onClick}>
            {item.label}
          </button>
        ))}
      </div>
    </div>
  ),
}));

vi.mock("../Button/Button", () => ({
  __esModule: true,
  Button: (props: any) => {
    const { icon, ...rest } = props;
    lastButtonIcon = icon;
    return <button type="button" data-testid="action-button" {...rest} />;
  },
}));

let mockedAuthPermissions: ActionMenuPermissions = { details: true, delete: true };
vi.mock("@/app/context/AuthContext/AuthContext", () => ({
  useAuth: () => ({ currentPagePermissions: mockedAuthPermissions }),
}));

let mockedIsMobile = false;
vi.mock("../DataTable/components/DataTableLayout/hooks/useMediaQuery", () => ({
  useIsMobile: () => mockedIsMobile,
}));

import ActionMenuCell, { ActionMenuCellView, buildActionMenuItems } from "./ActionMenuCell";

describe("buildActionMenuItems", () => {
  const row = { id: 1 };
  const onEdit = vi.fn();
  const onDelete = vi.fn();

  beforeEach(() => {
    onEdit.mockReset();
    onDelete.mockReset();
  });

  it("crea opciones de editar y eliminar segun permisos", () => {
    const items = buildActionMenuItems({
      row,
      onEdit,
      onDelete,
      permissions: { details: true, delete: true },
    });

    expect(items).toHaveLength(2);
    expect(items[0].label).toBe("Editar");
    items[0].onClick?.();
    expect(onEdit).toHaveBeenCalledWith(row);

    expect(items[1].label).toBe("Eliminar");
    items[1].onClick?.();
    expect(onDelete).toHaveBeenCalledWith(row);
  });

  it("usa etiqueta 'Actualizar' cuando solo existe permiso de update", () => {
    const items = buildActionMenuItems({
      row,
      onEdit,
      onDelete,
      permissions: { update: true },
    });
    expect(items).toHaveLength(1);
    expect(items[0].label).toBe("Actualizar");
  });

  it("usa la etiqueta personalizada cuando se proporciona editLabel", () => {
    const items = buildActionMenuItems({
      row,
      onEdit,
      editLabel: "Ver detalle",
      permissions: { details: true },
    });
    expect(items).toHaveLength(1);
    expect(items[0].label).toBe("Ver detalle");
  });

  it("devuelve una lista vacia cuando no hay permisos", () => {
    const items = buildActionMenuItems({
      row,
      onEdit,
      onDelete,
      permissions: {},
    });
    expect(items).toHaveLength(0);
  });
});

describe("ActionMenuCellView", () => {
  const row = { id: "row-1", name: "Fila 1" };
  const onEdit = vi.fn();
  const onDelete = vi.fn();

  beforeEach(() => {
    onEdit.mockReset();
    onDelete.mockReset();
    lastButtonIcon = null;
  });

  it("renderiza botones para cada item y respeta el modo mobile", async () => {
    render(
      <ActionMenuCellView
        row={row}
        onEdit={onEdit}
        onDelete={onDelete}
        permissions={{ details: true, delete: true }}
        isMobile={true}
      />
    );

    expect(screen.getByTestId("trigger")).toBeInTheDocument();
    expect(screen.getByTestId("menu")).toBeInTheDocument();
    expect(lastButtonIcon).toBe(RightArrowIcon);

    await userEvent.click(screen.getByTestId("item-0"));
    expect(onEdit).toHaveBeenCalledWith(row);

    await userEvent.click(screen.getByTestId("item-1"));
    expect(onDelete).toHaveBeenCalledWith(row);
    expect(screen.getByTestId("action-button").getAttribute("aria-label")).toBe("Abrir menu de acciones");
  });

  it("usa el icono de tres puntos en desktop", () => {
    render(
      <ActionMenuCellView
        row={row}
        onEdit={onEdit}
        onDelete={onDelete}
        permissions={{ details: true }}
        isMobile={false}
      />
    );

    expect(lastButtonIcon).toBe(DotsIcon);
  });

  it("permite forzar el icono de tres puntos en mobile", () => {
    render(
      <ActionMenuCellView
        row={row}
        onEdit={onEdit}
        permissions={{ details: true }}
        isMobile={true}
        triggerIcon="dots"
      />
    );

    expect(lastButtonIcon).toBe(DotsIcon);
  });
});

describe("ActionMenuCell", () => {
  const row = { id: "f-1" };
  const onEdit = vi.fn();
  const onDelete = vi.fn();

  beforeEach(() => {
    onEdit.mockReset();
    onDelete.mockReset();
    mockedAuthPermissions = { details: true, delete: false };
    mockedIsMobile = false;
  });

  it("toma permisos del contexto cuando no se pasan overrides", () => {
    render(<ActionMenuCell row={row} onEdit={onEdit} onDelete={onDelete} />);

    expect(screen.queryByTestId("item-1")).toBeNull();
    expect(lastButtonIcon).toBe(DotsIcon);
  });

  it("prioriza overrides de mobile y permisos", () => {
    mockedAuthPermissions = { details: false, delete: false };
    mockedIsMobile = false;

    render(
      <ActionMenuCell
        row={row}
        onEdit={onEdit}
        onDelete={onDelete}
        permissions={{ delete: true }}
        isMobile
      />
    );

    expect(lastButtonIcon).toBe(RightArrowIcon);
    expect(screen.getByText("Eliminar")).toBeInTheDocument();
  });
});

import { render, screen } from "@testing-library/react";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import RefactionsList from "./RefactionsList";

const hookState = {
  rows: [
    {
      id: "0",
      index: 0,
      description: "Kit de limpieza",
      brand: "OptiClean",
      model: "OC-200",
      serialnumber: "SN-100",
      partnumber: "PN-200",
    },
  ],
  pageSize: 8,
  deleteRow: vi.fn(),
  confirmDeleteUI: <div data-testid="refactions-popup" />,
  report: { clientsign: { url: null } },
  isMobile: false,
};

const dataTableSpy = vi.fn();
const actionMenuSpy = vi.fn();

vi.mock("./hooks/useRefactionsList", () => ({
  __esModule: true,
  default: () => hookState,
}));

vi.mock("@/app/components/DataTable/DataTable", () => ({
  DataTable: (props: any) => {
    dataTableSpy(props);
    return <div data-testid="data-table">{props.dataTableTitle}</div>;
  },
}));

vi.mock("@/app/components/ActionMenuCell/ActionMenuCell", () => ({
  __esModule: true,
  default: (props: any) => {
    actionMenuSpy(props);
    return (
      <button type="button" data-testid="action-menu" onClick={() => props.onEdit?.(props.row)}>
        menu
      </button>
    );
  },
}));

describe("RefactionsList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    hookState.rows = [
      {
        id: "0",
        index: 0,
        description: "Kit de limpieza",
        brand: "OptiClean",
        model: "OC-200",
        serialnumber: "SN-100",
        partnumber: "PN-200",
      },
    ];
    hookState.report = { clientsign: { url: null } };
    hookState.isMobile = false;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renderiza la tabla de refacciones con acciones habilitadas", () => {
    const onCreate = vi.fn();
    const onEdit = vi.fn();

    render(<RefactionsList onCreate={onCreate} onEdit={onEdit} />);

    expect(screen.getByTestId("data-table")).toHaveTextContent("Lista de Refacciones");
    expect(dataTableSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        onTableActionClick: onCreate,
        searchableKeys: expect.arrayContaining(["description"]),
      })
    );
    const columns = dataTableSpy.mock.calls.at(-1)?.[0]?.tables?.[0]?.columns ?? [];
    const actionColumn = columns.find((column: any) => column.key === "actions" || column.label === "");
    expect(actionColumn?.render).toBeTruthy();
    expect(screen.getByTestId("refactions-popup")).toBeInTheDocument();
  });

  it("muestra estado vacio cuando no hay refacciones registradas", () => {
    hookState.rows = [];

    render(<RefactionsList onCreate={vi.fn()} onEdit={vi.fn()} />);

    expect(screen.getByText(/Aún no has registrado refacciones/i)).toBeInTheDocument();
  });

  it("oculta el menu de acciones cuando el reporte ya esta firmado", () => {
    hookState.report = { clientsign: { url: "https://cdn.example.com/sign.png" } };

    render(<RefactionsList onCreate={vi.fn()} onEdit={vi.fn()} />);

    expect(actionMenuSpy).not.toHaveBeenCalled();
  });
});

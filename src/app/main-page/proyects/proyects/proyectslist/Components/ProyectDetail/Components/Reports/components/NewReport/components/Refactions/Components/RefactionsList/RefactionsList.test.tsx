import { render, screen } from "@testing-library/react";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import RefactionsList from "./RefactionsList";

const hookState = {
  rows: [
    {
      id: "sp-1",
      description: "Kit de limpieza",
      brand: "OptiClean",
      model: "OC-200",
      serialnumber: "SN-100",
      partnumber: "PN-200",
      source: {
        id: "sp-1",
        sku: "PN-200",
        stock: 8,
        name: "Kit de limpieza",
        brand: "OptiClean",
        model: "OC-200",
        serialNumber: "SN-100",
        characteristic: "",
        provider: "",
        website: "",
        phoneNumber: "",
      },
    },
  ],
  onSelectedChange: vi.fn(),
  pageSize: 8,
  deleteRow: vi.fn(),
  confirmDeleteUI: <div data-testid="refactions-popup" />,
  initialSelectedIds: ["sp-1"],
  report: { clientsign: { url: null } },
  isMobile: false,
  loading: false,
  projectSelected: true,
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
        id: "sp-1",
        description: "Kit de limpieza",
        brand: "OptiClean",
        model: "OC-200",
        serialnumber: "SN-100",
        partnumber: "PN-200",
        source: {
          id: "sp-1",
          sku: "PN-200",
          stock: 8,
          name: "Kit de limpieza",
          brand: "OptiClean",
          model: "OC-200",
          serialNumber: "SN-100",
          characteristic: "",
          provider: "",
          website: "",
          phoneNumber: "",
        },
      },
    ];
    hookState.report = { clientsign: { url: null } };
    hookState.isMobile = false;
    hookState.loading = false;
    hookState.projectSelected = true;
    hookState.initialSelectedIds = ["sp-1"];
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renderiza la tabla seleccionable de refacciones con acciones habilitadas", () => {
    const onCreate = vi.fn();
    const onEdit = vi.fn();

    render(<RefactionsList onCreate={onCreate} onEdit={onEdit} />);

    expect(screen.getByTestId("data-table")).toHaveTextContent("Refacciones registradas");
    expect(dataTableSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        onTableActionClick: onCreate,
        searchableKeys: expect.arrayContaining(["description"]),
      })
    );
    expect(dataTableSpy.mock.calls.at(-1)?.[0]?.tables?.[0]).toEqual(
      expect.objectContaining({
        enableSelection: true,
        initialSelectedRowIds: ["sp-1"],
      })
    );
    expect(screen.getByTestId("refactions-popup")).toBeInTheDocument();
  });

  it("muestra estado vacío cuando no hay refacciones disponibles", () => {
    hookState.rows = [];

    render(<RefactionsList onCreate={vi.fn()} onEdit={vi.fn()} />);

    expect(screen.getByText(/No se encontraron refacciones disponibles/i)).toBeInTheDocument();
  });

  it("muestra mensaje cuando no se encontró el proyecto del reporte", () => {
    hookState.projectSelected = false;

    render(<RefactionsList onCreate={vi.fn()} onEdit={vi.fn()} />);

    expect(screen.getByText(/No se encontró el proyecto del reporte/i)).toBeInTheDocument();
    expect(dataTableSpy).not.toHaveBeenCalled();
  });

  it("oculta el menú de acciones cuando el reporte ya está firmado", () => {
    hookState.report = { clientsign: { url: "https://cdn.example.com/sign.png" } };

    render(<RefactionsList onCreate={vi.fn()} onEdit={vi.fn()} />);

    expect(actionMenuSpy).not.toHaveBeenCalled();
  });
});

import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import DevicesList from "./DevicesList";

const hookState = {
  rows: [
    { id: "DEV-1", brand: "Axis", model: "M2026", serialnumber: "SN-1" },
    { id: "DEV-2", brand: "Hikvision", model: "DS-2", serialnumber: "SN-2" },
  ],
  locationSelected: true,
  onSelectedChange: vi.fn(),
  deleteRow: vi.fn(),
  confirmDeleteUI: <div data-testid="devices-popup" />,
  pageSize: 10,
  loading: false,
  initialSelectedIds: ["DEV-1"],
  report: { clientsign: { url: null } },
  isMobile: false,
};

const dataTableSpy = vi.fn();
const actionMenuSpy = vi.fn();

vi.mock("./hooks/useDevicesList", () => ({
  __esModule: true,
  default: () => hookState,
}));

vi.mock("@/app/components/DataTable/DataTable", () => ({
  DataTable: (props: any) => {
    dataTableSpy(props);
    return (
      <div>
        <span data-testid="data-table">{props.dataTableTitle}</span>
        <button
          type="button"
          onClick={() => props.onSelectedChange?.([], hookState.rows)}
        >
          change-selection
        </button>
      </div>
    );
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

describe("DevicesList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.assign(hookState, { locationSelected: true, report: { clientsign: { url: null } } });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("muestra un estado vacio cuando no existe ubicacion seleccionada", () => {
    Object.assign(hookState, { locationSelected: false });

    render(<DevicesList onCreate={vi.fn()} onEdit={vi.fn()} />);

    expect(screen.getByText(/Para ver los dispositivos disponibles/)).toBeInTheDocument();
    expect(screen.queryByTestId("data-table")).toBeNull();
  });

  it("renderiza la tabla y delega la seleccion de filas", () => {
    const onCreate = vi.fn();
    const onEdit = vi.fn();

    render(<DevicesList onCreate={onCreate} onEdit={onEdit} />);

    expect(screen.getByTestId("data-table")).toHaveTextContent("Equipos registrados");
    expect(dataTableSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        onTableActionClick: onCreate,
        dataTableTitle: "Equipos registrados",
      })
    );

    fireEvent.click(screen.getByText("change-selection"));
    expect(hookState.onSelectedChange).toHaveBeenCalled();
  });

  it("omite las acciones cuando el reporte ya cuenta con firma del cliente", () => {
    Object.assign(hookState, { report: { clientsign: { url: "https://cdn.example.com/sign.png" } } });

    render(<DevicesList onCreate={vi.fn()} onEdit={vi.fn()} />);

    expect(actionMenuSpy).not.toHaveBeenCalled();
  });
});

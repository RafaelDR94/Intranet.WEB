import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { sampleReports } from "./testUtils/reportFixtures";

import ReportsTable from "./ReportsTable";

const handleCloseDetailsMock = vi.fn();
const setCurrentMock = vi.fn();
const downloadPicMock = vi.fn();
const downloadDigitalMock = vi.fn();
const dataTableSpy = vi.fn();

vi.mock("./hooks/useReportsTable", () => ({
  __esModule: true,
  default: () => ({
    currentReport: sampleReports[0],
    reportId: sampleReports[0].id,
    reports: sampleReports,
    setCurrent: setCurrentMock,
    handleCloseDetails: handleCloseDetailsMock,
    handleDownloadPicReport: downloadPicMock,
    handleDownloadDigitalReport: downloadDigitalMock,
  }),
}));

vi.mock("@/app/components/DataTable/DataTable", () => ({
  DataTable: (props: any) => {
    dataTableSpy(props);
    const table = props.tables?.[0];
    const actionColumn = table?.columns?.find((col: any) => col.label === "" || col.key === "actions");
    const actionContent = actionColumn?.render?.(table.data[0]);
    return (
      <div data-testid="data-table">
        <span data-testid="rows-count">{table?.data?.length ?? 0}</span>
        <div>{actionContent}</div>
      </div>
    );
  },
}));

vi.mock("@/app/components/Button/Button", () => ({
  Button: ({ children, onClick, icon }: any) => (
    <button type="button" data-icon={icon ? "true" : "false"} onClick={onClick}>
      {children || "icon-button"}
    </button>
  ),
}));

vi.mock("@/app/components/DetailsPanelLayout/DetailsPanelLayout", () => ({
  __esModule: true,
  default: ({ open, renderActions, onClose, children }: any) => (
    <div data-testid="details-panel" data-open={open ? "true" : "false"}>
      <button type="button" onClick={onClose}>cerrar</button>
      <div data-testid="actions-slot">{renderActions?.()}</div>
      <div data-testid="panel-body">{children}</div>
    </div>
  ),
}));

vi.mock("./components/ReportDetails/ReportDetails", () => ({
  __esModule: true,
  default: () => <div data-testid="report-details" />,
}));

describe("ReportsTable", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renderiza la tabla con los reportes disponibles", () => {
    render(<ReportsTable />);

    expect(screen.getByTestId("data-table")).toBeInTheDocument();
    expect(screen.getByTestId("rows-count").textContent).toBe(String(sampleReports.length));
    expect(dataTableSpy).toHaveBeenCalled();
  });

  it("permite abrir el detalle de un reporte desde la columna de acciones", () => {
    render(<ReportsTable />);

    fireEvent.click(screen.getByRole("button", { name: "Ver Detalle" }));
    expect(setCurrentMock).toHaveBeenCalledWith(sampleReports[0]);
  });

  it("expone acciones de descarga y cierre dentro del panel lateral", () => {
    render(<ReportsTable />);

    fireEvent.click(screen.getAllByRole("button", { name: "icon-button" })[0]);
    expect(downloadPicMock).toHaveBeenCalled();

    fireEvent.click(screen.getAllByRole("button", { name: "icon-button" })[1]);
    expect(downloadDigitalMock).toHaveBeenCalled();

    fireEvent.click(screen.getByText("cerrar"));
    expect(handleCloseDetailsMock).toHaveBeenCalled();
  });
});

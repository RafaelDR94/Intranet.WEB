import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { sampleProjectReports, sampleReports } from "./testUtils/reportFixtures";
import { ProjectReportsTableMap } from "@/app/mappings/reports/report.mapper";

const mappedReports = ProjectReportsTableMap(sampleProjectReports);

import ReportsTable from "./ReportsTable";

const hookState = {
  newReport: false,
  isMobile: false,
  currentPagePermissions: { reportdetails: true },
  currentReport: sampleReports[0],
  reportId: sampleReports[0].id,
  reportIdFront: null,
  reportList: mappedReports,
  reportLocalList: [] as typeof mappedReports,
  reportPendingDelete: null as (typeof sampleReports)[number] | null,
  forceActionButton: false,
  activeFilter: "all",
  controlFilterOptions: [],
  handleFilterChange: vi.fn(),
  handleSelectReportOnline: vi.fn(),
  handleSelectReportOffline: vi.fn(),
  handleDownloadPicReport: vi.fn(),
  handleDownloadDigitalReport: vi.fn(),
  handleClosePanel: vi.fn(),
  handleDelete: vi.fn(),
  handleEdit: vi.fn(),
  handleNewReport: vi.fn(),
  setReportPendingDelete: vi.fn(),
};

const dataTableSpy = vi.fn();

vi.mock("./hooks/useReportsTable", () => ({
  __esModule: true,
  default: () => hookState,
}));

vi.mock("@/app/context/AuthContext/AuthContext", () => ({
  useAuth: () => ({
    user: {
      idEmployee: sampleReports[0].employe.employee_id,
      fullName: sampleReports[0].employe.fullname,
    },
    currentPagePermissions: { reportdetails: true, canSeeAllReports: true },
  }),
}));

vi.mock("@/app/components/DataTable/DataTable", () => ({
  DataTable: (props: any) => {
    dataTableSpy(props);
    const table = props.tables?.[0];
    const actionColumn =
      table?.columns?.find((col: any) => col.key === "actions") ??
      table?.columns?.find((col: any) => col.label === "");
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
    Object.assign(hookState, {
      newReport: false,
      isMobile: false,
      currentPagePermissions: { reportdetails: true },
      currentReport: sampleReports[0],
      reportId: sampleReports[0].id,
      reportIdFront: null,
      reportList: mappedReports,
      reportLocalList: [],
      reportPendingDelete: null,
      forceActionButton: false,
      activeFilter: "all",
    });
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
    expect(hookState.handleSelectReportOnline).toHaveBeenCalledWith(
      expect.objectContaining({ id: sampleReports[0].id }),
      { forceButton: false }
    );
  });

  it("expone acciones de descarga y cierre dentro del panel lateral", () => {
    render(<ReportsTable />);

    fireEvent.click(screen.getAllByRole("button", { name: "icon-button" })[0]);
    expect(hookState.handleDownloadPicReport).toHaveBeenCalled();

    fireEvent.click(screen.getAllByRole("button", { name: "icon-button" })[1]);
    expect(hookState.handleDownloadDigitalReport).toHaveBeenCalled();

    fireEvent.click(screen.getByText("cerrar"));
    expect(hookState.handleClosePanel).toHaveBeenCalled();
  });
});

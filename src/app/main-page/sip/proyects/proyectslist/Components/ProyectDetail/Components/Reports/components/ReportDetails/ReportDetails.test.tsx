import { render, screen } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { createSampleReport } from "../../testUtils/reportFixtures";

let currentReportMock = createSampleReport();

vi.mock("./hooks/useReportDetails", () => ({
  __esModule: true,
  default: () => ({ currentReport: currentReportMock, loadingCurrent: false }),
}));

import ReportDetails from "./ReportDetails";

vi.mock("@/app/stores/useReportsStore/useReportsStore", () => ({
  useReportsStore: (selector?: any) => {
    const state = { currentReport: currentReportMock };
    return typeof selector === "function" ? selector(state) : state;
  },
}));

vi.mock("@/app/components/ButtonsNavigation/ButtonsNavigation", () => {
  const Mock = ({ children }: any) => <div data-testid="buttons-navigation">{children}</div>;
  Mock.Item = ({ id, label, renderContent }: any) => (
    <div data-testid={`nav-${id}`} data-label={label}>
      {renderContent}
    </div>
  );
  return { __esModule: true, default: Mock };
});

vi.mock("./components/Information/Information", () => ({
  __esModule: true,
  default: () => <div data-testid="info-section" />,
}));

vi.mock("./components/Activities/Activities", () => ({
  __esModule: true,
  default: () => <div data-testid="activities-section" />,
}));

vi.mock("./components/Devices/Devices", () => ({
  __esModule: true,
  default: () => <div data-testid="devices-section" />,
}));

vi.mock("./components/Refactions/Refactions", () => ({
  __esModule: true,
  default: () => <div data-testid="refactions-section" />,
}));

vi.mock("./components/WorkMaps/WorkMaps", () => ({
  __esModule: true,
  default: () => <div data-testid="workmaps-section" />,
}));

vi.mock("./components/Signatures/Signatures", () => ({
  __esModule: true,
  default: () => <div data-testid="signatures-section" />,
}));

describe("ReportDetails", () => {
  beforeEach(() => {
    currentReportMock = createSampleReport();
  });

  it("muestra todas las secciones disponibles para el reporte actual", () => {
    render(<ReportDetails />);

    expect(screen.getByTestId("buttons-navigation")).toBeInTheDocument();
    expect(screen.getByTestId("nav-info")).toBeInTheDocument();
    expect(screen.getByTestId("nav-activities")).toBeInTheDocument();
    expect(screen.getByTestId("nav-devices")).toBeInTheDocument();
    expect(screen.getByTestId("nav-refactions")).toBeInTheDocument();
    expect(screen.getByTestId("nav-workmaps")).toBeInTheDocument();
    expect(screen.getByTestId("nav-signature")).toBeInTheDocument();
  });

  it("omite las pestañas opcionales cuando no hay datos", () => {
    currentReportMock = createSampleReport({
      reportDeviceView: [],
      refactions: [],
      maps: [],
    });

    render(<ReportDetails />);

    expect(screen.queryByTestId("nav-devices")).toBeNull();
    expect(screen.queryByTestId("nav-refactions")).toBeNull();
    expect(screen.queryByTestId("nav-workmaps")).toBeNull();
  });
});

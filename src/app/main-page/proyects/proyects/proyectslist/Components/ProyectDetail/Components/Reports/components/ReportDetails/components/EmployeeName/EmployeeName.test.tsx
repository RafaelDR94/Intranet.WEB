import { render, screen } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { createSampleReport } from "../../../../testUtils/reportFixtures";

import EmployeeName from "./EmployeeName";

let currentReportMock = createSampleReport();

vi.mock("@/app/stores/useReportsStore/useReportsStore", () => ({
  useReportsStore: (selector?: any) => {
    const state = { currentReport: currentReportMock };
    return typeof selector === "function" ? selector(state) : state;
  },
}));

describe("EmployeeName", () => {
  beforeEach(() => {
    currentReportMock = createSampleReport();
  });

  it("muestra el nombre y puesto del responsable", () => {
    render(<EmployeeName />);

    expect(screen.getByText(/Responsable:/i).textContent).toContain(currentReportMock.employe.fullname);
    expect(screen.getByText(/Posici/i).textContent).toContain(currentReportMock.workposition.name);
  });

  it("utiliza los datos del empleado cuando falta el puesto directo", () => {
    currentReportMock = createSampleReport({
      workposition: { workposition_id: "WP-0", name: "" },
    });

    render(<EmployeeName />);
    expect(screen.getByText(/Posici/i).textContent).toContain(currentReportMock.employe.workposition.name);
  });
});


import { render, screen } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { createSampleReport } from "../../../../testUtils/reportFixtures";

import Signatures from "./Signatures";

let currentReportMock = createSampleReport();

vi.mock("@/app/stores/useReportsStore/useReportsStore", () => ({
  useReportsStore: (selector?: any) => {
    const state = { currentReport: currentReportMock };
    return typeof selector === "function" ? selector(state) : state;
  },
}));

vi.mock("../EmployeeName/EmployeeName", () => ({
  __esModule: true,
  default: () => <div data-testid="employee-name" />,
}));

vi.mock("@/app/components/SignatureBox/SignatureBox", () => ({
  __esModule: true,
  default: ({ title, imageUrl, captionTop, captionBottom }: any) => (
    <div data-testid={`signature-${title}`} data-image={imageUrl}>
      <span>{captionTop}</span>
      <span>{captionBottom}</span>
    </div>
  ),
}));

describe("Signatures component", () => {
  beforeEach(() => {
    currentReportMock = createSampleReport();
  });

  it("muestra las firmas del responsable y del cliente", () => {
    render(<Signatures />);

    expect(screen.getByTestId("employee-name")).toBeInTheDocument();
    const employeeSignature = screen.getByTestId("signature-Firma responsable");
    expect(employeeSignature.dataset.image).toBe(currentReportMock.employeesignurl);

    const clientSignature = screen.getByTestId("signature-Firma cliente");
    expect(clientSignature.dataset.image).toBe(currentReportMock.clientsign?.url);
    expect(clientSignature.textContent).toContain(currentReportMock.clientsign?.clientname ?? "");
    expect(clientSignature.textContent).toContain(currentReportMock.clientsign?.datetime ?? "");
  });
});


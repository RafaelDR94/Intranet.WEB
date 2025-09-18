import { render, screen } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import Information from "./Information";

const cardsMock = [[{ label: "Tipo", value: "Correctivo" }]];
let currentReportMock: any = {};

vi.mock("./hooks/useInformation", () => ({
  __esModule: true,
  default: () => ({ cards: cardsMock, progressPct: 80, currentReport: currentReportMock }),
}));

vi.mock("../EmployeeName/EmployeeName", () => ({
  __esModule: true,
  default: () => <div data-testid="employee-name" />,
}));

vi.mock("@/app/components/ProgressCard/ProgressCard", () => ({
  __esModule: true,
  default: ({ percentage }: any) => <div data-testid="progress-card">{percentage}</div>,
}));

vi.mock("@/app/components/InfoCards/InfoCards", () => ({
  __esModule: true,
  default: ({ cards }: any) => <div data-testid="info-cards">{cards.length}</div>,
}));

describe("Information component", () => {
  beforeEach(() => {
    currentReportMock = { id: "REP-1" };
  });

  it("muestra la informacion del reporte cuando hay datos", () => {
    render(<Information />);

    expect(screen.getByTestId("employee-name")).toBeInTheDocument();
    expect(screen.getByTestId("progress-card").textContent).toBe("80");
    expect(screen.getByTestId("info-cards").textContent).toBe("1");
  });

  it("muestra un mensaje de carga cuando no existe reporte", () => {
    currentReportMock = null;
    render(<Information />);

    expect(screen.getByText(/Obteniendo reporte seleccionado/i)).toBeInTheDocument();
  });
});

import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

import Devices from "./Devices";

const rowsMock = [
  { id: "1", index: 1, device: "Axis M2026" },
];
const dataTableSpy = vi.fn();

vi.mock("./hooks/useDevices", () => ({
  __esModule: true,
  default: () => ({ rows: rowsMock }),
}));

vi.mock("../EmployeeName/EmployeeName", () => ({
  __esModule: true,
  default: () => <div data-testid="employee-name" />,
}));

vi.mock("@/app/components/DataTable/DataTable", () => ({
  DataTable: (props: any) => {
    dataTableSpy(props);
    return (
      <div data-testid="devices-table">
        {props.tables?.[0]?.data?.map((row: any) => (
          <span key={row.id}>{row.device}</span>
        ))}
      </div>
    );
  },
}));

describe("Devices component", () => {
  it("muestra la tabla de dispositivos y al responsable", () => {
    render(<Devices />);

    expect(screen.getByTestId("employee-name")).toBeInTheDocument();
    expect(screen.getByTestId("devices-table").textContent).toContain("Axis");
    expect(dataTableSpy).toHaveBeenCalled();
  });
});

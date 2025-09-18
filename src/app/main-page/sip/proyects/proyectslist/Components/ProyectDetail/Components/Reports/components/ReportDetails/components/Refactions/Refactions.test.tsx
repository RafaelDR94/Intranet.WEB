import { render, screen } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import Refactions from "./Refactions";

const rowsMock = [
  { id: "1", index: 1, description: "Fuente", brand: "Delta", model: "D1", serialnumber: "SN-1", partnumber: "PN-1" },
];
const dataTableSpy = vi.fn();
let compactMock = false;

vi.mock("./hooks/useRefactions", () => ({
  __esModule: true,
  default: () => ({ rows: rowsMock, compact: compactMock, containerRef: { current: null } }),
}));

vi.mock("@/app/components/DataTable/DataTable", () => ({
  DataTable: (props: any) => {
    dataTableSpy(props);
    return <div data-testid="refactions-table">{props.tables?.[0]?.data?.length}</div>;
  },
}));

vi.mock("../EmployeeName/EmployeeName", () => ({
  __esModule: true,
  default: () => <div data-testid="employee-name" />,
}));

describe("Refactions component", () => {
  beforeEach(() => {
    compactMock = false;
    dataTableSpy.mockClear();
  });

  it("renderiza columnas extendidas cuando hay espacio suficiente", () => {
    render(<Refactions />);

    expect(screen.getByTestId("employee-name")).toBeInTheDocument();
    const call = dataTableSpy.mock.calls[0][0];
    expect(call.tables[0].columns).toHaveLength(5);
  });

  it("usa la version compacta cuando el hook lo indica", () => {
    compactMock = true;
    render(<Refactions />);

    const call = dataTableSpy.mock.calls[0][0];
    expect(call.tables[0].columns).toHaveLength(2);
  });
});

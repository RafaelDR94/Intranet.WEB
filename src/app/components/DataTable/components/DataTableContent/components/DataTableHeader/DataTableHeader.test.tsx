import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

import { DataTableHeader } from "./DataTableHeader";

vi.mock("../../../DataTableLayout/hooks/useMediaQuery", () => ({
  useIsMobile: () => false,
}));

vi.mock("@/app/components/CheckBox/CheckBox", () => ({
  Checkbox: () => <input type="checkbox" />,
}));

vi.mock("@/assets/icons/navegacion/nav-arrow-down.svg", () => ({
  default: () => <svg data-testid="arrow-down" />,
}));

vi.mock("@/assets/icons/navegacion/nav-arrow-up.svg", () => ({
  default: () => <svg data-testid="arrow-up" />,
}));

type Row = {
  id: string;
  code: string;
  date: string;
};

describe("DataTableHeader", () => {
  it("sorts sortable columns", () => {
    const onSort = vi.fn();

    render(
      <DataTableHeader<Row>
        columns={[{ key: "code", label: "Código" }]}
        enableSelection={false}
        allSelected={false}
        onSelectAll={vi.fn()}
        sortKey={null}
        sortDirection={null}
        onSort={onSort}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "CÓDIGO" }));
    expect(onSort).toHaveBeenCalledWith("code");
  });

  it("does not sort or render arrows for unsortable columns", () => {
    const onSort = vi.fn();

    render(
      <DataTableHeader<Row>
        columns={[{ key: "date", label: "Fecha", sortable: false }]}
        enableSelection={false}
        allSelected={false}
        onSelectAll={vi.fn()}
        sortKey={"date"}
        sortDirection={"asc"}
        onSort={onSort}
      />,
    );

    expect(screen.queryByRole("button", { name: "FECHA" })).not.toBeInTheDocument();
    expect(screen.getByText("FECHA")).toBeInTheDocument();
    expect(screen.queryByTestId("arrow-up")).not.toBeInTheDocument();
    expect(onSort).not.toHaveBeenCalled();
  });

  it("keeps sorting enabled when only the sort indicator is hidden", () => {
    const onSort = vi.fn();

    render(
      <DataTableHeader<Row>
        columns={[{ key: "date", label: "Fecha", showSortIndicator: false }]}
        enableSelection={false}
        allSelected={false}
        onSelectAll={vi.fn()}
        sortKey={"date"}
        sortDirection={"asc"}
        onSort={onSort}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "FECHA" }));
    expect(onSort).toHaveBeenCalledWith("date");
    expect(screen.queryByTestId("arrow-up")).not.toBeInTheDocument();
  });
});

import { render } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

import type { TravelExpense } from "@/app/mappings/travelExpenses/travelExpenses.types";

import { TreasuryRequisitionRequestsTable } from "./TreasuryRequisitionRequestsTable";

const dataTableMock = vi.fn();

vi.mock("@/app/components/DataTable/DataTable", () => ({
  DataTable: (props: unknown) => {
    dataTableMock(props);
    return <div data-testid="data-table" />;
  },
}));

vi.mock("@/app/components/Label/Label", () => ({
  Label: ({ text }: { text: string }) => <span>{text}</span>,
}));

describe("TreasuryRequisitionRequestsTable", () => {
  it("uses treasury_status_name for the status column and search", () => {
    render(
      <TreasuryRequisitionRequestsTable
        rows={[]}
        onRefresh={vi.fn()}
        onViewDetails={vi.fn()}
      />,
    );

    const props = dataTableMock.mock.calls[0][0] as {
      dateKey: string;
      searchableKeys: string[];
      showCalendar: boolean;
      tables: Array<{
        columns: Array<{
          key: string;
          render: (row: TravelExpense) => React.ReactNode;
        }>;
      }>;
    };
    const statusColumn = props.tables[0].columns.find(
      (column) => column.key === "treasury_status_name",
    );
    const actionColumn = props.tables[0].columns.find(
      (column) => column.key === "id",
    );

    expect(props.showCalendar).toBe(true);
    expect(props.dateKey).toBe("date_created");
    expect(props.searchableKeys).toContain("treasury_status_name");
    expect(statusColumn).toBeDefined();

    const statusCell = statusColumn?.render({
      treasury_status_name: "PENDIENTE",
      status_name: "APROBADA",
    } as TravelExpense);
    const actionCell = actionColumn?.render({
      image_urls: ["https://files.example/requisition.png"],
    } as TravelExpense);

    expect(statusCell).toMatchObject({ props: { status: "PENDIENTE" } });
    expect(actionCell).toMatchObject({ props: { variant: "ghost" } });
  });
});

import { render } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

import type { TravelExpense } from "@/app/mappings/travelExpenses/travelExpenses.types";

import { RequisitionRequestsTable } from "./RequisitionRequestsTable";

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

describe("RequisitionRequestsTable", () => {
  it("opens the requisition detail from Ver más regardless of evidence", () => {
    const onViewDetails = vi.fn();
    render(
      <RequisitionRequestsTable
        rows={[]}
        onRefresh={vi.fn()}
        onViewDetails={onViewDetails}
      />,
    );

    const props = dataTableMock.mock.calls[0][0] as {
      tables: Array<{
        columns: Array<{
          key: string;
          render: (row: TravelExpense) => React.ReactNode;
        }>;
      }>;
    };
    const actionColumn = props.tables[0].columns.find(
      (column) => column.key === "id",
    );
    const row = { id: "request-1", image_urls: [] } as TravelExpense;
    const actionCell = actionColumn?.render(row) as React.ReactElement<{
      disabled?: boolean;
      onClick: () => void;
    }>;

    expect(actionCell.props.disabled).toBeUndefined();
    actionCell.props.onClick();
    expect(onViewDetails).toHaveBeenCalledWith(row);
  });
});

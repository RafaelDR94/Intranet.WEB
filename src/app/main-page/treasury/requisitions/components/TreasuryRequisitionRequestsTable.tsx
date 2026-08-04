"use client";

import React, { useMemo } from "react";

import { Button } from "@/app/components/Button/Button";
import { DataTable } from "@/app/components/DataTable/DataTable";
import type { ColumnDefinition } from "@/app/components/DataTable/types";
import { Label } from "@/app/components/Label/Label";
import type { TravelExpense } from "@/app/mappings/travelExpenses/travelExpenses.types";
import {
  formatDate,
  normalizeStatusType,
} from "@/app/main-page/operations/expenserequisitions/travelexpenserequest/utilities/travelExpenseRequestHelpers";

type TreasuryRequisitionRequestsTableProps = {
  onRefresh: () => void;
  onViewDetails: (row: TravelExpense) => void;
  rows: TravelExpense[];
};

const StatusBadge = ({ status }: { status?: string }) => (
  <Label
    type={normalizeStatusType(status ?? "")}
    text={status || "Pendiente"}
    className="min-w-[78px]"
  />
);

/** Treasury requisition-request summary table. */
export const TreasuryRequisitionRequestsTable = ({
  onRefresh,
  onViewDetails,
  rows,
}: TreasuryRequisitionRequestsTableProps) => {
  const columns = useMemo<ColumnDefinition<TravelExpense>[]>(
    () => [
      {
        key: "date_created",
        label: "FECHA",
        render: (row) => formatDate(row.date_created),
        headerClass: "flex-[0.85]",
        cellClass: "flex-[0.85] text-gray-80",
      },
      {
        key: "applicant_name",
        label: "SOLICITANTE",
        render: (row) => row.applicant_name || row.created_by,
        headerClass: "flex-[1.35]",
        cellClass: "flex-[1.35] text-gray-80",
      },
      {
        key: "department_name",
        label: "ÁREA",
        render: (row) => row.department_name || row.area,
        headerClass: "flex-[1.1]",
        cellClass: "flex-[1.1] text-gray-80",
      },
      {
        key: "employeename",
        label: "BENEFICIARIO",
        render: (row) => row.employeename,
        headerClass: "flex-[1.55]",
        cellClass: "flex-[1.55] text-gray-80",
      },
      {
        key: "requisitionkey",
        label: "CÓDIGO DE REQUISICIÓN",
        render: (row) => row.requisitionkey,
        headerClass: "flex-[1.05]",
        cellClass: "flex-[1.05] text-gray-80",
      },
      {
        key: "treasury_status_name",
        label: "ESTATUS",
        render: (row) => <StatusBadge status={row.treasury_status_name} />,
        headerClass: "flex-[0.85] justify-center",
        cellClass: "flex-[0.85] justify-center",
      },
      {
        key: "id",
        label: "",
        sortable: false,
        showSortIndicator: false,
        render: (row) => (
          <Button
            size="xsmall"
            variant="ghost"
            hideIcon
            type="button"
            onClick={() => onViewDetails(row)}
          >
            Ver más
          </Button>
        ),
        headerClass: "flex-[0.55] justify-end",
        cellClass: "flex-[0.55] justify-end",
      },
    ],
    [onViewDetails],
  );

  return (
    <DataTable<TravelExpense>
      showButton={false}
      showCalendar
      showRefresh
      onRefreshPage={onRefresh}
      enableInternalSearch
      enablePagination
      dateKey="date_created"
      searchableKeys={[
        "date_created",
        "requisitionkey",
        "treasury_status_name",
        "applicant_name",
        "department_name",
        "employeename",
      ]}
      rowsPerPage={5}
      tables={[
        {
          title: "Estatus Aprobación de requisiciones",
          hidetitle: true,
          hideHeader: true,
          data: rows,
          columns,
          enableSelection: false,
          enableCollaps: false,
          defaultSortKey: "date_created",
          defaultSortDirection: "desc",
          textSize: { desktop: "b3", tablet: "c2", mobile: "c2" },
        },
      ]}
    />
  );
};

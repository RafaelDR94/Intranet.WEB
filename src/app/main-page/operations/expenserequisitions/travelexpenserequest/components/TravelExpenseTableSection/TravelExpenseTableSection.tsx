import { useMemo } from "react";

import { Button } from "@/app/components/Button/Button";
import { DataTable } from "@/app/components/DataTable/DataTable";
import type { ColumnDefinition } from "@/app/components/DataTable/types";
import { Label } from "@/app/components/Label/Label";
import type { TravelExpense } from "@/app/mappings/travelExpenses/travelExpenses.types";

import { travelExpenseRequestStyles as styles } from "../../styles";
import type { TravelExpenseTableSectionProps } from "../../types";
import {
  formatDate,
  getTravelExpenseArea,
  getTravelExpenseBeneficiaries,
  normalizeStatusType,
} from "../../utilities/travelExpenseRequestHelpers";

const StatusBadge = ({ status }: { status: string }) => (
  <Label
    type={normalizeStatusType(status)}
    text={status || "Pendiente"}
    className="min-w-[78px]"
  />
);

/**
 * Displays travel expense requests in the operations workflow.
 */
export const TravelExpenseTableSection = ({
  rows,
  showStatus = false,
  onRefresh,
  onViewDetails,
  pagination = true,
}: TravelExpenseTableSectionProps) => {
  const columns = useMemo<ColumnDefinition<TravelExpense>[]>(
    () => [
      {
        key: "date_created",
        label: "FECHA",
        render: (row) => formatDate(row.date_created || row.assignmentdate),
        headerClass: "flex-[0.8]",
        cellClass: `flex-[0.8] ${styles.tableCell}`,
      },
      {
        key: "created_by",
        label: "SOLICITANTE",
        render: (row) =>
          row.applicant_name || row.created_by || row.employeename,
        headerClass: "flex-[1.45]",
        cellClass: `flex-[1.45] ${styles.tableCell}`,
      },
      {
        key: "department_name",
        label: "AREA",
        render: (row) => getTravelExpenseArea(row),
        headerClass: "flex-[1.25]",
        cellClass: `flex-[1.25] ${styles.tableCell}`,
      },
      {
        key: "employeename",
        label: showStatus ? "BENEFICIARIO" : "NUM. BENEFICIARIOS",
        render: (row) =>
          showStatus
            ? getTravelExpenseBeneficiaries(row).join(", ")
            : getTravelExpenseBeneficiaries(row).length,
        headerClass: showStatus ? "flex-[1.55]" : "flex-[0.95] justify-center",
        cellClass: showStatus
          ? `flex-[1.55] truncate ${styles.tableCell}`
          : `flex-[0.95] justify-center ${styles.tableCell}`,
      },
      {
        key: "projectname",
        label: "PROYECTO",
        headerClass: "flex-[1.05]",
        cellClass: `flex-[1.05] ${styles.tableCell}`,
      },
      ...(showStatus
        ? [
            {
              key: "status" as keyof TravelExpense,
              label: "ESTATUS",
              render: (row: TravelExpense) =>
                row.status ? <StatusBadge status={row.status} /> : null,
              headerClass: "flex-[0.95] justify-center",
              cellClass: "flex-[0.95] justify-center",
            },
          ]
        : []),
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
            Ver mas
          </Button>
        ),
        headerClass: "flex-[0.65]",
        cellClass: "flex-[0.65] justify-end",
      },
    ],
    [onViewDetails, showStatus],
  );

  return (
    <DataTable<TravelExpense>
      showButton={false}
      showCalendar={false}
      showRefresh
      onRefreshPage={onRefresh}
      enableInternalSearch
      enablePagination={pagination}
      searchableKeys={[
        "date_created",
        "applicant_name",
        "created_by",
        "area",
        "employeename",
        "projectname",
        "status",
      ]}
      rowsPerPage={5}
      tables={[
        {
          title: "Solicitudes de viaticos",
          hidetitle: true,
          hideHeader: true,
          data: rows,
          columns,
          enableSelection: false,
          enableCollaps: false,
          defaultSortKey: "date_created",
          defaultSortDirection: "desc",
          textSize: {
            desktop: "b3",
            tablet: "c2",
            mobile: "c2",
          },
        },
      ]}
    />
  );
};

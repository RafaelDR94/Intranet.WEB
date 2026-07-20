import { useMemo } from "react";

import { Button } from "@/app/components/Button/Button";
import { DataTable } from "@/app/components/DataTable/DataTable";
import type { ColumnDefinition } from "@/app/components/DataTable/types";
import type { TravelExpense } from "@/app/mappings/travelExpenses/travelExpenses.types";

import { requisitionRequestStyles as styles } from "../../styles";
import type { TravelExpenseTableSectionProps } from "../../types";

/**
 * Displays the travel expense requests available for requisition review.
 */
export const TravelExpenseTableSection = ({
  rows,
  onRefresh,
  onViewDetails,
  pagination = true,
}: TravelExpenseTableSectionProps) => {
  const columns = useMemo<ColumnDefinition<TravelExpense>[]>(
    () => [
      {
        key: "employeename",
        label: "Nombre",
        render: (row) => row?.employeename,
        headerClass: "flex-[1.6]",
        cellClass: `flex-[1.6] ${styles.tableCellText}`,
      },
      {
        key: "phone_number",
        label: "Telefono",
        render: (row) => row?.phone_number,
        headerClass: "flex-[0.85]",
        cellClass: `flex-[0.85] ${styles.tableCellText}`,
      },
      {
        key: "created_by",
        label: "Email",
        render: (row) => row?.created_by,
        headerClass: "flex-[1.9]",
        cellClass: `flex-[1.9] ${styles.tableCellText}`,
      },
      {
        key: "requisitionkey",
        label: "C. DEUDOR",
        render: (row) => row?.requisitionkey,
        headerClass: "flex-[0.9]",
        cellClass: `flex-[0.9] ${styles.tableCellText}`,
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
            Ver solicitud
          </Button>
        ),
        headerClass: "flex-[0.6]",
        cellClass: `flex-[0.6] ${styles.tableActionCell}`,
      },
    ],
    [onViewDetails],
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

"use client";
import React from "react";

import ActionMenuCell from "@/app/components/ActionMenuCell/ActionMenuCell";
import { useIsMobile } from "@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery";
import { DataTable } from "@/app/components/DataTable/DataTable";
import type { ColumnDefinition } from "@/app/components/DataTable/types";
import Label from "@/app/components/Label/Label";
import { LabelType } from "@/app/components/Label/types";
import {
  actionCell,
  container,
} from "@/app/main-page/accounting/personalInvoices/requisitions/componentes/RequisitionsTable/styles";
import { useRequisitionTable } from "@/app/main-page/accounting/personalInvoices/requisitions/componentes/RequisitionsTable/hooks/useRequisitionsTable";
import type { RequisitionRow } from "@/app/main-page/accounting/personalInvoices/requisitions/componentes/RequisitionsTable/types";

const RequisitionsFiles = ({ forceVisible = false }) => {
  const { rows, setQuery, refresh, hasIdParam, onEdit, onDelete } =
    useRequisitionTable();
  const isMobile = useIsMobile();

  const StatusBadge = ({ status }: { status?: string }) => {
    const s = (status || "").toLowerCase();
    let type: LabelType = "pendiente";
    if (s.includes("cierre de periodo")) type = "invalido";
    if (s.includes("viaticando")) type = "purple";
    if (s.includes("folio adicional")) type = "prohibido";
    if (s.includes("cancelada")) type = "restringido";
    if (s.includes("validaci")) type = "valido";

    return <Label type={type} text={status || "En espera"} />;
  };

  const computedColumns: ColumnDefinition<RequisitionRow>[] = React.useMemo(
    () => [
      { key: "projectCode", label: "PROYECTO" },
      { key: "state", label: "ESTADO" },
      { key: "snCode", label: "CÓDIGO DE SOLICITUD" },
      { key: "assignmentDate", label: "PERIODO" },
      { key: "dueDate", label: "TERMINO", render: (row) => row.dueDate },
      {
        key: "status",
        label: "ESTATUS",
        render: (row) => <StatusBadge status={row.status} />,
      },
      {
        key: "actions" as unknown as keyof RequisitionRow,
        label: "",
        render: (row) => (
          <div className={actionCell}>
            <ActionMenuCell row={row} onEdit={onEdit} onDelete={onDelete} />
          </div>
        ),
        invisible: false,
      },
    ],
    [onEdit, onDelete],
  );

  const mobileColumns: ColumnDefinition<RequisitionRow>[] = React.useMemo(
    () => [
      { key: "snCode", label: "CÓDIGO SN" },
      {
        key: "status",
        label: "",
        render: (row) => <StatusBadge status={row.status} />,
      },
      {
        key: "actions" as unknown as keyof RequisitionRow,
        label: "",
        render: (row) => (
          <div className="flex justify-end">
            <ActionMenuCell row={row} onEdit={onEdit} onDelete={onDelete} />
          </div>
        ),
        cellClass: "w-12 text-right",
        headerClass: "w-12",
        invisible: false,
      },
    ],
    [onEdit, onDelete],
  );

  const columns = isMobile ? mobileColumns : computedColumns;

  if (hasIdParam && !forceVisible) return <></>;

  return (
    <div className={container}>
      <DataTable
        showCalendar={true}
        showDownloadTable
        textSize={{ mobile: "c2", desktop: "text-c2" }}
        dataTableTitle="Listado de Requisiciones"
        onSearchChange={setQuery}
        onCalendarClick={(start, end) => refresh(start, end)}
        onFilterClick={refresh}
        showRefresh
        tables={[
          {
            data: rows,
            columns: columns,
            enableSelection: true,
            title: "Historial",
            enableCollaps: true,
            defaultSortKey: "date_created",
            defaultSortDirection: "desc",
          },
        ]}
        showButton={false}
        dateKey={"date_created"}
      />
    </div>
  );
};
export default RequisitionsFiles;

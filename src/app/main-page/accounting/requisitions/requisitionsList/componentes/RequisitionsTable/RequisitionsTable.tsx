"use client";
import React from "react";

import { useRequisitionTable } from "./hooks/useRequisitionsTable";
import { container, actionCell } from "./styles";
import { RequisitionRow } from "./types";

import ActionMenuCell from "@/app/components/ActionMenuCell/ActionMenuCell";
import { useIsMobile } from "@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery";
import { DataTable } from "@/app/components/DataTable/DataTable";
import type { ColumnDefinition } from "@/app/components/DataTable/types";
import Label from "@/app/components/Label/Label";
import { LabelType } from "@/app/components/Label/types";
import { PopUp } from "@/app/components/PopUp/PopUp";
import { useAuth } from "@/app/context/AuthContext/AuthContext";
import { formatCurrency } from "@/app/utilities/FormatHelpers/FormatHelpets";
import Avatar from "@/app/components/Avatar/Avatar";
import { Button } from "@/app/components/Button/Button";

type RequisitionsTableProps = {
  /**
   * Forces the table to render even when an `id` query param is present.
   * Useful for views that need the list alongside detail tabs.
   */
  forceVisible?: boolean;
};

const RequisitionsTable: React.FC<RequisitionsTableProps> = ({
  forceVisible = false,
}) => {
  const {
    rows,
    setQuery,
    confirmOpen,
    rowToDelete,
    removing,
    handleConfirmDelete,
    setConfirmOpen,
    onEdit,
    onViewFiles,
    onViewRequisitions,
    onDelete,
    refresh,
    hasIdParam,
  } = useRequisitionTable();
  const isMobile = useIsMobile();
  const { currentPagePermissions } = useAuth();

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

  // Desktop columns (leave mobileColumns intact as requested)
  const computedColumns: ColumnDefinition<RequisitionRow>[] = React.useMemo(
    () => [
      {
        key: "debtorName",
        label: "Nombre",
        render: (row) => (
          <div className="flex items-center gap-2">
            <Avatar size="xxs" />
            <span>{row.debtorName}</span>
          </div>
        ),
      },
      { key: "projectCode", label: "Número" },
      { key: "state", label: "Correo eléctronico" },
      {
        key: "projectCode",
        label: "Archivos",
        render: (row) => (
          <Button variant="ghost" hideIcon onClick={() => onViewFiles(row)}>
            Ver Archivos
          </Button>
        ),
      },
      {
        key: "projectCode",
        label: "Requisiciones",
        render: (row) => (
          <Button
            variant="ghost"
            hideIcon
            onClick={() => onViewRequisitions(row)}
          >
            Ver Requisiciones
          </Button>
        ),
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
    [onEdit, onDelete, onViewFiles, onViewRequisitions],
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
          <div className="flex justify-end pr-2">
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

  // Filtra columnas si currentPagePermissions.sapprofile es true
  const filteredComputedColumns = React.useMemo(() => {
    if (currentPagePermissions?.sapprofile) {
      return computedColumns.filter((col) => col.key !== "status");
    }
    return computedColumns;
  }, [computedColumns, currentPagePermissions?.sapprofile]);

  const filteredMobileColumns = React.useMemo(() => {
    if (currentPagePermissions?.sapprofile) {
      return mobileColumns.filter((col) => col.key !== "status");
    }
    return mobileColumns;
  }, [mobileColumns, currentPagePermissions?.sapprofile]);

  const columns = isMobile ? filteredMobileColumns : filteredComputedColumns;

  if (hasIdParam && !forceVisible) return <></>;
  return (
    <div className={container}>
      <PopUp
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="¿Deseas eliminar el documento seleccionado?"
        content={
          rowToDelete
            ? `Esta acción confirmará la eliminación de ${rowToDelete.snCode}.`
            : "Esta acción confirmará la eliminación."
        }
        showSecondaryButton
        secondaryButtonText="Cancelar"
        onSecondaryButtonClick={() => setConfirmOpen(false)}
        showPrimaryButton
        primaryButtonText={removing ? "Eliminando…" : "Eliminar"}
        onPrimaryButtonClick={handleConfirmDelete}
      />

      {currentPagePermissions?.read && (
        <DataTable
          showCalendar={true}
          textSize={{ mobile: "c2", desktop: "text-c2" }}
          dataTableTitle="Listado de Requisiciones"
          onSearchChange={setQuery}
          onCalendarClick={(start, end) => refresh(start, end)}
          onFilterClick={refresh}
          showRefresh={true}
          tables={[
            {
              data: rows,
              columns: columns,
              enableSelection: false,
              title: "Requisiciones",
              enableCollaps: true,
              defaultSortKey: "date_created",
              defaultSortDirection: "desc",
            },
          ]}
          showButton={false}
          dateKey={"date_created"}
        />
      )}
    </div>
  );
};

export default RequisitionsTable;

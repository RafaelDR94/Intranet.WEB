"use client"
import React, { useMemo } from "react";

import ActionMenuCell from "@/app/components/ActionMenuCell/ActionMenuCell";
import { Button } from "@/app/components/Button/Button";
import { DataTable } from "@/app/components/DataTable/DataTable";
import type { ColumnDefinition } from "@/app/components/DataTable/types";
import Label from "@/app/components/Label/Label";
import { LabelType } from "@/app/components/Label/types";
import { PopUp } from "@/app/components/PopUp/PopUp";
import { actionCell } from "@/app/main-page/accounting/requisitions/requisitionsList/componentes/RequisitionsTable/styles";
import { RequisitionRow } from "@/app/main-page/accounting/requisitions/requisitionsList/componentes/RequisitionsTable/types";
import { useIsMobile } from "@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery";
import { UserRequisitionsListProps } from "./types";
import useRequisitionsFiles from "./hooks/useRequisitionsFiles";



const UserRequisitionsList: React.FC<UserRequisitionsListProps> = ({
  forceVisible = false,
  userId,
  onViewFiles,
}) => {
  const isMobile = useIsMobile();
  const {
    rows,
    filterOptions,
    confirmOpen,
    setConfirmOpen,
    rowToDelete,
    removing,
    handleConfirmDelete,
    onViewDetails,
    onDelete,
    shouldShowEmptyState,
    handleRefreshPage,
  } = useRequisitionsFiles({ forceVisible, userId });

  const statusBadge = (status?: string) => {
    const normalizedStatus = (status || "").toLowerCase();
    let type: LabelType = "pendiente";
    if (normalizedStatus.includes("cierre de periodo")) type = "actualizado";
    if (normalizedStatus.includes("viaticando")) type = "purple";
    if (normalizedStatus.includes("folio adicional")) type = "prohibido";
    if (normalizedStatus.includes("cerrado")) type = "restringido";
    if (normalizedStatus.includes("valid")) type = "valido";
    if (normalizedStatus.includes("rechaz")) type = "rechazado";

    return (
      <Label
        type={type}
        text={status || "En espera"}
        className={isMobile ? "m-0 px-2 py-0.5 text-[10px]" : undefined}
      />
    );
  };

  const desktopColumns: ColumnDefinition<RequisitionRow>[] = useMemo(
    () => [
      { key: "debtorName", label: "Nombre" },
      { key: "snCode", label: "Código" },
      {
        key: "status",
        label: "Estatus",
        render: (row) => statusBadge(row.status),
      },
      {
        key: "files" as unknown as keyof RequisitionRow,
        label: "Archivos",
        render: (row) =>
          onViewFiles ? (
            <Button
              variant="ghost"
              size="small"
              hideIcon
              onClick={() => onViewFiles(row)}
            >
              Ver Archivos
            </Button>
          ) : null,
        invisible: !onViewFiles,
      },
      {
        key: "actions" as unknown as keyof RequisitionRow,
        label: "",
        render: (row) => (
          <div className={actionCell}>
            <ActionMenuCell row={row} onEdit={onViewDetails} onDelete={onDelete} />
          </div>
        ),
        invisible: false,
      },
    ],
    [onDelete, onViewDetails, onViewFiles],
  );

  const mobileColumns: ColumnDefinition<RequisitionRow>[] = useMemo(
    () => [
      { key: "snCode", label: "Código" },
      {
        key: "status",
        label: "Estatus",
        render: (row) => statusBadge(row.status),
        cellClass: "w-4/12 text-right",
        headerClass: "w-4/12 text-right",
      },
      {
        key: "files" as unknown as keyof RequisitionRow,
        label: "",
        render: (row) =>
          onViewFiles ? (
            <div className="flex justify-end pr-1">
              <Button
                variant="ghost"
                size="xsmall"
                hideIcon
                onClick={() => onViewFiles(row)}
              >
                Archivos
              </Button>
            </div>
          ) : null,
        cellClass: "w-3/12 text-right",
        headerClass: "w-3/12 text-right",
        invisible: !onViewFiles,
      },
      {
        key: "actions" as unknown as keyof RequisitionRow,
        label: "",
        render: (row) => (
          <div className="flex justify-end pr-1">
            <ActionMenuCell row={row} onEdit={onViewDetails} onDelete={onDelete} />
          </div>
        ),
        cellClass: "w-1/12 text-right",
        headerClass: "w-1/12 text-right",
        invisible: false,
      },
    ],
    [onDelete, onViewDetails, onViewFiles],
  );

  if (shouldShowEmptyState) {
    return (
      <div className="p-4 text-sm text-gray-500">
        Selecciona un colaborador para ver sus requisiciones.
      </div>
    );
  }

  return (
    <div>
      <PopUp
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="¿Deseas eliminar la requisición seleccionada?"
        content={
          rowToDelete
            ? `Esta acción confirmará la eliminación de ${rowToDelete.snCode}.`
            : "Esta acción confirmará la eliminación."
        }
        showSecondaryButton
        secondaryButtonText="Cancelar"
        onSecondaryButtonClick={() => setConfirmOpen(false)}
        showPrimaryButton
        primaryButtonText={removing ? "Eliminando..." : "Eliminar"}
        onPrimaryButtonClick={handleConfirmDelete}
      />

      <DataTable
        showCalendar={false}
        showFilter={true}
        showRefresh={true}
        onRefreshPage={handleRefreshPage}
        filterOptions={filterOptions}
        textSize={{ mobile: "text-[11px]", desktop: "text-c2" }}
        dataTableTitle="Requisiciones"
        tables={[
          {
            data: rows,
            columns: isMobile ? mobileColumns : desktopColumns,
            title: "Historial",
            enableCollaps: true,
            enableSelection: false,
            defaultSortKey: "snCode",
            defaultSortDirection: "desc",
          },
        ]}
        showDownloadTable={true}
        showButton={false}
      />
    </div>
  );
};

export default UserRequisitionsList;

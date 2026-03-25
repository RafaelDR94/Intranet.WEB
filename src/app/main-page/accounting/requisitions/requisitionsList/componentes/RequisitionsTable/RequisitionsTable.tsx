"use client"
import React from "react";

import { useRequisitionTable } from "./hooks/useRequisitionsTable";
import { container} from "./styles";
import { RequisitionRow } from "./types";
import { useIsMobile } from "@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery";
import { DataTable } from "@/app/components/DataTable/DataTable";
import type { ColumnDefinition } from "@/app/components/DataTable/types";
import { PopUp } from "@/app/components/PopUp/PopUp";
import { useAuth } from "@/app/context/AuthContext/AuthContext";
import Avatar from "@/app/components/Avatar/Avatar";
import { Button } from "@/app/components/Button/Button";
import ContextMenu from "@/app/components/ContextMenu/ContextMenu";
import type { ContextMenuItem } from "@/app/components/ContextMenu/types";
import DotsIcon from "@/assets/icons/navegacion/more-horiz.svg";

type RequisitionsTableProps = {
  /**
   * Forces the table to render even when an `id` query param is present.
   * Useful for views that need the list alongside detail tabs.
   */
  forceVisible?: boolean;
  /**
   * Shows the main action button in the table header.
   */
  showActionButton?: boolean;
  /**
   * Label for the main action button.
   */
  actionLabel?: string;
  /**
   * Handler for the main action button.
   */
  onActionClick?: () => void;
};

const RequisitionsTable: React.FC<RequisitionsTableProps> = ({
  forceVisible = false,
  showActionButton = false,
  actionLabel = "Agregar",
  onActionClick,
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

  // Desktop columns (leave mobileColumns intact as requested)
  const computedColumns: ColumnDefinition<RequisitionRow>[] = React.useMemo(
    () => [
      {
        key: "image_url",
        label: "",
        render: (row) => {
          const initials = row.employeename
            ?.split(" ")
            .filter(Boolean)
            .map((n) => n[0].toUpperCase())
            .slice(0, 2)
            .join("");
          return (
            <div className="flex items-center gap-2">
              {row.image_url ? (
                <Avatar size="xs" src={row.image_url} className="mr-1" />
              ) : (
                <Avatar size="xs" initials={initials} className="mr-1" />
              )}
            </div>
          );
        },
        cellClass: "w-15",
        headerClass: "w-15",
      },
      {
        key: "employeename",
        label: "Nombre",
        cellClass: "w-65",
        headerClass: "w-65",
      },
      {
        key: "phone_number",
        label: "Número",
        cellClass: "w-35",
        headerClass: "w-33",
      },
      {
        key: "email",
        label: "Correo eléctronico",
        cellClass: "w-67",
        headerClass: "w-73",
      },
      {
        key: "projectCode",
        label: "Archivos",
        render: (row) => (
          <Button
            variant="ghost"
            size="small"
            hideIcon
            onClick={() => onViewFiles(row)}
            data-tour="requisitions-view-files"
          >
            Ver Archivos
          </Button>
        ),
        cellClass: "w-50",
        headerClass: "w-45",
      },
      {
        key: "projectCode",
        label: "Requisiciones",
        render: (row) => (
          <Button
            variant="ghost"
            hideIcon
            size="small"
            onClick={() => onViewRequisitions(row)}
            data-tour="requisitions-view-requisitions"
          >
            Ver Requisiciones
          </Button>
        ),
        cellClass: "w-50",
        headerClass: "w-50 pl-4",
      },

    ],
    [onEdit, onDelete, onViewFiles, onViewRequisitions],
  );

  const mobileColumns: ColumnDefinition<RequisitionRow>[] = React.useMemo(
    () => [
      {
        key: "employeename",
        label: "Beneficiario",
        render: (row) => (
          <div className="flex items-center gap-3">
            <Avatar
              size="xs"
              src={row.image_url}
              initials={row.employeename
                ?.split(" ")
                .filter(Boolean)
                .map((n) => n[0].toUpperCase())
                .slice(0, 2)
                .join("")}
            />
            <span className="text-c2 text-gray-90 font-semibold">
              {row.employeename}
            </span>
          </div>
        ),
      },
      {
        key: "mobileActions" as unknown as keyof RequisitionRow,
        label: "",
        render: (row) => (
          <ContextMenu
            alignRight
            autoFlip
            items={
              [
                {
                  label: "Ver Archivos",
                  onClick: () => onViewFiles(row),
                  dataTour: "requisitions-view-files",
                },
                {
                  label: "Ver Requisiciones",
                  onClick: () => onViewRequisitions(row),
                  dataTour: "requisitions-view-requisitions",
                },
              ] as ContextMenuItem[]
            }
            trigger={
              <Button
                size="xsmall"
                variant="ghost"
                icon={DotsIcon}
                aria-label="Abrir menu de acciones"
                data-tour="requisitions-row-actions"
              />
            }
          />
        ),
        cellClass: "w-12 text-right",
        headerClass: "w-12 text-right",
      }
    ],
    [onDelete, onEdit, onViewFiles, onViewRequisitions],
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
    <div className={container} data-tour="requisitions-table">
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
          searchDataTour="requisitions-search"
          calendarDataTour="requisitions-calendar"
          refreshDataTour="requisitions-refresh"
          actionButtonDataTour="requisitions-add"
          showButton={showActionButton && !currentPagePermissions?.create}
          actionLabel={actionLabel}
          onTableActionClick={onActionClick}
          tables={[
            {
              data: rows,
              columns: columns,
              enableSelection: false,
              title: "Beneficiarios",
              enableCollaps: true,
              defaultSortKey: "date_created",
              defaultSortDirection: "desc",
            },
          ]}
          dateKey={"date_created"}
        />
      )}
    </div>
  );
};

export default RequisitionsTable;

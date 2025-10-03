"use client";

import React from "react";

import SideMenu from "./components/SideMenu";
import SideMenuEdit from "./components/SideMenuEdit/SideMenuEdit";
import { useControlTable } from "./hooks/useControlTable";
import { actionCell, container } from "./styles";
import type { ActionMenuCellProps, ControlRow } from "./types";

import { Button } from "@/app/components/Button/Button";
import { ContextMenu } from "@/app/components/ContextMenu/ContextMenu";
import type { ContextMenuItem } from "@/app/components/ContextMenu/types";
import { useIsMobile } from "@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery";
import { DataTable } from "@/app/components/DataTable/DataTable";
import type { ColumnDefinition } from "@/app/components/DataTable/types";
import Label from "@/app/components/Label/Label";
import type { LabelType } from "@/app/components/Label/types";
import { PopUp } from "@/app/components/PopUp/PopUp";
import { useAuth } from "@/app/context/AuthContext/AuthContext";
import { formatCurrency } from "@/app/utilities/FormatHelpers/FormatHelpets";
import DeleteIcon from "@/assets/icons/acciones/trash.svg";
import EditIcon from "@/assets/icons/Editor/edit-pencil.svg";
import DotsIcon from "@/assets/icons/navegacion/more-horiz.svg";
import RightArrowIcon from "@/assets/icons/navegacion/nav-arrow-right.svg";

const controlFilterOptions = [
  { label: "Todos", value: "all" },
  { label: "Vale Rosa", value: "voucher:rosa" },
  { label: "Vale Azul", value: "voucher:azul" },
  { label: "Validado", value: "status:validado" },
  { label: "Rechazado", value: "status:rechazado" },
  { label: "En Proceso", value: "status:proceso" },
];

const truthyPermissionStrings = new Set([
  "true",
  "1",
  "yes",
  "y",
  "si",
  "sí",
  "allow",
]);
const falsyPermissionStrings = new Set([
  "false",
  "0",
  "no",
  "deny",
  "disabled",
]);

const interpretPermission = (value: unknown): boolean | undefined => {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (!normalized) return undefined;
    if (truthyPermissionStrings.has(normalized)) return true;
    if (falsyPermissionStrings.has(normalized)) return false;
  }
  return undefined;
};

const formatMoney = (value?: number) => {
  if (typeof value === "number" && !Number.isNaN(value)) {
    return formatCurrency(value);
  }
  return "—";
};

const statusToLabelType = (status?: string): LabelType => {
  const normalized = (status ?? "").toLowerCase();
  if (normalized.includes("rechazado")) return "rechazado";
  if (normalized.includes("proceso")) return "en-proceso";
  if (normalized.includes("valid")) return "valido";
  if (normalized.includes("pend")) return "pendiente";
  if (normalized.includes("no deducible")) return "prohibido";
  if (normalized.includes("sin factura")) return "sin-factura";
  if (normalized.includes("factura rechazada")) return "factura-rechazada";
  if (normalized.includes("factura enviada")) return "purple";
  return normalized ? "actualizado" : "pendiente";
};

const StatusBadge: React.FC<{ status?: string }> = ({ status }) => (
  <Label type={statusToLabelType(status)} text={status || "Pendiente"} />
);

const ActionMenuCell: React.FC<ActionMenuCellProps> = ({
  row,
  onView,
  onDelete,
}) => {
  const isMobile = useIsMobile();
  const { currentPagePermissions } = useAuth();
  const [menuOpen, setMenuOpen] = React.useState(false);

  const menuItems = React.useMemo<ContextMenuItem[]>(() => {
    const items: ContextMenuItem[] = [];
    const rawPermissions = (currentPagePermissions ?? {}) as Record<
      string,
      unknown
    >;
    const canView = interpretPermission(rawPermissions.details);
    if (canView !== false) {
      items.push({
        label: "Ver detalles",
        icon: EditIcon,
        onClick: () => {
          onView(row);
          setMenuOpen(false);
        },
      });
    }

    const canDelete = interpretPermission(rawPermissions.delete);
    if (canDelete ?? true) {
      items.push({
        label: "Eliminar",
        icon: DeleteIcon,
        danger: true,
        onClick: () => {
          onDelete(row);
          setMenuOpen(false);
        },
      });
    }

    if (!items.length) {
      items.push({ label: "Sin acciones disponibles", disabled: true });
    }

    return items;
  }, [currentPagePermissions, onDelete, onView, row, setMenuOpen]);

  return (
    <ContextMenu
      isOpen={menuOpen}
      setIsOpen={setMenuOpen}
      alignRight
      autoFlip
      trigger={
        <Button
          size="xsmall"
          variant="ghost"
          icon={isMobile ? RightArrowIcon : DotsIcon}
        />
      }
      items={menuItems}
    />
  );
};

const ControlTable = () => {
  const {
    rows,
    setConfirmOpen,
    handleSearchChange,
    handleFilterChange,
    activeFilter,
    confirmOpen,
    rowToDelete,
    removing,
    handleConfirmDelete,
    onView,
    onDelete,
    refreshData,
    refreshPage,
    detailOpen,
    editOpen,
    detailLoading,
    detailData,
    selectedRow,
    handleCloseDetail,
    formatDate,
    handleValidate,
    handleReject,
    handleRejectInvoice,
    validating,
    rejecting,
    isEditing,
    handleEditModeChange,
    handleUpdateAmount,
    updatingAmount,
  } = useControlTable();

  const isMobile = useIsMobile();
  const { currentPagePermissions } = useAuth();

  const columnsDesktop: ColumnDefinition<ControlRow>[] = React.useMemo(
    () => [
      {
        key: "employeeName",
        label: "COLABORADOR",
        render: (row) => <span>{row.employeeName || "—"}</span>,
      },
      {
        key: "applicationDate",
        label: "FECHA",
        render: (row) => <span>{formatDate(row.applicationDate) || "—"}</span>,
      },
      {
        key: "provider",
        label: "PROVEEDOR",
        render: (row) => <span>{row.provider || "—"}</span>,
      },
      {
        key: "concept",
        label: "CONCEPTO",
        render: (row) => <span>{row.concept || "—"}</span>,
      },
      {
        key: "subtotal",
        label: "SUBTOTAL",
        render: (row) => <span>{formatMoney(row.subtotal)}</span>,
      },
      {
        key: "iva",
        label: "IVA",
        render: (row) => <span>{formatMoney(row.iva)}</span>,
      },
      {
        key: "total",
        label: "TOTAL",
        render: (row) => <span>{formatMoney(row.total)}</span>,
      },
      {
        key: "voucherType",
        label: "TIPO DE VALE",
        render: (row) => (
          <Label type={row?.VoucherLabelType} text={row?.voucherType} />
        ),
      },
      {
        key: "status",
        label: "STATUS",
        render: (row) => <StatusBadge status={row.status} />,
      },
      {
        key: "actions" as unknown as keyof ControlRow,
        label: "",
        render: (row) => (
          <div className={actionCell}>
            <ActionMenuCell row={row} onView={onView} onDelete={onDelete} />
          </div>
        ),
        invisible: false,
      },
    ],
    [formatDate, onDelete, onView],
  );

  const columnsMobile: ColumnDefinition<ControlRow>[] = React.useMemo(
    () => [
      { key: "employeeName", label: "COLABORADOR" },
      {
        key: "status",
        label: "STATUS",
        render: (row) => <StatusBadge status={row.status} />,
      },
      {
        key: "actions" as unknown as keyof ControlRow,
        label: "",
        render: (row) => (
          <div className="flex justify-end pr-2">
            <ActionMenuCell row={row} onView={onView} onDelete={onDelete} />
          </div>
        ),
        cellClass: "w-12 text-right",
        headerClass: "w-12",
        invisible: false,
      },
    ],
    [onDelete, onView],
  );

  const columns = isMobile ? columnsMobile : columnsDesktop;

  return (
    <div className={container}>
      <PopUp
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Eliminar vale"
        content={
          rowToDelete
            ? `Esta acción confirmará la eliminación del vale seleccionado.\nUna vez confirmado, no podrás revertir el cambio.`
            : "Esta acción confirmará la eliminación del vale seleccionado."
        }
        showSecondaryButton
        secondaryButtonText="Cancelar"
        onSecondaryButtonClick={() => setConfirmOpen(false)}
        showPrimaryButton
        primaryButtonText={removing ? "Eliminando…" : "Eliminar"}
        onPrimaryButtonClick={handleConfirmDelete}
      />

      <SideMenu
        panelOpen={detailOpen}
        setPanelOpen={(open) => {
          if (!open) {
            handleCloseDetail();
          }
        }}
        selected={selectedRow}
        detail={detailData}
        isDetailLoading={detailLoading}
        formatDate={formatDate}
        formatMoney={formatMoney}
        onValidate={handleValidate}
        isValidating={validating}
        onReject={handleReject}
        onRejectInvoice={handleRejectInvoice}
        isRejecting={rejecting}
      />

      <SideMenuEdit
        panelOpen={editOpen}
        setPanelOpen={(open) => {
          if (!open) {
            handleCloseDetail();
          }
        }}
        selected={selectedRow}
        detail={detailData}
        isDetailLoading={detailLoading}
        formatDate={formatDate}
        formatMoney={formatMoney}
        onReject={handleReject}
        isRejecting={rejecting}
        isEditingAmount={isEditing}
        onEditModeChange={handleEditModeChange}
        onSaveAmount={handleUpdateAmount}
        isSavingAmount={updatingAmount}
      />

      {currentPagePermissions?.read && (
        <DataTable
          showCalendar={true}
          showFilter={true}
          showRefresh
          onRefreshPage={refreshPage}
          filterOptions={controlFilterOptions}
          filterValue={activeFilter}
          filterTitle="Filtrar vales"
          showDownloadTable
          showButton={false}
          dateKey={(row) => row.applicationDate}
          onSearchChange={handleSearchChange}
          onFilterChange={(value) => {
            handleFilterChange(value);
            refreshData();
          }}
          textSize={{ mobile: 'c2', desktop: 'text-d3' }}
          tables={[
            {
              data: rows,
              columns,
              enableSelection: true,
              title: "Reporte de gastos de caja chica",
              enableCollaps: false,
              defaultSortKey: "applicationDate",
              defaultSortDirection: "desc",
            },
          ]}
        />
      )}
    </div>
  );
};

export default ControlTable;

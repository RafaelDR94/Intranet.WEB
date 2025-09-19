"use client";
import React from "react";

import { PettyCashProvider } from "../pettycashrequest/context/PettyCashContext";
import SideMenu from "./components/SideMenu";

import usePettyCashHistory from "./hooks/usePettyCashHistory";
import { PettyCashHistoryRow } from "./types";

import { Button } from "@/app/components/Button/Button";
import { useIsMobile } from "@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery";
import { DataTable } from "@/app/components/DataTable/DataTable";
import { ColumnDefinition } from "@/app/components/DataTable/types";
import { Label } from "@/app/components/Label/Label";
import ContextMenu from "@/app/components/ContextMenu/ContextMenu";
import { useAuth } from "@/app/context/AuthContext/AuthContext";
import { PopUp } from "@/app/components/PopUp/PopUp";
import EditIcon from "@/assets/icons/Editor/edit-pencil.svg";
import DotsIcon from "@/assets/icons/navegacion/more-horiz.svg";
import CancelIcon from "@/assets/icons/acciones/cancel.svg"
import RightArrowIcon from "@/assets/icons/navegacion/nav-arrow-right.svg";
import type { ContextMenuItem } from "@/app/components/ContextMenu/types";

const truthyPermissionStrings = new Set(["true", "1", "yes", "y", "si", "sí", "allow"]);
const falsyPermissionStrings = new Set(["false", "0", "no", "deny"]);

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

const cancelPermissionKeys = [
  "delete",
  "cancel",
  "cancelvoucher",
  "cancelVoucher",
  "cancelvale",
  "cancelVale",
  "cancelpettycash",
  "cancelPettycash",
  "cancel_petty_cash",
  "cancelPettyCash",
  "deleteVoucher",
  "deleteVale",
  "deletevoucher",
  "deletevale",
  "remove",
];

type PettyCashActionMenuProps = {
  row: PettyCashHistoryRow;
  onEdit: (row: PettyCashHistoryRow) => void;
  onDelete: (row: PettyCashHistoryRow) => void;
};

const ActionMenuCell: React.FC<PettyCashActionMenuProps> = ({
  row,
  onEdit,
  onDelete,
}) => {
  const isMobile = useIsMobile();
  const { currentPagePermissions } = useAuth();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const handleEdit = React.useCallback(() => {
    onEdit(row);
    setMenuOpen(false);
  }, [onEdit, row]);

  const handleDelete = React.useCallback(() => {
    onDelete(row);
    setMenuOpen(false);
  }, [onDelete, row]);

  const menuItems = React.useMemo<ContextMenuItem[]>(() => {
    const items: ContextMenuItem[] = [];
    const rawPermissions = (currentPagePermissions ?? {}) as Record<string, unknown>;

    const detailPermission = interpretPermission(rawPermissions.details);
    if (detailPermission !== false) {
      items.push({
        label: "Ver Detalle",
        icon: EditIcon,
        onClick: handleEdit,
      });
    }

    let cancelPermission = interpretPermission(rawPermissions.delete);
    if (cancelPermission === undefined) {
      for (const key of cancelPermissionKeys) {
        if (!(key in rawPermissions)) continue;
        cancelPermission = interpretPermission(rawPermissions[key]);
        if (cancelPermission !== undefined) break;
      }
    }

    if (cancelPermission ?? true) {
      items.push({
        label: "Cancelar",
        icon: CancelIcon,
        danger: true,
        onClick: handleDelete,
      });
    }

    if (!items.length) {
      items.push({
        label: "Sin acciones disponibles",
        disabled: true,
      });
    }

    return items;
  }, [currentPagePermissions, handleDelete, handleEdit]);
  return (
    <ContextMenu
      alignRight
      autoFlip
      trigger={<Button size="xsmall" variant="ghost" icon={isMobile ? RightArrowIcon : DotsIcon} />}
      items={menuItems}
      isOpen={menuOpen}
      setIsOpen={setMenuOpen}
    />
  );
};
const PettyCashHistory = () => {
  const {
    panelOpen,
    setPanelOpen,
    selected,
    pettyCashAsHistoryRows,
    selectedDetail,
    detailLoading,
    onEdit,
    onDelete,
    handleCancelDelete,
    confirmOpen,
    rowToDelete,
    handleConfirmDelete,
    removing,
  } = usePettyCashHistory();

  const isMobile = useIsMobile();

  // Columnas de escritorio
  const columnsDesktop: ColumnDefinition<PettyCashHistoryRow>[] = React.useMemo( () => [
    {
      key: "date",
      label: "FECHA",
      render: (row) => <span>{row.date}</span>,
    },
    {
      key: "description",
      label: "CONCEPTO",
      render: (row) => <span>{row.description.name}</span>,
    },
    {
      key: "voucherType",
      label: "TIPO DE VALE",
      render: (row) => (
        <Label type={row?.voucherLabelType} text={row?.voucherType} />
      ),
    },
    {
      key: "amount",
      label: "MONTO",
      render: (row) => (
        <span>
          {typeof row.amount === "number"
            ? row.amount.toLocaleString("es-MX", {
                style: "currency",
                currency: "MXN",
              })
            : row.amount}
        </span>
      ),
    },
    {
      key: "status",
      label: "ESTATUS",
      render: (row) => (
        <Label
          type={(row?.status ?? "").toLowerCase() as any}
          text={(row?.status ?? "").toUpperCase()}
        />
      ),
    },
    {
      key: "actions" as unknown as keyof PettyCashHistoryRow,
      label: "",
      render: (row) => (
        <div className="flex justify-end pr-2">
          <ActionMenuCell row={row} onEdit={onEdit} onDelete={onDelete} />
        </div>
      ),

      invisible: false,
    },
  ],
  [onEdit, onDelete]);

  // Columnas móviles
  const columnsMobile: ColumnDefinition<PettyCashHistoryRow>[] = [
    {
      key: "amount",
      label: "MONTO",
      render: (row) => (
        <span>
          {typeof row.amount === "number"
            ? row.amount.toLocaleString("es-MX", {
                style: "currency",
                currency: "MXN",
              })
            : row.amount}
        </span>
      ),
    },
    {
      key: "date",
      label: "FECHA",
      render: (row) => <span>{row.date}</span>,
    },
    {
      key: "voucherType",
      label: "TIPO DE VALE",
      render: (row) => (
        <Label type={row?.voucherLabelType} text={row?.voucherType} />
      ),
    },
    {
      key: "status",
      label: "ESTATUS",
      render: (row) => (
        <Label
          type={(row?.status ?? "").toLowerCase() as any}
          text={(row?.status ?? "").toUpperCase()}
        />
      ),
    },
  ];

  const columns = isMobile ? columnsMobile : columnsDesktop;

  return (
    <>
      <PopUp
        open={confirmOpen}
        onClose={handleCancelDelete}
        title="Eliminar Vale"
        content={
          rowToDelete
            ? `Esta acción confirmará la eliminación del vale seleccionado. Una vez confirmado, no podrás revertir el cambio.`
            : "Esta acción confirmará la eliminación del vale seleccionado"
        }
        showSecondaryButton
        secondaryButtonText="Cancelar"
        onSecondaryButtonClick={handleCancelDelete}
        showPrimaryButton
        primaryButtonText={removing ? "Eliminando…" : "Eliminar"}
        onPrimaryButtonClick={handleConfirmDelete}
      />
      <div className="space-y-8 overflow-auto">
        <DataTable
          showCalendar={true}
          showFilter={true}
          showDownloadTable
          showButton={false}
          textSize={{ mobile: 'c2', desktop: 'text-c2' }}
          tables={[
            {
              data: pettyCashAsHistoryRows, 
              columns,
              enableSelection: true,
              title: "Historial Vales",
              enableCollaps: true,
              defaultSortKey: "date",
              defaultSortDirection: "desc",
            },
          ]}
        />
      </div>

      <PettyCashProvider>
        <SideMenu
          panelOpen={panelOpen}
          setPanelOpen={setPanelOpen}
          selected={selected}
          detail={selectedDetail}
          isDetailLoading={detailLoading}
        />
      </PettyCashProvider>
    </>
  );
};

export default PettyCashHistory;

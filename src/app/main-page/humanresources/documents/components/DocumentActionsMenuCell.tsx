"use client";

import React from "react";

import { Button } from "@/app/components/Button/Button";
import ContextMenu from "@/app/components/ContextMenu/ContextMenu";
import type { ContextMenuItem } from "@/app/components/ContextMenu/types";
import { useAuth } from "@/app/context/AuthContext/AuthContext";
import { useIsMobile } from "@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery";
import type { ManagementDocumentTableRow } from "@/app/mappings/documents/documents.types";
import CancelIcon from "@/assets/icons/acciones/cancel.svg";
import EditIcon from "@/assets/icons/Editor/edit-pencil.svg";
import DotsIcon from "@/assets/icons/navegacion/more-horiz.svg";
import RightArrowIcon from "@/assets/icons/navegacion/nav-arrow-right.svg";

type DocumentActionsMenuCellProps = {
  row: ManagementDocumentTableRow;
  onView?: (row: ManagementDocumentTableRow) => void;
  onDelete?: (row: ManagementDocumentTableRow) => void;
};

const truthyPermissionStrings = new Set([
  "true",
  "1",
  "yes",
  "y",
  "si",
  "sí",
  "allow",
]);

const falsyPermissionStrings = new Set(["false", "0", "no", "deny"]);

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

const DocumentActionsMenuCell: React.FC<DocumentActionsMenuCellProps> = ({
  row,
  onView,
  onDelete,
}) => {
  const isMobile = useIsMobile();
  const { currentPagePermissions } = useAuth();
  const [menuOpen, setMenuOpen] = React.useState(false);

  const handleView = React.useCallback(() => {
    if (!onView) return;

    onView(row);
    setMenuOpen(false);
  }, [onView, row]);

  const handleDelete = React.useCallback(() => {
    if (!onDelete) return;

    onDelete(row);
    setMenuOpen(false);
  }, [onDelete, row]);

  const menuItems = React.useMemo<ContextMenuItem[]>(() => {
    const items: ContextMenuItem[] = [];
    const rawPermissions = (currentPagePermissions ?? {}) as Record<string, unknown>;

    const detailPermission = interpretPermission(rawPermissions.details);
    if (detailPermission !== false && onView) {
      items.push({
        label: "Ver Detalle",
        icon: EditIcon,
        onClick: handleView,
      });
    }

    if (onDelete) {
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
    }

    if (!items.length) {
      items.push({
        label: "Sin acciones disponibles",
        disabled: true,
      });
    }

    return items;
  }, [currentPagePermissions, handleDelete, handleView, onDelete, onView]);

  return (
    <ContextMenu
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
      isOpen={menuOpen}
      setIsOpen={setMenuOpen}
    />
  );
};

export default DocumentActionsMenuCell;

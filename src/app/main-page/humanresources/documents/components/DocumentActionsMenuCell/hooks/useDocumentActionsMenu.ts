import React from "react";
import type { ManagementDocumentTableRow } from "@/app/mappings/documents/documents.types";
import type { ContextMenuItem } from "@/app/components/ContextMenu/types";
import { useAuth } from "@/app/context/AuthContext/AuthContext";
import CancelIcon from "@/assets/icons/acciones/cancel.svg";
import EditIcon from "@/assets/icons/Editor/edit-pencil.svg";
import { interpretPermission, cancelPermissionKeys } from "../permissions";

interface Props {
  row: ManagementDocumentTableRow;
  onView?: (row: ManagementDocumentTableRow) => void;
  onDelete?: (row: ManagementDocumentTableRow) => void;
}

export function useDocumentActionsMenu({ row, onView, onDelete }: Props) {
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
          label: "Eliminar",
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
  }, [currentPagePermissions, handleView, handleDelete, onView, onDelete]);

  return { menuItems, menuOpen, setMenuOpen };
}

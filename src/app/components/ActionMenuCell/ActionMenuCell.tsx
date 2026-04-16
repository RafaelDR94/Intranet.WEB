import React, { useMemo } from "react";

import { Button } from "../Button/Button";
import type { ButtonProps } from "../Button/types";
import ContextMenu from "../ContextMenu/ContextMenu";
import type { ContextMenuItem, ContextMenuProps } from "../ContextMenu/types";
import { useIsMobile } from "../DataTable/components/DataTableLayout/hooks/useMediaQuery";

import type {
  ActionMenuCellBaseProps,
  ActionMenuCellProps,
  ActionMenuCellResolvedProps,
  ActionMenuPermissions,
} from "./types";

import { useAuth } from "@/app/context/AuthContext/AuthContext";
import DeleteIcon from "@/assets/icons/acciones/trash.svg";
import EditIcon from "@/assets/icons/Editor/edit-pencil.svg";
import DotsIcon from "@/assets/icons/navegacion/more-horiz.svg";
import RightArrowIcon from "@/assets/icons/navegacion/nav-arrow-right.svg";
import CalendarPlusIcon from "@/assets/icons/System/System/calendar-plus.svg";

export type { ActionMenuPermissions } from "./types";

/**
 * Celda de menu contextual para filas de tablas o listados.
 *
 * Expone acciones de "ver/editar" y "eliminar" segun los permisos
 * disponibles para la ruta actual. El contenido del menu se genera con
 * {@link buildActionMenuItems} y puede forzarse manualmente pasando
 * `permissions` (ideal para historias y pruebas).
 *
 * @remarks
 * - Usa `ContextMenu` para la capa de visualizacion, por lo que respeta
 *   navegacion con teclado y cierre al hacer clic fuera.
 * - El icono del trigger cambia entre tres puntos (desktop) y flecha
 *   (mobile) usando `useIsMobile`.
 * - Permite sustituir `ContextMenu` y `Button` mediante props internas,
 *   lo que simplifica los tests sin dependencias pesadas.
 *
 * @accessibility
 * - El boton trigger expone `aria-label="Abrir menu de acciones"` y usa
 *   un `<button>` nativo.
 * - Las opciones heredan la semantica accesible de `ContextMenu`.
 *
 * @example
 * ```tsx
 * <ActionMenuCell
 *   row={row}
 *   onEdit={(r) => navigate(`/detalle/${r.id}`)}
 *   onDelete={handleDelete}
 * />
 * ```
 */
const ActionMenuCell = <T extends Record<string, any>>({
  permissions: permissionsOverride,
  isMobile: isMobileOverride,
  ...props
}: ActionMenuCellProps<T>) => {
  const { currentPagePermissions } = useAuth();
  const useismobile = useIsMobile();
  const isMobile = isMobileOverride ?? useismobile;

  const normalizedPermissions = useMemo<ActionMenuPermissions>(
    () => ({
      details: Boolean(permissionsOverride?.details ?? currentPagePermissions?.details),
      update: Boolean(permissionsOverride?.update ?? currentPagePermissions?.update),
      delete: Boolean(permissionsOverride?.delete ?? currentPagePermissions?.delete),
      renew: Boolean(permissionsOverride?.renew ?? currentPagePermissions?.renew),
    }),
    [permissionsOverride, currentPagePermissions]
  );

  return (
    <ActionMenuCellView
      {...props}
      isMobile={isMobile}
      permissions={normalizedPermissions}
    />
  );
};

export default ActionMenuCell;

/**
 * Genera la lista de items del menu contextual segun permisos.
 */
export const buildActionMenuItems = <T extends Record<string, unknown>>({
  row,
  onEdit,
  onDelete,
  onDetails,
  onRenewDay,
  permissions,
}: ActionMenuCellBaseProps<T> & { permissions: ActionMenuPermissions }): ContextMenuItem[] => {
  const items: ContextMenuItem[] = [];
  const canEdit = Boolean(permissions.details || permissions.update);

  if (canEdit) {
    items.push({
      label: permissions.details ? "Editar" : "Actualizar",
      icon: EditIcon,
      onClick: () => onEdit?.(row) ?? onDetails?.(row),
    });
  }

  if (permissions.renew) {
    items.push({
      label: "Renovar",
      icon: CalendarPlusIcon,
      onClick: () => onRenewDay?.(row),
    });
  }

  if (permissions.delete) {
    items.push({
      label: "Eliminar",
      icon: DeleteIcon,
      danger: true,
      onClick: () => onDelete?.(row),
    });
  }


  return items;
};

export type ActionMenuCellViewProps<T> = ActionMenuCellResolvedProps<T> & {
  menuComponent?: React.ComponentType<ContextMenuProps>;
  buttonComponent?: React.ComponentType<ButtonProps>;
};

/**
 * Variante presentacional y facilmente testeable de {@link ActionMenuCell}.
 * Permite inyectar componentes ligeros para `ContextMenu` y `Button`.
 */
export const ActionMenuCellView = <T extends Record<string, unknown>>({
  row,
  onEdit,
  onDelete,
  onDetails,
  onRenewDay,
  permissions,
  isMobile,
  menuComponent: MenuComponent = ContextMenu,
  buttonComponent: ButtonComponent = Button,
}: ActionMenuCellViewProps<T>) => {
  const menuItems = useMemo(
    () => buildActionMenuItems<T>({ row, onEdit, onDelete, onDetails, onRenewDay, permissions }),
    [row, onEdit, onDelete, onDetails, onRenewDay, permissions]
  );

  const TriggerIcon = isMobile ? RightArrowIcon : DotsIcon;

  return (
    <MenuComponent
      alignRight
      autoFlip
      items={menuItems}
      trigger={
        <ButtonComponent
          size="xsmall"
          variant="ghost"
          icon={TriggerIcon as ButtonProps["icon"]}
          aria-label="Abrir menu de acciones"
        />
      }
    />
  );
};

/** Permisos relevantes para las acciones disponibles en el menu. */
export type ActionMenuPermissions = Partial<{
  details: boolean;
  update: boolean;
  delete: boolean;
}>;

/** Props minimas para operar sobre una fila del menu contextual. */
export type ActionMenuCellBaseProps<T> = {
  /** Fila actual (se reenvia como argumento de los callbacks). */
  row: T;
  /** Callback cuando se elige la opcion de ver/editar. */
  onEdit: (row: T) => void;
  /** Callback cuando se elige la opcion de cancelar/eliminar. */
  onDelete: (row: T) => void;
};

/** Props internas con permisos resueltos e indicador de vista mobile. */
export type ActionMenuCellResolvedProps<T> = ActionMenuCellBaseProps<T> & {
  permissions: ActionMenuPermissions;
  isMobile: boolean;
};

/** Props publicas del componente `ActionMenuCell`. */
export type ActionMenuCellProps<T> = ActionMenuCellBaseProps<T> & {
  /** Permisos a usar en lugar de los detectados por `useAuth`. */
  permissions?: ActionMenuPermissions;
  /** Fuerza el modo mobile/desktop (por defecto usa `useIsMobile`). */
  isMobile?: boolean;


};

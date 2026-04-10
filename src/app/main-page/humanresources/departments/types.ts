/**
 * Vista actual del catalogo de departamentos.
 */
export type DepartmentViewMode = "list" | "new" | "edit";

/**
 * Modelo de un puesto dentro del departamento.
 */
export type DepartmentPositionItem = {
  id: string;
  name: string;
};

/**
 * Estado del formulario de departamentos.
 */
export type DepartmentFormState = {
  name: string;
  description: string;
  enterpriseId: string;
  positions: DepartmentPositionItem[];
};

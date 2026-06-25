import { ResponsiveLayoutMatrix } from "@/app/components/DynamicForm/types";

/**
 * Identificador de los campos soportados por el formulario contextual.
 */
export type ContextualInfoFieldId =
  | "company"
  | "projectCode"
  | "debtorCode"
  | "clientCode"
  | "startDate"
  | "endDate"
  | "assignedPerson";

/**
 * Definicion de un campo visible dentro del formulario contextual.
 */
export type ContextualInfoFieldConfig = {
  /** Identificador estable del campo. */
  id: ContextualInfoFieldId;
  /** Etiqueta visible del campo. */
  label: string;
  /** Query params aceptados para resolver el valor desde la URL. */
  queryKeys?: string[];
  /** Muestra el icono de calendario y formatea el valor como fecha. */
  isDate?: boolean;
};

/**
 * Valores controlados que pueden sobreescribir lo leido desde query params.
 */
export type ContextualInfoValues = Partial<
  Record<ContextualInfoFieldId, string>
>;

/**
 * Configuracion de una variante de campos.
 */
export type ContextualInfoVariantConfig = {
  /** Campos que se muestran para la variante. */
  fields: ContextualInfoFieldConfig[];
};

/**
 * Props del formulario reutilizable de informacion contextual.
 */
export type ContextualInfoFormProps = {
  /**
   * Valores controlados por la pantalla consumidora. Si existen, tienen prioridad
   * sobre lo resuelto desde la URL.
   */
  values?: ContextualInfoValues;
  /**
   * Variante forzada. Si no se envia, se lee de `formVariant`, `variant`, `view`
   * o `context` en el query string.
   */
  variant?: string;
  /**
   * Variantes disponibles por query param. Permite que cada modulo decida que
   * campos mostrar sin duplicar el componente.
   */
  variants?: Record<string, ContextualInfoVariantConfig>;
  /** Texto mostrado cuando un campo no tiene valor en props ni URL. */
  emptyValue?: string;
  /** Clases adicionales para el contenedor. */
  className?: string;
  /** Prefijo para selectores de prueba. */
  dataTestId?: string;
  contextualInfoLayout?: ResponsiveLayoutMatrix;
};

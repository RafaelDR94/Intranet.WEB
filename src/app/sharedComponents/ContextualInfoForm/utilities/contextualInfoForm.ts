import type {
  ContextualInfoFieldConfig,
  ContextualInfoValues,
  ContextualInfoVariantConfig,
} from "../types";

export const defaultContextualInfoFields: ContextualInfoFieldConfig[] = [
  {
    id: "company",
    label: "Empresa",
    queryKeys: ["empresa", "company", "enterprise", "enterpriseName"],
  },
  {
    id: "projectCode",
    label: "Codigo de proyecto",
    queryKeys: [
      "codigoProyecto",
      "projectCode",
      "proyectCode",
      "codeProyect",
      "project",
    ],
  },
  {
    id: "debtorCode",
    label: "Codigo de deudor",
    queryKeys: [
      "codigoDeudor",
      "debtorCode",
      "idDebtor",
      "debtorId",
      "idEmployee",
    ],
  },
  {
    id: "clientCode",
    label: "Codigo de cliente",
    queryKeys: ["codigoCliente", "clientCode", "customerCode", "idClient"],
  },
  {
    id: "startDate",
    label: "Fecha Inicio",
    queryKeys: ["fechaInicio", "startDate", "start_date"],
    isDate: true,
  },
  {
    id: "endDate",
    label: "Fecha Termino",
    queryKeys: ["fechaTermino", "endDate", "end_date"],
    isDate: true,
  },
  {
    id: "assignedPerson",
    label: "Personal asignado",
    queryKeys: [
      "personalAsignado",
      "assignedPerson",
      "employeeName",
      "responsibleName",
    ],
  },
];

export const defaultContextualInfoVariants: Record<
  string,
  ContextualInfoVariantConfig
> = {
  default: { fields: defaultContextualInfoFields },
  requisition: {
    fields: defaultContextualInfoFields.filter(
      (field) => field.id !== "clientCode",
    ),
  },
  project: {
    fields: defaultContextualInfoFields.filter(
      (field) => field.id !== "debtorCode",
    ),
  },
};

/**
 * Selecciona la variante configurada para el formulario contextual.
 *
 * @param variantName Nombre de variante leido por props o URL.
 * @param variants Diccionario de variantes disponibles.
 * @returns Configuracion de variante resuelta.
 */
export function resolveContextualInfoVariant(
  variantName: string | null | undefined,
  variants: Record<string, ContextualInfoVariantConfig>,
): ContextualInfoVariantConfig {
  const normalized = variantName?.trim();
  return (
    (normalized && variants[normalized]) ||
    variants.default || {
      fields: defaultContextualInfoFields,
    }
  );
}

/**
 * Normaliza fechas para campos `date` de DynamicForm.
 *
 * @param value Valor de fecha recibido.
 * @returns Fecha en formato `yyyy-mm-dd` cuando puede normalizarse.
 */
export function normalizeContextualInfoDateInput(value: string): string {
  const isoMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    return `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`;
  }

  const displayMatch = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (displayMatch) {
    return `${displayMatch[3]}-${displayMatch[2]}-${displayMatch[1]}`;
  }

  return value;
}

/**
 * Resuelve el valor de un campo usando primero props controladas y despues los
 * aliases declarados para query params.
 *
 * @param field Campo a resolver.
 * @param values Valores controlados por props.
 * @param searchParams Query params actuales.
 * @param emptyValue Fallback visual cuando no hay dato.
 * @returns Valor listo para pintar.
 */
export function resolveContextualInfoFieldValue(
  field: ContextualInfoFieldConfig,
  values: ContextualInfoValues,
  searchParams: URLSearchParams,
  emptyValue: string,
): string {
  const controlledValue = values[field.id];
  const rawValue =
    controlledValue ??
    field.queryKeys
      ?.map((key) => searchParams.get(key))
      .find((value) => Boolean(value)) ??
    "";

  const value = rawValue.trim();
  if (!value) return emptyValue;

  return field.isDate ? normalizeContextualInfoDateInput(value) : value;
}

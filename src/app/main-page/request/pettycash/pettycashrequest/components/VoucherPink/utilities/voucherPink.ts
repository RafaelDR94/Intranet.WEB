import type { FieldModel } from "@/app/components/DynamicForm/types";
import type {
  PettyCashVoucherData,
  PostPettyCashVoucher,
} from "@/app/mappings/billingPettyCash/BillingPettyCash.types";
import type { Proyect } from "@/app/mappings/proyects/proyects.types";
import { currentDate } from "@/app/utilities/DatesHelper/Dateshelper";
// Ya existentes en tu archivo (mantén tus implementaciones)
/**
 * Determina si el formulario aún está cargando información
 * (empleados o proyectos).
 *
 * @param fields campos actuales del formulario.
 * @returns `true` si faltan opciones, `false` si todo está listo.
 */
export const computeLoadingFormInfo = (fields: FieldModel[]) => {
  const prj = fields.find((f) => f.name === "project");
  const projectsReady =
    Array.isArray(prj?.options) && (prj?.options?.length ?? 0) > 0;
  return !projectsReady;
};

/**
 * Obtiene la etiqueta asociada a un valor dentro de un campo select.
 *
 * @param fields lista de campos del formulario.
 * @param fieldName nombre del campo a consultar.
 * @param value valor cuyo label se busca.
 * @returns etiqueta encontrada o `undefined`.
 */
export const getOptionLabel = (
  fields: FieldModel[],
  fieldName: string,
  value: unknown,
): string | undefined => {
  const f = fields.find((x) => x.name === fieldName);
  const opt = (
    f?.options as Array<{ label: string; value: unknown }> | undefined
  )?.find((o) => o.value === value);
  return opt?.label;
};

/**
 * Construye el payload para crear o actualizar un vale de caja chica.
 */
export const buildPettyCashVoucherPayload = ({
  values,
  proyects: _proyects,
  fields: _fields,
  pettyCashFundId,
  getOptionLabel: _getOptionLabel,
  employeeId,
}: {
  values: Record<string, unknown>;
  proyects: Proyect[];
  fields: FieldModel[];
  pettyCashFundId?: string;
  getOptionLabel: (fieldName: string, value: unknown) => string | undefined;
  employeeId: string;
}): PostPettyCashVoucher => {
  const projectId = String(values.project ?? "");
  const application_date = String(values.asignamentdate ?? "");
  const concept = String(values.concept ?? "");
  const amount = Number(values.monto ?? 0);

  const xmlValue = values.xml as { url: string } | undefined;
  const pdfValue = values.pdf as { url: string } | undefined;

  return {
    petty_cash_funds_id: pettyCashFundId ?? "",
    employee_id: employeeId,
    voucher_type: "R",
    application_date,
    concept,
    amount,
    comments: "",
    project_id: projectId,
    xml: xmlValue?.url ?? "",
    pdf: pdfValue?.url ?? "",
  };
};

// --- NUEVO: helpers puros y alerts pequeñas

/**
 * Crea la definición de campos iniciales para el formulario.
 * @returns arreglo con modelos de campo.
 */
export const createInitialFields = (
  dataEdit?: PettyCashVoucherData,
): FieldModel[] => [
  {
    type: "input",
    name: "personName",
    label: "Nombre",
    placeholder: "Ingrese el nombre completo",
    value: "",
    className: "max-w-[400px]",
    onlyText: true,
    showIf: () => Boolean(!dataEdit),
  },
  {
    type: "input",
    name: "monto",
    label: "Monto",
    placeholder: "Escribe el monto solicitado",
    value: dataEdit ? String(dataEdit.amount) : "",
    className: "max-w-[400px]",
    validations: [{ type: "required" }],
  },
  {
    type: "date",
    name: "asignamentdate",
    label: "Fecha",
    placeholder: "00/00/00",
    value: dataEdit?.application_date ?? currentDate(),
    className: "max-w-[400px]",
    validations: [{ type: "required" }],
  },
  {
    type: "input",
    name: "concept",
    label: "Concepto",
    placeholder: "Escribe el concepto",
    value: dataEdit?.concept ?? "",
    className: "max-w-[400px]",
    validations: [{ type: "required" }],
  },
  {
    type: "select",
    name: "project",
    label: "Proyecto",
    placeholder: "Selecciona el proyecto ",
    value: dataEdit?.project_id ?? "",
    className: "max-w-[400px]",
    validations: [{ type: "required" }],
    showIf: (_v, all) => {
      const f = all.find((x) => x.name === "project");
      return Array.isArray(f?.options) && (f.options?.length ?? 0) > 0;
    },
  },
  {
    type: "file",
    name: "xml",
    label: "Documento XML",
    value: { name: dataEdit?.xml ? "Documento XML" : "", url: dataEdit?.xml },
    initialFile: { name: dataEdit?.xml ?? "", url: dataEdit?.xml ?? "" },
    accept: ".xml",
    className: "max-w-[300px]",
    validations: dataEdit ? [] : [{ type: "required" }],
  },
  {
    type: "file",
    name: "pdf",
    label: "Documento PDF",
    value: { name: dataEdit?.pdf ? "Documento PDF" : "", url: dataEdit?.pdf },
    initialFile: { name: dataEdit?.pdf ?? "", url: dataEdit?.pdf ?? "" },
    accept: ".pdf",
    className: "max-w-[300px]",
    validations: dataEdit ? [] : [{ type: "required" }],
  },
];

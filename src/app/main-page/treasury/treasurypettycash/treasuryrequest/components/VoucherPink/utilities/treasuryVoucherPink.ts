import type { FieldModel } from "@/app/components/DynamicForm/types";
import {
  buildPettyCashVoucherPayload,
  getOptionLabel,
} from "@/app/main-page/request/pettycash/pettycashrequest/components/VoucherPink/utilities/voucherPink";
import type { PettyCashVoucherData } from "@/app/mappings/billingPettyCash/BillingPettyCash.types";
import { currentDate } from "@/app/utilities/DatesHelper/Dateshelper";

/**
 * Determina si el formulario aún está cargando catálogos necesarios.
 * Considera tanto empleados como proyectos.
 */
export const computeLoadingFormInfo = (fields: FieldModel[]) => {
  const projectField = fields.find((f) => f.name === "project");
  const projectsReady =
    Array.isArray(projectField?.options) && (projectField.options?.length ?? 0) > 0;

  const employeeField = fields.find((f) => f.name === "personName");
  const employeesReady =
    Array.isArray(employeeField?.options) &&
    (employeeField.options?.length ?? 0) > 0;

  return !(projectsReady && employeesReady);
};

/**
 * Crea la definición de campos iniciales para el formulario rosa de tesorería.
 */
export const createInitialFields = ({
  dataEdit,
  defaultEmployeeId,
}: {
  dataEdit?: PettyCashVoucherData;
  defaultEmployeeId?: string;
}): FieldModel[] => [
  {
    type: "select",
    name: "personName",
    label: "Colaborador",
    placeholder: "Selecciona el colaborador",
    value: dataEdit?.employee_id ?? defaultEmployeeId ?? "",
    className: "max-w-[400px]",
    options: [],
    validations: [{ type: "required" }],
    showIf: (_value, all) => {
      const field = all.find((x) => x.name === "personName");
      return Array.isArray(field?.options) && (field.options?.length ?? 0) > 0;
    },
  },
  {
    type: "select",
    name: "project",
    label: "Proyecto",
    placeholder: "Selecciona el proyecto ",
    value: dataEdit?.project_id ?? "",
    className: "max-w-[400px]",
    validations: [{ type: "required" }],
    showIf: (_value, all) => {
      const field = all.find((x) => x.name === "project");
      return Array.isArray(field?.options) && (field.options?.length ?? 0) > 0;
    },
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

export { buildPettyCashVoucherPayload, getOptionLabel };

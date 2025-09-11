import type { FieldModel } from "@/app/components/DynamicForm/types";
import type { EmployeeType } from "@/app/mappings/employees/employee.types";
import type { Proyect } from "@/app/mappings/proyects/proyects.types";
import type { PostPettyCashVoucher } from "@/app/mappings/billingPettyCash/BillingPettyCash.types";
import { currentDate } from "@/app/utilities/DatesHelper/Dateshelper";

/**
 * Determina si el formulario aún está cargando información
 * (empleados o proyectos).
 * @param fields campos actuales del formulario.
 * @returns `true` si faltan opciones, `false` si todo está listo.
 */
export const computeLoadingFormInfo = (fields: FieldModel[]) => {
  const emp = fields.find((f) => f.name === "employees");
  const prj = fields.find((f) => f.name === "project");
  const employeesReady =
    Array.isArray(emp?.options) && (emp?.options?.length ?? 0) > 0;
  const projectsReady =
    Array.isArray(prj?.options) && (prj?.options?.length ?? 0) > 0;
  return !(employeesReady && projectsReady);
};

/**
 * Obtiene la etiqueta asociada a un valor dentro de un campo select.
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
 * Construye el payload para crear o actualizar un vale de caja chica azul.
 */
export const buildPettyCashVoucherPayload = ({
  values,
  employees,
  proyects,
  fields,
  pettyCashFundId,
  getOptionLabel,
}: {
  values: Record<string, unknown>;
  employees: EmployeeType[];
  proyects: Proyect[];
  fields: FieldModel[];
  pettyCashFundId?: string;
  getOptionLabel: (fieldName: string, value: unknown) => string | undefined;
}): PostPettyCashVoucher => {
  const employeeId = String(values.employees ?? "");
  const projectId = String(values.project ?? "");
  const application_date = String(values.asignamentdate ?? "");
  const concept = String(values.concept ?? "");
  const amount = Number(values.monto ?? 0);

  const xmlValue = values.xml as { url: string } | undefined;
  const pdfValue = values.pdf as { url: string } | undefined;

  return {
    petty_cash_funds_id: pettyCashFundId ?? "",
    employee_id: employeeId,
    voucher_type: "blue",
    application_date,
    concept,
    amount,
    comments: "",
    project_id: projectId,
    xml: xmlValue?.url ?? "",
    pdf: pdfValue?.url ?? "",
  };
};

/**
 * Crea la definición de campos iniciales para el formulario azul.
 */
export const createInitialFields = (): FieldModel[] => [
  {
    type: "select",
    name: "employees",
    label: "Nombre del Deudor",
    placeholder: "Seleccione el Deudor",
    value: "",
    className: "max-w-[400px]",
    validations: [{ type: "required" }],
    showIf: (_v, all) => {
      const f = all.find((x) => x.name === "employees");
      return Array.isArray(f?.options) && (f.options?.length ?? 0) > 0;
    },
  },
  {
    type: "input",
    name: "monto",
    label: "Monto",
    placeholder: "Escribe el monto solicitado",
    value: "",
    className: "max-w-[400px]",
    validations: [{ type: "required" }],
  },
  {
    type: "date",
    name: "asignamentdate",
    label: "Fecha",
    placeholder: "00/00/00",
    value: currentDate(),
    className: "max-w-[400px]",
    validations: [{ type: "required" }],
  },
  {
    type: "input",
    name: "concept",
    label: "Concepto",
    placeholder: "Escribe el concepto",
    value: "",
    className: "max-w-[400px]",
    validations: [{ type: "required" }],
  },
  {
    type: "select",
    name: "project",
    label: "Proyecto",
    placeholder: "Selecciona el proyecto ",
    value: "",
    className: "max-w-[400px]",
    validations: [{ type: "required" }],
    showIf: (_v, all) => {
      const f = all.find((x) => x.name === "project");
      return Array.isArray(f?.options) && (f.options?.length ?? 0) > 0;
    },
  },
  
];
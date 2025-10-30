import { FieldModel } from "@/app/components/DynamicForm/types";
import { currentDate } from "@/app/utilities/DatesHelper/Dateshelper";

/**
 * Creates base fields for the invoice form.
 * Used when the user already has XML and PDF files.
 */
export const voucherPinkFields = (): FieldModel[] => [
  {
    type: "input",
    name: "debtorName",
    label: "Nombre del Deudor",
    placeholder: "Ingrese el nombre completo",
    value: "",
    className: "max-w-[400px]",
    onlyText: true,
    showIf: (value) => Boolean(value.debtorName),
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
    label: "Fecha de asignación",
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
    name: "proyect",
    label: "Proyecto",
    placeholder: "Selecciona un proyecto",
    value: "",
    options: [],
    className: "max-w-[400px]",
    onlyText: true,
  },
  {
    type: "file",
    name: "xml",
    label: "Documento XML",
    value: { name: "Documento XML", url: "" },
    accept: ".xml",
    className: "max-w-[300px]",
    validations: [{ type: "required" }],
  },
  {
    type: "file",
    name: "pdf",
    label: "Documento PDF",
    value: { name: "Documento PDF", url: "" },
    accept: ".pdf",
    className: "max-w-[300px]",
    validations: [{ type: "required" }],
  },
];

/**
 * Creates base fields for the ticket form.
 * Used when the user only has a picture of the ticket.
 */
export const voucherBlueFields = (): FieldModel[] => [
  {
    type: "input",
    name: "debtorName",
    label: "Nombre del Deudor",
    placeholder: "Ingrese el nombre completo",
    value: "",
    className: "max-w-[400px]",
    onlyText: true,
    showIf: (value) => Boolean(value.debtorName),
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
    label: "Fecha de asignación",
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
    name: "proyect",
    label: "Proyecto",
    placeholder: "Selecciona un proyecto",
    value: "",
    options: [],
    className: "max-w-[400px]",
    onlyText: true,
  },
  {
    type: "file",
    name: "xml",
    label: "Documento XML",
    value: { name: "Documento XML", url: "" },
    accept: ".xml",
    className: "max-w-[300px]",
    validations: [{ type: "required" }],
  },
  {
    type: "file",
    name: "pdf",
    label: "Documento PDF",
    value: { name: "Documento PDF", url: "" },
    accept: ".pdf",
    className: "max-w-[300px]",
    validations: [{ type: "required" }],
  },
];

const initialFieldsExports = {};
export default initialFieldsExports;

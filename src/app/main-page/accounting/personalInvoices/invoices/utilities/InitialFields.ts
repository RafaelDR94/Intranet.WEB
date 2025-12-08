import { FieldModel } from "@/app/components/DynamicForm/types";
import { ticketFormDropzoneClasses } from "../components/TicketForm/styles";

/**
 * Creates base fields for the invoice form.
 * Used when the user already has XML and PDF files.
 */
export const createInvoiceFields = (): FieldModel[] => [
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
    name: "proyect",
    label: "Proyecto",
    placeholder: "Ingrese el nombre completo",
    value: "",
    className: "max-w-[400px]",
    onlyText: true,
  },
  {
    type: "select",
    name: "requisition",
    label: "Código de Requisición",
    placeholder: "Seleccione el código",
    value: "",
    options: [],
    className: "max-w-[400px]",
    showIf: (_v, all) => {
      const f = all.find((x) => x.name === "requisition");
      return Array.isArray(f?.options) && (f.options?.length ?? 0) > 0;
    },
    validations: [{ type: "required" }],
  },
  {
    type: "select",
    name: "category",
    label: "Categoría",
    placeholder: "Selecciona una categoría",
    value: "",
    options: [],
    className: "max-w-[400px]",
    showIf: (_v, all) => {
      const f = all.find((x) => x.name === "category");
      return Array.isArray(f?.options) && (f.options?.length ?? 0) > 0;
    },
    validations: [{ type: "required" }],
  },
  {
    type: "select",
    name: "description",
    label: "Descripción",
    placeholder: "Selecciona una descripción",
    value: "",
    options: [],
    className: "max-w-[400px]",
    showIf: (_v, all) => {
      const f = all.find((x) => x.name === "description");
      return Array.isArray(f?.options) && (f.options?.length ?? 0) > 0;
    },
    validations: [{ type: "required" }],
  },
  {
    type: "numberControl",
    name: "numnights",
    label: "Número de noches",
    value: 1,
    className: "max-w-[300px]",
    validations: [{ type: "required" }],
  },
  {
    type: "numberControl",
    name: "numpersons",
    label: "Número de personas",
    value: 1,
    className: "max-w-[300px]",
    validations: [{ type: "required" }],
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
export const createTicketFields = (): FieldModel[] => [
  // {
  //   type: "input",
  //   name: "debtorName",
  //   label: "Nombre del Deudor",
  //   placeholder: "Ingrese el nombre completo",
  //   value: "",
  //   className: "max-w-[400px]",
  //   onlyText: true,
  //   showIf: (value) => Boolean(value.debtorName),
  // },
  // {
  //   type: "input",
  //   name: "proyect",
  //   label: "Proyecto",
  //   placeholder: "Ingrese el nombre completo",
  //   value: "",
  //   className: "max-w-[400px]",
  //   onlyText: true,
  // },
  // {
  //   type: "select",
  //   name: "requisition",
  //   label: "Código de Requisición",
  //   placeholder: "Seleccione el código",
  //   value: "",
  //   options: [],
  //   className: "max-w-[400px]",
  //   showIf: (_v, all) => {
  //     const f = all.find((x) => x.name === "requisition");
  //     return Array.isArray(f?.options) && (f.options?.length ?? 0) > 0;
  //   },
  // },
  // {
  //   type: "select",
  //   name: "description",
  //   label: "Descripción",
  //   placeholder: "Selecciona una descripción",
  //   value: "",
  //   options: [],
  //   className: "max-w-[400px]",
  //   showIf: (_v, all) => {
  //     const f = all.find((x) => x.name === "description");
  //     return Array.isArray(f?.options) && (f.options?.length ?? 0) > 0;
  //   },
  //   validations: [{ type: "required" }],
  // },
  {
    type: "select",
    name: "category",
    label: "Categoría",
    placeholder: "Seleccione una categoría",
    value: "",
    options: [],
    className: "max-w-[400px]",
    showIf: (_v, all) => {
      const f = all.find((x) => x.name === "category");
      return Array.isArray(f?.options) && (f.options?.length ?? 0) > 0;
    },
    validations: [{ type: "required" }],
  },
  // {
  //   type: "numberControl",
  //   name: "numnights",
  //   label: "Número de noches",
  //   value: 1,
  //   validations: [{ type: "required" }],
  //   className: "max-w-[300px]",
  // },
  // {
  //   type: "numberControl",
  //   name: "numpersons",
  //   label: "Número de personas",
  //   value: 1,
  //   validations: [{ type: "required" }],
  //   className: "max-w-[300px]",
  // },
  {
    type: "imageUploaderExpanded",
    name: "ticket",
    label: "Imagen del ticket (JPG o PNG)",
    placeholder: "Arrastra o selecciona la foto del ticket",
    value: { name: "Imagen", url: "" },
    accept: ".jpg,.png",
    className: ticketFormDropzoneClasses,
    validations: [{ type: "required" }],
    buttonLabel: "Seleccionar imagen",
    cameraButtonAriaLabel: "Tomar foto del ticket",
    preview: true,
  },
];

const initialFieldsExports = {};
export default initialFieldsExports;

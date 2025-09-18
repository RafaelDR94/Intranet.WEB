
import { FieldModel } from "@/app/components/DynamicForm/types";

export const buildInitialFields = (): FieldModel[] => [
  {
    type: "input",
    name: "client",
    label: "Cliente*",
    placeholder: "Cliente",
    value: "",
    className: "max-w-[400px]",
    validations: [{ type: "required" }],
  },
  {
    type: "input",
    name: "name",
    label: "Nombre del Proyecto*",
    placeholder: "Nombre del Proyecto",
    value: "",
    className: "max-w-[400px]",
    validations: [{ type: "required" }],
  },
  {
    type: "input",
    name: "proyectKey",
    label: "Llave del Proyecto*",
    placeholder: "Escribe la llave del Proyecto",
    value: "",
    className: "max-w-[400px]",
    validations: [{ type: "required" }],
  },
  {
    type: "select",
    name: "manager",
    label: "Encargado*",
    placeholder: "Selecciona encargado",
    value: [],
    className: "max-w-[400px]",
    options: [],
    showIf: (_v, all) => {
      const f = all.find((x) => x.name === "manager");
      return Array.isArray(f?.options) && (f?.options?.length ?? 0) > 0;
    },
  },
  {
    type: "multiSelect",
    name: "collaborators",
    label: "Colaboradores",
    placeholder: "Selecciona colaboradores",
    value: [],
    className: "max-w-[400px]",
    options: [],
    showIf: (_v, all) => {
      const f = all.find((x) => x.name === "collaborators");
      return Array.isArray(f?.options) && (f?.options?.length ?? 0) > 0;
    },
  },
];
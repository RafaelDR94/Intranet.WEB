import { useCallback, useMemo, useRef, useState } from "react";

import type {
  FieldModel,
  ResponsiveLayoutMatrix,
} from "@/app/components/DynamicForm/types";

const responsiveLayoutMatrix: ResponsiveLayoutMatrix = {
  sm: [[10], [10], [10], [10], [10], [10]],
  md: [
    [5, 5],
    [5, 5],
    [5, 5],
  ],
  lg: [[5, 5], [5, 5, 5], [10]],
};

const toolsChecklistOptions = [
  { label: "Administración", value: "administracion" },
  { label: "Almacén", value: "almacen" },
  { label: "Asistente de dirección", value: "add" },
  { label: "Calidad", value: "add" },
  { label: "CAYAS", value: "cayas" },
  { label: "Compras", value: "compras" },
  { label: "Contabilidad y nominas", value: "" },
  { label: "Control interno y auditoria", value: "" },
  { label: "Coord. operativa", value: "" },
  { label: "Coord. compras nacionales", value: "" },
  { label: "Desarrollo tecnológico", value: "" },
  { label: "Dirección", value: "" },
  { label: "Finanzas", value: "" },
  { label: "Ingeniería", value: "" },
  { label: "ITEDESCA", value: "" },
  { label: "Licitaciones", value: "" },
  { label: "Niveles de servicio", value: "" },
  { label: "PMO", value: "" },
  { label: "Proyectos", value: "" },
  { label: "Protectos especiales", value: "" },
  { label: "Radiología", value: "" },
  { label: "Reclutamiento y selec. personal", value: "" },
  { label: "RH", value: "" },
  { label: "Servicios generales", value: "" },
  { label: "SIP", value: "" },
  { label: "Tecnología de la información", value: "" },
  { label: "Ventas", value: "" },
  { label: "VIP Ingeniería", value: "" },
  { label: "VISITAX", value: "" },
];

const createDocumentRegistryFields = (): FieldModel[] => [
  
  {
    type: "file",
    name: "documentFile",
    label: "Selecciona un archivo",
    placeholder: "Seleccionar archivo",
    value: null,
    accept: ".pdf,.doc,.docx,.xlsx",
    helperText: "Ningún archivo seleccionado",
    className: "w-full md:w-auto",
    validations: [{ type: "required" }],
  },
  {
    type: "input",
    name: "documentKey",
    label: "Clave del Documento",
    placeholder: "Ingresa una clave de documento",
    value: "",
    inputSize: "lg",
    className: "w-full",
    validations: [{ type: "required" }, { type: "maxLength", value: 50 }],
  },
  {
    type: "select",
    name: "specifications",
    label: "Documento para",
    placeholder: "Selecciona una opción",
    value: "",
    rows: 5,
    inputSize: "lg",
    className: "w-full",
    options: [
      { label: "Documentos Gerenciales", value: "internal" },
      { label: "Documentos Operativos", value: "external" },
    ],
  },
  {
    type: "select",
    name: "destinationArea",
    label: "Indique el área",
    placeholder: "Selecciona una opción",
    value: "",
    options: [
      { label: "Recursos Humanos", value: "hr" },
      { label: "Operaciones", value: "operations" },
      { label: "Seguridad", value: "security" },
      { label: "Finanzas", value: "finance" },
      { label: "Tecnologías de la Información", value: "it" },
    ],
    className: "w-full",
    validations: [{ type: "required" }],
  },
  {
    type: "select",
    name: "documentType",
    label: "Indique el tipo de documento",
    placeholder: "Selecciona una opción",
    value: "",
    options: [
      { label: "Política", value: "policy" },
      { label: "Procedimiento", value: "procedure" },
      { label: "Manual", value: "manual" },
      { label: "Formato", value: "format" },
      { label: "Aviso", value: "notice" },
    ],
    className: "w-full",
    validations: [{ type: "required" }],
  },
  {
    type: "textarea",
    name: "description",
    label: "Descripción del documento",
    placeholder: "Ingresa la descripción del documento",
    value: "",
    rows: 2,
    inputSize: "lg",
    className: "w-full",
    validations: [{ type: "required" }],
  },
  {
    type: "checkboxList",
    name: "toolsChecklist",
    label: "Check List Herramientas",
    value:'',
    options: toolsChecklistOptions,
    checkboxListProps: {
      labelPosition: "right",
    },
  },
];

const useDocumentRegistry = () => {
  const submitRef = useRef<(() => void | Promise<void>) | null>(null);
  const [formReady, setFormReady] = useState(false);

  const fields = useMemo(() => createDocumentRegistryFields(), []);

  const handleSubmit = useCallback((_values: Record<string, unknown>) => {
    // TODO: Integrar con el servicio de registro de documentos.
  }, []);

  return {
    title: "Registro de Documentos",
    submitLabel: "Registrar Documento",
    submitRef,
    formReady,
    setFormReady,
    fields,
    responsiveLayoutMatrix,
    handleSubmit,
  };
};

export default useDocumentRegistry;

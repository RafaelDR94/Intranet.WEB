import { useCallback, useMemo, useRef, useState } from "react";

import type {
  FieldModel,
  ResponsiveLayoutMatrix,
} from "@/app/components/DynamicForm/types";

const responsiveLayoutMatrix: ResponsiveLayoutMatrix = {
  sm: [[10], [10], [10], [10], [10], [10]],
  md: [[5, 5], [5, 5], [5, 5]],
  lg: [[6, 4], [5, 5], [5, 5]],
};

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
    name: "destinationArea",
    label: "Área de destino",
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
    label: "Tipo de documento",
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
    label: "Ingresa la descripción del documento",
    placeholder: "Describe brevemente el documento",
    value: "",
    rows: 5,
    inputSize: "lg",
    className: "w-full",
    validations: [{ type: "required" }],
  },
  {
    type: "textarea",
    name: "specifications",
    label: "Ingresa las especificaciones del documento",
    placeholder: "Detalla las especificaciones o comentarios adicionales",
    value: "",
    rows: 5,
    inputSize: "lg",
    className: "w-full",
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

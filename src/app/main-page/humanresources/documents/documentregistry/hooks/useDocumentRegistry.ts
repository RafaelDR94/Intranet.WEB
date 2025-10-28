"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type {
  FieldModel,
  ResponsiveLayoutMatrix,
} from "@/app/components/DynamicForm/types";
import { mapDocumentTypesToOptions } from "@/app/mappings/documents/documents.mapper";
import { useDepartmentsStore } from "@/app/stores/useDepartmentsStore/useDepartmentsStore";
import { useDocumentTypesStore } from "@/app/stores/useDocumentTypesStore/useDocumentTypesStore";

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
  { label: "Asistente de dirección", value: "asistente_direccion" },
  { label: "Calidad", value: "calidad" },
  { label: "CAYAS", value: "cayas" },
  { label: "Compras", value: "compras" },
  { label: "Contabilidad y nominas", value: "contabilidad_nominas" },
  { label: "Control interno y auditoria", value: "control_auditoria" },
  { label: "Coord. operativa", value: "coord_operativa" },
  { label: "Coord. compras nacionales", value: "coord_compras_nacionales" },
  { label: "Desarrollo tecnológico", value: "desarrollo_tecnologico" },
  { label: "Dirección", value: "direccion" },
  { label: "Finanzas", value: "finanzas" },
  { label: "Ingeniería", value: "ingenieria" },
  { label: "ITEDESCA", value: "itedesca" },
  { label: "Licitaciones", value: "licitaciones" },
  { label: "Niveles de servicio", value: "niveles_servicio" },
  { label: "PMO", value: "pmo" },
  { label: "Proyectos", value: "proyectos" },
  { label: "Protectos especiales", value: "proyectos_especiales" },
  { label: "Radiología", value: "radiologia" },
  { label: "Reclutamiento y selec. personal", value: "reclutamiento" },
  { label: "RH", value: "rh" },
  { label: "Servicios generales", value: "servicios_generales" },
  { label: "SIP", value: "sip" },
  { label: "Tecnología de la información", value: "ti" },
  { label: "Ventas", value: "ventas" },
  { label: "VIP Ingeniería", value: "vip_ingenieria" },
  { label: "VISITAX", value: "visitax" },
];

const DEFAULT_TOOLS_CHECKED = toolsChecklistOptions.map((option) => option.value);

const createDocumentRegistryFields = (
  documentTypeOptions: { label: string; value: string }[],
  documentTypesLoading: boolean,
  destinationAreaOptions: { label: string; value: string }[],
  destinationAreasLoading: boolean,
): FieldModel[] => [
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
    options: destinationAreaOptions,
    className: "w-full",
    validations: [{ type: "required" }],
    disabled: destinationAreasLoading,
  },
  {
    type: "select",
    name: "documentType",
    label: "Indique el tipo de documento",
    placeholder: "Selecciona una opción",
    value: "",
    options: documentTypeOptions,
    className: "w-full",
    validations: [{ type: "required" }],
    disabled: documentTypesLoading,
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
    value: DEFAULT_TOOLS_CHECKED,
    options: toolsChecklistOptions,
    checkboxListProps: {
      labelPosition: "right",
    },
  },
];

const useDocumentRegistry = () => {
  const submitRef = useRef<(() => void | Promise<void>) | null>(null);
  const [formReady, setFormReady] = useState(false);

  const {
    activeDocumentTypes,
    loading: documentTypesLoading,
    fetchDocumentTypes,
  } = useDocumentTypesStore((state) => ({
    activeDocumentTypes: state.activeDocumentTypes,
    loading: state.loading,
    fetchDocumentTypes: state.fetchDocumentTypes,
  }));

  const {
    departments,
    loading: destinationAreasLoading,
    fetchDepartments,
  } = useDepartmentsStore((state) => ({
    departments: state.departments,
    loading: state.loading,
    fetchDepartments: state.fetchDepartments,
  }));

  useEffect(() => {
    void fetchDocumentTypes();
  }, [fetchDocumentTypes]);

  useEffect(() => {
    void fetchDepartments();
  }, [fetchDepartments]);

  const documentTypeOptions = useMemo(
    () => mapDocumentTypesToOptions(activeDocumentTypes),
    [activeDocumentTypes],
  );

  const destinationAreaOptions = useMemo(() => {
    const uniqueDepartments = new Map<string, { label: string; value: string }>();
    departments.forEach((department) => {
      const departmentName = department?.name?.trim();
      if (!departmentName) return;
      const value = department?.department_id || departmentName;
      if (!uniqueDepartments.has(value)) {
        uniqueDepartments.set(value, { label: departmentName, value });
      }
    });

    return Array.from(uniqueDepartments.values()).sort((a, b) =>
      a.label.localeCompare(b.label, "es", { sensitivity: "base" }),
    );
  }, [departments]);

  const fields = useMemo(
    () =>
      createDocumentRegistryFields(
        documentTypeOptions,
        documentTypesLoading,
        destinationAreaOptions,
        destinationAreasLoading,
      ),
    [
      documentTypeOptions,
      documentTypesLoading,
      destinationAreaOptions,
      destinationAreasLoading,
    ],
  );

  const handleSubmit = useCallback((_values: Record<string, unknown>) => {
    console.log("submited");
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

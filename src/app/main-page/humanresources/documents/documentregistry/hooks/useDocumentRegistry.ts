"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type {
  FieldModel,
  ResponsiveLayoutMatrix,
} from "@/app/components/DynamicForm/types";
import { Documents as DocumentsUrl } from "@/app/configurations/Axios/urls";
import { useFirebase } from "@/app/context/FirebaseContext/FirebaseContext";
import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";
import { mapDocumentTypesToOptions } from "@/app/mappings/documents/documents.mapper";
import type {
  DocumentPostPayload,
  ManagementDocument,
} from "@/app/mappings/documents/documents.types";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pPost } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";
import { useDepartmentsStore } from "@/app/stores/useDepartmentsStore/useDepartmentsStore";
import { useDocumentTypesStore } from "@/app/stores/useDocumentTypesStore/useDocumentTypesStore";
import { useDocumentsStore } from "@/app/stores/useDocumentsStore/useDocumentsStore";

const responsiveLayoutMatrix: ResponsiveLayoutMatrix = {
  sm: [[10], [10], [10], [10], [10], [10], [10]],
  md: [
    [5, 5],
    [5, 5],
    [5, 5],
    [10],
  ],
  lg: [[5, 5], [5, 5, 5], [10], [10]],
};

const DOCUMENTS_STORAGE_PREFIX = "HumanResources/DocumentRegistry/";

const createDocumentRegistryFields = (
  documentTypeOptions: { label: string; value: string }[],
  documentTypesLoading: boolean,
  destinationAreaOptions: { label: string; value: string }[],
  destinationAreasLoading: boolean,
  areasChecklistOptions: { label: string; value: string }[],
  documentRoute: string,
  documentFileLabel: string,
): FieldModel[] => [
  {
    type: "file",
    name: "documentFile",
    label: "Selecciona un archivo",
    placeholder: "Seleccionar archivo",
    value: null,
    accept: ".pdf,.doc,.docx,.xlsx",
    helperText: documentRoute
      ? `Archivo listo: ${documentFileLabel || "Documento cargado"}`
      : "Ningún archivo seleccionado",
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
    label: "Seleccione las áreas a las que aplica",
    value: [],
    options: areasChecklistOptions,
    disabled: destinationAreasLoading,
    showIf: (values) =>
      typeof values.specifications === "string" &&
      values.specifications.trim() === "external",
    checkboxListProps: {
      labelPosition: "right",
      showSelectAll: true,
      columns: 3,
    },
  },
];

const safeString = (value: unknown): string => {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean")
    return String(value);
  return "";
};

const toManagement = (value: unknown): boolean => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "internal" || normalized === "true") return true;
    if (normalized === "external" || normalized === "false") return false;
  }
  return true;
};

const extractFile = (value: unknown): File | null =>
  value instanceof File ? value : null;

const getFileBaseName = (fileName: string): string => {
  const lastDot = fileName.lastIndexOf(".");
  if (lastDot <= 0) return fileName;
  return fileName.slice(0, lastDot);
};

const getFileExtension = (fileName: string): string => {
  const lastDot = fileName.lastIndexOf(".");
  if (lastDot === -1 || lastDot === fileName.length - 1) return "";
  return fileName.slice(lastDot + 1);
};

const sanitizeStorageKey = (value: string): string => {
  if (!value) return "";
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");
};

const normalizeExtension = (extension: string): string =>
  extension.trim().toLowerCase();

const mapDocumentToFieldValues = (
  fields: FieldModel[],
  document?: ManagementDocument,
): FieldModel[] => {
  if (!document) return fields;

  return fields.map((field) => {
    switch (field.name) {
      case "documentKey":
        return { ...field, value: document.code };
      case "specifications":
        return {
          ...field,
          value: document.management ? "internal" : "external",
        };
      case "destinationArea":
        return {
          ...field,
          value:
            document.departments?.[0]?.department_id ??
            document.department?.department_id ??
            "",
        };
      case "documentType":
        return {
          ...field,
          value: document.document_type?.document_type_id ?? "",
        };
      case "description":
        return { ...field, value: document.description };
      case "toolsChecklist": {
        const departmentIds = (document.departments || [])
          .map((department) => department.department_id)
          .filter((departmentId): departmentId is string => Boolean(departmentId));

        if (!departmentIds.length && document.department?.department_id) {
          departmentIds.push(document.department.department_id);
        }

        return { ...field, value: departmentIds };
      }
      default:
        return field;
    }
  });
};

type ChecklistValue = { value?: unknown } | string | number | boolean | null | undefined;

const extractChecklistValue = (value: ChecklistValue): string => {
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return safeString(value).trim();
  }

  if (value && typeof value === "object" && "value" in value) {
    const optionValue = (value as { value?: unknown }).value;
    if (
      typeof optionValue === "string" ||
      typeof optionValue === "number" ||
      typeof optionValue === "boolean"
    ) {
      return safeString(optionValue).trim();
    }
  }

  return "";
};

const buildDocumentPayload = (
  values: Record<string, unknown>,
  route: string,
  extension: string,
): DocumentPostPayload => {
  const file = extractFile(values.documentFile);
  const fileName = file?.name ?? "";
  const fileExtension = getFileExtension(fileName);
  const code = safeString(values.documentKey).trim();
  const description = safeString(values.description).trim();
  const documentTypeId = safeString(values.documentType);
  const departmentId = safeString(values.destinationArea).trim();
  const management = toManagement(values.specifications);
  const providedName = safeString(values.name).trim();
  const baseName = fileName ? getFileBaseName(fileName) : "";
  const toolsChecklist = Array.isArray(values.toolsChecklist)
    ? values.toolsChecklist
        .map((item) => extractChecklistValue(item as ChecklistValue))
        .filter((item) => Boolean(item))
    : [];

  const departmentIdsSet = new Set<string>();
  if (departmentId) {
    departmentIdsSet.add(departmentId);
  }

  if (!management) {
    toolsChecklist.forEach((id) => {
      if (id) {
        departmentIdsSet.add(id);
      }
    });
  }

  const departmentIds = Array.from(departmentIdsSet);

  const name = providedName || baseName || code || fileName;
  const normalizedExtension = normalizeExtension(
    extension || fileExtension || "",
  );

  return {
    name,
    code,
    description,
    document_type_id: documentTypeId,
    department_id: departmentIds,
    management,
    route,
    extension: normalizedExtension,
  };
};

const useDocumentRegistry = (documentId?: string) => {
  const submitRef = useRef<(() => void | Promise<void>) | null>(null);
  const { firebasestorage } = useFirebase();
  const [formValid, setFormValid] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadedRoute, setUploadedRoute] = useState("");
  const [uploadedExtension, setUploadedExtension] = useState("");
  const [uploadedFileLabel, setUploadedFileLabel] = useState("");
  const lastUploadedFileRef = useRef<File | null>(null);

  const { usePrincipalLoading, usePrincipalAlert } = usePrincipal();
  const { withLoading } = usePrincipalLoading;
  const { showAlert, hideAlert } = usePrincipalAlert;

  const formReady = formValid && !uploadingFile;

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

  const { documents, fetchDocuments } = useDocumentsStore((state) => ({
    documents: state.documents,
    fetchDocuments: state.fetchDocuments,
  }));

  useEffect(() => {
    void fetchDocumentTypes();
  }, [fetchDocumentTypes]);

  useEffect(() => {
    void fetchDepartments();
  }, [fetchDepartments]);

  useEffect(() => {
    if (!documentId) return;

    const documentExists = documents.some(
      (document) => document.document_id === documentId,
    );

    if (documentExists) return;

    void fetchDocuments(true);
  }, [documentId, documents, fetchDocuments]);

  const documentTypeOptions = useMemo(
    () => mapDocumentTypesToOptions(activeDocumentTypes),
    [activeDocumentTypes],
  );

  const destinationAreaOptions = useMemo(() => {
    const uniqueDepartments = new Map<string, { label: string; value: string }>();

    departments.forEach((department) => {
      const rawId = department?.department_id;
      const rawName = department?.name;

      if (typeof rawId !== "string" || typeof rawName !== "string") {
        return;
      }

      const departmentId = rawId.trim();
      const departmentName = rawName.trim();

      if (!departmentId || !departmentName || uniqueDepartments.has(departmentId)) {
        return;
      }

      uniqueDepartments.set(departmentId, {
        label: departmentName,
        value: departmentId,
      });
    });

    return Array.from(uniqueDepartments.values()).sort((a, b) =>
      a.label.localeCompare(b.label, "es", { sensitivity: "base" }),
    );
  }, [departments]);

  const existingDocument = useMemo(() => {
    if (!documentId) return undefined;

    return documents.find((document) => document.document_id === documentId);
  }, [documentId, documents]);

  useEffect(() => {
    if (!existingDocument) {
      setUploadedRoute("");
      setUploadedExtension("");
      setUploadedFileLabel("");
      return;
    }

    setUploadedRoute(existingDocument.route ?? "");
    setUploadedExtension(existingDocument.extension ?? "");
    setUploadedFileLabel(existingDocument.name ?? existingDocument.code ?? "");
  }, [existingDocument]);

  const uploadDocumentFile = useCallback(
    async (file: File, values: Record<string, unknown>) => {
      if (!firebasestorage?.uploadFile) {
        throw new Error("Firebase Storage no disponible");
      }

      const rawExtension = getFileExtension(file.name) || "dat";
      const resolvedExtension = normalizeExtension(rawExtension) || "dat";
      const code = safeString(values.documentKey).trim();
      const baseNameFromFile = getFileBaseName(file.name);
      const storageBase =
        sanitizeStorageKey(code) || sanitizeStorageKey(baseNameFromFile) || "documento";
      const storageKey = `${DOCUMENTS_STORAGE_PREFIX}${storageBase}.${resolvedExtension}`;

      const url = await firebasestorage.uploadFile(file, storageKey);
      return {
        url,
        extension: resolvedExtension,
      };
    },
    [firebasestorage],
  );

  const handleValuesChange = useCallback(
    async (values: Record<string, unknown>) => {
      const file = extractFile(values.documentFile);

      if (!file) {
        lastUploadedFileRef.current = null;
        if (!existingDocument) {
          setUploadedRoute("");
          setUploadedExtension("");
          setUploadedFileLabel("");
        }
        return;
      }

      if (lastUploadedFileRef.current === file && uploadedRoute) {
        return;
      }

      setUploadingFile(true);
      try {
        const { url, extension } = await uploadDocumentFile(file, values);
        lastUploadedFileRef.current = file;
        setUploadedRoute(url);
        setUploadedExtension(extension);
        setUploadedFileLabel(file.name);
      } catch (error) {
        console.error("[document-registry] Error uploading file", error);
        lastUploadedFileRef.current = null;
        if (!existingDocument) {
          setUploadedRoute("");
          setUploadedExtension("");
          setUploadedFileLabel("");
        }
      } finally {
        setUploadingFile(false);
      }
    },
    [existingDocument, uploadDocumentFile, uploadedRoute],
  );

  const fields = useMemo(() => {
    const baseFields = createDocumentRegistryFields(
      documentTypeOptions,
      documentTypesLoading,
      destinationAreaOptions,
      destinationAreasLoading,
      destinationAreaOptions,
      uploadedRoute,
      uploadedFileLabel,
    );

    return mapDocumentToFieldValues(baseFields, existingDocument);
  }, [
    destinationAreaOptions,
    destinationAreasLoading,
    documentTypeOptions,
    documentTypesLoading,
    existingDocument,
    uploadedRoute,
    uploadedFileLabel,
  ]);

  const handleSubmit = useCallback(
    async (values: Record<string, unknown>) => {
      const post = pPost(requireGateway("post"), [200, 201]);

      try {
        await withLoading(
          async () => {
            const file = extractFile(values.documentFile);
            let route = uploadedRoute || existingDocument?.route || "";
            let extension = uploadedExtension;

            if (!route && file) {
              const uploadResult = await uploadDocumentFile(file, values);
              route = uploadResult.url;
              extension = uploadResult.extension;
              setUploadedRoute(route);
              setUploadedExtension(extension);
              setUploadedFileLabel(file.name);
              lastUploadedFileRef.current = file;
            }

            if (!route) {
              throw new Error(
                "No se pudo obtener la ruta del archivo a registrar. Verifica la carga en Firebase.",
              );
            }

            if (!extension) {
              const fallbackExtension = file
                ? getFileExtension(file.name)
                : existingDocument?.extension ?? "";
              extension = normalizeExtension(fallbackExtension || "");
            }

            const payload = buildDocumentPayload(values, route, extension);
            await post(DocumentsUrl, payload);
          },
          { message: "Registrando documento…" },
        );

        showAlert({
          type: "success",
          variant: "filled",
          title: "Documento registrado",
          description: "El documento se registró correctamente.",
          autoCloseMs: 2000,
          showPrimaryButton: false,
          showSecondaryButton: false,
        });
      } catch (error) {
        const normalized = normalizeApiError(error);

        showAlert({
          type: "error",
          variant: "filled",
          title: "No se pudo registrar el documento",
          description:
            normalized.message || "Ocurrió un error. Intenta de nuevo.",
          showPrimaryButton: true,
          primaryLabel: "Entendido",
          onPrimaryClick: () => {
            hideAlert();
          },
          showSecondaryButton: true,
          secondaryLabel: "Reintentar",
          onSecondaryClick: () => {
            hideAlert();
            submitRef.current?.();
          },
        });
      }
    },
    [
      withLoading,
      showAlert,
      hideAlert,
      uploadedRoute,
      uploadedExtension,
      uploadDocumentFile,
      existingDocument,
    ],
  );

  return {
    title: documentId ? "Edición de Documento" : "Registro de Documentos",
    submitLabel: documentId ? "Guardar Cambios" : "Registrar Documento",
    submitRef,
    formReady,
    setFormReady: setFormValid,
    fields,
    responsiveLayoutMatrix,
    handleSubmit,
    handleValuesChange,
    uploadingFile,
    checklistDefinitions: {
      areas: {
        title: "Seleccione las áreas a las que aplica",
        options: destinationAreaOptions.map((option) => ({ ...option })),
      },
    },
  };
};

export default useDocumentRegistry;

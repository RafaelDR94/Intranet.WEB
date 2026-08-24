"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type {
  FieldModel,
  ResponsiveLayoutMatrix,
} from "@/app/components/DynamicForm/types";
import type { CheckBoxListOptionGroup } from "@/app/components/CheckBoxList/types";
import { Documents as DocumentsUrl } from "@/app/configurations/Axios/urls";
import { useFirebase } from "@/app/context/FirebaseContext/FirebaseContext";
import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";
import { mapDocumentTypesToOptions } from "@/app/mappings/documents/documents.mapper";
import type {
  DocumentPostPayload,
  ManagementDocument,
} from "@/app/mappings/documents/documents.types";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pPost, pPut } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";
import { useDepartmentsStore } from "@/app/stores/useDepartmentsStore/useDepartmentsStore";
import { useDocumentTypesStore } from "@/app/stores/useDocumentTypesStore/useDocumentTypesStore";
import { useDocumentsStore } from "@/app/stores/useDocumentsStore/useDocumentsStore";
import { useIsMobile } from "@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery";
import type { DepartmentType } from "@/app/mappings/department/department.types";

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

type DepartmentOption = {
  label: string;
  value: string;
  enterpriseName: string;
};

const getDepartmentEnterpriseName = (department: DepartmentType): string => {
  const directEnterpriseName = department.enterprice_name?.trim();
  if (directEnterpriseName) return directEnterpriseName;

  const relatedEnterpriseName = department.enterprises
    ?.map((enterprise) => enterprise.name.trim())
    .find(Boolean);

  return relatedEnterpriseName || "Sin empresa";
};

const mapDepartmentsToOptions = (
  departments: DepartmentType[],
): DepartmentOption[] => {
  const uniqueDepartments = new Map<string, DepartmentOption>();

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
      enterpriseName: getDepartmentEnterpriseName(department),
    });
  });

  return Array.from(uniqueDepartments.values()).sort((a, b) =>
    a.label.localeCompare(b.label, "es", { sensitivity: "base" }),
  );
};

const groupDepartmentOptionsByEnterprise = (
  options: DepartmentOption[],
): CheckBoxListOptionGroup[] => {
  const groups = new Map<string, { label: string; value: string }[]>();

  options.forEach(({ enterpriseName, label, value }) => {
    const groupOptions = groups.get(enterpriseName) ?? [];
    groupOptions.push({ label, value });
    groups.set(enterpriseName, groupOptions);
  });

  return Array.from(groups.entries())
    .map(([label, groupOptions]) => ({
      label,
      options: groupOptions.sort((a, b) =>
        a.label.localeCompare(b.label, "es", { sensitivity: "base" }),
      ),
    }))
    .sort((a, b) =>
      a.label.localeCompare(b.label, "es", { sensitivity: "base" }),
    );
};

const createDocumentRegistryFields = (
  documentTypeOptions: { label: string; value: string }[],
  documentTypesLoading: boolean,
  destinationAreaOptions: { label: string; value: string }[],
  destinationAreasLoading: boolean,
  areasChecklistOptions: { label: string; value: string }[],
  areaChecklistGroups: CheckBoxListOptionGroup[],
  documentRoute: string,
  documentFileLabel: string,
  isMobile: boolean,
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
    validations: documentRoute ? undefined : [{ type: "required" }],
    initialFile: documentRoute
      ? {
          name: documentFileLabel || "Documento cargado",
          url: documentRoute,
        }
      : undefined,
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
      columns: isMobile ? 2 : 4,
      optionGroups: areaChecklistGroups,
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
  const ignoredFileRef = useRef<File | null>(null);
  const ignoreNextFileRef = useRef(false);
  const [formVersion, setFormVersion] = useState(0);
  const isMobile = useIsMobile();
  const [shouldPrefillFromDocument, setShouldPrefillFromDocument] = useState(
    () => Boolean(documentId),
  );

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

  const departmentOptions = useMemo(
    () => mapDepartmentsToOptions(departments),
    [departments],
  );

  const destinationAreaOptions = useMemo(
    () =>
      departmentOptions.map(({ label, value }) => ({
        label,
        value,
      })),
    [departmentOptions],
  );

  const areaChecklistGroups = useMemo(
    () => groupDepartmentOptionsByEnterprise(departmentOptions),
    [departmentOptions],
  );

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

  useEffect(() => {
    setShouldPrefillFromDocument(Boolean(documentId));
  }, [documentId]);

  const resetFormState = useCallback(
    (nextState?: { route?: string; extension?: string; label?: string }) => {
      if (lastUploadedFileRef.current) {
        ignoredFileRef.current = lastUploadedFileRef.current;
        ignoreNextFileRef.current = true;
      } else {
        ignoredFileRef.current = null;
        ignoreNextFileRef.current = false;
      }
      lastUploadedFileRef.current = null;

      const resolvedRoute =
        nextState?.route ?? existingDocument?.route ?? "";
      const resolvedExtension =
        nextState?.extension ?? existingDocument?.extension ?? "";
      const resolvedLabel =
        nextState?.label ??
        existingDocument?.name ??
        existingDocument?.code ??
        "";

      setUploadedRoute(resolvedRoute);
      setUploadedExtension(resolvedExtension);
      setUploadedFileLabel(resolvedLabel);
      setFormValid(false);
      setFormVersion((prev) => prev + 1);
      setShouldPrefillFromDocument(false);
    },
    [existingDocument, setShouldPrefillFromDocument],
  );

const createTimestampedStorageKey = (
  base: string,
  extension: string,
): string => {
  const isoTimestamp = new Date().toISOString();
  const normalizedTimestamp = isoTimestamp
    .replace(/[-:.TZ]/g, "")
    .trim();
  const suffix = normalizedTimestamp ? `_${normalizedTimestamp}` : "";

  return `${DOCUMENTS_STORAGE_PREFIX}${base}${suffix}.${extension}`;
};

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
    const storageKey = createTimestampedStorageKey(storageBase, resolvedExtension);

    const url = await firebasestorage.uploadFile(file, storageKey, true);
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

      if (ignoreNextFileRef.current && ignoredFileRef.current === file) {
        ignoreNextFileRef.current = false;
        ignoredFileRef.current = null;
        return;
      }

      ignoreNextFileRef.current = false;
      ignoredFileRef.current = null;

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
    const documentRouteForField = shouldPrefillFromDocument
      ? uploadedRoute
      : "";
    const documentLabelForField = shouldPrefillFromDocument
      ? uploadedFileLabel
      : "";

    const baseFields = createDocumentRegistryFields(
      documentTypeOptions,
      documentTypesLoading,
      destinationAreaOptions,
      destinationAreasLoading,
      destinationAreaOptions,
      areaChecklistGroups,
      documentRouteForField,
      documentLabelForField,
      isMobile,
    );

    return mapDocumentToFieldValues(
      baseFields,
      shouldPrefillFromDocument ? existingDocument : undefined,
    );
  }, [
    destinationAreaOptions,
    areaChecklistGroups,
    destinationAreasLoading,
    documentTypeOptions,
    documentTypesLoading,
    existingDocument,
    isMobile,
    shouldPrefillFromDocument,
    uploadedFileLabel,
    uploadedRoute,
  ]);

  const handleSubmit = useCallback(
    async (values: Record<string, unknown>) => {
      const post = pPost(requireGateway("post"), [200, 201]);
      const put = pPut(requireGateway("put"), [200, 204]);
      const isEditing = Boolean(documentId ?? existingDocument?.document_id);
      const targetId = existingDocument?.document_id ?? documentId ?? "";
      const loadingMessage = isEditing
        ? "Actualizando documento…"
        : "Registrando documento…";
      const successTitle = isEditing
        ? "Documento actualizado"
        : "Documento registrado";
      const successDescription = isEditing
        ? "Los cambios se guardaron correctamente."
        : "El documento se registró correctamente.";
      const errorTitle = isEditing
        ? "No se pudo actualizar el documento"
        : "No se pudo registrar el documento";

      let resolvedRoute = "";
      let resolvedExtension = "";
      let resolvedFileLabel = "";

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

            resolvedRoute = route;
            resolvedExtension = extension;
            resolvedFileLabel =
              file?.name ||
              payload.name ||
              existingDocument?.name ||
              existingDocument?.code ||
              "";

            if (isEditing && targetId) {
              const url = `${DocumentsUrl}`;
              await put(url, {...payload, document_id: targetId});
            } else {
              await post(DocumentsUrl, payload);
            }
          },
          { message: loadingMessage },
        );

        resetFormState(
          isEditing
            ? {
                route: resolvedRoute,
                extension: resolvedExtension,
                label: resolvedFileLabel,
              }
            : undefined,
        );
        void fetchDocuments(true);

        showAlert({
          type: "success",
          variant: "filled",
          title: successTitle,
          description: successDescription,
          autoCloseMs: 2000,
          showPrimaryButton: false,
          showSecondaryButton: false,
        });
      } catch (error) {
        const normalized = normalizeApiError(error);

        showAlert({
          type: "error",
          variant: "filled",
          title: errorTitle,
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
      documentId,
      resetFormState,
      fetchDocuments,
    ],
  );

  return {
    title: documentId ? "Edición de Documento" : "Aqui puedes hacer el registro de documentos que necesites",
    submitLabel: documentId ? "Guardar Cambios" : "Registrar Documento",
    submitRef,
    formReady,
    uploadedRoute,
    formVersion,
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
        groups: areaChecklistGroups.map((group) => ({
          label: group.label,
          options: group.options.map((option) => ({ ...option })),
        })),
      },
    },
  };
};

export default useDocumentRegistry;

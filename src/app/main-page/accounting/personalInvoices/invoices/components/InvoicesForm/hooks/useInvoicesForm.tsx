import { useMemo, useRef } from "react";
import { shallow } from "zustand/shallow";

import { useInvoices } from "../../../context/InvoicesContext";
import useInitInvoicesForms from "../../../hooks/useInitInvoicesForms";
import { createInvoiceFields } from "../../../utilities/InitialFields";

import { UseInvoicesFormReturn, UseInvoicesFormProps } from "./types";
import type { InvoiceSubmitResult } from "../../types";

import { FieldModel } from "@/app/components/DynamicForm/types";
import { useFirebase } from "@/app/context/FirebaseContext/FirebaseContext";
import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";
import type {
  BillingDocumentsPost,
  BillingDocumentsPut,
} from "@/app/mappings/billingdocuments/billingdocuments.types";
import { useBillingDocumentsStore } from "@/app/stores/useBillingDocumentsStore/useBillingDocumentsStore";
import { useBillingHistoryStore } from "@/app/stores/useBillingHistoryStore/useBillingHistoryStore";
import { useBillingAllDocumentsByEmployeeStore } from "@/app/stores/useBillingAllDocumentsByEmployeeStore/useBillingAllDocumentsByEmployeeStore";
import { useBillingImagesStore } from "@/app/stores/useBillingImagesStore/useBillingImagesStore";
import { useFormFieldsStore } from "@/app/stores/useFormFieldsStore/useFormFieldsStore";

const useInvoicesForm = ({
  dataEdit,
  withoutName,
  formId,
  billingImages,
  onCloseImage,
  disabled,
  refreshRequisitionId,
}: UseInvoicesFormProps): UseInvoicesFormReturn => {
  const isEdit = Boolean(dataEdit);
  const { firebasestorage } = useFirebase();
  const latestValuesRef = useRef<Record<string, any> | null>(null);

  const buildDocumentStoragePath = (
    requisition: string,
    extension: "xml" | "pdf",
  ) => {
    const safeRequisition = requisition.trim() || "no-requisition";
    return `Billings/BillingDocuments/${safeRequisition}-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}.${extension}`;
  };

  const getDisplayNameFromUrl = (url: string | undefined, fallback: string) => {
    if (!url) return fallback;
    try {
      const parsed = new URL(url);
      const path = parsed.pathname ?? "";
      const afterO = path.includes("/o/") ? path.split("/o/")[1] : path;
      const decoded = decodeURIComponent(afterO);
      const last = decoded.split("/").pop();
      return (last && last.trim()) || fallback;
    } catch {
      return fallback;
    }
  };

  const { createBillingDocument, updateBillingDocument, resetFlags } =
    useBillingDocumentsStore(
      (s) => ({
        createBillingDocument: s.createBillingDocument,
        updateBillingDocument: s.updateBillingDocument,
        resetFlags: s.resetFlags,
      }),
      shallow,
    );

  const { forceFetchBillingHistory } = useBillingHistoryStore(
    (s) => ({
      forceFetchBillingHistory: s.forceFetchBillingHistory,
    }),
    shallow,
  );

  const { fetchBillingAllDocumentsByEmployee } =
    useBillingAllDocumentsByEmployeeStore(
      (s) => ({
        fetchBillingAllDocumentsByEmployee:
          s.fetchBillingAllDocumentsByEmployee,
      }),
      shallow,
    );

  const initialformFields: FieldModel[] = useMemo(() => {
    if (isEdit || withoutName) {
      return [
        {
          type: "input",
          name: "personName",
          label: "Nombre",
          placeholder: "Nombre del colaborador",
          value: "",
          className: "max-w-[400px]",
          onlyText: true,
          showIf: () => Boolean(!dataEdit),
        },
        {
          type: "input",
          name: "proyect",
          label: "Proyecto",
          placeholder: "Proyecto",
          value: "",
          className: "max-w-[400px]",
          onlyText: true,
          showIf: () => Boolean(!dataEdit),
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
            const field = all.find((x) => x.name === "requisition");
            return (
              Array.isArray(field?.options) && (field.options?.length ?? 0) > 0
            );
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
            const field = all.find((x) => x.name === "category");
            return (
              Array.isArray(field?.options) && (field.options?.length ?? 0) > 0
            );
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
            const field = all.find((x) => x.name === "description");
            return (
              Array.isArray(field?.options) && (field.options?.length ?? 0) > 0
            );
          },
          validations: [{ type: "required" }],
        },
        {
          type: "numberControl",
          name: "numnights",
          label: "No. de Noches",
          value: dataEdit?.numnights ?? 0,
          className: "max-w-[220px]",
          validations: [{ type: "required" }],
        },
        {
          type: "numberControl",
          name: "numpersons",
          label: "No. de Personas",
          value: dataEdit?.numpersons ?? 0,
          className: "max-w-[220px]",
          validations: [{ type: "required" }],
        },
        {
          type: "file",
          name: "xml",
          label: "Sube aquí el archivo xml",
          placeholder: "Seleccionar documento",
          value: null,
          initialFile: dataEdit?.xml
            ? { name: getDisplayNameFromUrl(dataEdit.xml, "XML cargado") }
            : undefined,
          accept: ".xml",
          className: "w-full md:w-[200px] px-3 py-1.5 text-btn-sm",
          validations: [{ type: "required" }],
        },
        {
          type: "file",
          name: "pdf",
          label: "Sube aquí el archivo pdf",
          placeholder: "Seleccionar documento",
          value: null,
          initialFile: dataEdit?.pdf
            ? { name: getDisplayNameFromUrl(dataEdit.pdf, "PDF cargado") }
            : undefined,
          accept: ".pdf",
          className: "w-full md:w-[200px] px-3 py-1.5 text-btn-sm",
          validations: [{ type: "required" }],
        },
      ];
    }

    return createInvoiceFields();
  }, [dataEdit, isEdit, withoutName]);

  const { formId1, targetEmployeeId } = useInvoices();
  const effectiveFormId = formId ?? formId1;
  const EMPTY_ARRAY: FieldModel[] = [];
  const fields = useFormFieldsStore(
    (state) => state.fieldsByFormId[effectiveFormId] ?? EMPTY_ARRAY,
  );
  const formVersion = useFormFieldsStore(
    (state) => state.formVersionsByFormId?.[effectiveFormId] ?? 0,
  );
  const { fetchBillingImages } = useBillingImagesStore(
    (s) => ({
      fetchBillingImages: s.fetchBillingImages,
    }),
    shallow,
  );
  const { loadingFormInfo, submitRef, formReady, setFormReady, ResetForm } =
    useInitInvoicesForms({
      initialformFields,
      field: fields,
      formId: effectiveFormId,
      dataEdit,
      billingImages,
    });

  const { usePrincipalLoading, usePrincipalAlert, usePrincipalImage } =
    usePrincipal();
  const { showSpinner, hideSpinner } = usePrincipalLoading;
  const { showAlert, hideAlert } = usePrincipalAlert;
  const { showImage } = usePrincipalImage;

  const asBlobLike = (value: unknown): Blob | null => {
    if (!value || typeof value !== "object") return null;
    const candidate = value as Blob & { size?: number; slice?: Blob["slice"] };
    if (typeof candidate.size !== "number") return null;
    if (typeof candidate.slice !== "function") return null;
    return candidate;
  };

  const readHeadText = async (blob: Blob, bytes: number) => {
    const slice = blob.slice(0, bytes) as Blob & {
      text?: () => Promise<string>;
      arrayBuffer?: () => Promise<ArrayBuffer>;
    };
    if (typeof slice.text === "function") return slice.text();
    if (typeof slice.arrayBuffer !== "function") return "";
    const buffer = await slice.arrayBuffer();
    return new TextDecoder().decode(buffer);
  };

  const uploadXmlIfNeeded = async (
    file: unknown,
    requisition: string,
  ): Promise<string> => {
    const maybeFile = asBlobLike(file);

    if (maybeFile) {
      if (maybeFile.size === 0) {
        throw new Error(
          "El archivo XML se detectó como vacío (0 bytes). Vuelve a seleccionarlo e intenta de nuevo.",
        );
      }

      const head = String(await readHeadText(maybeFile, 256)).trim();
      if (head && !head.startsWith("<")) {
        throw new Error(
          "El archivo seleccionado no parece ser un XML válido.",
        );
      }
      const url = await firebasestorage.uploadFile(
        maybeFile,
        buildDocumentStoragePath(requisition, "xml"),
      );
      if (!url) throw new Error("Hubo un problema al subir el XML");
      return url;
    }

    const urlObj = (file as { url?: string } | null | undefined)?.url;
    if (urlObj) return urlObj;
    if (isEdit && dataEdit?.xml) return dataEdit.xml;
    throw new Error("No se encontró XML válido para continuar");
  };

  const uploadPdfIfNeeded = async (
    file: unknown,
    requisition: string,
  ): Promise<string> => {
    const maybeFile = asBlobLike(file);

    if (maybeFile) {
      if (maybeFile.size === 0) {
        throw new Error(
          "El archivo PDF se detectó como vacío (0 bytes). Vuelve a seleccionarlo e intenta de nuevo.",
        );
      }
      const url = await firebasestorage.uploadFile(
        maybeFile,
        buildDocumentStoragePath(requisition, "pdf"),
      );
      if (!url) throw new Error("Hubo un problema al subir el PDF");
      return url;
    }

    const urlObj = (file as { url?: string } | null | undefined)?.url;
    if (urlObj) return urlObj;
    if (isEdit && dataEdit?.pdf) return dataEdit.pdf;
    throw new Error("No se encontró PDF válido para continuar");
  };

  const refreshRelatedData = async () => {
    if (isEdit && targetEmployeeId) {
      forceFetchBillingHistory(targetEmployeeId);
    }
    if (targetEmployeeId) {
      fetchBillingImages(targetEmployeeId, true);
      fetchBillingAllDocumentsByEmployee(targetEmployeeId, true);
    }
  };

  const submitInvoiceValues = async (
    formValues: Record<string, any> | null | undefined,
  ): Promise<InvoiceSubmitResult> => {
    if (!formValues) {
      return {
        ok: false,
        error: "No se encontraron datos de la factura para enviar.",
      };
    }

    try {
      const xmlUrl = await uploadXmlIfNeeded(
        formValues.xml,
        formValues.requisition,
      );
      const pdfUrl = await uploadPdfIfNeeded(
        formValues.pdf,
        formValues.requisition,
      );

      if (isEdit && dataEdit) {
        const payload: BillingDocumentsPut = {
          billingdocument_id: dataEdit.billingdocument_id,
          requisition_id: formValues.requisition,
          billingimages_id: dataEdit.billing_image_id || null,
          xml: xmlUrl,
          pdf: pdfUrl,
          comments: dataEdit.comments,
          description_id: formValues.description,
          category_id: formValues.category,
          numnights: formValues.numnights,
          numpersons: formValues.numpersons,
          user_comments: "",
        };
        const updated = await updateBillingDocument(
          payload,
          refreshRequisitionId,
        );
        const updateError = useBillingDocumentsStore.getState().error;
        resetFlags();
        if (!updated) {
          return {
            ok: false,
            error: updateError ?? "No se pudo actualizar la factura.",
          };
        }
      } else {
        const payload: BillingDocumentsPost = {
          requisition_id: formValues.requisition,
          billingimages_id: billingImages?.billing_image_id || null,
          xml: xmlUrl,
          pdf: pdfUrl,
          description_id: formValues.description,
          category_id: formValues.category,
          numnights: formValues.numnights,
          numpersons: formValues.numpersons,
        };
        const created = await createBillingDocument(payload);
        resetFlags();
        if (!created) {
          return {
            ok: false,
            error: "No se pudo enviar la factura.",
          };
        }
      }

      onCloseImage?.();
      await refreshRelatedData();
      return { ok: true };
    } catch (err) {
      return {
        ok: false,
        error:
          (err instanceof Error ? err.message : String(err)) ||
          "Ocurrió un error al subir los archivos. Intenta de nuevo.",
      };
    }
  };

  const handleImageClick = (image: string) => {
    showImage({
      src: image,
      alt: "Ticket",
      showAction: false,
      disableOutsideClose: false,
    });
  };

  const handleValuesChange = (values: Record<string, any>) => {
    latestValuesRef.current = values;
  };

  const handleSubmit = async (values: Record<string, any>) => {
    latestValuesRef.current = values;
    showSpinner({
      message: isEdit ? "Actualizando factura..." : "Subiendo factura...",
    });

    const result = await submitInvoiceValues(values);
    hideSpinner();

    if (!result.ok) {
      showAlert({
        type: "error",
        variant: "filled",
        title: isEdit ? "No se pudo actualizar" : "No se pudo enviar",
        description: result.error,
        showPrimaryButton: true,
        primaryLabel: "Entendido",
        onPrimaryClick: hideAlert,
        showSecondaryButton: true,
        secondaryLabel: "Reintentar",
        onSecondaryClick: () => {
          hideAlert();
          submitRef.current?.();
        },
      });
      return;
    }

    if (!isEdit) {
      ResetForm();
    }

    showAlert({
      type: "success",
      variant: "filled",
      title: isEdit ? "Archivos cargados con éxito" : "Archivos cargados",
      description: "Tus archivos se han cargado exitosamente.",
      showPrimaryButton: false,
      showSecondaryButton: false,
      autoCloseMs: 1500,
    });
  };

  return {
    fields: disabled
      ? fields.map((field) => ({
          ...field,
          disabled: true,
        }))
      : fields,
    formVersion,
    loadingFormInfo,
    submitRef,
    formReady,
    setFormReady,
    handleSubmit,
    ResetForm,
    handleImageClick,
    handleValuesChange,
    submitCurrentValues: async () =>
      submitInvoiceValues(latestValuesRef.current),
  };
};

export default useInvoicesForm;

import { useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { shallow } from "zustand/shallow";

import { useInvoices } from "../../../context/InvoicesContext";
import useInitInvoicesForms from "../../../hooks/useInitInvoicesForms";
import { createInvoiceFields } from "../../../utilities/InitialFields";

import { UseInvoicesFormReturn, UseInvoicesFormProps } from "./types";

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

const useInvoicesForm = ({
  dataEdit,
  withoutName,
  billingImages,
  onCloseImage,
  disabled,
  refreshRequisitionId,
}: UseInvoicesFormProps): UseInvoicesFormReturn => {
  const isEdit = Boolean(dataEdit);
  const { firebasestorage } = useFirebase();

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

  const {
    creating,
    updating,
    error,
    successPost,
    successPut,
    createBillingDocument,
    updateBillingDocument,
    resetFlags,
  } = useBillingDocumentsStore(
    (s) => ({
      creating: s.creating,
      updating: s.updating,
      error: s.error,
      successPost: s.successPost,
      successPut: s.successPut,
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

  const { fetchBillingAllDocumentsByEmployee } = useBillingAllDocumentsByEmployeeStore(
    (s) => ({
      fetchBillingAllDocumentsByEmployee: s.fetchBillingAllDocumentsByEmployee,
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

  const { field1, formId1, user } = useInvoices();
  const searchParams = useSearchParams();
  const employeeIdParam = searchParams.get("idEmployee") ?? undefined;
  const { fetchBillingImages } = useBillingImagesStore(
    (s) => ({
      fetchBillingImages: s.fetchBillingImages,
    }),
    shallow,
  );
  const { loadingFormInfo, submitRef, formReady, setFormReady, ResetForm } =
    useInitInvoicesForms({
      initialformFields,
      field: field1,
      formId: formId1,
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
    const candidate = value as any;
    if (typeof candidate.size !== "number") return null;
    if (typeof candidate.slice !== "function") return null;
    return candidate as Blob;
  };

  const readHeadText = async (blob: Blob, bytes: number) => {
    const slice = blob.slice(0, bytes) as any;
    if (typeof slice.text === "function") return await slice.text();
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
      if ("size" in maybeFile && maybeFile.size === 0) {
        throw new Error(
          "El archivo XML se detectÃ³ como vacÃ­o (0 bytes). Vuelve a seleccionarlo e intenta de nuevo.",
        );
      }

      // ValidaciÃ³n ligera: evitar subir texto vacÃ­o o no-XML
      const head = String(await readHeadText(maybeFile, 256)).trim();
      if (head && !head.startsWith("<")) {
        throw new Error("El archivo seleccionado no parece ser un XML vÃ¡lido.");
      }
      const url = await firebasestorage.uploadFile(
        maybeFile,
        `Billings/BillingDocuments/${requisition}.xml`,
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
      if ("size" in maybeFile && maybeFile.size === 0) {
        throw new Error(
          "El archivo PDF se detectÃ³ como vacÃ­o (0 bytes). Vuelve a seleccionarlo e intenta de nuevo.",
        );
      }
      const url = await firebasestorage.uploadFile(
        maybeFile,
        `Billings/BillingDocuments/${requisition}.pdf`,
      );
      if (!url) throw new Error("Hubo un problema al subir el PDF");
      return url;
    }
    const urlObj = (file as { url?: string } | null | undefined)?.url;
    if (urlObj) return urlObj;
    if (isEdit && dataEdit?.pdf) return dataEdit.pdf;
    throw new Error("No se encontró PDF válido para continuar");
  };

  const handleImageClick = (image: string) => {
    showImage({
      src: image,
      alt: "Ticket",
      showAction: false,
      disableOutsideClose: false, // si quieres obligar a usar los botones, ponlo en true
    });
  };

  const handleSubmit = async (values: Record<string, any>) => {
    showSpinner({
      message: isEdit ? "Actualizando factura..." : "Subiendo factura...",
    });
    try {
      const xmlUrl = await uploadXmlIfNeeded(values.xml, values.requisition);
      const pdfUrl = await uploadPdfIfNeeded(values.pdf, values.requisition);

      if (isEdit && dataEdit) {
        const payload: BillingDocumentsPut = {
          billingdocument_id: dataEdit?.billingdocument_id,
          requisition_id: values?.requisition,
          billingimages_id: dataEdit?.billing_image_id || null,
          xml: xmlUrl,
          pdf: pdfUrl,
          comments: dataEdit?.comments,
          description_id: values?.description,
          category_id: values?.category,
          numnights: values?.numnights,
          numpersons: values?.numpersons,
          user_comments: "",
        };
        updateBillingDocument(payload, refreshRequisitionId);
      } else {
        const payload: BillingDocumentsPost = {
          requisition_id: values.requisition,
          billingimages_id: billingImages?.billing_image_id || null,
          xml: xmlUrl,
          pdf: pdfUrl,
          description_id: values?.description,
          category_id: values?.category,
          numnights: values?.numnights,
          numpersons: values?.numpersons,
        };
        createBillingDocument(payload);
      }
    } catch (err) {
      hideSpinner();
      showAlert({
        type: "error",
        variant: "filled",
        title: isEdit ? "No se pudo actualizar" : "No se pudo enviar",
        description:
          String(err) ||
          "Ocurrió un error al subir los archivos. Intenta de nuevo.",
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
    }
  };

  useEffect(() => {
    if (creating || updating) return;
    hideSpinner();
    const hadError = Boolean(error);
    const postOk = Boolean(successPost);
    const putOk = Boolean(successPut);

    resetFlags();

    if (hadError) {
      showAlert({
        type: "error",
        variant: "filled",
        title: isEdit ? "No se pudo actualizar" : "No se pudo enviar",
        description:
          error ?? "Ocurrió un error al subir los archivos. Intenta de nuevo.",
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
    } else if (postOk || putOk) {
      onCloseImage?.();
      if (postOk) ResetForm();
      if (putOk && user) forceFetchBillingHistory(user?.idEmployee);
      const employeeId = employeeIdParam ?? user?.idEmployee;
      if (employeeId) {
        fetchBillingImages(employeeId, true);
        fetchBillingAllDocumentsByEmployee(employeeId, true);
      }
      showAlert({
        type: "success",
        variant: "filled",
        title: isEdit
          ? "Archivos cargados con éxito"
          : "Archivos cargados",
        description: isEdit
          ? "Tus archivos se han cargado exitosamente."
          : "Tus archivos se han cargado exitosamente.",
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1500,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    creating,
    updating,
    error,
    successPost,
    successPut,
    submitRef,
    isEdit,
    user,
    employeeIdParam,
    fetchBillingImages,
    fetchBillingAllDocumentsByEmployee,
  ]);

  const resolvedFields = useMemo(
    () =>
      disabled
        ? field1.map((field) => ({ ...field, disabled: true }))
        : field1,
    [disabled, field1],
  );

  return {
    fields: resolvedFields,
    loadingFormInfo,
    submitRef,
    formReady,
    setFormReady,
    handleSubmit,
    ResetForm,
    handleImageClick,
  };
};

export default useInvoicesForm;

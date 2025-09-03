import { useEffect, useMemo } from "react";
import { shallow } from "zustand/shallow";
import { FieldModel } from "@/app/components/DynamicForm/types";
import { useFirebase } from "@/app/context/FirebaseContext/FirebaseContext";
import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";
import { useInvoices } from "../../../context/InvoicesContext";
import useInitInvoicesForms from "../../../hooks/useInitInvoicesForms";
import { useBillingDocumentsStore } from "@/app/stores/useBillingDocumentsStore/useBillingDocumentsStore";
import type {
  BillingDocumentsPost,
  BillingDocumentsPut,
} from "@/app/mappings/billingdocuments/billingdocuments.types";
import { UseInvoicesFormReturn, UseInvoicesFormProps } from "./types";
import { useBillingHistoryStore } from "@/app/stores/useBillingHistoryStore/useBillingHistoryStore";

const useInvoicesForm = ({
  dataEdit,
  withoutName,
  billingImages,
  onCloseImage,
}: UseInvoicesFormProps): UseInvoicesFormReturn => {
  const isEdit = Boolean(dataEdit);
  const { firebasestorage } = useFirebase();

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
    shallow
  );

  const { forceFetchBillingHistory } = useBillingHistoryStore(
    (s) => ({
      forceFetchBillingHistory: s.forceFetchBillingHistory,
    }),
    shallow
  );





  const initialformFields: FieldModel[] = useMemo(() => {
    if (isEdit || withoutName) {
      return [

        {
          type: "input",
          name: "personName",
          label: "Nombre del Deudor",
          placeholder: "Ingrese el nombre completo",
          value: "",
          className: "max-w-[400px]",
          onlyText: true,
          showIf: () => Boolean(!dataEdit),
        },
        {
          type: "input",
          name: "proyect",
          label: "Proyecto",
          placeholder: "Ingrese el código del proyect",
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
          label: "Número de noches",
          value: dataEdit?.numnights ?? 0,
          className: "max-w-[300px]",
          validations: [{ type: "required" }],
        },
        {
          type: "numberControl",
          name: "numpersons",
          label: "Número de personas",
          value: dataEdit?.numpersons ?? 0,

          className: "max-w-[300px]",
          validations: [{ type: "required" }],
        },
        {
          type: "file",
          name: "xml",
          label: "Documento XML",
          value: { name: "Documento XML", url: dataEdit?.xml },
          initialFile: { name: dataEdit?.xml ?? "", url: dataEdit?.xml },
          accept: ".xml",
          className: "max-w-[300px]",
          validations: [{ type: "required" }],
        },
        {
          type: "file",
          name: "pdf",
          label: "Documento PDF",
          value: { name: "Documento PDF", url: dataEdit?.pdf },
          initialFile: { name: dataEdit?.pdf ?? "", url: dataEdit?.pdf },
          accept: ".pdf",
          className: "max-w-[300px]",
          validations: [{ type: "required" }],
        },


      ];
    }

    return [
      {
        type: "input",
        name: "debtorName",
        label: "Nombre del Deudor",
        placeholder: "Ingrese el nombre completo",
        value: "",
        className: "max-w-[400px]",
        onlyText: true,
        showIf: (value) => value.debtorName,
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
        placeholder: "Seleccione la categoría",
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
        placeholder: "Seleccione la descripción",
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
        value: "",
        accept: ".xml",
        validations: [{ type: "required" }],
        className: "max-w-[300px]",
      },
      {
        type: "file",
        name: "pdf",
        label: "Documento PDF",
        value: "",
        accept: ".pdf",
        validations: [{ type: "required" }],
        className: "max-w-[300px]",
      },
    ];
  }, [dataEdit, isEdit]);

  const { field1, formId1, user } = useInvoices();
  const { loadingFormInfo, submitRef, formReady, setFormReady, ResetForm } =
    useInitInvoicesForms({
      initialformFields,
      field: field1,
      formId: formId1,
      dataEdit,
      billingImages,
    });

  const { usePrincipalLoading, usePrincipalAlert, usePrincipalImage } = usePrincipal();
  const { showSpinner, hideSpinner } = usePrincipalLoading;
  const { showAlert, hideAlert } = usePrincipalAlert;
  const { showImage } = usePrincipalImage;

  const uploadXmlIfNeeded = async (
    file: File | null | undefined,
    requisition: string
  ): Promise<string> => {
    if (file) {
      const url = await firebasestorage.uploadFile(
        file,
        `Billings/BillingDocuments/${requisition}.xml`
      );
      if (!url) throw new Error("Hubo un problema al subir el XML");
      return url;
    }
    if (isEdit && dataEdit?.xml) return dataEdit.xml;
    throw new Error("No se encontró XML válido para continuar");
  };

  const uploadPdfIfNeeded = async (
    file: File | null | undefined,
    requisition: string
  ): Promise<string> => {
    if (file) {
      const url = await firebasestorage.uploadFile(
        file,
        `Billings/BillingDocuments/${requisition}.pdf`
      );
      if (!url) throw new Error("Hubo un problema al subir el PDF");
      return url;
    }
    if (isEdit && dataEdit?.pdf) return dataEdit.pdf;
    throw new Error("No se encontró PDF válido para continuar");
  };

  const handleImageClick = (image: string) => {
    showImage({
      src: image,
      alt: 'Ticket',
      showAction: false,
      disableOutsideClose: false, // si quieres obligar a usar los botones, ponlo en true
    });
  }

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
          user_comments: ""
        };
        updateBillingDocument(payload);
      } else {
        const payload: BillingDocumentsPost = {
          requisition_id: values.requisition,
          billingimages_id: billingImages?.billing_image_id || null,
          xml: xmlUrl,
          pdf: pdfUrl,
          description_id: values?.description,
          category_id: values?.category,
          numnights: values?.numnights,
          numpersons: values?.numpersons
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
          String(err) ??
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
      showAlert({
        type: "success",
        variant: "filled",
        title: isEdit
          ? "Factura actualizada con éxito"
          : "Factura subida con éxito",
        description: isEdit
          ? "Tu factura ha sido actualizada correctamente."
          : "Tu factura ha sido subida correctamente.",
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1500,
      });
    }
  }, [
    creating,
    updating,
    error,
    successPost,
    successPut,
    hideSpinner,
    showAlert,
    hideAlert,
    resetFlags,
    submitRef,
    isEdit,
  ]);

  return {
    fields: field1,
    loadingFormInfo,
    submitRef,
    formReady,
    setFormReady,
    handleSubmit,
    ResetForm,
    handleImageClick
  };
};

export default useInvoicesForm;

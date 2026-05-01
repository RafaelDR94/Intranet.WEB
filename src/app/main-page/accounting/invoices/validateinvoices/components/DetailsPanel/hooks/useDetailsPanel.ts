import { useEffect, useMemo, useRef, useState } from "react";
import { shallow } from "zustand/shallow";

import { UseDetailsPanelArgs } from "./types";

import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";
import { BillingDocumentsPutMap } from "@/app/mappings/billingdocuments/billingdocuments.mapper";
import type { BillingDocumentJsonSap } from "@/app/mappings/billingdocuments/billingdocuments.types";
import { useBillingDocumentsStore } from "@/app/stores/useBillingDocumentsStore/useBillingDocumentsStore";
import { useBillingCompleteProcessToSAPStore } from "@/app/stores/useBillingCompleteProcessToSAPStore/useBillingCompleteProcessToSAPStore";

type UpdateAction = "comment" | "json_sap" | null;

export const useDetailsPanel = ({
  selected,
  rejectType,
  setPanelOpen,
  operations,
  reqisition,
  documentLabel = "factura",
}: UseDetailsPanelArgs) => {
  const { usePrincipalAlert, usePrincipalLoading } = usePrincipal();
  const { showAlert } = usePrincipalAlert;
  const { showSpinner, hideSpinner } = usePrincipalLoading;

  const { sending } = useBillingCompleteProcessToSAPStore(
    (s) => ({
      sending: s.sending,
    }),
    shallow,
  );

  const {
    validateBillingDocument,
    validateBillingDocumentOperations,
    rejectBillingDocument,
    fetchExpenseTypeCatalog,
    expenseTypeCatalog,
    updateBillingDocument,
    updateBillingDocumentJsonSap,
    rejecting,
    validating,
    succesReject,
    succesValidate,
    updating,
    successPut,
    resetFlags,
    error,
  } = useBillingDocumentsStore(
    (s) => ({
      updateBillingDocument: s.updateBillingDocument,
      updateBillingDocumentJsonSap: s.updateBillingDocumentJsonSap,
      validateBillingDocument: s.validateBillingDocument,
      validateBillingDocumentOperations: s.validateBillingDocumentOperations,
      rejectBillingDocument: s.rejectBillingDocument,
      fetchExpenseTypeCatalog: s.fetchExpenseTypeCatalog,
      expenseTypeCatalog: s.expenseTypeCatalog,
      updating: s.updating,
      successPut: s.successPut,
      succesReject: s.succesReject,
      succesValidate: s.succesValidate,
      rejecting: s.rejecting,
      validating: s.validating,
      resetFlags: s.resetFlags,
      error: s.error,
    }),
    shallow,
  );

  const [openRejectInvoice, setOpenRejectInvoice] = useState(false);
  const [openValidInvoice, setOpenValidInvoice] = useState(false);
  const [currentUpdateAction, setCurrentUpdateAction] = useState<UpdateAction>(null);
  const selectedRef = useRef(selected);
  const latestJsonSapRef = useRef<BillingDocumentJsonSap | null>(
    selected?.json_sap ?? null,
  );
  const jsonSapUpdateQueueRef = useRef<Promise<void>>(Promise.resolve());

  const getShortName = (fullName?: string): string => {
    if (!fullName) return "";
    const parts = fullName.trim().split(" ").filter(Boolean);
    const [firstName, lastName] = parts;
    return `${firstName || ""} ${lastName || ""}`.trim();
  };

  const labels = useMemo(
    () => ({
      left: selected
        ? `Usuario: ${getShortName(selected?.requisition?.employeename)}`
        : undefined,
      secondLeft: selected ? `Tipo de gastos: 105` : undefined,
      childrenLabel: selected ? `Denom. Gto.: Analisis Clinico ` : undefined,
      secondRight: selected ? `Grupo IVA: A.16%` : undefined,
      right: selected
        ? `Codigo de solicitud: ${selected?.requisition?.projectname}`
        : undefined,
    }),
    [selected],
  );

  const handleSubmitComment = (values: Record<string, any>) => {
    setCurrentUpdateAction("comment");
    const payload = BillingDocumentsPutMap({
      billingdocument_id: selected?.billingdocument_id ?? "",
      requisition_id: selected?.requisition?.billingrequisition_id ?? "",
      billingimages_id: selected?.billingimages_id || null,
      xml: selected?.xml ?? "",
      pdf: selected?.pdf ?? "",
      comments: values.comments ?? "",
      description_id: selected?.description?.id_billingdescription || "",
      category_id: selected?.category?.id_billingcategory,
      numpersons: selected?.numpersons || "",
      numnights: selected?.numnights || "",
      bllingAcuses_id: selected?.billingAcuse?.id,
      user_comments: selected?.user_comments,
      forbidden_code: selected?.forbidden_code,
      sat_validation: selected?.sat_validation,
    });
    updateBillingDocument(payload, reqisition);
  };

  const handleUpdateJsonSapItem = async (
    jsonSapItemIndex: number,
    sapInternalKey: string,
    description?: string,
  ): Promise<boolean> => {
    let result = false;

    const queuedUpdate = jsonSapUpdateQueueRef.current.then(async () => {
      const currentSelected = selectedRef.current;
      const documentId = currentSelected?.billingdocument_id;
      const currentJsonSap = latestJsonSapRef.current ?? currentSelected?.json_sap;
      if (!documentId || !currentJsonSap || !Array.isArray(currentJsonSap.items)) {
        result = false;
        return;
      }

      const previousJsonSap = currentJsonSap;
      const updatedJsonSap = {
        ...currentJsonSap,
        items: currentJsonSap.items.map((item, idx) =>
          idx === jsonSapItemIndex
            ? {
                ...item,
                claveInterna: sapInternalKey,
                ...(typeof description === "string" ? { descripcion: description } : {}),
              }
            : item,
        ),
      };

      latestJsonSapRef.current = updatedJsonSap;
      setCurrentUpdateAction("json_sap");
      const ok = await updateBillingDocumentJsonSap({
        Id_BillingDocument: documentId,
        jsonsap: JSON.stringify(updatedJsonSap),
      });

      if (!ok) {
        latestJsonSapRef.current = previousJsonSap;
      }
      result = ok;
    });

    jsonSapUpdateQueueRef.current = queuedUpdate.then(() => undefined);
    await queuedUpdate;
    return result;
  };

  const handleUpdateJsonSapExpenseType = async (
    expenseType: string,
  ): Promise<boolean> => {
    let result = false;

    const queuedUpdate = jsonSapUpdateQueueRef.current.then(async () => {
      const currentSelected = selectedRef.current;
      const documentId = currentSelected?.billingdocument_id;
      const currentJsonSap = latestJsonSapRef.current ?? currentSelected?.json_sap;
      if (!documentId || !currentJsonSap) {
        result = false;
        return;
      }

      const previousJsonSap = currentJsonSap;
      const updatedJsonSap = {
        ...currentJsonSap,
        expenseType,
      };

      latestJsonSapRef.current = updatedJsonSap;
      setCurrentUpdateAction("json_sap");
      const ok = await updateBillingDocumentJsonSap({
        Id_BillingDocument: documentId,
        jsonsap: JSON.stringify(updatedJsonSap),
      });

      if (!ok) {
        latestJsonSapRef.current = previousJsonSap;
      }
      result = ok;
    });

    jsonSapUpdateQueueRef.current = queuedUpdate.then(() => undefined);
    await queuedUpdate;
    return result;
  };

  const handleSubmitReject = (values: Record<string, any>) => {
    setOpenRejectInvoice(false);
    const payload = {
      id: selected?.billingdocument_id ?? "",
      comment: values.comments ?? "",
      type: rejectType,
    };
    if (operations) rejectBillingDocument(payload, reqisition);
    else rejectBillingDocument(payload);
  };

  const handleSubmitValid = () => {
    setOpenValidInvoice(false);
    if (operations)
      validateBillingDocumentOperations(
        [selected?.billingdocument_id ?? ""],
        reqisition,
      );
    else validateBillingDocument([selected?.billingdocument_id ?? ""]);
  };

  useEffect(() => {
    selectedRef.current = selected;
    latestJsonSapRef.current = selected?.json_sap ?? null;
  }, [selected]);

  useEffect(() => {
    if (!selected?.billingdocument_id) return;
    fetchExpenseTypeCatalog(false);
  }, [fetchExpenseTypeCatalog, selected?.billingdocument_id]);

  useEffect(() => {
    if (updating) {
      showSpinner({
        message:
          currentUpdateAction === "json_sap"
            ? "Actualizando informacion SAP..."
            : "Espera un momento, se esta enviando el comentario.",
      });
      return;
    }
    if (rejecting) {
      showSpinner({
        message: `Espera un momento, se esta rechazando el ${documentLabel}.`,
      });
      return;
    }
    if (validating) {
      showSpinner({
        message: `Espera un momento, se esta validando el ${documentLabel}.`,
      });
      return;
    }
    if (sending) return;
    hideSpinner();

    if (successPut) {
      if (currentUpdateAction === "json_sap") {
        showAlert({
          type: "success",
          title: "Ajuste guardado",
          description: "Se han guardado exitosamente los ajustes.",
          showPrimaryButton: false,
          showSecondaryButton: false,
          autoCloseMs: 1500,
        });
      } else {
        setPanelOpen(false);
        showAlert({
          type: "info",
          title: "Comentario Enviado",
          description: "Tu ticket ha sido subido correctamente.",
          showPrimaryButton: false,
          showSecondaryButton: false,
          autoCloseMs: 1500,
        });
      }
      setCurrentUpdateAction(null);
    }

    if (succesValidate) {
      setPanelOpen(false);
      showAlert({
        type: "info",
        title: `${documentLabel.charAt(0).toUpperCase()}${documentLabel.slice(1)} Validado`,
        description: "Se ha validado correctamente.",
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1500,
      });
    }

    if (succesReject) {
      setPanelOpen(false);
      showAlert({
        type: "info",
        title: `${documentLabel.charAt(0).toUpperCase()}${documentLabel.slice(1)} Rechazado`,
        description: "Se ha rechazado correctamente.",
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1500,
      });
    }

    if (error) {
      showAlert({
        type: "error",
        title:
          currentUpdateAction === "json_sap"
            ? "Error al actualizar JSON SAP"
            : "Error al enviar comentario",
        description:
          String(error) ||
          (currentUpdateAction === "json_sap"
            ? "Hubo un problema al actualizar la informacion SAP."
            : "Hubo un problema al enviar tus comentarios."),
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1500,
      });
      setCurrentUpdateAction(null);
    }

    resetFlags();
  }, [
    updating,
    error,
    successPut,
    rejecting,
    validating,
    succesReject,
    succesValidate,
    hideSpinner,
    resetFlags,
    setPanelOpen,
    showAlert,
    showSpinner,
    documentLabel,
    sending,
    currentUpdateAction,
  ]);

  return {
    labels,
    expenseTypeCatalog,
    openRejectInvoice,
    openValidInvoice,
    setOpenRejectInvoice,
    setOpenValidInvoice,
    handleSubmitComment,
    handleUpdateJsonSapItem,
    handleUpdateJsonSapExpenseType,
    handleSubmitReject,
    handleSubmitValid,
  };
};

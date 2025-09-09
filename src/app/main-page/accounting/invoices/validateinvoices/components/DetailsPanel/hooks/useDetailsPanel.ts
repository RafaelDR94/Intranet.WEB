
import { useEffect, useMemo, useState } from "react";
import { shallow } from "zustand/shallow";

import { UseDetailsPanelArgs } from "./types";

import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";
import { BillingDocumentsPutMap } from "@/app/mappings/billingdocuments/billingdocuments.mapper";
import { useBillingDocumentsStore } from "@/app/stores/useBillingDocumentsStore/useBillingDocumentsStore";
export const useDetailsPanel = ({ selected, rejectType, setPanelOpen, operations, reqisition }: UseDetailsPanelArgs) => {
  const { usePrincipalAlert, usePrincipalLoading } = usePrincipal();
  const { showAlert } = usePrincipalAlert;
  const { showSpinner, hideSpinner } = usePrincipalLoading;

  const { validateBillingDocument, validateBillingDocumentOperations, rejectBillingDocument, rejecting, validating, succesReject, succesValidate, updateBillingDocument, updating, successPut, resetFlags, error } = useBillingDocumentsStore(
    (s) => ({
      updateBillingDocument: s.updateBillingDocument,
      validateBillingDocument: s.validateBillingDocument,
      validateBillingDocumentOperations: s.validateBillingDocumentOperations,
      rejectBillingDocument: s.rejectBillingDocument,
      updating: s.updating,
      successPut: s.successPut,
      succesReject: s.succesReject,
      succesValidate: s.succesValidate,
      rejecting: s.rejecting,
      validating: s.validating,
      resetFlags: s.resetFlags,
      error: s.error,
    }),
    shallow
  );

  const [openRejectInvoice, setOpenRejectInvoice] = useState(false);
  const [openValidInvoice, setOpenValidInvoice] = useState(false);



  const labels = useMemo(
    () => ({
      left: selected ? `Usuario: ${selected?.requisition?.employeename}` : undefined,
      right: selected ? `Código: ${selected?.requisition?.projectname}` : undefined,
    }),
    [selected]
  );

  const handleSubmitComment = (values: Record<string, any>) => {
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

  const handleSubmitReject = (values: Record<string, any>) => {
    setOpenRejectInvoice(false);
    const payload = {
      id: selected?.billingdocument_id ?? "",
      comment: values.comments ?? "",
      type: rejectType
    };
    if (operations) rejectBillingDocument(payload,reqisition)
    else rejectBillingDocument(payload)

  };

  const handleSubmitValid = () => {
    setOpenValidInvoice(false);
    if (operations) validateBillingDocumentOperations([selected?.billingdocument_id ?? ""], reqisition)
    else validateBillingDocument([selected?.billingdocument_id ?? ""])
  };

  useEffect(() => {
    if (updating) {
      showSpinner({ message: "Espera un momento, se esta enviando el comentario" });
      return;
    }
    if (rejecting) {
      showSpinner({ message: "Espera un momento, se esta rechazando la factua." });
      return;
    }
    if (validating) {
      showSpinner({ message: "Espera un momento, se esta validando la factua." });
      return;
    }
    hideSpinner();
    if (successPut) {
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
    if (succesValidate) {
      setPanelOpen(false);
      showAlert({
        type: "info",
        title: "Factura Validada",
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
        title: "Factura Rechazada",
        description: "Se ha rechazado correctamente.",
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1500,
      });
    }
    if (error) {
      showAlert({
        type: "error",
        title: "Error al enviar comentario",
        description: String(error) || "Hubo un problema al enviar tus comentarios",
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1500,
      });
    }
    resetFlags();

  }, [updating, error, successPut, rejecting, validating, succesReject, succesValidate, hideSpinner, resetFlags, setPanelOpen, showAlert, showSpinner]);


  return {
    labels,

    openRejectInvoice,
    openValidInvoice,
    setOpenRejectInvoice,
    setOpenValidInvoice,
    handleSubmitComment,
    handleSubmitReject,
    handleSubmitValid,
  };
};



import { useEffect, useMemo, useState } from "react";
import { formatCurrency, computeBreakdown } from "@/app/utilities/FormatHelpers/FormatHelpets";
import { useBillingDocumentsStore } from "@/app/stores/useBillingDocumentsStore/useBillingDocumentsStore";
import { shallow } from "zustand/shallow";
import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";
import { UseDetailsPanelArgs } from "./types";

export const useDetailsPanel = ({ selected ,rejectType}: UseDetailsPanelArgs) => {
  const { usePrincipalAlert, usePrincipalLoading } = usePrincipal();
  const { showAlert } = usePrincipalAlert;
  const { showSpinner, hideSpinner } = usePrincipalLoading;

  const { validateBillingDocument, rejectBillingDocument, rejecting, validating, succesReject, succesValidate, updateBillingDocument, updating, successPut, resetFlags, error } = useBillingDocumentsStore(
    (s) => ({
      updateBillingDocument: s.updateBillingDocument,
      validateBillingDocument: s.validateBillingDocument,
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

  const money = useMemo(() => {
    const { subtotal, iva, total } = computeBreakdown(selected?.importe, 0.16);
    return {
      subtotal: formatCurrency(subtotal),
      iva: formatCurrency(iva),
      total: formatCurrency(total),
    };
  }, [selected?.importe]);

  const labels = useMemo(
    () => ({
      left: selected ? `Usuario: ${selected?.requisition?.employeename}` : undefined,
      right: selected ? `Código: ${selected?.requisition?.projectname}` : undefined,
    }),
    [selected]
  );

  const handleSubmitComment = (values: Record<string, any>) => {
    const payload = {
      billingdocument_id: selected?.billingdocument_id ?? "",
      requisition_id: selected?.requisition?.billingrequisition_id ?? "",
      billingimages_id: selected?.billingimages_id || null,
      xml: selected?.xml ?? "",
      pdf: selected?.pdf ?? "",
      comments: values.comments ?? "",
    };
    updateBillingDocument(payload);
  };

  const handleSubmitReject = (values: Record<string, any>) => {
    setOpenRejectInvoice(false);
    const payload = {
      id: selected?.billingdocument_id ?? "",
      comment: values.comments ?? "",
      type:rejectType
    };
    rejectBillingDocument(payload)
  };

  const handleSubmitValid = () => {
    setOpenValidInvoice(false);
    validateBillingDocument([selected?.billingdocument_id ?? ""])
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
      showAlert({
        type: "info",
        title: "Factura Validada",
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
        description: String(error) ?? "Hubo un problema al enviar tus comentarios",
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1500,
      });
    }
    resetFlags();

  }, [updating, error, successPut,rejecting,validating,succesReject,succesValidate]);


  return {
    labels,
    money,
    openRejectInvoice,
    openValidInvoice,
    setOpenRejectInvoice,
    setOpenValidInvoice,
    handleSubmitComment,
    handleSubmitReject,
    handleSubmitValid,
  };
};


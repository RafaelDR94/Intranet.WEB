'use client'
import { useEffect, useState } from 'react'
import { shallow } from 'zustand/shallow'

import { usePrincipal } from '@/app/context/PrincipalContext/PrincipalContext'
import { BillingDocuments } from '@/app/mappings/billingdocuments/billingdocuments.types'
import { useBillingDocumentsStore } from '@/app/stores/useBillingDocumentsStore/useBillingDocumentsStore'

export const useValidateInvoices = () => {
  // ---- state para details panel + comentario
  const [panelOpen, setPanelOpen] = useState(false)
  const [openValidInvoice, setOpenValidInvoice] = useState(false);
  const [selected, setSelected] = useState<BillingDocuments | null>(null)
  const [multiselectedt1, setMultiselectedt1] = useState<BillingDocuments[] | null>(null)
  const [multiselectedt2, setMultiselectedt2] = useState<BillingDocuments[] | null>(null)
  const { usePrincipalAlert, usePrincipalLoading } = usePrincipal();
  const { showSpinner, hideSpinner } = usePrincipalLoading;
  const { showAlert } = usePrincipalAlert
  const { validating, succesValidate, validateBillingDocument, error, resetFlags, billingDocuments, billingDocumentnotToday, loading, fetchBillingDocuments } = useBillingDocumentsStore(
    (s) => ({
      billingDocuments: s.billingDocuments,
      billingDocumentnotToday: s.billingDocumentnotToday,
      loading: s.loading,
      validating: s.validating,
      succesValidate: s.succesValidate,
      fetchBillingDocuments: s.fetchBillingDocuments,
      error: s.error,
      resetFlags: s.resetFlags,
      validateBillingDocument: s.validateBillingDocument,
    }),
    shallow
  );
  const handleMultiSelectt1: ((index: number, rows: BillingDocuments[]) => void) | undefined = (index, rows) => {
    setMultiselectedt1(rows);
  }
  const handleMultiSelectt2: ((index: number, rows: BillingDocuments[]) => void) | undefined = (index, rows) => {
    setMultiselectedt2(rows);
  }
  const handleActionClick = () => {
    setOpenValidInvoice(true);

  }
  const handleOpenDetails = (row: BillingDocuments) => {
    setSelected(row)
    setPanelOpen(true)
  }

  const handleMultiValidate = () => {
    if (multiselectedt1 || multiselectedt2) {
      setOpenValidInvoice(false);
      let ids: string[] = [];

      if (multiselectedt1) {
        ids = [...ids, ...multiselectedt1.map(d => d.billingdocument_id)];
      }

      if (multiselectedt2) {
        ids = [...ids, ...multiselectedt2.map(d => d.billingdocument_id)];
      }

      validateBillingDocument(ids);
    }
  }

  useEffect(() => {
    fetchBillingDocuments(true);
  }, [fetchBillingDocuments])

  useEffect(() => {
    if (!selected) return;
    const updated = billingDocuments.find(
      (doc) => doc.billingdocument_id === selected.billingdocument_id
    );
    if (updated && updated.status !== selected.status) {
      setSelected(updated);
    }
  }, [billingDocuments, selected]);
  useEffect(() => {
    if (loading) {
      showSpinner({ message: "Obteniendo historial..." })
      return;
    }
    if (validating) {
      showSpinner({ message: "Espera un momento, se esta validando la factua." });
      return;
    }
    hideSpinner();
    resetFlags();
    if (succesValidate) {
      showAlert({
        type: "success",
        title: "Validación exitosa",
        description: "Se han validado las facturas correctamente.",
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1500,
      });
    }
    if (error) {
      showAlert({
        type: "error",
        title: "Error al obtener las facturas",
        description: String(error) || "Hubo un problema al obtener las facturas",
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1500,
      });
    }

  }, [loading, error, hideSpinner, resetFlags, showAlert, showSpinner, succesValidate, validating])



  return {
    handleOpenDetails,
    billingDocuments,
    billingDocumentnotToday,
    panelOpen,
    setPanelOpen,
    selected,
    handleMultiSelectt1,
    handleMultiSelectt2,
    handleActionClick,
    openValidInvoice,
    setOpenValidInvoice,
    handleMultiValidate,
    multiselectedt1,
    multiselectedt2
  }
}

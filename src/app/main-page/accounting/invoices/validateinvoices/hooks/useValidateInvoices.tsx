"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { shallow } from "zustand/shallow"

import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext"
import { BillingDocuments } from "@/app/mappings/billingdocuments/billingdocuments.types"
import { useBillingDocumentsStore } from "@/app/stores/useBillingDocumentsStore/useBillingDocumentsStore"
import type { BillingDocumentsFilterOptions } from "@/app/stores/useBillingDocumentsStore/types"

export const isNonDeductibleDocument = (document: BillingDocuments): boolean => {
  const uuid = document?.uuid?.trim()
  const xml = document?.xml?.trim()
  const pdf = document?.pdf?.trim()
  const image = document?.image?.trim()

  return !uuid && !xml && !pdf && Boolean(image)
}

export const useValidateInvoices = () => {
  const [panelOpen, setPanelOpen] = useState(false)
  const [openValidInvoice, setOpenValidInvoice] = useState(false)
  const [selected, setSelected] = useState<BillingDocuments | null>(null)
  const [multiselectedt1, setMultiselectedt1] = useState<BillingDocuments[] | null>(null)
  const [multiselectedt2, setMultiselectedt2] = useState<BillingDocuments[] | null>(null)
  const [multiselectedNonDeductibleNew, setMultiselectedNonDeductibleNew] =
    useState<BillingDocuments[] | null>(null)
  const [
    multiselectedNonDeductiblePending,
    setMultiselectedNonDeductiblePending,
  ] = useState<BillingDocuments[] | null>(null)
  const { usePrincipalAlert, usePrincipalLoading } = usePrincipal()
  const { showSpinner, hideSpinner } = usePrincipalLoading
  const { showAlert } = usePrincipalAlert
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const idRequisition = searchParams.get("idRequisition") ?? undefined
  const idEmployee = searchParams.get("idEmployee") ?? undefined
  const billingDocumentsFilter = useMemo<BillingDocumentsFilterOptions>(() => {
    if (idRequisition) {
      return { filterValue: "4", idRequisition }
    }

    if (idEmployee) {
      return { filterValue: "5", idEmployee }
    }

    return { filterValue: "3" }
  }, [idEmployee, idRequisition])

  const {
    validating,
    succesValidate,
    validateBillingDocument,
    error,
    resetFlags,
    billingDocuments,
    billingDocumentnotToday,
    loading,
    fetchBillingDocuments,
    sendToSapBillingDocument,
    sending,
    succesSend,
  } = useBillingDocumentsStore(
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
      sendToSapBillingDocument: s.sendToSapBillingDocument,
      sending: s.sending,
      succesSend: s.succesSend,
    }),
    shallow,
  )

  const invoiceDocuments = useMemo(
    () => billingDocuments.filter((document) => !isNonDeductibleDocument(document)),
    [billingDocuments],
  )
  const pendingInvoiceDocuments = useMemo(
    () =>
      billingDocumentnotToday.filter(
        (document) => !isNonDeductibleDocument(document),
      ),
    [billingDocumentnotToday],
  )
  const nonDeductibleDocuments = useMemo(
    () => billingDocuments.filter((document) => isNonDeductibleDocument(document)),
    [billingDocuments],
  )
  const pendingNonDeductibleDocuments = useMemo(
    () =>
      billingDocumentnotToday.filter((document) =>
        isNonDeductibleDocument(document),
      ),
    [billingDocumentnotToday],
  )
  const hasNonDeductibleDocuments =
    nonDeductibleDocuments.length > 0 || pendingNonDeductibleDocuments.length > 0

  const handleMultiSelectt1 = useCallback(
    (_index: number, rows: BillingDocuments[]) => {
      setMultiselectedt1(rows)
    },
    [],
  )

  const handleMultiSelectt2 = useCallback(
    (_index: number, rows: BillingDocuments[]) => {
      setMultiselectedt2(rows)
    },
    [],
  )

  const handleMultiSelectNonDeductibleNew = useCallback(
    (_index: number, rows: BillingDocuments[]) => {
      setMultiselectedNonDeductibleNew(rows)
    },
    [],
  )

  const handleMultiSelectNonDeductiblePending = useCallback(
    (_index: number, rows: BillingDocuments[]) => {
      setMultiselectedNonDeductiblePending(rows)
    },
    [],
  )

  const handleActionClick = useCallback(() => {
    setOpenValidInvoice(true)
  }, [])

  const handleOpenDetails = useCallback((row: BillingDocuments) => {
    setSelected(row)
    setPanelOpen(true)
  }, [])

  const handleMultiValidate = useCallback(() => {
    if (!multiselectedt1 && !multiselectedt2) return

    setOpenValidInvoice(false)
    const ids = [
      ...(multiselectedt1 ?? []).map((document) => document.billingdocument_id),
      ...(multiselectedt2 ?? []).map((document) => document.billingdocument_id),
    ]

    validateBillingDocument(ids)
  }, [multiselectedt1, multiselectedt2, validateBillingDocument])

  const handleSendNonDeductibleToSap = useCallback(() => {
    const ids = [
      ...(multiselectedNonDeductibleNew ?? []),
      ...(multiselectedNonDeductiblePending ?? []),
    ]
      .map((document) => document.billingdocument_id)
      .filter(Boolean)

    if (!ids.length) return

    sendToSapBillingDocument(ids)
  }, [
    multiselectedNonDeductibleNew,
    multiselectedNonDeductiblePending,
    sendToSapBillingDocument,
  ])

  const handleSendSelectedNonDeductibleToSap = useCallback(() => {
    if (!selected?.billingdocument_id) return
    sendToSapBillingDocument([selected.billingdocument_id])
  }, [selected, sendToSapBillingDocument])

  useEffect(() => {
    const current = new URLSearchParams(searchParams.toString())
    const alreadyFlagged = current.get("hasNonDeductible") === "1"

    if (hasNonDeductibleDocuments && !alreadyFlagged) {
      current.set("hasNonDeductible", "1")
      router.replace(`${pathname}?${current.toString()}`)
      return
    }

    if (!hasNonDeductibleDocuments && alreadyFlagged) {
      current.delete("hasNonDeductible")
      const nextQuery = current.toString()
      const fallbackPath = "/main-page/accounting/invoices/validateinvoices"
      const targetPath = pathname.includes("/nondeductibles")
        ? fallbackPath
        : pathname
      router.replace(nextQuery ? `${targetPath}?${nextQuery}` : targetPath)
    }
  }, [hasNonDeductibleDocuments, pathname, router, searchParams])

  useEffect(() => {
    fetchBillingDocuments(true, billingDocumentsFilter)
  }, [billingDocumentsFilter, fetchBillingDocuments])

  useEffect(() => {
    if (!selected) return
    const updated = [...billingDocuments, ...billingDocumentnotToday].find(
      (document) => document.billingdocument_id === selected.billingdocument_id,
    )
    if (updated && updated.status !== selected.status) {
      setSelected(updated)
    }
  }, [billingDocumentnotToday, billingDocuments, selected])

  useEffect(() => {
    if (loading) {
      showSpinner({ message: "Obteniendo historial..." })
      return
    }
    if (sending) {
      showSpinner({ message: "Enviando documentos a SAP..." })
      return
    }
    if (validating) {
      showSpinner({ message: "Espera un momento, se esta validando la factua." })
      return
    }

    hideSpinner()

    if (succesValidate) {
      showAlert({
        type: "success",
        title: "Validación exitosa",
        description: "Se han validado las facturas correctamente.",
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1500,
      })
    }

    if (succesSend) {
      showAlert({
        type: "success",
        title: "Envó­o exitoso",
        description: "Los documentos fueron enviados correctamente a SAP.",
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1500,
      })
      setPanelOpen(false)
    }

    if (error) {
      showAlert({
        type: "error",
        title: "Error al obtener las facturas",
        description: String(error) || "Hubo un problema al obtener las facturas",
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1500,
      })
    }

    resetFlags()
  }, [
    error,
    hideSpinner,
    loading,
    resetFlags,
    sending,
    showAlert,
    showSpinner,
    succesSend,
    succesValidate,
    validating,
  ])

  return {
    handleOpenDetails,
    billingDocuments: invoiceDocuments,
    billingDocumentnotToday: pendingInvoiceDocuments,
    nonDeductibleDocuments,
    pendingNonDeductibleDocuments,
    hasNonDeductibleDocuments,
    panelOpen,
    setPanelOpen,
    selected,
    handleMultiSelectt1,
    handleMultiSelectt2,
    handleMultiSelectNonDeductibleNew,
    handleMultiSelectNonDeductiblePending,
    handleActionClick,
    openValidInvoice,
    setOpenValidInvoice,
    handleMultiValidate,
    handleSendNonDeductibleToSap,
    handleSendSelectedNonDeductibleToSap,
    multiselectedt1,
    multiselectedt2,
    multiselectedNonDeductibleNew,
    multiselectedNonDeductiblePending,
  }
}

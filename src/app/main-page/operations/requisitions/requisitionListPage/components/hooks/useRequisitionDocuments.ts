'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useMemo } from 'react'
import { shallow } from 'zustand/shallow'

import type { BillingDocumentRequisition, Requisition } from '@/app/mappings/requisitions/requisitions.types'
import { useBillingRequisitionWithEmployeesStore } from '@/app/stores/useBillingRequisitionWithEmployeesStore/useBillingRequisitionWithEmployeesStore'

type UseRequisitionDocumentsResult = {
  requisitionId?: string
  requisition?: Requisition
  requisitions: Requisition[]
  documents: BillingDocumentRequisition[]
}

/**
 * Returns the requisition and its attached documents for the current `id` query param.
 * Falls back to refetching the active requisitions list when the requisition is missing.
 */
export const useRequisitionDocuments = (): UseRequisitionDocumentsResult => {
  const searchParams = useSearchParams()
  const requisitionId = searchParams.get('id') ?? undefined

  const {
    requisitions,
    fetchRequisitionsWithEmployees,
    loading,
  } = useBillingRequisitionWithEmployeesStore(
    (state) => ({
      requisitions: state.requisitions,
      fetchRequisitionsWithEmployees: state.fetchRequisitionsWithEmployees,
      loading: state.loading,
    }),
    shallow,
  )

  useEffect(() => {
    if (!requisitionId || loading) return

    const hasRequisition = requisitions.some(
      (item) => item.billingrequisition_id === requisitionId,
    )

    if (!hasRequisition) {
      fetchRequisitionsWithEmployees(undefined, undefined, true)
    }
  }, [
    requisitionId,
    loading,
    requisitions,
    fetchRequisitionsWithEmployees,
  ])

  const requisition = useMemo(
    () =>
      requisitions.find(
        (item) => item.billingrequisition_id === requisitionId,
      ),
    [requisitionId, requisitions],
  )

  return {
    requisitionId,
    requisition,
    requisitions,
    documents: requisition?.billingDocumentRquisition ?? [],
  }
}

export default useRequisitionDocuments

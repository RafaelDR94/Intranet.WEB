'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useRef } from 'react'
import { shallow } from 'zustand/shallow'

import type { BillingDocumentRequisition, Requisition } from '@/app/mappings/requisitions/requisitions.types'
import { useRequisitionsStore } from '@/app/stores/useRequisitionStore/useRequisitionStore'

type UseRequisitionDocumentsResult = {
  requisitionId?: string
  employeeId?: string
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
  const requisitionId = searchParams.get('idRequisition') ?? searchParams.get('id') ?? undefined
  const employeeIdParam =
    searchParams.get('idEmployee') ??
    (searchParams.get('idRequisition') ? searchParams.get('id') : null) ??
    undefined
  const fetchedEmployeeIdRef = useRef<string | null>(null)
  const fetchedRequisitionIdRef = useRef<string | null>(null)
  const fetchedEmployeeFromRequisitionRef = useRef<string | null>(null)

  const {
    requisitions,
    currentRequisition,
    fetchCurrentRequisition,
    fetchRequisitionsByIdEmployee,
  } = useRequisitionsStore(
    (state) => ({
      requisitions: state.requisitions,
      currentRequisition: state.currentRequisition,
      fetchCurrentRequisition: state.fetchCurrentRequisition,
      fetchRequisitionsByIdEmployee: state.fetchRequisitionsByIdEmployee,
    }),
    shallow,
  )

  useEffect(() => {
    if (!employeeIdParam) return
    if (fetchedEmployeeIdRef.current === employeeIdParam) return
    fetchedEmployeeIdRef.current = employeeIdParam
    fetchRequisitionsByIdEmployee(employeeIdParam, true)
  }, [employeeIdParam, fetchRequisitionsByIdEmployee])

  useEffect(() => {
    if (employeeIdParam || !requisitionId) return
    if (fetchedRequisitionIdRef.current === requisitionId) return
    fetchedRequisitionIdRef.current = requisitionId
    fetchCurrentRequisition(requisitionId, true)
  }, [employeeIdParam, fetchCurrentRequisition, requisitionId])

  useEffect(() => {
    if (employeeIdParam || !currentRequisition?.id_Employee) return
    if (fetchedEmployeeFromRequisitionRef.current === currentRequisition.id_Employee) return
    fetchedEmployeeFromRequisitionRef.current = currentRequisition.id_Employee
    fetchRequisitionsByIdEmployee(currentRequisition.id_Employee, true)
  }, [
    currentRequisition?.id_Employee,
    employeeIdParam,
    fetchRequisitionsByIdEmployee,
  ])

  const requisition = useMemo(
    () =>
      currentRequisition ??
      requisitions.find(
        (item) => item.billingrequisition_id === requisitionId,
      ),
    [currentRequisition, requisitionId, requisitions],
  )

  return {
    requisitionId,
    employeeId: employeeIdParam ?? requisition?.id_Employee ?? currentRequisition?.id_Employee,
    requisition,
    requisitions,
    documents: requisition?.billingDocumentRquisition ?? [],
  }
}

export default useRequisitionDocuments

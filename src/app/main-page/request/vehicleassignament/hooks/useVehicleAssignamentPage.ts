'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { shallow } from 'zustand/shallow'

import { useAuth } from '@/app/context/AuthContext/AuthContext'
import { usePrincipal } from '@/app/context/PrincipalContext/PrincipalContext'
import type { TransportAssignament, VehicleReassignmentView } from '@/app/mappings/transport/transport.types'
import { useTransportStore } from '@/app/stores/useTransportStore/useTransportStore'
import type { VehicleRegistryRow } from '@/app/main-page/generalservices/vehicleregist/vehicleregistrylist/types'
import { sortByDepartureDesc,toVehicleRegistryRow } from '@/app/main-page/generalservices/vehicleregist/vehicleregistrylist/utilities/vehicleRegistryRows'
import type { Authorized } from '@/app/components/SignaturePopUp/types'

export type PendingReassignmentAction = 'approve' | 'reject'

export type PendingReassignmentCandidate = {
  reassignment: VehicleReassignmentView
  assignment: TransportAssignament
}

export const findPendingVehicleReassignmentForEmployee = (
  assignment: TransportAssignament | null | undefined,
  employeeId: string | null | undefined
): VehicleReassignmentView | null => {
  if (!assignment?.vehicle_reassignment || assignment.vehicle_reassignment.length === 0) return null
  if (!employeeId) return null

  const pending = assignment.vehicle_reassignment
    .filter((item) => {
      const status = (item.status ?? '').trim().toLowerCase()
      return (
        item.id_new_employee === employeeId &&
        status === 'pendiente'
      )
    })
    .sort((a, b) => {
      const ad = Date.parse(a.date_created)
      const bd = Date.parse(b.date_created)
      return bd - ad
    })

  return pending[0] ?? null
}

const buildPendingReassignmentContent = (pending: VehicleReassignmentView) => {
  const requester = pending.previous_employee_name?.trim() || 'Un colaborador'
  return {
    title: 'Confirmación cambio de conductor',
    content: `${requester} ha solicitado hacer el cambio de responsable de un vehículo ¿Deseas hacer el cambio?\n\nUna vez confirmado este cambio, te vuelves responsable del vehículo asignado.`,
  }
}

type TrackingFormConfig = {
  assignmentId: string
  signature: string
  reassignmentId: string
}

const useVehicleAssignamentPage = () => {
  const { user } = useAuth()
  const idEmployee = user?.idEmployee

  const { usePrincipalLoading, usePrincipalAlert } = usePrincipal()
  const { showSpinner, hideSpinner } = usePrincipalLoading
  const { showAlert } = usePrincipalAlert
  const [openDetailsPanel, setOpenDetailsPanel] = useState<boolean>(false)
  const [pendingCandidate, setPendingCandidate] = useState<PendingReassignmentCandidate | null>(null)
  const [pendingAction, setPendingAction] = useState<PendingReassignmentAction | null>(null)
  const [pendingPopUpOpen, setPendingPopUpOpen] = useState(false)
  const [signatureOpen, setSignatureOpen] = useState(false)
  const [trackingForm, setTrackingForm] = useState<TrackingFormConfig | null>(null)
  const [detailsRequestedId, setDetailsRequestedId] = useState<string | null>(null)
  const [dismissedPendingAssignmentId, setDismissedPendingAssignmentId] = useState<string | null>(null)
  const pendingPopUpCloseReasonRef = useRef<'dismiss' | 'action'>('dismiss')

  const {
    vehicleReassignmentsByEmployee,
    fetchVehicleReassignmentsByEmployee,
    loadingVehicleReassignmentsByEmployee,
    successGetVehicleReassignmentsByEmployee,
    setCurrentAssignment,
    currentAssignment,
    fetchAssignmentById,
    loadingAssignments,
    successGetAssignment,
    resetCurrentAssignment,
    reset,
    error,
    resetFlags,
    vehicleReassignmentReject,
  } = useTransportStore(
    (state) => ({
      vehicleReassignmentsByEmployee: state.vehicleReassignmentsByEmployee,
      fetchVehicleReassignmentsByEmployee: state.fetchVehicleReassignmentsByEmployee,
      loadingVehicleReassignmentsByEmployee: state.loadingVehicleReassignmentsByEmployee,
      successGetVehicleReassignmentsByEmployee: state.successGetVehicleReassignmentsByEmployee,
      setCurrentAssignment: state.setCurrentAssignment,
      currentAssignment: state.currentAssignment,
      fetchAssignmentById: state.fetchAssignmentById,
      loadingAssignments: state.loadingAssignments,
      successGetAssignment: state.successGetAssignment,
      resetCurrentAssignment: state.resetCurrentAssignment,
      reset: state.reset,
      error: state.error,
      resetFlags: state.resetFlags,
      vehicleReassignmentApprove: state.vehicleReassignmentApprove,
      vehicleReassignmentReject: state.vehicleReassignmentReject,
    }),
    shallow
  )

  useEffect(() => {
    if (!idEmployee) return
    void fetchVehicleReassignmentsByEmployee(idEmployee)
  }, [fetchVehicleReassignmentsByEmployee, idEmployee])

  const rows = useMemo<VehicleRegistryRow[]>(
    () => vehicleReassignmentsByEmployee.map(toVehicleRegistryRow),
    [vehicleReassignmentsByEmployee]
  )

  const { inTransitRows, otherRows } = useMemo(() => {
    const inTransit: VehicleRegistryRow[] = []
    const others: VehicleRegistryRow[] = []

    rows.forEach((row) => {
      if (row.statusVariant === 'inTransit') {
        inTransit.push(row)
      } else {
        others.push(row)
      }
    })

    inTransit.sort(sortByDepartureDesc)
    others.sort(sortByDepartureDesc)

    return { inTransitRows: inTransit, otherRows: others }
  }, [rows])

  const handleRefresh = useCallback(() => {
    if (!idEmployee) return
    reset()
    void fetchVehicleReassignmentsByEmployee(idEmployee)
  }, [fetchVehicleReassignmentsByEmployee, idEmployee, reset])

  const handleOpenDetails = useCallback(
    (assignment: TransportAssignament) => {
      setCurrentAssignment(assignment)
      setOpenDetailsPanel(true)
      setDetailsRequestedId(assignment.vehicleassignments_id)
      setDismissedPendingAssignmentId(null)
      void fetchAssignmentById(assignment.vehicleassignments_id, true)
    },
    [fetchAssignmentById, setCurrentAssignment]
  )

  const handleCloseDetails = useCallback(() => {
    resetCurrentAssignment()
    setOpenDetailsPanel(false)
    setPendingCandidate(null)
    setPendingAction(null)
    setPendingPopUpOpen(false)
    setSignatureOpen(false)
    setDetailsRequestedId(null)
    setDismissedPendingAssignmentId(null)
  }, [resetCurrentAssignment])

  useEffect(() => {
    if (!openDetailsPanel) return
    if (!successGetAssignment) return
    if (loadingAssignments) return
    if (!currentAssignment) return
    if (detailsRequestedId && currentAssignment.vehicleassignments_id !== detailsRequestedId) return
    if (dismissedPendingAssignmentId === currentAssignment.vehicleassignments_id) return
    if (!idEmployee) return
    if (pendingPopUpOpen || signatureOpen || pendingCandidate) return

    const pending = findPendingVehicleReassignmentForEmployee(currentAssignment, idEmployee)
    if (!pending) return

    setPendingCandidate({ reassignment: pending, assignment: currentAssignment })
    setPendingPopUpOpen(true)
  }, [
    currentAssignment,
    detailsRequestedId,
    dismissedPendingAssignmentId,
    idEmployee,
    loadingAssignments,
    openDetailsPanel,
    pendingCandidate,
    pendingPopUpOpen,
    signatureOpen,
    successGetAssignment,
  ])

  const pendingPopUpText = useMemo(() => {
    if (!pendingCandidate) return null
    return buildPendingReassignmentContent(pendingCandidate.reassignment)
  }, [pendingCandidate])

  const handlePendingReject = useCallback(() => {
    if (!pendingCandidate) return
    setPendingAction('reject')
    pendingPopUpCloseReasonRef.current = 'action'
    setPendingPopUpOpen(false)
    setSignatureOpen(true)
  }, [pendingCandidate])

  const handlePendingApprove = useCallback(() => {
    if (!pendingCandidate) return
    setPendingAction('approve')
    pendingPopUpCloseReasonRef.current = 'action'
    setPendingPopUpOpen(false)
    setSignatureOpen(true)
  }, [pendingCandidate])

  const handleClosePendingPopUp = useCallback(() => {
    const reason = pendingPopUpCloseReasonRef.current
    pendingPopUpCloseReasonRef.current = 'dismiss'

    setPendingPopUpOpen(false)

    if (reason === 'dismiss') {
      const id = currentAssignment?.vehicleassignments_id ?? detailsRequestedId
      if (id) setDismissedPendingAssignmentId(id)
      setPendingCandidate(null)
      setPendingAction(null)
    }
  }, [currentAssignment?.vehicleassignments_id, detailsRequestedId])

  const handleCloseSignature = useCallback(() => {
    setSignatureOpen(false)
    setPendingAction(null)
    if (pendingCandidate) {
      setPendingPopUpOpen(true)
    }
  }, [pendingCandidate])

  const handleSignatureAuthorization = useCallback(
    async (authorized: Authorized) => {
      if (!authorized?.state || !authorized.signature) return
      if (!pendingCandidate || !pendingAction) return

      const reassignmentId = pendingCandidate.reassignment.id
      if (!reassignmentId) return

      try {
        if (pendingAction === 'reject') {
          showSpinner({ message: 'Procesando cambio...' })
          const ok = await vehicleReassignmentReject(reassignmentId, 'Cambio rechazado')
          if (!ok) throw new Error('No se pudo rechazar el cambio de conductor')

          showAlert({
            type: 'error',
            title: 'Cambio rechazado',
            description: 'Se ha rechazado el cambio de conductor.',
            showPrimaryButton: false,
            showSecondaryButton: false,
            autoCloseMs: 2000,
          })

          handleCloseSignature()
          handleCloseDetails()
          handleRefresh()
          return
        }

        handleCloseSignature()
        handleCloseDetails()
        setTrackingForm({
          signature: authorized.signature,
          assignmentId: pendingCandidate.assignment.vehicleassignments_id,
          reassignmentId,
        })
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Intenta nuevamente.'
        showAlert({
          type: 'error',
          title: 'Error',
          description: message,
          showPrimaryButton: false,
          showSecondaryButton: false,
          autoCloseMs: 2000,
        })
      } finally {
        hideSpinner()
      }
    },
    [
      handleCloseDetails,
      handleCloseSignature,
      handleRefresh,
      idEmployee,
      pendingAction,
      pendingCandidate,
      showAlert,
      hideSpinner,
      showSpinner,
      vehicleReassignmentReject,
    ]
  )

  const handleCloseTrackingForm = useCallback(() => {
    setTrackingForm(null)
    handleRefresh()
  }, [handleRefresh])

  useEffect(() => {
    if (loadingVehicleReassignmentsByEmployee) {
      showSpinner({ message: 'Cargando registros...' })
      return
    }
    if (successGetVehicleReassignmentsByEmployee) {
      resetFlags()
    }
    if (error) {
      showAlert({
        type: 'error',
        title: 'Error al obtener listas',
        description: error,
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1500,
      })
      resetFlags()
    }
    hideSpinner()
  }, [
    loadingVehicleReassignmentsByEmployee,
    successGetVehicleReassignmentsByEmployee,
    error,
    showSpinner,
    showAlert,
    hideSpinner,
    resetFlags,
  ])

  const searchableKeys = useMemo(
    () =>
      [
        'departureDate',
        'arrivalDate',
        'vehicle',
        'plates',
        'driver',
        'status',
        'destination',
      ] as (keyof VehicleRegistryRow)[],
    []
  )

  return {
    inTransitRows,
    otherRows,
    loading: loadingVehicleReassignmentsByEmployee,
    handleRefresh,
    searchableKeys,
    handleOpenDetails,
    handleCloseDetails,
    openDetailsPanel,
    pendingPopUpOpen,
    pendingPopUpText,
    handleClosePendingPopUp,
    handlePendingApprove,
    handlePendingReject,
    signatureOpen,
    handleCloseSignature,
    handleSignatureAuthorization,
    trackingForm,
    handleCloseTrackingForm,
    loadingAssignments,
  }
}

export default useVehicleAssignamentPage

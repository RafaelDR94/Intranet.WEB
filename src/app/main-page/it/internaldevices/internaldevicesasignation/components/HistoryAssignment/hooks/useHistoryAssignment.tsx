import { useCallback, useEffect, useMemo, useState } from 'react'
import { shallow } from 'zustand/shallow'

import { useAuth } from '@/app/context/AuthContext/AuthContext'
import { usePrincipal } from '@/app/context/PrincipalContext/PrincipalContext'
import useQuery from '@/app/hooks/useQuery/useQuery'
import type { EmployeeType } from '@/app/mappings/employees/employee.types'
import type { InternalDeviceAssignmentHistory } from '@/app/mappings/internaldevices/internaldevices.types'
import { useEmployeesStore } from '@/app/stores/useEmployeesStore/useEmployeesStore'
import { useInternalDevicesStore } from '@/app/stores/useInternalDevicesStore/useInternalDevicesStore'

import type { HistoryAssignmentProps, HistoryAssignmentRow } from '../types'

const formatAssignmentDate = (
  assignment: InternalDeviceAssignmentHistory,
): string => {
  const rawDate = assignment.date ?? assignment.created_at
  if (!rawDate) return '-'

  const onlyDate = rawDate.split('T')[0]
  const [year, month, day] = onlyDate.split('-')
  if (!year || !month || !day) return '-'

  return `${day}/${month}/${year}`
}

/**
 * Encapsulates state, data fetching, and handlers for HistoryAssignment.
 */
const useHistoryAssignment = ({
  deviceId,
  onCreateAssignment,
}: HistoryAssignmentProps) => {
  const { updateQuery } = useQuery()
  const { user } = useAuth()
  const { usePrincipalAlert, usePrincipalLoading } = usePrincipal()
  const { showAlert } = usePrincipalAlert
  const { showSpinner, hideSpinner } = usePrincipalLoading

  const {
    deviceAssignmentHistory,
    loadingDeviceAssignmentHistory,
    fetchDeviceAssignmentHistoryByDeviceId,
    deleteDeviceAssignment,
    deletingDeviceAssignment,
    fetchDeviceAssignments,
    deviceAssignments,
    deviceAssignment,
    error,
  } = useInternalDevicesStore(
    (state) => ({
      deviceAssignmentHistory: state.deviceAssignmentHistory,
      loadingDeviceAssignmentHistory: state.loadingDeviceAssignmentHistory,
      fetchDeviceAssignmentHistoryByDeviceId:
        state.fetchDeviceAssignmentHistoryByDeviceId,
      deleteDeviceAssignment: state.deleteDeviceAssignment,
      deletingDeviceAssignment: state.deletingDeviceAssignment,
      fetchDeviceAssignments: state.fetchDeviceAssignments,
      deviceAssignments: state.deviceAssignments,
      deviceAssignment: state.deviceAssignment,
      error: state.error,
    }),
    shallow,
  )

  const { activeEmployees, loadingActive, fetchActiveEmployees } = useEmployeesStore(
    (state) => ({
      activeEmployees: state.activeEmployees,
      loadingActive: state.loadingActive,
      fetchActiveEmployees: state.fetchActiveEmployees,
    }),
    shallow,
  )

  useEffect(() => {
    if (!deviceId) return
    void fetchDeviceAssignmentHistoryByDeviceId(deviceId, true)
    if (!activeEmployees.length) {
      void fetchActiveEmployees(true)
    }
    if (!deviceAssignments.length) {
      void fetchDeviceAssignments(true)
    }
  }, [
    deviceId,
    activeEmployees.length,
    fetchActiveEmployees,
    fetchDeviceAssignmentHistoryByDeviceId,
    deviceAssignments.length,
    fetchDeviceAssignments,
  ])

  const employeeById = useMemo(() => {
    const entries = activeEmployees
      .map((employee) => {
        const key = employee.employee_id || employee.id
        return key ? ([key, employee] as const) : null
      })
      .filter(
        (entry): entry is readonly [string, EmployeeType] => entry !== null,
      )
    return new Map<string, EmployeeType>(entries)
  }, [activeEmployees])

  const responsiveByAssignmentId = useMemo(() => {
    const entries = deviceAssignments.map((assignment) => [
      assignment.device_assigment_id,
      assignment.responsive_url ?? null,
    ] as const)
    return new Map<string, string | null>(entries)
  }, [deviceAssignments])

  const rows = useMemo<HistoryAssignmentRow[]>(
    () =>
      (deviceAssignmentHistory ?? []).map((assignment) => {
        const employee =
          assignment.assigned_to ??
          employeeById.get(assignment.employee_id)?.fullname ??
          assignment.employee_id ??
          '-'
        return {
          assignmentId: assignment.device_assigment_id,
          dateLabel: formatAssignmentDate(assignment),
          assignedTo: employee,
          deliveryCondition: assignment.delivery_condition || 'Sin condiciones',
          responsiveUrl: responsiveByAssignmentId.get(assignment.device_assigment_id),
        }
      }),
    [deviceAssignmentHistory, employeeById, responsiveByAssignmentId],
  )

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [responsiveOpen, setResponsiveOpen] = useState(false)
  const [responsiveUrl, setResponsiveUrl] = useState<string | null>(null)
  const [responsiveTitle, setResponsiveTitle] = useState<string>('')

  const hasActiveAssignment = Boolean(
    deviceAssignment?.device_assigment_id &&
      deviceAssignment.device_id &&
      deviceAssignment.device_id === deviceId,
  )

  const handleCreateAssignment = useCallback(() => {
    if (onCreateAssignment) {
      onCreateAssignment()
      return
    }
    updateQuery({ view: 'new' })
  }, [onCreateAssignment, updateQuery])

  const handleConfirmUnlink = useCallback(async () => {
    if (
      !deviceAssignment?.device_assigment_id ||
      !deviceAssignment.device_id ||
      deviceAssignment.device_id !== deviceId
    ) {
      return
    }
    showSpinner({ message: 'Desvinculando usuario...' })
    const ok = await deleteDeviceAssignment(
      deviceAssignment.device_assigment_id,
      undefined,
      user?.idEmployee,
    )
    hideSpinner()

    if (!ok) {
      showAlert({
        type: 'error',
        title: 'Ocurrio un error',
        description: error ?? 'No se pudo desvincular al usuario.',
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1500,
      })
      return
    }

    setConfirmOpen(false)
    showAlert({
      type: 'info',
      title: 'Usuario desvinculado',
      description: 'El dispositivo quedo disponible para una nueva asignación.',
      showPrimaryButton: false,
      showSecondaryButton: false,
      autoCloseMs: 1200,
    })

    if (deviceId) {
      await fetchDeviceAssignmentHistoryByDeviceId(deviceId, true)
    }
    await fetchDeviceAssignments(true)
  }, [
    deleteDeviceAssignment,
    deviceAssignment?.device_assigment_id,
    deviceId,
    error,
    fetchDeviceAssignmentHistoryByDeviceId,
    fetchDeviceAssignments,
    hideSpinner,
    showAlert,
    showSpinner,
    user?.idEmployee,
  ])

  const handleOpenResponsive = useCallback(
    (url?: string | null, title?: string) => {
      if (!url) {
        showAlert({
          type: 'warning',
          title: 'Responsiva no disponible',
          description: 'No se encontro una responsiva para esta asignacion.',
          showPrimaryButton: false,
          showSecondaryButton: false,
          autoCloseMs: 1500,
        })
        return
      }
      setResponsiveUrl(url)
      setResponsiveTitle(title ?? 'Responsiva de asignacion')
      setResponsiveOpen(true)
    },
    [showAlert],
  )

  const handleCloseResponsive = useCallback(() => {
    setResponsiveOpen(false)
    setResponsiveUrl(null)
  }, [])

  return {
    confirmOpen,
    deletingDeviceAssignment,
    handleCloseResponsive,
    handleConfirmUnlink,
    handleCreateAssignment,
    handleOpenResponsive,
    hasActiveAssignment,
    loading: loadingDeviceAssignmentHistory || loadingActive,
    responsiveOpen,
    responsiveTitle,
    responsiveUrl,
    rows,
    setConfirmOpen,
  }
}

export default useHistoryAssignment

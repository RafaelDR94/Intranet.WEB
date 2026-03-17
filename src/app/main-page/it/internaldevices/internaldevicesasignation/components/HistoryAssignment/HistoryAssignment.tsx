'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { shallow } from 'zustand/shallow'

import { Button } from '@/app/components/Button/Button'
import { PopUp } from '@/app/components/PopUp/PopUp'
import { useAuth } from '@/app/context/AuthContext/AuthContext'
import { usePrincipal } from '@/app/context/PrincipalContext/PrincipalContext'
import useQuery from '@/app/hooks/useQuery/useQuery'
import type { EmployeeType } from '@/app/mappings/employees/employee.types'
import type { InternalDeviceAssignmentHistory } from '@/app/mappings/internaldevices/internaldevices.types'
import { useEmployeesStore } from '@/app/stores/useEmployeesStore/useEmployeesStore'
import { useInternalDevicesStore } from '@/app/stores/useInternalDevicesStore/useInternalDevicesStore'
import UserIcon from '@/assets/icons/Users/Users/user.svg'

export interface HistoryAssignmentProps {
  deviceId?: string | null
  onCreateAssignment?: () => void
}

const getAssignmentDate = (assignment: InternalDeviceAssignmentHistory): string =>
  assignment.date ?? assignment.created_at ?? '-'

const HistoryAssignment: React.FC<HistoryAssignmentProps> = ({
  deviceId,
  onCreateAssignment,
}) => {
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
  }, [
    deviceId,
    activeEmployees.length,
    fetchActiveEmployees,
    fetchDeviceAssignmentHistoryByDeviceId,
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

  const rows = useMemo<InternalDeviceAssignmentHistory[]>(
    () => deviceAssignmentHistory ?? [],
    [deviceAssignmentHistory],
  )

  const [confirmOpen, setConfirmOpen] = useState(false)
  const hasActiveAssignment = Boolean(
    deviceAssignment?.device_assigment_id &&
      deviceAssignment.device_id &&
      deviceAssignment.device_id === deviceId,
  )

  const handleCreateAssignment = () => {
    if (onCreateAssignment) {
      onCreateAssignment()
      return
    }
    updateQuery({ view: 'new' })
  }

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
      description: 'El dispositivo quedo disponible para una nueva asignacion.',
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

  if (loadingDeviceAssignmentHistory || loadingActive) {
    return <div className="text-center text-gray-70">Cargando historial...</div>
  }

  return (
    <div className="space-y-4">
      <PopUp
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Desvincular usuario"
        content="¿Desea desvincular el usuario del dispositivo?"
        showSecondaryButton
        secondaryButtonText="Cancelar"
        onSecondaryButtonClick={() => setConfirmOpen(false)}
        showPrimaryButton
        primaryButtonText={deletingDeviceAssignment ? 'Desvinculando...' : 'Desvincular'}
        onPrimaryButtonClick={handleConfirmUnlink}
      />

      <div className="flex items-center justify-end">
        <Button
          size="small"
          variant="ghost"
          icon={UserIcon}
          onClick={() => {
            if (hasActiveAssignment) {
              setConfirmOpen(true)
              return
            }
            handleCreateAssignment()
          }}
        >
          {hasActiveAssignment ? 'Desvincular usuario' : 'Nueva Asignacion'}
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-20 bg-white-70 shadow-sm">
        <table className="w-full text-left">
          <thead className="border-b border-gray-20">
            <tr className="text-gray-90">
              <th className="px-6 py-4 text-c2 font-semibold">FECHA</th>
              <th className="px-6 py-4 text-c2 font-semibold">ASIGNADO A</th>
              <th className="px-6 py-4 text-c2 font-semibold">
                CONDICIONES DE ENTREGA
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-70">
            {rows.length === 0 && (
              <tr>
                <td className="px-6 py-5 text-center text-c2" colSpan={3}>
                  Sin asignaciones registradas.
                </td>
              </tr>
            )}
            {rows.map((assignment) => {
              const employee =
                assignment.assigned_to ??
                employeeById.get(assignment.employee_id)?.fullname ??
                assignment.employee_id ??
                '-'

              return (
                <tr
                  key={assignment.device_assigment_id}
                  className="border-b border-gray-10 last:border-b-0"
                >
                  <td className="px-6 py-4 text-c2">
                    {getAssignmentDate(assignment)}
                  </td>
                  <td className="px-6 py-4 text-c2">{employee}</td>
                  <td className="px-6 py-4 text-c2">
                    <span className="block max-w-[280px] truncate">
                      {assignment.delivery_condition || 'Sin condiciones'}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default HistoryAssignment

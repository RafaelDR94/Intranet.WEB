import { useCallback, useEffect, useMemo, useState } from 'react'
import { shallow } from 'zustand/shallow'

import type { SelectOption } from '@/app/components/Select/types'
import { usePrincipal } from '@/app/context/PrincipalContext/PrincipalContext'
import { useEmployeesStore } from '@/app/stores/useEmployeesStore/useEmployeesStore'
import { useTransportStore } from '@/app/stores/useTransportStore/useTransportStore'

export type UseChangeDriverResult = {
  popUpOpen: boolean
  openPopUp: () => void
  closePopUp: () => void
  options: SelectOption[]
  selected: string[]
  setSelected: (values: string[]) => void
  canSubmit: boolean
  changingDriver: boolean
  handleSubmit: () => Promise<void>
}

const useChangeDriver = (): UseChangeDriverResult => {
  const { usePrincipalAlert } = usePrincipal()
  const { showAlert } = usePrincipalAlert

  const { employees, fetchEmployees } = useEmployeesStore(
    (s) => ({
      employees: s.employees,
      fetchEmployees: s.fetchEmployees,
    }),
    shallow
  )

  const { currentAssignment, changeDriver, changingDriver } = useTransportStore(
    (s) => ({
      currentAssignment: s.currentAssignment,
      changeDriver: s.changeDriver,
      changingDriver: s.changingDriver,
    }),
    shallow
  )

  const [popUpOpen, setPopUpOpen] = useState(false)
  const [selected, setSelected] = useState<string[]>([])

  useEffect(() => {
    if ((employees?.length ?? 0) > 0) return
    void fetchEmployees()
  }, [employees?.length, fetchEmployees])

  useEffect(() => {
    if (!currentAssignment) {
      setPopUpOpen(false)
      setSelected([])
    }
  }, [currentAssignment])

  const options = useMemo<SelectOption[]>(
    () =>
      (employees ?? []).map((employee) => ({
        label: employee.fullname,
        value: employee.employee_id,
      })),
    [employees]
  )

  const selectedEmployeeId = selected[0] ?? ''
  const assignmentId = currentAssignment?.vehicleassignments_id
  const currentEmployeeId = currentAssignment?.employee_id

  const canSubmit =
    Boolean(assignmentId) &&
    Boolean(selectedEmployeeId) &&
    selectedEmployeeId !== currentEmployeeId &&
    !changingDriver

  const openPopUp = useCallback(() => setPopUpOpen(true), [])
  const closePopUp = useCallback(() => {
    setPopUpOpen(false)
    setSelected([])
  }, [])

  const handleSubmit = useCallback(async () => {
    if (!assignmentId) return

    if (!selectedEmployeeId) {
      showAlert({
        type: 'warning',
        title: 'Selecciona un conductor',
        description: 'Debes seleccionar el nuevo conductor antes de continuar.',
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 2500,
      })
      return
    }

    if (selectedEmployeeId === currentEmployeeId) {
      showAlert({
        type: 'info',
        title: 'Sin cambios',
        description: 'El conductor seleccionado ya se encuentra asignado.',
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 2200,
      })
      return
    }

    const ok = await changeDriver({
      id_vehicleAssignments: assignmentId,
      id_newEmployee: selectedEmployeeId,
    })

    if (ok) {
      showAlert({
        type: 'success',
        title: 'Conductor actualizado',
        description: 'El cambio de conductor se guardó correctamente.',
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 2000,
      })
      closePopUp()
      return
    }

    showAlert({
      type: 'error',
      title: 'No se pudo cambiar el conductor',
      description: 'Intenta nuevamente en unos segundos.',
      showPrimaryButton: false,
      showSecondaryButton: false,
      autoCloseMs: 2500,
    })
  }, [
    assignmentId,
    changeDriver,
    closePopUp,
    currentEmployeeId,
    selectedEmployeeId,
    showAlert,
  ])

  return {
    popUpOpen,
    openPopUp,
    closePopUp,
    options,
    selected,
    setSelected,
    canSubmit,
    changingDriver,
    handleSubmit,
  }
}

export default useChangeDriver

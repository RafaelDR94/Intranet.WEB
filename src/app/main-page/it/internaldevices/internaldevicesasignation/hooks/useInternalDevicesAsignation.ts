'use client'

import { useCallback, useEffect } from 'react'
import { shallow } from 'zustand/shallow'

import { usePrincipal } from '@/app/context/PrincipalContext/PrincipalContext'
import { useInternalDevicesStore } from '@/app/stores/useInternalDevicesStore/useInternalDevicesStore'

/**
 * Hook para cargar la tabla de asignacion de dispositivos internos.
 */
const useInternalDevicesAsignation = () => {
  const { usePrincipalAlert, usePrincipalLoading } = usePrincipal()
  const { showSpinner, hideSpinner } = usePrincipalLoading
  const { showAlert } = usePrincipalAlert

  const {
    deviceAssignments,
    fetchDeviceAssignments,
    loadingDeviceAssignments,
    error,
  } = useInternalDevicesStore(
    (state) => ({
      deviceAssignments: state.deviceAssignments,
      fetchDeviceAssignments: state.fetchDeviceAssignments,
      loadingDeviceAssignments: state.loadingDeviceAssignments,
      error: state.error,
    }),
    shallow,
  )

  useEffect(() => {
    fetchDeviceAssignments()
  }, [fetchDeviceAssignments])

  useEffect(() => {
    if (loadingDeviceAssignments) {
      showSpinner({ message: 'Cargando asignaciones...' })
      return
    }

    if (error) {
      showAlert({
        type: 'error',
        title: 'Ocurrio un error',
        description: error,
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1200,
      })
    }

    hideSpinner()
  }, [error, hideSpinner, loadingDeviceAssignments, showAlert, showSpinner])

  const handleRefresh = useCallback(() => {
    fetchDeviceAssignments(true)
  }, [fetchDeviceAssignments])

  return {
    deviceAssignments,
    handleRefresh,
  }
}

export default useInternalDevicesAsignation

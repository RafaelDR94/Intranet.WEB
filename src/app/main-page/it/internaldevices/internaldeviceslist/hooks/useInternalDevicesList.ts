'use client'

import { useCallback, useEffect, useMemo } from 'react'
import { shallow } from 'zustand/shallow'

import { usePrincipal } from '@/app/context/PrincipalContext/PrincipalContext'
import useQuery from '@/app/hooks/useQuery/useQuery'
import type { InternalDevice } from '@/app/mappings/internaldevices/internaldevices.types'
import { useInternalDevicesStore } from '@/app/stores/useInternalDevicesStore/useInternalDevicesStore'

const useInternalDevicesList = () => {
  const { all, updateQuery } = useQuery()
  const forced = Boolean(all.force)
  const normalizedId = useMemo(() => {
    const raw = all.id
    if (Array.isArray(raw)) return raw[0] ?? null
    if (typeof raw === 'string' && raw.trim()) return raw
    return null
  }, [all.id])
  const normalizedView = useMemo(() => {
    const raw = all.view
    if (Array.isArray(raw)) return raw[0] ?? null
    if (typeof raw === 'string' && raw.trim()) return raw
    return null
  }, [all.view])
  const isEditView = normalizedView === 'edit'
  const isReviewView = normalizedView === 'review'
  const openDetails = Boolean(normalizedId && !isEditView && !isReviewView)

  const { usePrincipalAlert, usePrincipalLoading } = usePrincipal()
  const { showSpinner, hideSpinner } = usePrincipalLoading
  const { showAlert } = usePrincipalAlert

  const {
    devices,
    device,
    fetchDevices,
    fetchDeviceById,
    activateDevice,
    fetchDeviceReviewsByDeviceId,
    deviceReviewsByDevice,
    loadingDevices,
    loadingDevice,
    loadingDeviceReviewsByDevice,
    creatingDeviceReview,
    activatingDevice,
    updatingDevice,
    error,
    successActivateDevice,
    successUpdateDevice,
    successCreateDeviceReview,
    resetFlags,
  } = useInternalDevicesStore(
    (state) => ({
      devices: state.devices,
      device: state.device,
      fetchDevices: state.fetchDevices,
      fetchDeviceById: state.fetchDeviceById,
      activateDevice: state.activateDevice,
      fetchDeviceReviewsByDeviceId: state.fetchDeviceReviewsByDeviceId,
      deviceReviewsByDevice: state.deviceReviewsByDevice,
      loadingDevices: state.loadingDevices,
      loadingDevice: state.loadingDevice,
      loadingDeviceReviewsByDevice: state.loadingDeviceReviewsByDevice,
      creatingDeviceReview: state.creatingDeviceReview,
      activatingDevice: state.activatingDevice,
      updatingDevice: state.updatingDevice,
      error: state.error,
      successActivateDevice: state.successActivateDevice,
      successUpdateDevice: state.successUpdateDevice,
      successCreateDeviceReview: state.successCreateDeviceReview,
      resetFlags: state.resetFlags,
    }),
    shallow,
  )

  useEffect(() => {
    fetchDevices(forced)
  }, [fetchDevices, forced])

  useEffect(() => {
    if (loadingDevices) {
      showSpinner({ message: 'Cargando dispositivos...' })
      return
    }
    if (loadingDevice) {
      showSpinner({ message: 'Cargando dispositivo...' })
      return
    }
    if (activatingDevice) {
      showSpinner({ message: 'Actualizando dispositivo...' })
      return
    }
    if (updatingDevice) {
      showSpinner({ message: 'Guardando informacion...' })
      return
    }
    if (creatingDeviceReview) {
      showSpinner({ message: 'Guardando revision...' })
      return
    }
    if (loadingDeviceReviewsByDevice) {
      showSpinner({ message: 'Cargando revisiones...' })
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

    if (successActivateDevice) {
      showAlert({
        type: 'info',
        title: 'Estado actualizado',
        description: 'El dispositivo fue actualizado correctamente.',
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1200,
      })
    }

    if (successUpdateDevice) {
      showAlert({
        type: 'info',
        title: 'Informacion guardada',
        description: 'El dispositivo fue actualizado correctamente.',
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1200,
      })
    }

    if (successCreateDeviceReview) {
      showAlert({
        type: 'info',
        title: 'Revision creada',
        description: 'La revision fue creada correctamente.',
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1200,
      })
    }

    hideSpinner()
    if (error || successActivateDevice || successUpdateDevice || successCreateDeviceReview) {
      resetFlags()
    }
  }, [
    creatingDeviceReview,
    activatingDevice,
    error,
    hideSpinner,
    loadingDevices,
    loadingDevice,
    loadingDeviceReviewsByDevice,
    resetFlags,
    showAlert,
    showSpinner,
    successActivateDevice,
    successCreateDeviceReview,
    successUpdateDevice,
    updatingDevice,
  ])

  useEffect(() => {
    if (!normalizedId) return
    if (devices.some((item) => item.device_id === normalizedId)) return
    if (device?.device_id === normalizedId) return
    void fetchDeviceById(normalizedId)
  }, [device, devices, fetchDeviceById, normalizedId])

  useEffect(() => {
    if (!normalizedId || isEditView || isReviewView) return
    void fetchDeviceReviewsByDeviceId(normalizedId)
  }, [fetchDeviceReviewsByDeviceId, isEditView, isReviewView, normalizedId])

  const selectedDevice = useMemo<InternalDevice | null>(() => {
    if (!normalizedId) return null
    return (
      devices.find((item) => item.device_id === normalizedId) ??
      (device?.device_id === normalizedId ? device : null)
    )
  }, [device, devices, normalizedId])

  const handleOpenDetails = useCallback(
    (deviceRow: InternalDevice) => {
      updateQuery({ id: deviceRow.device_id, view: null })
    },
    [updateQuery],
  )

  const handleCloseDetails = useCallback(() => {
    updateQuery({ id: null, view: null })
  }, [updateQuery])

  const handleToggleActive = useCallback(
    async (deviceRow: InternalDevice) => {
      await activateDevice(deviceRow.device_id)
    },
    [activateDevice],
  )

  const handleRefresh = useCallback(() => {
    fetchDevices(true)
  }, [fetchDevices])

  const handleEditInformation = useCallback(() => {
    const targetId = selectedDevice?.device_id ?? normalizedId
    if (!targetId) return
    updateQuery({ id: targetId, view: 'edit' })
  }, [normalizedId, selectedDevice, updateQuery])

  const handleCreateReview = useCallback(() => {
    const targetId = selectedDevice?.device_id ?? normalizedId
    if (!targetId) return
    updateQuery({ id: targetId, view: 'review' })
  }, [normalizedId, selectedDevice, updateQuery])

  const handleBackToDetails = useCallback(() => {
    if (!normalizedId) return
    updateQuery({ view: null })
  }, [normalizedId, updateQuery])

  return {
    devices,
    openDetails,
    selectedDevice,
    deviceReviewsByDevice,
    isEditView,
    isReviewView,
    handleOpenDetails,
    handleCloseDetails,
    handleToggleActive,
    handleRefresh,
    handleEditInformation,
    handleCreateReview,
    handleBackToDetails,
  }
}

export default useInternalDevicesList

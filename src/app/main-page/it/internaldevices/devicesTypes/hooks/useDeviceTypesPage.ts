'use client'

import { useCallback, useEffect, useMemo } from 'react'
import { shallow } from 'zustand/shallow'

import { usePrincipal } from '@/app/context/PrincipalContext/PrincipalContext'
import { useAuth } from '@/app/context/AuthContext/AuthContext'
import useQuery from '@/app/hooks/useQuery/useQuery'
import type { InternalDeviceType } from '@/app/mappings/internaldevices/internaldevices.types'
import { useInternalDevicesStore } from '@/app/stores/useInternalDevicesStore/useInternalDevicesStore'

/**
 * Hook para cargar la tabla y manejar la vista de tipos de dispositivos.
 */
const useDeviceTypesPage = () => {
  const { currentPagePermissions } = useAuth()
  const { all, updateQuery } = useQuery()
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
  const isCreateView = normalizedView === 'new'
  const isEditView = normalizedView === 'edit'
  const isListView = !isCreateView && !isEditView

  const { usePrincipalAlert, usePrincipalLoading } = usePrincipal()
  const { showSpinner, hideSpinner } = usePrincipalLoading
  const { showAlert } = usePrincipalAlert

  const {
    deviceTypes,
    deviceType,
    fetchDeviceTypes,
    fetchDeviceTypeById,
    deleteDeviceType,
    loadingDeviceTypes,
    creatingDeviceType,
    updatingDeviceType,
    deletingDeviceType,
    activatingDeviceType,
    successCreateDeviceType,
    successUpdateDeviceType,
    successDeleteDeviceType,
    successActivateDeviceType,
    error,
    resetFlags,
  } = useInternalDevicesStore(
    (state) => ({
      deviceTypes: state.deviceTypes,
      deviceType: state.deviceType,
      fetchDeviceTypes: state.fetchDeviceTypes,
      fetchDeviceTypeById: state.fetchDeviceTypeById,
      deleteDeviceType: state.deleteDeviceType,
      loadingDeviceTypes: state.loadingDeviceTypes,
      creatingDeviceType: state.creatingDeviceType,
      updatingDeviceType: state.updatingDeviceType,
      deletingDeviceType: state.deletingDeviceType,
      activatingDeviceType: state.activatingDeviceType,
      successCreateDeviceType: state.successCreateDeviceType,
      successUpdateDeviceType: state.successUpdateDeviceType,
      successDeleteDeviceType: state.successDeleteDeviceType,
      successActivateDeviceType: state.successActivateDeviceType,
      error: state.error,
      resetFlags: state.resetFlags,
    }),
    shallow,
  )

  useEffect(() => {
    fetchDeviceTypes(undefined)
  }, [fetchDeviceTypes])

  useEffect(() => {
    if (loadingDeviceTypes) {
      showSpinner({ message: 'Cargando tipos de dispositivo...' })
      return
    }
    if (creatingDeviceType) {
      showSpinner({ message: 'Guardando tipo de dispositivo...' })
      return
    }
    if (updatingDeviceType) {
      showSpinner({ message: 'Actualizando tipo de dispositivo...' })
      return
    }
    if (deletingDeviceType) {
      showSpinner({ message: 'Desactivando tipo de dispositivo...' })
      return
    }
    if (activatingDeviceType) {
      showSpinner({ message: 'Actualizando estado...' })
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

    if (successCreateDeviceType) {
      showAlert({
        type: 'info',
        title: 'Tipo creado',
        description: 'El tipo de dispositivo fue creado correctamente.',
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1200,
      })
    }

    if (successUpdateDeviceType) {
      showAlert({
        type: 'info',
        title: 'Tipo actualizado',
        description: 'El tipo de dispositivo fue actualizado correctamente.',
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1200,
      })
    }

    if (successDeleteDeviceType) {
      showAlert({
        type: 'info',
        title: 'Tipo desactivado',
        description: 'El tipo de dispositivo fue desactivado correctamente.',
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1200,
      })
    }

    if (successActivateDeviceType) {
      showAlert({
        type: 'info',
        title: 'Estado actualizado',
        description: 'El estado del tipo de dispositivo fue actualizado.',
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1200,
      })
    }

    hideSpinner()

    if (
      error ||
      successCreateDeviceType ||
      successUpdateDeviceType ||
      successDeleteDeviceType ||
      successActivateDeviceType
    ) {
      void fetchDeviceTypes(undefined, true)
      resetFlags()
    }
  }, [
    activatingDeviceType,
    creatingDeviceType,
    deletingDeviceType,
    error,
    fetchDeviceTypes,
    hideSpinner,
    loadingDeviceTypes,
    resetFlags,
    showAlert,
    showSpinner,
    successActivateDeviceType,
    successCreateDeviceType,
    successDeleteDeviceType,
    successUpdateDeviceType,
    updatingDeviceType,
  ])

  useEffect(() => {
    if (!normalizedId || !isEditView) return
    if (deviceTypes.some((item) => item.device_type_id === normalizedId)) return
    if (deviceType?.device_type_id === normalizedId) return
    void fetchDeviceTypeById(normalizedId)
  }, [deviceType, deviceTypes, fetchDeviceTypeById, isEditView, normalizedId])

  const selectedType = useMemo<InternalDeviceType | null>(() => {
    if (!normalizedId) return null
    return (
      deviceTypes.find((item) => item.device_type_id === normalizedId) ??
      (deviceType?.device_type_id === normalizedId ? deviceType : null)
    )
  }, [deviceType, deviceTypes, normalizedId])

  const handleRefresh = useCallback(() => {
    fetchDeviceTypes(undefined, true)
  }, [fetchDeviceTypes])

  const handleOpenCreate = useCallback(() => {
    if (!currentPagePermissions?.createDeviceType) return
    updateQuery({ id: null, view: 'new' })
  }, [currentPagePermissions?.createDeviceType, updateQuery])

  const handleOpenEdit = useCallback(
    (deviceType: InternalDeviceType) => {
      if (!currentPagePermissions?.updateDeviceType) return
      updateQuery({ id: deviceType.device_type_id, view: 'edit' })
    },
    [currentPagePermissions?.updateDeviceType, updateQuery],
  )

  const handleDeleteType = useCallback(
    async (deviceType: InternalDeviceType) => {
      if (!currentPagePermissions?.deleteDeviceType) return
      await deleteDeviceType(deviceType.device_type_id)
    },
    [currentPagePermissions?.deleteDeviceType, deleteDeviceType],
  )

  const handleBackToList = useCallback(() => {
    updateQuery({ id: null, view: null })
  }, [updateQuery])

  return {
    deviceTypes,
    selectedType,
    isCreateView,
    isEditView,
    isListView,
    handleRefresh,
    handleOpenCreate,
    handleOpenEdit,
    handleDeleteType,
    handleBackToList,
  }
}

export default useDeviceTypesPage

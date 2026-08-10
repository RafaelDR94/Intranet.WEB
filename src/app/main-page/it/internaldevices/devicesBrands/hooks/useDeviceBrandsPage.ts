'use client'

import { useCallback, useEffect, useMemo } from 'react'
import { shallow } from 'zustand/shallow'

import { usePrincipal } from '@/app/context/PrincipalContext/PrincipalContext'
import { useAuth } from '@/app/context/AuthContext/AuthContext'
import useQuery from '@/app/hooks/useQuery/useQuery'
import type { InternalDeviceBrand } from '@/app/mappings/internaldevices/internaldevices.types'
import { useInternalDevicesStore } from '@/app/stores/useInternalDevicesStore/useInternalDevicesStore'

/**
 * Hook para cargar la tabla y manejar la vista de marcas de dispositivos.
 */
const useDeviceBrandsPage = () => {
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
    deviceBrands,
    deviceBrand,
    fetchDeviceBrands,
    fetchDeviceBrandById,
    deleteDeviceBrand,
    loadingDeviceBrands,
    creatingDeviceBrand,
    updatingDeviceBrand,
    deletingDeviceBrand,
    activatingDeviceBrand,
    successCreateDeviceBrand,
    successUpdateDeviceBrand,
    successDeleteDeviceBrand,
    successActivateDeviceBrand,
    error,
    resetFlags,
  } = useInternalDevicesStore(
    (state) => ({
      deviceBrands: state.deviceBrands,
      deviceBrand: state.deviceBrand,
      fetchDeviceBrands: state.fetchDeviceBrands,
      fetchDeviceBrandById: state.fetchDeviceBrandById,
      deleteDeviceBrand: state.deleteDeviceBrand,
      loadingDeviceBrands: state.loadingDeviceBrands,
      creatingDeviceBrand: state.creatingDeviceBrand,
      updatingDeviceBrand: state.updatingDeviceBrand,
      deletingDeviceBrand: state.deletingDeviceBrand,
      activatingDeviceBrand: state.activatingDeviceBrand,
      successCreateDeviceBrand: state.successCreateDeviceBrand,
      successUpdateDeviceBrand: state.successUpdateDeviceBrand,
      successDeleteDeviceBrand: state.successDeleteDeviceBrand,
      successActivateDeviceBrand: state.successActivateDeviceBrand,
      error: state.error,
      resetFlags: state.resetFlags,
    }),
    shallow,
  )

  useEffect(() => {
    fetchDeviceBrands(false)
  }, [fetchDeviceBrands])

  useEffect(() => {
    if (loadingDeviceBrands) {
      showSpinner({ message: 'Cargando marcas...' })
      return
    }
    if (creatingDeviceBrand) {
      showSpinner({ message: 'Guardando marca...' })
      return
    }
    if (updatingDeviceBrand) {
      showSpinner({ message: 'Actualizando marca...' })
      return
    }
    if (deletingDeviceBrand) {
      showSpinner({ message: 'Desactivando marca...' })
      return
    }
    if (activatingDeviceBrand) {
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

    if (successCreateDeviceBrand) {
      showAlert({
        type: 'info',
        title: 'Marca creada',
        description: 'La marca fue creada correctamente.',
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1200,
      })
    }

    if (successUpdateDeviceBrand) {
      showAlert({
        type: 'info',
        title: 'Marca actualizada',
        description: 'La marca fue actualizada correctamente.',
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1200,
      })
    }

    if (successDeleteDeviceBrand) {
      showAlert({
        type: 'info',
        title: 'Marca desactivada',
        description: 'La marca fue desactivada correctamente.',
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1200,
      })
    }

    if (successActivateDeviceBrand) {
      showAlert({
        type: 'info',
        title: 'Estado actualizado',
        description: 'El estado de la marca fue actualizado correctamente.',
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1200,
      })
    }

    hideSpinner()

    if (
      error ||
      successCreateDeviceBrand ||
      successUpdateDeviceBrand ||
      successDeleteDeviceBrand ||
      successActivateDeviceBrand
    ) {
      void fetchDeviceBrands(false, true)
      resetFlags()
    }
  }, [
    activatingDeviceBrand,
    creatingDeviceBrand,
    deletingDeviceBrand,
    error,
    fetchDeviceBrands,
    hideSpinner,
    loadingDeviceBrands,
    resetFlags,
    showAlert,
    showSpinner,
    successActivateDeviceBrand,
    successCreateDeviceBrand,
    successDeleteDeviceBrand,
    successUpdateDeviceBrand,
    updatingDeviceBrand,
  ])

  useEffect(() => {
    if (!normalizedId || !isEditView) return
    if (deviceBrands.some((item) => item.device_brand_id === normalizedId)) return
    if (deviceBrand?.device_brand_id === normalizedId) return
    void fetchDeviceBrandById(normalizedId)
  }, [deviceBrand, deviceBrands, fetchDeviceBrandById, isEditView, normalizedId])

  const selectedBrand = useMemo<InternalDeviceBrand | null>(() => {
    if (!normalizedId) return null
    return (
      deviceBrands.find((item) => item.device_brand_id === normalizedId) ??
      (deviceBrand?.device_brand_id === normalizedId ? deviceBrand : null)
    )
  }, [deviceBrand, deviceBrands, normalizedId])

  const handleRefresh = useCallback(() => {
    fetchDeviceBrands(false, true)
  }, [fetchDeviceBrands])

  const handleOpenCreate = useCallback(() => {
    if (!currentPagePermissions?.createDeviceBrand) return
    updateQuery({ id: null, view: 'new' })
  }, [currentPagePermissions?.createDeviceBrand, updateQuery])

  const handleOpenEdit = useCallback(
    (brand: InternalDeviceBrand) => {
      if (!currentPagePermissions?.updateDeviceBrand) return
      updateQuery({ id: brand.device_brand_id, view: 'edit' })
    },
    [currentPagePermissions?.updateDeviceBrand, updateQuery],
  )

  const handleDeleteBrand = useCallback(
    async (brand: InternalDeviceBrand) => {
      if (!currentPagePermissions?.deleteDeviceBrand) return
      await deleteDeviceBrand(brand.device_brand_id)
    },
    [currentPagePermissions?.deleteDeviceBrand, deleteDeviceBrand],
  )

  const handleBackToList = useCallback(() => {
    updateQuery({ id: null, view: null })
  }, [updateQuery])

  return {
    deviceBrands,
    selectedBrand,
    isCreateView,
    isEditView,
    isListView,
    handleRefresh,
    handleOpenCreate,
    handleOpenEdit,
    handleDeleteBrand,
    handleBackToList,
  }
}

export default useDeviceBrandsPage

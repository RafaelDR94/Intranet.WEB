'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { shallow } from 'zustand/shallow'

import { useFirebase } from '@/app/context/FirebaseContext/FirebaseContext'
import { usePrincipal } from '@/app/context/PrincipalContext/PrincipalContext'
import useQuery from '@/app/hooks/useQuery/useQuery'
import { useEmployeesStore } from '@/app/stores/useEmployeesStore/useEmployeesStore'
import { useUsersStore } from '@/app/stores/useUsersStore/useUsersStore'

import type {
  PendingUserActivationPayload,
  PendingUserDetailData,
  PendingUserRow,
} from '../types'
import {
  mapEmployeeSummaryToPendingUserDetailData,
  mapEmployeeSummaryToPendingUserRow,
  mapEmployeeToPendingUserDetailData,
  mapRolesToPendingRoleOptions,
} from '../utilities/pendingUsers.mapper'

type PendingUserFilterValue = 'all' | 'fingerprint-active' | 'fingerprint-inactive'

const matchesFilter = (row: PendingUserRow, filter: PendingUserFilterValue) => {
  switch (filter) {
    case 'fingerprint-active':
      return row.hasFingerprint
    case 'fingerprint-inactive':
      return !row.hasFingerprint
    case 'all':
    default:
      return true
  }
}

const getImageFile = (value: unknown): File | null => {
  if (value instanceof File) return value
  if (!Array.isArray(value)) return null

  const firstImage = value[0] as { file?: unknown } | undefined
  return firstImage?.file instanceof File ? firstImage.file : null
}

const getImageUrl = (value: unknown): string | null => {
  if (typeof value === 'string' && value.trim()) {
    return value.trim()
  }

  if (Array.isArray(value)) {
    const firstImage = value[0] as { url?: unknown } | undefined
    if (
      typeof firstImage?.url === 'string' &&
      firstImage.url.trim()
    ) {
      return firstImage.url.trim()
    }
  }

  if (value && typeof value === 'object') {
    const maybeUrl = (value as { url?: unknown }).url
    if (typeof maybeUrl === 'string' && maybeUrl.trim()) {
      return maybeUrl.trim()
    }
  }

  return null
}

const usePendingUsersPage = () => {
  const { all, updateQuery } = useQuery()
  const { usePrincipalAlert, usePrincipalLoading } = usePrincipal()
  const { firebasestorage } = useFirebase()
  const { showAlert } = usePrincipalAlert
  const { showSpinner, hideSpinner } = usePrincipalLoading
  const [selectedFilter, setSelectedFilter] =
    useState<PendingUserFilterValue>('all')
  const [assignmentPromptEmployeeId, setAssignmentPromptEmployeeId] =
    useState<string | null>(null)
  const [reactivationPromptUser, setReactivationPromptUser] = useState<{
    employeeId: string
    userId: string
  } | null>(null)

  const {
    employeesWithoutActiveUser,
    roles,
    createUser,
    fetchEmployeesWithoutActiveUser,
    fetchEmployeesWithActiveUser,
    fetchRoles,
    creating,
    toggleActive,
    togglingActive,
    loadingWithoutActiveUser,
    loadingWithActiveUser,
    loadingRoles,
    usersStoreError,
    resetFlags: resetUserFlags,
  } = useUsersStore(
    (state) => ({
      employeesWithoutActiveUser: state.employeesWithoutActiveUser,
      roles: state.roles,
      createUser: state.createUser,
      fetchEmployeesWithoutActiveUser: state.fetchEmployeesWithoutActiveUser,
      fetchEmployeesWithActiveUser: state.fetchEmployeesWithActiveUser,
      fetchRoles: state.fetchRoles,
      creating: state.creating,
      toggleActive: state.toggleActive,
      togglingActive: state.togglingActive,
      loadingWithoutActiveUser: state.loadingWithoutActiveUser,
      loadingWithActiveUser: state.loadingWithActiveUser,
      loadingRoles: state.loadingRoles,
      usersStoreError: state.error,
      resetFlags: state.resetFlags,
    }),
    shallow,
  )

  const {
    employeeDetail,
    fetchEmployeeById,
    loadingEmployeeById,
    employeeError,
    resetEmployee,
    resetFlags: resetEmployeeFlags,
  } = useEmployeesStore(
    (state) => ({
      employeeDetail: state.employee,
      fetchEmployeeById: state.fetchEmployeeById,
      loadingEmployeeById: state.loadingById,
      employeeError: state.error,
      resetEmployee: state.resetEmployee,
      resetFlags: state.resetFlags,
    }),
    shallow,
  )

  const selectedUserId = useMemo(() => {
    const raw = all.id
    if (Array.isArray(raw)) return raw[0] ?? null
    if (typeof raw === 'string' && raw.trim()) return raw
    return null
  }, [all.id])

  useEffect(() => {
    void fetchEmployeesWithoutActiveUser(true)
    void fetchRoles(false)
  }, [fetchEmployeesWithoutActiveUser, fetchRoles])

  useEffect(() => {
    if (!selectedUserId) {
      resetEmployee()
      return
    }

    void fetchEmployeeById(selectedUserId, false)
  }, [fetchEmployeeById, resetEmployee, selectedUserId])

  useEffect(() => {
    if (creating) {
      showSpinner({ message: 'Activando cuenta...' })
      return
    }

    if (togglingActive) {
      showSpinner({ message: 'Reactivando cuenta...' })
      return
    }

    if (loadingEmployeeById) {
      showSpinner({ message: 'Cargando detalle del empleado...' })
      return
    }

    if (loadingWithoutActiveUser) {
      showSpinner({ message: 'Cargando cuentas por activar...' })
      return
    }

    if (loadingWithActiveUser) {
      showSpinner({ message: 'Actualizando cuentas activadas...' })
      return
    }

    if (loadingRoles) {
      showSpinner({ message: 'Cargando roles de usuario...' })
      return
    }

    hideSpinner()
  }, [
    creating,
    hideSpinner,
    loadingEmployeeById,
    loadingRoles,
    loadingWithActiveUser,
    loadingWithoutActiveUser,
    showSpinner,
    togglingActive,
  ])

  useEffect(() => {
    if (!usersStoreError || selectedUserId) return

    showAlert({
      type: 'error',
      title: 'Ocurrio un error',
      description: usersStoreError,
      showPrimaryButton: false,
      showSecondaryButton: false,
      autoCloseMs: 1600,
    })
    resetUserFlags()
  }, [resetUserFlags, selectedUserId, showAlert, usersStoreError])

  useEffect(() => {
    if (!employeeError || employeeDetail?.employee_id === selectedUserId) return

    showAlert({
      type: 'error',
      title: 'No fue posible cargar el detalle',
      description: employeeError,
      showPrimaryButton: false,
      showSecondaryButton: false,
      autoCloseMs: 1600,
    })
    updateQuery({ id: null, label: null })
    resetEmployee()
    resetEmployeeFlags()
  }, [
    employeeDetail?.employee_id,
    employeeError,
    resetEmployee,
    resetEmployeeFlags,
    selectedUserId,
    showAlert,
    updateQuery,
  ])

  const rows = useMemo(
    () => employeesWithoutActiveUser.map(mapEmployeeSummaryToPendingUserRow),
    [employeesWithoutActiveUser],
  )

  const filteredRows = useMemo(
    () => rows.filter((row) => matchesFilter(row, selectedFilter)),
    [rows, selectedFilter],
  )

  const selectedSummary = useMemo(
    () =>
      selectedUserId
        ? employeesWithoutActiveUser.find(
            (item) => item.employee_id === selectedUserId,
          ) ?? null
        : null,
    [employeesWithoutActiveUser, selectedUserId],
  )

  const selectedUser = useMemo<PendingUserDetailData | null>(() => {
    if (!selectedUserId) return null

    if (employeeDetail?.employee_id === selectedUserId) {
      return mapEmployeeToPendingUserDetailData(employeeDetail, selectedSummary)
    }

    return selectedSummary
      ? mapEmployeeSummaryToPendingUserDetailData(selectedSummary)
      : null
  }, [employeeDetail, selectedSummary, selectedUserId])

  const roleOptions = useMemo(
    () => mapRolesToPendingRoleOptions(roles),
    [roles],
  )

  const handleFilterChange = useCallback((value: string) => {
    const allowedValues: PendingUserFilterValue[] = [
      'all',
      'fingerprint-active',
      'fingerprint-inactive',
    ]

    setSelectedFilter(
      allowedValues.includes(value as PendingUserFilterValue)
        ? (value as PendingUserFilterValue)
        : 'all',
    )
  }, [])

  const handleOpenActivation = useCallback(
    async (row: PendingUserRow) => {
      const employee = await fetchEmployeeById(row.id, true)
      const existingUser = employee?.user

      if (existingUser?.user_id) {
        setReactivationPromptUser({
          employeeId: row.id,
          userId: existingUser.user_id,
        })
        return
      }

      updateQuery({
        id: row.id,
        label: 'Activar Empleado',
      })
    },
    [fetchEmployeeById, updateQuery],
  )

  const handleCloseActivation = useCallback(() => {
    updateQuery({ id: null, label: null })
  }, [updateQuery])

  const handleCloseAssignmentPrompt = useCallback(() => {
    setAssignmentPromptEmployeeId(null)
  }, [])

  const handleCloseReactivationPrompt = useCallback(() => {
    setReactivationPromptUser(null)
  }, [])

  const handleSkipDeviceAssignment = useCallback(() => {
    handleCloseAssignmentPrompt()
    updateQuery({ id: null, label: null })
    showAlert({
      type: 'success',
      title: 'Cuenta activada',
      description: 'La cuenta del empleado se activo correctamente.',
      showPrimaryButton: false,
      showSecondaryButton: false,
      autoCloseMs: 1800,
    })
  }, [handleCloseAssignmentPrompt, showAlert, updateQuery])

  const handleGoToDeviceAssignment = useCallback(() => {
    if (!assignmentPromptEmployeeId) {
      handleSkipDeviceAssignment()
      return
    }

    handleCloseAssignmentPrompt()
    updateQuery({
      id: null,
      label: null,
    })

    window.location.assign(
      `/main-page/it/internaldevices/internaldevicesasignation?view=new&employeeId=${encodeURIComponent(
        assignmentPromptEmployeeId,
      )}`,
    )
  }, [
    assignmentPromptEmployeeId,
    handleCloseAssignmentPrompt,
    handleSkipDeviceAssignment,
    updateQuery,
  ])

  const handleConfirmReactivation = useCallback(async () => {
    if (!reactivationPromptUser?.userId) {
      handleCloseReactivationPrompt()
      return
    }

    const success = await toggleActive({
      id: reactivationPromptUser.userId,
      isActive: true,
    })

    if (!success) {
      const description =
        useUsersStore.getState().error ??
        'No fue posible reactivar la cuenta del usuario.'
      showAlert({
        type: 'error',
        title: 'Error al reactivar usuario',
        description,
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 2200,
      })
      return
    }

    await Promise.all([
      fetchEmployeesWithoutActiveUser(true),
      fetchEmployeesWithActiveUser(true),
    ])

    handleCloseReactivationPrompt()
    showAlert({
      type: 'success',
      title: 'Usuario reactivado',
      description: 'La cuenta del usuario se reactivo correctamente.',
      showPrimaryButton: false,
      showSecondaryButton: false,
      autoCloseMs: 1800,
    })
  }, [
    fetchEmployeesWithActiveUser,
    fetchEmployeesWithoutActiveUser,
    handleCloseReactivationPrompt,
    reactivationPromptUser?.userId,
    showAlert,
    toggleActive,
  ])

  const handleActivateUser = useCallback(
    async (payload: PendingUserActivationPayload) => {
      if (!selectedUser) {
        showAlert({
          type: 'warning',
          title: 'Empleado no disponible',
          description:
            'No se encontro el detalle del empleado para completar la activacion.',
          showPrimaryButton: false,
          showSecondaryButton: false,
          autoCloseMs: 1800,
        })
        return
      }

      const username = String(payload.email ?? '').trim()
      const password = String(payload.provisionalPassword ?? '')
      const roleId = String(payload.userRoleId ?? '').trim()
      const phoneNumber = String(payload.businessPhone ?? '').trim()
      const signature = String(payload.signature ?? '')

      if (!username || !password || !roleId) {
        showAlert({
          type: 'warning',
          title: 'Informacion incompleta',
          description:
            'Completa los campos obligatorios antes de activar la cuenta.',
          showPrimaryButton: false,
          showSecondaryButton: false,
          autoCloseMs: 1800,
        })
        return
      }

      try {
        let imageUrl =
          getImageUrl(payload.profileImage) ??
          selectedUser.avatarUrl ??
          ''

        const selectedImage = getImageFile(payload.profileImage)
        if (selectedImage) {
          if (!firebasestorage?.uploadImage) {
            throw new Error(
              'Firebase no esta disponible para subir la imagen del empleado.',
            )
          }

          showSpinner({ message: 'Subiendo imagen del empleado...' })
          imageUrl = await firebasestorage.uploadImage(
            selectedImage,
            `Employees/${selectedUser.id}/profileImage.jpg`,
          )
        }

        const createdUser = await createUser({
          username,
          imageUrl,
          phoneNumber,
          isGerence: Boolean(payload.managerialPermissions),
          drFingerprint: Boolean(payload.hasFingerprint),
          password,
          signature,
          roleId,
          employeeId: selectedUser.id,
          changePassword: Boolean(payload.changePasswordOnNextLogin),
        })

        const createdAccount =
          createdUser ??
          useUsersStore
            .getState()
            .users.find(
              (user) =>
                user.employee_id === selectedUser.id ||
                user.idemployee === selectedUser.id ||
                user.username === username,
            ) ??
          null

        if (!createdAccount) {
          const backendError =
            useUsersStore.getState().error ??
            'No fue posible confirmar la creacion de la cuenta.'

          resetUserFlags()
          showAlert({
            type: 'error',
            title: 'Error al activar cuenta',
            description: backendError,
            showPrimaryButton: false,
            showSecondaryButton: false,
            autoCloseMs: 2200,
          })
          return
        }

        await Promise.all([
          fetchEmployeesWithoutActiveUser(true),
          fetchEmployeesWithActiveUser(true),
        ])
        setAssignmentPromptEmployeeId(selectedUser.id)
        resetUserFlags()
      } catch (error) {
        const description =
          error instanceof Error
            ? error.message
            : 'Ocurrio un error al activar la cuenta.'

        resetUserFlags()
        showAlert({
          type: 'error',
          title: 'Error al activar cuenta',
          description,
          showPrimaryButton: false,
          showSecondaryButton: false,
          autoCloseMs: 2200,
        })
      }
    },
    [
      createUser,
      fetchEmployeesWithActiveUser,
      fetchEmployeesWithoutActiveUser,
      firebasestorage,
      resetUserFlags,
      selectedUser,
      showAlert,
      showSpinner,
    ],
  )

  return {
    assignmentPromptEmployeeId,
    assignmentPromptOpen: Boolean(assignmentPromptEmployeeId),
    filteredRows,
    isActivationOpen: Boolean(selectedUserId),
    reactivationPromptOpen: Boolean(reactivationPromptUser),
    roleOptions,
    selectedFilter,
    selectedUser,
    handleActivateUser,
    handleCloseActivation,
    handleCloseAssignmentPrompt,
    handleCloseReactivationPrompt,
    handleConfirmReactivation,
    handleFilterChange,
    handleGoToDeviceAssignment,
    handleOpenActivation,
    handleSkipDeviceAssignment,
  }
}

export default usePendingUsersPage

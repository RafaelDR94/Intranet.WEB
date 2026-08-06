'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { shallow } from 'zustand/shallow'

import { usePrincipal } from '@/app/context/PrincipalContext/PrincipalContext'
import { useAuth } from '@/app/context/AuthContext/AuthContext'
import useQuery from '@/app/hooks/useQuery/useQuery'
import { useEmployeesStore } from '@/app/stores/useEmployeesStore/useEmployeesStore'
import { useUsersStore } from '@/app/stores/useUsersStore/useUsersStore'

import type { ActivatedUserRow, UserAccountDetailData } from '../types'
import {
  mapAssignedDevices,
  mapEmployeeToUserAccountDetailData,
  mapEmployeeSummaryToActivatedUserRow,
  mapEmployeeSummaryToUserAccountDetailData,
} from '../utilities/userList.mapper'

type UserFilterValue =
  | 'all'
  | 'active'
  | 'inactive'
  | 'fingerprint-active'
  | 'fingerprint-inactive'

const matchesFilter = (row: ActivatedUserRow, filter: UserFilterValue) => {
  switch (filter) {
    case 'active':
      return row.isActive
    case 'inactive':
      return !row.isActive
    case 'fingerprint-active':
      return row.hasFingerprint
    case 'fingerprint-inactive':
      return !row.hasFingerprint
    case 'all':
    default:
      return true
  }
}

const useActivatedUsersPage = () => {
  const { currentPagePermissions } = useAuth()
  const { all, updateQuery } = useQuery()
  const { usePrincipalAlert, usePrincipalLoading } = usePrincipal()
  const { showAlert } = usePrincipalAlert
  const { showSpinner, hideSpinner } = usePrincipalLoading
  const [selectedFilter, setSelectedFilter] = useState<UserFilterValue>('all')

  const {
    employeesWithActiveUser,
    userDetail,
    fetchEmployeesWithActiveUser,
    fetchUserById,
    loadingWithActiveUser,
    loadingUserById,
    usersStoreError,
    resetFlags: resetUserFlags,
    resetUser,
  } = useUsersStore(
    (state) => ({
      employeesWithActiveUser: state.employeesWithActiveUser,
      userDetail: state.user,
      fetchEmployeesWithActiveUser: state.fetchEmployeesWithActiveUser,
      fetchUserById: state.fetchUserById,
      loadingWithActiveUser: state.loadingWithActiveUser,
      loadingUserById: state.loadingById,
      usersStoreError: state.error,
      resetFlags: state.resetFlags,
      resetUser: state.resetUser,
    }),
    shallow,
  )

  const {
    employeeDetail,
    devicesAssignedHistory,
    fetchEmployeeById,
    fetchDevicesAssignedByEmployeeId,
    loadingEmployeeById,
    employeeError,
    resetEmployee,
    resetEmployeeFlags,
  } = useEmployeesStore(
    (state) => ({
      employeeDetail: state.employee,
      devicesAssignedHistory: state.devicesAssignedHistory,
      fetchEmployeeById: state.fetchEmployeeById,
      fetchDevicesAssignedByEmployeeId: state.fetchDevicesAssignedByEmployeeId,
      loadingEmployeeById: state.loadingById,
      employeeError: state.error,
      resetEmployee: state.resetEmployee,
      resetEmployeeFlags: state.resetFlags,
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
    void fetchEmployeesWithActiveUser(true)
  }, [fetchEmployeesWithActiveUser])

  useEffect(() => {
    if (loadingEmployeeById) {
      showSpinner({ message: 'Cargando detalle del empleado...' })
      return
    }

    if (loadingUserById) {
      showSpinner({ message: 'Cargando Información del usuario...' })
      return
    }

    if (loadingWithActiveUser) {
      showSpinner({ message: 'Cargando cuentas activadas...' })
      return
    }

    hideSpinner()
  }, [
    hideSpinner,
    loadingEmployeeById,
    loadingWithActiveUser,
    loadingUserById,
    showSpinner,
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
    if (!selectedUserId) {
      resetEmployee()
      resetUser()
      return
    }

    void fetchEmployeeById(selectedUserId, false)
  }, [fetchEmployeeById, resetEmployee, resetUser, selectedUserId])

  useEffect(() => {
    const userId = employeeDetail?.user?.user_id
    if (!selectedUserId || !userId) return

    void fetchUserById(userId, false)
  }, [employeeDetail?.user?.user_id, fetchUserById, selectedUserId])

  useEffect(() => {
    if (!selectedUserId) return

    void fetchDevicesAssignedByEmployeeId(selectedUserId, false)
  }, [fetchDevicesAssignedByEmployeeId, selectedUserId])

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
    resetEmployeeFlags()
  }, [
    employeeDetail?.employee_id,
    employeeError,
    resetEmployeeFlags,
    selectedUserId,
    showAlert,
  ])

  useEffect(() => {
    const shouldHandleUserError =
      Boolean(selectedUserId) &&
      Boolean(employeeDetail?.user?.user_id) &&
      !loadingUserById &&
      Boolean(usersStoreError)

    if (!shouldHandleUserError) return

    showAlert({
      type: 'error',
      title: 'No fue posible cargar la Información del usuario',
      description: usersStoreError!,
      showPrimaryButton: false,
      showSecondaryButton: false,
      autoCloseMs: 1600,
    })
    resetUserFlags()
  }, [
    employeeDetail?.user?.user_id,
    loadingUserById,
    resetUserFlags,
    selectedUserId,
    showAlert,
    usersStoreError,
  ])

  const rows = useMemo(
    () => employeesWithActiveUser.map(mapEmployeeSummaryToActivatedUserRow),
    [employeesWithActiveUser],
  )

  const filteredRows = useMemo(
    () => rows.filter((row) => matchesFilter(row, selectedFilter)),
    [rows, selectedFilter],
  )

  const selectedSummary = useMemo(
    () =>
      selectedUserId
        ? employeesWithActiveUser.find(
            (item) => item.employee_id === selectedUserId,
          ) ?? null
        : null,
    [employeesWithActiveUser, selectedUserId],
  )

  const selectedUser = useMemo<UserAccountDetailData | null>(() => {
    if (!selectedUserId) return null

    const assignedDevices = mapAssignedDevices(
      employeeDetail?.employee_id === selectedUserId ? devicesAssignedHistory : [],
    )

    if (
      employeeDetail?.employee_id === selectedUserId
    ) {
      return mapEmployeeToUserAccountDetailData(
        employeeDetail,
        selectedSummary,
        userDetail,
        assignedDevices,
      )
    }

    return selectedSummary
      ? mapEmployeeSummaryToUserAccountDetailData(selectedSummary)
      : null
  }, [
    devicesAssignedHistory,
    employeeDetail,
    selectedSummary,
    selectedUserId,
    userDetail,
  ])

  const handleFilterChange = useCallback((value: string) => {
    const allowedValues: UserFilterValue[] = [
      'all',
      'active',
      'inactive',
      'fingerprint-active',
      'fingerprint-inactive',
    ]

    setSelectedFilter(
      allowedValues.includes(value as UserFilterValue)
        ? (value as UserFilterValue)
        : 'all',
    )
  }, [])

  const handleOpenDetails = useCallback((row: ActivatedUserRow) => {
    if (!currentPagePermissions?.viewUserDetails) return
    updateQuery({ id: row.id })
  }, [currentPagePermissions?.viewUserDetails, updateQuery])

  const handleCloseDetails = useCallback(() => {
    updateQuery({ id: null })
  }, [updateQuery])

  return {
    filteredRows,
    isDetailOpen: Boolean(selectedUserId),
    selectedFilter,
    selectedUser,
    handleFilterChange,
    handleOpenDetails,
    handleCloseDetails,
  }
}

export default useActivatedUsersPage

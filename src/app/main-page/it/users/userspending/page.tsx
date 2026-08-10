'use client'

import React, { useMemo } from 'react'

import ActionMenuCell from '@/app/components/ActionMenuCell/ActionMenuCell'
import Avatar from '@/app/components/Avatar/Avatar'
import { DataTable } from '@/app/components/DataTable/DataTable'
import { useIsMobile } from '@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery'
import type {
  ColumnDefinition,
  DataTableFilterOption,
} from '@/app/components/DataTable/types'
import { PopUp } from '@/app/components/PopUp/PopUp'
import FingerprintCheckIcon from '@/assets/icons/Identy/fingerprint-check-circle.svg'
import FingerprintErrorIcon from '@/assets/icons/Identy/fingerprint-error-circle.svg'

import PendingUserActivation from './components/PendingUserActivation/PendingUserActivation'
import usePendingUsersPage from './hooks/usePendingUsersPage'
import type { PendingUserRow } from './types'
import { useAuth } from '@/app/context/AuthContext/AuthContext'

type PendingUserFilterValue = 'all' | 'fingerprint-active' | 'fingerprint-inactive'

const FILTER_OPTIONS: DataTableFilterOption<PendingUserRow, PendingUserFilterValue>[] = [
  { label: 'Todos', value: 'all' },
  { label: 'Con huella activa', value: 'fingerprint-active' },
  { label: 'Sin huella activa', value: 'fingerprint-inactive' },
]

const SEARCHABLE_KEYS: (keyof PendingUserRow)[] = [
  'fullname',
  'department',
  'position',
  'employeeNumber',
]

const PendingUsersPage = () => {
  const isMobile = useIsMobile()
  const { currentPagePermissions } = useAuth()
  const {
    assignmentPromptOpen,
    filteredRows,
    isActivationOpen,
    reactivationPromptOpen,
    roleOptions,
    selectedFilter,
    selectedUser,
    handleActivateUser,
    handleCloseActivation,
    handleCloseReactivationPrompt,
    handleConfirmReactivation,
    handleFilterChange,
    handleGoToDeviceAssignment,
    handleOpenActivation,
    handleSkipDeviceAssignment,
  } = usePendingUsersPage()

  const columnsDesktop = useMemo<ColumnDefinition<PendingUserRow>[]>(
    () => [
      {
        key: 'fullname',
        label: 'IMAGEN',
        cellClass: 'w-[7%] min-w-0 px-2',
        headerClass: 'w-[7%] min-w-0 px-2',
        render: (row) => (
          <div className="flex justify-center">
            <Avatar
              src={row.avatarUrl}
              alt={row.fullname}
              size="xxs"
              online={false}
            />
          </div>
        ),
      },
      {
        key: 'fullname',
        label: 'NOMBRE',
        cellClass: 'w-[16%] min-w-0 px-2',
        headerClass: 'w-[16%] min-w-0 px-2',
      },
      {
        key: 'department',
        label: 'DEPARTAMENTOS',
        cellClass: 'w-[23%] min-w-0 px-2',
        headerClass: 'w-[23%] min-w-0 px-2',
      },
      {
        key: 'position',
        label: 'PUESTO',
        cellClass: 'w-[24%] min-w-0 px-2',
        headerClass: 'w-[24%] min-w-0 px-2',
      },
      {
        key: 'employeeNumber',
        label: 'NO. EMPLEADO',
        cellClass: 'w-[12%] min-w-0 px-2',
        headerClass: 'w-[12%] min-w-0 px-2',
      },
      {
        key: 'hasFingerprint',
        label: 'HUELLA',
        cellClass: 'w-[8%] min-w-0 px-2',
        headerClass: 'w-[8%] min-w-0 px-2',
        render: (row) => (
          <div className="flex justify-center">
            {row.hasFingerprint ? (
              <FingerprintCheckIcon className="text-green-70" />
            ) : (
              <FingerprintErrorIcon className="text-alert-red-100" />
            )}
          </div>
        ),
      },
      {
        key: 'actions' as keyof PendingUserRow,
        label: '',
        cellClass: 'w-[6%] min-w-0 px-2',
        headerClass: 'w-[6%] min-w-0 px-2',
        render: (row) => (
          <div className="flex justify-end">
            <ActionMenuCell
              row={row}
              editLabel="Activar"
              onEdit={() => handleOpenActivation(row)}
              permissions={{ update: Boolean(currentPagePermissions?.activateUser || currentPagePermissions?.reactivateUser) }}
            />
          </div>
        ),
      },
    ],
    [currentPagePermissions?.activateUser, currentPagePermissions?.reactivateUser, handleOpenActivation],
  )

  const columnsMobile = useMemo<ColumnDefinition<PendingUserRow>[]>(
    () => [
      {
        key: 'fullname',
        label: 'NOMBRE',
        cellClass: 'w-8/12 min-w-0 px-2',
        headerClass: 'w-8/12 min-w-0 px-2',
        render: (row) => (
          <div className="flex items-center gap-3">
            <Avatar
              src={row.avatarUrl}
              alt={row.fullname}
              size="xxs"
              online={false}
            />
            <div className="min-w-0">
              <p className="truncate">{row.fullname}</p>
              <p className="truncate text-d4 text-gray-70">{row.department}</p>
            </div>
          </div>
        ),
      },
      {
        key: 'hasFingerprint',
        label: 'HUELLA',
        cellClass: 'w-2/12 min-w-0 px-2',
        headerClass: 'w-2/12 min-w-0 px-2',
        render: (row) => (
          <div className="flex justify-center">
            {row.hasFingerprint ? (
              <FingerprintCheckIcon className="text-green-70" />
            ) : (
              <FingerprintErrorIcon className="text-alert-red-100" />
            )}
          </div>
        ),
      },
      {
        key: 'actions' as keyof PendingUserRow,
        label: '',
        cellClass: 'w-2/12 min-w-0 px-2',
        headerClass: 'w-2/12 min-w-0 px-2',
        render: (row) => (
          <div className="flex justify-end">
            <ActionMenuCell
              row={row}
              editLabel="Activar"
              onEdit={() => handleOpenActivation(row)}
              permissions={{ update: Boolean(currentPagePermissions?.activateUser || currentPagePermissions?.reactivateUser) }}
            />
          </div>
        ),
      },
    ],
    [currentPagePermissions?.activateUser, currentPagePermissions?.reactivateUser, handleOpenActivation],
  )

  return (
    <>
      {isActivationOpen ? (
        <PendingUserActivation
          user={selectedUser}
          roleOptions={roleOptions}
          onActivate={handleActivateUser}
          onClose={handleCloseActivation}
        />
      ) : (
        <div data-tour="it-users-pending-table">
          <DataTable<PendingUserRow>
            tables={[
              {
                title: 'Nuevas cuentas por activar',
                columns: isMobile ? columnsMobile : columnsDesktop,
                data: filteredRows,
                enableCollaps: true,
                enableSelection: false,
              },
            ]}
            textSize={{ mobile: 'text-d3', desktop: 'text-c2' }}
            enableInternalSearch
            searchableKeys={SEARCHABLE_KEYS}
            showCalendar={false}
            showFilter
            showRefresh={false}
            showButton={false}
            filterTitle="Filtros"
            filterOptions={FILTER_OPTIONS}
            filterValue={selectedFilter}
            onFilterChange={handleFilterChange}
            dataTableTitle="Cuentas por Activar"
          />
        </div>
      )}

      <PopUp
        open={assignmentPromptOpen}
        onClose={handleSkipDeviceAssignment}
        title="Asignación de dispositivo"
        content="Se ha creado un nuevo usuario ¿Deseas asignarle un dispositivo?"
        showPrimaryButton
        showSecondaryButton
        primaryButtonText="Asignar dispositivo"
        secondaryButtonText="No asignar"
        onPrimaryButtonClick={handleGoToDeviceAssignment}
        onSecondaryButtonClick={handleSkipDeviceAssignment}
      />
      <PopUp
        open={reactivationPromptOpen}
        onClose={handleCloseReactivationPrompt}
        title="Re-activar usuario"
        content="Este empleado ya cuenta con un usuario. ¿Deseas re-activarlo?"
        showPrimaryButton
        showSecondaryButton
        primaryButtonText="Si, re-activar"
        secondaryButtonText="Cancelar"
        onPrimaryButtonClick={handleConfirmReactivation}
        onSecondaryButtonClick={handleCloseReactivationPrompt}
      />
    </>
  )
}

export default PendingUsersPage

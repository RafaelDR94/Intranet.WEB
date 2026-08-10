'use client'

import { useMemo } from 'react'

import ActionMenuCell from '@/app/components/ActionMenuCell/ActionMenuCell'
import Avatar from '@/app/components/Avatar/Avatar'
import { DataTable } from '@/app/components/DataTable/DataTable'
import { useIsMobile } from '@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery'
import type {
  ColumnDefinition,
  DataTableFilterOption,
} from '@/app/components/DataTable/types'
import FingerprintCheckIcon from '@/assets/icons/Identy/fingerprint-check-circle.svg'
import FingerprintErrorIcon from '@/assets/icons/Identy/fingerprint-error-circle.svg'
import type { ActivatedUserRow } from './types'
import UserAccountDetail from './components/UserAccountDetail/UserAccountDetail'
import useActivatedUsersPage from './hooks/useActivatedUsersPage'
import { useAuth } from '@/app/context/AuthContext/AuthContext'

type UserFilterValue =
  | 'all'
  | 'active'
  | 'inactive'
  | 'fingerprint-active'
  | 'fingerprint-inactive'

const FILTER_OPTIONS: DataTableFilterOption<ActivatedUserRow, UserFilterValue>[] = [
  { label: 'Todos', value: 'all' },
  { label: 'Usuarios activos', value: 'active' },
  { label: 'Usuarios desactivados', value: 'inactive' },
  { label: 'Con huella activa', value: 'fingerprint-active' },
  { label: 'Sin huella activa', value: 'fingerprint-inactive' },
]

const SEARCHABLE_KEYS: (keyof ActivatedUserRow)[] = [
  'fullname',
  'department',
  'position',
  'employeeNumber',
]

const ActivatedUsersPage = () => {
  const isMobile = useIsMobile()
  const { currentPagePermissions } = useAuth()
  const {
    filteredRows,
    isDetailOpen,
    selectedFilter,
    selectedUser,
    handleFilterChange,
    handleOpenDetails,
    handleCloseDetails,
  } = useActivatedUsersPage()

  const columnsDesktop = useMemo<ColumnDefinition<ActivatedUserRow>[]>(
    () => [
      {
        key: 'avatarUrl',
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
        key: 'actions' as keyof ActivatedUserRow,
        label: '',
        cellClass: 'w-[6%] min-w-0 px-2',
        headerClass: 'w-[6%] min-w-0 px-2',
        render: (row) => (
          <div className="flex justify-end">
            <ActionMenuCell
              row={row}
              editLabel="Ver detalle"
              onDetails={() => handleOpenDetails(row)}
              permissions={{ details: Boolean(currentPagePermissions?.viewUserDetails) }}
            />
          </div>
        ),
      },
    ],
    [currentPagePermissions?.viewUserDetails, handleOpenDetails],
  )

  const columnsMobile = useMemo<ColumnDefinition<ActivatedUserRow>[]>(
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
        key: 'actions' as keyof ActivatedUserRow,
        label: '',
        cellClass: 'w-2/12 min-w-0 px-2',
        headerClass: 'w-2/12 min-w-0 px-2',
        render: (row) => (
          <div className="flex justify-end">
            <ActionMenuCell
              row={row}
              editLabel="Ver detalle"
              onDetails={() => handleOpenDetails(row)}
              permissions={{ details: Boolean(currentPagePermissions?.viewUserDetails) }}
            />
          </div>
        ),
      },
    ],
    [currentPagePermissions?.viewUserDetails, handleOpenDetails],
  )

  return (
    <>
      <div data-tour="it-users-list-table">
        <DataTable<ActivatedUserRow>
          tables={[
            {
              title: 'Cuentas Activadas',
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
          dataTableTitle="Cuentas Activadas"
        />
      </div>

      <UserAccountDetail
        open={isDetailOpen}
        onClose={handleCloseDetails}
        user={selectedUser}
      />
    </>
  )
}

export default ActivatedUsersPage

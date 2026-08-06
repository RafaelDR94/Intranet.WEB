import { useCallback, useMemo, useState } from 'react'

import ActionMenuCell from '@/app/components/ActionMenuCell/ActionMenuCell'
import { useAuth } from '@/app/context/AuthContext/AuthContext'
import { useIsMobile } from '@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery'
import type {
  ColumnDefinition,
  DataTableFilterGroup,
} from '@/app/components/DataTable/types'
import Label from '@/app/components/Label/Label'
import type { InternalDevice } from '@/app/mappings/internaldevices/internaldevices.types'

import type {
  AssignmentFilterValue,
  InternalDeviceRow,
  ReviewFilterValue,
  StatusFilterOption,
  StatusFilterValue,
} from '../types'
import {
  ASSIGNMENT_FILTER_OPTIONS,
  DEFAULT_STATUS_FILTER,
  INTERNAL_DEVICE_SEARCHABLE_KEYS,
  REVIEW_FILTER_OPTIONS,
  STATUS_FILTER_OPTIONS,
  isAssignmentFilterValue,
  isReviewFilterValue,
  isStatusFilterValue,
  matchesAssignmentFilter,
  matchesReviewFilter,
  matchesStatusFilter,
  sortInternalDevicesByCreationDate,
  statusToLabelType,
} from '../utilities/internalDevicesListTable'

type UseInternalDevicesListTableParams = {
  devices: InternalDevice[]
  onOpenDetails: (row: InternalDeviceRow) => void
  onDeleteDevice: (row: InternalDeviceRow) => void
}

type UseInternalDevicesListTableResult = {
  columns: ColumnDefinition<InternalDeviceRow>[]
  rows: InternalDeviceRow[]
  searchableKeys: (keyof InternalDeviceRow)[]
  statusFilter: StatusFilterValue
  statusFilterOptions: StatusFilterOption[]
  handleStatusFilterChange: (value: string) => void
  filterGroups: DataTableFilterGroup<InternalDeviceRow>[]
}

/**
 * Encapsulates table state, columns, and filtering for internal devices list.
 */
const useInternalDevicesListTable = ({
  devices,
  onOpenDetails,
  onDeleteDevice,
}: UseInternalDevicesListTableParams): UseInternalDevicesListTableResult => {
  const { currentPagePermissions } = useAuth()
  const isMobile = useIsMobile()
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>(
    DEFAULT_STATUS_FILTER,
  )
  const [assignmentFilter, setAssignmentFilter] =
    useState<AssignmentFilterValue>('all')
  const [reviewFilter, setReviewFilter] = useState<ReviewFilterValue>('all')

  const rows = useMemo<InternalDeviceRow[]>(
    () =>
      sortInternalDevicesByCreationDate(devices).map((device, index) => ({
        ...device,
        id: device.device_id || String(index + 1),
        display_id: String(index + 1).padStart(3, '0'),
      })),
    [devices],
  )

  const columnsDesktop = useMemo<ColumnDefinition<InternalDeviceRow>[]>(
    () => [
      {
        key: 'display_id',
        label: 'ID',
        cellClass: 'w-[5%] min-w-0 px-2',
        headerClass: 'w-[5%] min-w-0 px-2',
      },
      {
        key: 'device_status',
        label: 'ESTATUS',
        cellClass: 'w-[11%] min-w-0 px-2',
        headerClass: 'w-[11%] min-w-0 px-2',
        render: (row) => (
          <Label
            type={statusToLabelType(row.device_status?.name)}
            text={row.device_status?.name ?? 'SIN ESTATUS'}
          />
        ),
      },
      {
        key: 'device_type',
        label: 'DISPOSITIVO',
        cellClass: 'w-[10%] min-w-0 px-2',
        headerClass: 'w-[10%] min-w-0 px-2',
        render: (row) => (
          <span className="block w-full truncate">{row.device_type?.name ?? '-'}</span>
        ),
      },
      {
        key: 'device_brand',
        label: 'MARCA',
        cellClass: 'w-[9%] min-w-0 px-2',
        headerClass: 'w-[9%] min-w-0 px-2',
        render: (row) => (
          <span className="block w-full truncate">{row.device_brand?.name ?? '-'}</span>
        ),
      },
      {
        key: 'model',
        label: 'MODELO',
        cellClass: 'w-[11%] min-w-0 px-2',
        headerClass: 'w-[11%] min-w-0 px-2',
      },
      {
        key: 'serial_number',
        label: 'No. SERIE',
        cellClass: 'w-[12%] min-w-0 px-2',
        headerClass: 'w-[12%] min-w-0 px-2',
      },
      {
        key: 'name',
        label: 'NOMBRE',
        cellClass: 'w-[12%] min-w-0 px-2',
        headerClass: 'w-[12%] min-w-0 px-2',
      },
      {
        key: 'assigned',
        label: 'ASIGNADO',
        cellClass: 'w-[10%] min-w-0 px-2',
        headerClass: 'w-[10%] min-w-0 px-2',
        render: (row) => (
          <Label
            type={row.assigned ? 'asignado' : 'sin-asignar'}
            text={row.assigned ? 'ASIGNADO' : 'SIN ASIGNAR'}
          />
        ),
      },
      {
        key: 'reviewed',
        label: 'REVISIÓN',
        cellClass: 'w-[10%] min-w-0 px-2',
        headerClass: 'w-[10%] min-w-0 px-2',
        render: (row) => (
          <Label
            type={row.reviewed ? 'valido' : 'prohibido'}
            text={row.reviewed ? 'REVISADO' : 'SIN REVISIÓN'}
          />
        ),
      },
      {
        key: 'actions' as keyof InternalDeviceRow,
        label: '',
        cellClass: 'w-[4%] min-w-0 px-2',
        headerClass: 'w-[4%] min-w-0 px-2',
        render: (row) => (
          <div data-tour="internaldevices-list-row-actions">
            <ActionMenuCell
              row={row}
              editLabel="Ver detalle"
              onDetails={() => onOpenDetails(row)}
              onDelete={() => onDeleteDevice(row)}
              permissions={{ details: Boolean(currentPagePermissions?.viewDeviceDetails), delete: Boolean(currentPagePermissions?.deleteDevice) }}
            />
          </div>
        ),
      },
    ],
    [currentPagePermissions?.deleteDevice, currentPagePermissions?.viewDeviceDetails, onDeleteDevice, onOpenDetails],
  )

  const columnsMobile = useMemo<ColumnDefinition<InternalDeviceRow>[]>(
    () => [
      {
        key: 'display_id',
        label: 'ID',
        cellClass: 'w-2/12 min-w-0 px-2',
        headerClass: 'w-2/12 min-w-0 px-2',
      },
      {
        key: 'name',
        label: 'DISPOSITIVO',
        cellClass: 'w-6/12 min-w-0 px-2',
        headerClass: 'w-6/12 min-w-0 px-2',
      },
      {
        key: 'actions' as keyof InternalDeviceRow,
        label: '',
        cellClass: 'w-2/12 min-w-0 px-2',
        headerClass: 'w-2/12 min-w-0 px-2',
        render: (row) => (
          <div data-tour="internaldevices-list-row-actions">
            <ActionMenuCell
              row={row}
              editLabel="Ver detalle"
              onDetails={() => onOpenDetails(row)}
              onDelete={() => onDeleteDevice(row)}
              permissions={{ details: Boolean(currentPagePermissions?.viewDeviceDetails), delete: Boolean(currentPagePermissions?.deleteDevice) }}
            />
          </div>
        ),
      },
    ],
    [currentPagePermissions?.deleteDevice, currentPagePermissions?.viewDeviceDetails, onDeleteDevice, onOpenDetails],
  )

  const columns = isMobile ? columnsMobile : columnsDesktop

  const filteredRows = useMemo(
    () =>
      rows.filter(
        (row) =>
          matchesStatusFilter(row.device_status?.name, statusFilter) &&
          matchesAssignmentFilter(row.assigned, assignmentFilter) &&
          matchesReviewFilter(row.reviewed, reviewFilter),
      ),
    [rows, statusFilter, assignmentFilter, reviewFilter],
  )

  const handleStatusFilterChange = useCallback((value: string) => {
    setStatusFilter(isStatusFilterValue(value) ? value : DEFAULT_STATUS_FILTER)
  }, [])

  const handleAssignmentFilterChange = useCallback((value: string) => {
    setAssignmentFilter(isAssignmentFilterValue(value) ? value : 'all')
  }, [])

  const handleReviewFilterChange = useCallback((value: string) => {
    setReviewFilter(isReviewFilterValue(value) ? value : 'all')
  }, [])

  const filterGroups = useMemo<DataTableFilterGroup<InternalDeviceRow>[]>(
    () => [
      {
        title: 'Estatus',
        options: STATUS_FILTER_OPTIONS,
        value: statusFilter,
        onChange: handleStatusFilterChange,
      },
      {
        title: 'Asignación',
        options: ASSIGNMENT_FILTER_OPTIONS,
        value: assignmentFilter,
        onChange: handleAssignmentFilterChange,
      },
      {
        title: 'Revisión',
        options: REVIEW_FILTER_OPTIONS,
        value: reviewFilter,
        onChange: handleReviewFilterChange,
      },
    ],
    [
      assignmentFilter,
      handleAssignmentFilterChange,
      handleReviewFilterChange,
      handleStatusFilterChange,
      reviewFilter,
      statusFilter,
    ],
  )

  return {
    columns,
    rows: filteredRows,
    searchableKeys: INTERNAL_DEVICE_SEARCHABLE_KEYS,
    statusFilter,
    statusFilterOptions: STATUS_FILTER_OPTIONS,
    handleStatusFilterChange,
    filterGroups,
  }
}

export default useInternalDevicesListTable

import { useCallback, useMemo, useState } from 'react'

import ActionMenuCell from '@/app/components/ActionMenuCell/ActionMenuCell'
import { useIsMobile } from '@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery'
import type { ColumnDefinition } from '@/app/components/DataTable/types'
import Label from '@/app/components/Label/Label'
import type { InternalDevice } from '@/app/mappings/internaldevices/internaldevices.types'

import type {
  InternalDeviceRow,
  StatusFilterOption,
  StatusFilterValue,
} from '../types'
import {
  DEFAULT_STATUS_FILTER,
  INTERNAL_DEVICE_SEARCHABLE_KEYS,
  STATUS_FILTER_OPTIONS,
  isStatusFilterValue,
  matchesStatusFilter,
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
}

/**
 * Encapsulates table state, columns, and filtering for internal devices list.
 */
const useInternalDevicesListTable = ({
  devices,
  onOpenDetails,
  onDeleteDevice,
}: UseInternalDevicesListTableParams): UseInternalDevicesListTableResult => {
  const isMobile = useIsMobile()
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>(
    DEFAULT_STATUS_FILTER,
  )

  const rows = useMemo<InternalDeviceRow[]>(
    () =>
      devices.map((device, index) => ({
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
        cellClass: 'w-[4%]',
        headerClass: 'w-[5%]',
      },
      {
        key: 'device_status',
        label: 'ESTATUS',
        cellClass: 'w-[10%]',
        headerClass: 'w-[9%]',
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
        cellClass: 'w-[9%]',
        headerClass: 'w-[9%]',
        render: (row) => row.device_type?.name ?? '-',
      },
      {
        key: 'device_brand',
        label: 'MARCA',
        cellClass: 'w-[7%]',
        headerClass: 'w-[7%]',
        render: (row) => row.device_brand?.name ?? '-',
      },
      {
        key: 'model',
        label: 'MODELO',
        cellClass: 'w-[8%]',
        headerClass: 'w-[8%]',
      },
      {
        key: 'serial_number',
        label: 'No. SERIE',
        cellClass: 'w-[11%]',
        headerClass: 'w-[11%]',
      },
      {
        key: 'name',
        label: 'NOMBRE',
        cellClass: 'w-[11%]',
        headerClass: 'w-[11%]',
      },
      {
        key: 'ip_address',
        label: 'DIR. IP',
        cellClass: 'w-[8%]',
        headerClass: 'w-[8%]',
      },
      {
        key: 'mac_address',
        label: 'DIR. MAC',
        cellClass: 'w-[12%]',
        headerClass: 'w-[12%]',
      },
      {
        key: 'assigned',
        label: 'ASIGNADO',
        cellClass: 'w-[8%]',
        headerClass: 'w-[8%]',
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
        cellClass: 'w-[7%]',
        headerClass: 'w-[7%]',
        render: (row) => (
          <Label
            type={row.reviewed === false ? 'valido' : 'prohibido'}
            text={row.reviewed === false ? 'REVISADO' : 'SIN REVISIÓN'}
          />
        ),
      },
      {
        key: 'actions' as keyof InternalDeviceRow,
        label: '',
        cellClass: 'w-[3%]',
        headerClass: 'w-[3%]',
        render: (row) => (
          <div data-tour="internaldevices-list-row-actions">
            <ActionMenuCell
              row={row}
              onDetails={() => onOpenDetails(row)}
              onDelete={() => onDeleteDevice(row)}
              permissions={{ details: true, delete: true }}
            />
          </div>
        ),
      },
    ],
    [onDeleteDevice, onOpenDetails],
  )

  const columnsMobile = useMemo<ColumnDefinition<InternalDeviceRow>[]>(
    () => [
      {
        key: 'display_id',
        label: 'ID',
        cellClass: 'w-2/12',
        headerClass: 'w-2/12',
      },
      {
        key: 'name',
        label: 'DISPOSITIVO',
        cellClass: 'w-6/12',
        headerClass: 'w-6/12',
      },
      {
        key: 'actions' as keyof InternalDeviceRow,
        label: '',
        cellClass: 'w-2/12',
        headerClass: 'w-2/12',
        render: (row) => (
          <div data-tour="internaldevices-list-row-actions">
            <ActionMenuCell
              row={row}
              onDetails={() => onOpenDetails(row)}
              onDelete={() => onDeleteDevice(row)}
              permissions={{ details: true, delete: true }}
            />
          </div>
        ),
      },
    ],
    [onDeleteDevice, onOpenDetails],
  )

  const columns = isMobile ? columnsMobile : columnsDesktop

  const filteredRows = useMemo(
    () => rows.filter((row) => matchesStatusFilter(row.device_status?.name, statusFilter)),
    [rows, statusFilter],
  )

  const handleStatusFilterChange = useCallback((value: string) => {
    setStatusFilter(isStatusFilterValue(value) ? value : DEFAULT_STATUS_FILTER)
  }, [])

  return {
    columns,
    rows: filteredRows,
    searchableKeys: INTERNAL_DEVICE_SEARCHABLE_KEYS,
    statusFilter,
    statusFilterOptions: STATUS_FILTER_OPTIONS,
    handleStatusFilterChange,
  }
}

export default useInternalDevicesListTable

import { useCallback, useMemo, useState } from 'react'

import ActionMenuCell from '@/app/components/ActionMenuCell/ActionMenuCell'
import { useAuth } from '@/app/context/AuthContext/AuthContext'
import type { ColumnDefinition } from '@/app/components/DataTable/types'
import Label from '@/app/components/Label/Label'
import { useIsMobile } from '@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery'
import type { InternalDeviceType } from '@/app/mappings/internaldevices/internaldevices.types'

import type { DeviceTypeRow, StatusFilterOption, StatusFilterValue } from '../types'
import {
  DEFAULT_STATUS_FILTER,
  DEVICE_TYPES_SEARCHABLE_KEYS,
  STATUS_FILTER_OPTIONS,
  isStatusFilterValue,
  matchesStatusFilter,
  statusToLabelType,
} from '../utilities/deviceTypesTable'

type UseDeviceTypesTableParams = {
  deviceTypes: InternalDeviceType[]
  onEditType: (deviceType: InternalDeviceType) => void
  onDeleteType: (deviceType: InternalDeviceType) => void
}

type UseDeviceTypesTableResult = {
  columns: ColumnDefinition<DeviceTypeRow>[]
  rows: DeviceTypeRow[]
  searchableKeys: (keyof DeviceTypeRow)[]
  statusFilter: StatusFilterValue
  statusFilterOptions: StatusFilterOption[]
  handleStatusFilterChange: (value: string) => void
}

/**
 * Encapsulates table state, columns, and filtering for device types list.
 */
const useDeviceTypesTable = (
  { deviceTypes, onEditType, onDeleteType }: UseDeviceTypesTableParams,
): UseDeviceTypesTableResult => {
  const { currentPagePermissions } = useAuth()
  const isMobile = useIsMobile()
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>(
    DEFAULT_STATUS_FILTER,
  )

  const rows = useMemo<DeviceTypeRow[]>(
    () =>
      deviceTypes.map((deviceType, index) => {
        const displayId = String(index + 1).padStart(3, '0')
        const name = deviceType.name ?? '-'
        const description = deviceType.description ?? '-'
        const extract = deviceType.name ?? '-'
        const statusLabel = deviceType.is_active ? 'OPTIMO' : 'INACTIVO'

        return {
          id: deviceType.device_type_id || String(index + 1),
          display_id: displayId,
          device_type_id: deviceType.device_type_id,
          name,
          description,
          extract,
          is_active: deviceType.is_active,
          status_label: statusLabel,
          search_content: [
            displayId,
            name,
            description,
            extract,
            statusLabel,
          ].join(' '),
        }
      }),
    [deviceTypes],
  )

  const columnsDesktop = useMemo<ColumnDefinition<DeviceTypeRow>[]>(
    () => [
      {
        key: 'display_id',
        label: 'ID',
        cellClass: 'w-[6%]',
        headerClass: 'w-[6%]',
      },
      {
        key: 'name',
        label: 'NOMBRE',
        cellClass: 'w-[18%]',
        headerClass: 'w-[18%]',
      },
      {
        key: 'description',
        label: 'DESCRIPCION',
        cellClass: 'w-[34%]',
        headerClass: 'w-[34%]',
      },
      {
        key: 'extract',
        label: 'EXTRACTO',
        cellClass: 'w-[18%]',
        headerClass: 'w-[18%]',
      },
      {
        key: 'is_active',
        label: 'ESTADO',
        cellClass: 'w-[12%]',
        headerClass: 'w-[12%]',
        render: (row) => (
          <Label
            type={statusToLabelType(row.is_active)}
            text={row.is_active ? 'OPTIMO' : 'INACTIVO'}
          />
        ),
      },
      {
        key: 'actions' as keyof DeviceTypeRow,
        label: '',
        cellClass: 'w-[4%]',
        headerClass: 'w-[4%]',
        render: (row) => (
          <ActionMenuCell
            row={row}
            onEdit={() => onEditType({ device_type_id: row.device_type_id, name: row.name, description: row.description, is_active: row.is_active })}
            onDelete={() => onDeleteType({ device_type_id: row.device_type_id, name: row.name, description: row.description, is_active: row.is_active })}
            permissions={{ update: Boolean(currentPagePermissions?.updateDeviceType), delete: Boolean(currentPagePermissions?.deleteDeviceType) }}
          />
        ),
      },
    ],
    [currentPagePermissions?.deleteDeviceType, currentPagePermissions?.updateDeviceType, onDeleteType, onEditType],
  )

  const columnsMobile = useMemo<ColumnDefinition<DeviceTypeRow>[]>(
    () => [
      {
        key: 'display_id',
        label: 'ID',
        cellClass: 'w-2/12',
        headerClass: 'w-2/12',
      },
      {
        key: 'name',
        label: 'TIPO',
        cellClass: 'w-6/12',
        headerClass: 'w-6/12',
      },
      {
        key: 'is_active',
        label: 'ESTADO',
        cellClass: 'w-4/12',
        headerClass: 'w-4/12',
        render: (row) => (
          <Label
            type={statusToLabelType(row.is_active)}
            text={row.is_active ? 'OPTIMO' : 'INACTIVO'}
          />
        ),
      },
      {
        key: 'actions' as keyof DeviceTypeRow,
        label: '',
        cellClass: 'w-1/12',
        headerClass: 'w-1/12',
        render: (row) => (
          <ActionMenuCell
            row={row}
            onEdit={() => onEditType({ device_type_id: row.device_type_id, name: row.name, description: row.description, is_active: row.is_active })}
            onDelete={() => onDeleteType({ device_type_id: row.device_type_id, name: row.name, description: row.description, is_active: row.is_active })}
            permissions={{ update: Boolean(currentPagePermissions?.updateDeviceType), delete: Boolean(currentPagePermissions?.deleteDeviceType) }}
          />
        ),
      },
    ],
    [currentPagePermissions?.deleteDeviceType, currentPagePermissions?.updateDeviceType, onDeleteType, onEditType],
  )

  const columns = isMobile ? columnsMobile : columnsDesktop

  const filteredRows = useMemo(
    () => rows.filter((row) => matchesStatusFilter(row.is_active, statusFilter)),
    [rows, statusFilter],
  )

  const handleStatusFilterChange = useCallback((value: string) => {
    setStatusFilter(isStatusFilterValue(value) ? value : DEFAULT_STATUS_FILTER)
  }, [])

  return {
    columns,
    rows: filteredRows,
    searchableKeys: DEVICE_TYPES_SEARCHABLE_KEYS,
    statusFilter,
    statusFilterOptions: STATUS_FILTER_OPTIONS,
    handleStatusFilterChange,
  }
}

export default useDeviceTypesTable

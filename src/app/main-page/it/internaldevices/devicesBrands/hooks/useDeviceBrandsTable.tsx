import { useCallback, useMemo, useState } from 'react'

import ActionMenuCell from '@/app/components/ActionMenuCell/ActionMenuCell'
import { useAuth } from '@/app/context/AuthContext/AuthContext'
import type { ColumnDefinition } from '@/app/components/DataTable/types'
import Label from '@/app/components/Label/Label'
import { useIsMobile } from '@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery'
import type { InternalDeviceBrand } from '@/app/mappings/internaldevices/internaldevices.types'

import type { DeviceBrandRow, StatusFilterOption, StatusFilterValue } from '../types'
import {
  DEFAULT_STATUS_FILTER,
  DEVICE_BRANDS_SEARCHABLE_KEYS,
  STATUS_FILTER_OPTIONS,
  isStatusFilterValue,
  matchesStatusFilter,
  statusToLabelType,
} from '../utilities/deviceBrandsTable'

type UseDeviceBrandsTableParams = {
  brands: InternalDeviceBrand[]
  onEditBrand: (brand: InternalDeviceBrand) => void
  onDeleteBrand: (brand: InternalDeviceBrand) => void
}

type UseDeviceBrandsTableResult = {
  columns: ColumnDefinition<DeviceBrandRow>[]
  rows: DeviceBrandRow[]
  searchableKeys: (keyof DeviceBrandRow)[]
  statusFilter: StatusFilterValue
  statusFilterOptions: StatusFilterOption[]
  handleStatusFilterChange: (value: string) => void
}

/**
 * Encapsulates table state, columns, and filtering for device brands list.
 */
const useDeviceBrandsTable = (
  { brands, onEditBrand, onDeleteBrand }: UseDeviceBrandsTableParams,
): UseDeviceBrandsTableResult => {
  const { currentPagePermissions } = useAuth()
  const isMobile = useIsMobile()
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>(
    DEFAULT_STATUS_FILTER,
  )

  const rows = useMemo<DeviceBrandRow[]>(
    () =>
      brands.map((brand, index) => {
        const displayId = String(index + 1).padStart(3, '0')
        const name = brand.name ?? '-'
        const description = brand.description ?? '-'
        const extract = brand.name ?? '-'
        const statusLabel = brand.is_active ? 'ACTIVO' : 'INACTIVO'

        return {
          id: brand.device_brand_id || String(index + 1),
          display_id: displayId,
          device_brand_id: brand.device_brand_id,
          name,
          description,
          extract,
          is_active: brand.is_active,
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
    [brands],
  )

  const columnsDesktop = useMemo<ColumnDefinition<DeviceBrandRow>[]>(
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
            text={row.is_active ? 'ACTIVO' : 'INACTIVO'}
          />
        ),
      },
      {
        key: 'actions' as keyof DeviceBrandRow,
        label: '',
        cellClass: 'w-[4%]',
        headerClass: 'w-[4%]',
        render: (row) => (
          <ActionMenuCell
            row={row}
            onEdit={() => onEditBrand({ device_brand_id: row.device_brand_id, name: row.name, description: row.description, is_active: row.is_active })}
            onDelete={() => onDeleteBrand({ device_brand_id: row.device_brand_id, name: row.name, description: row.description, is_active: row.is_active })}
            permissions={{ update: Boolean(currentPagePermissions?.updateDeviceBrand), delete: Boolean(currentPagePermissions?.deleteDeviceBrand) }}
          />
        ),
      },
    ],
    [currentPagePermissions?.deleteDeviceBrand, currentPagePermissions?.updateDeviceBrand, onDeleteBrand, onEditBrand],
  )

  const columnsMobile = useMemo<ColumnDefinition<DeviceBrandRow>[]>(
    () => [
      {
        key: 'display_id',
        label: 'ID',
        cellClass: 'w-2/12',
        headerClass: 'w-2/12',
      },
      {
        key: 'name',
        label: 'MARCA',
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
            text={row.is_active ? 'ACTIVO' : 'INACTIVO'}
          />
        ),
      },
      {
        key: 'actions' as keyof DeviceBrandRow,
        label: '',
        cellClass: 'w-1/12',
        headerClass: 'w-1/12',
        render: (row) => (
          <ActionMenuCell
            row={row}
            onEdit={() => onEditBrand({ device_brand_id: row.device_brand_id, name: row.name, description: row.description, is_active: row.is_active })}
            onDelete={() => onDeleteBrand({ device_brand_id: row.device_brand_id, name: row.name, description: row.description, is_active: row.is_active })}
            permissions={{ update: Boolean(currentPagePermissions?.updateDeviceBrand), delete: Boolean(currentPagePermissions?.deleteDeviceBrand) }}
          />
        ),
      },
    ],
    [currentPagePermissions?.deleteDeviceBrand, currentPagePermissions?.updateDeviceBrand, onDeleteBrand, onEditBrand],
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
    searchableKeys: DEVICE_BRANDS_SEARCHABLE_KEYS,
    statusFilter,
    statusFilterOptions: STATUS_FILTER_OPTIONS,
    handleStatusFilterChange,
  }
}

export default useDeviceBrandsTable

/* eslint-disable react/no-unstable-nested-components */
'use client'

import React, { useMemo } from 'react'

import ActionMenuCell from '@/app/components/ActionMenuCell/ActionMenuCell'
import { DataTable } from '@/app/components/DataTable/DataTable'
import type { ColumnDefinition } from '@/app/components/DataTable/types'
import Label from '@/app/components/Label/Label'
import type { LabelType } from '@/app/components/Label/types'
import { useIsMobile } from '@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery'
import type { InternalDevice } from '@/app/mappings/internaldevices/internaldevices.types'
import useTutorialAutoRun from '@/tutorials/engine/useTutorialAutoRun'

import useInternalDevicesList from './hooks/useInternalDevicesList'
import InternalDeviceDetail from './components/InternalDeviceDetail/InternalDeviceDetail'
import InternalDeviceEdit from './components/InternalDeviceEdit/InternalDeviceEdit'
import InternalDeviceReview from './components/InternalDeviceReview/InternalDeviceReview'
import { Button } from '@/app/components/Button/Button'

type InternalDeviceRow = InternalDevice & {
  id: string
  display_id: string
}

const statusToLabelType = (status?: string): LabelType => {
  const normalized = (status ?? '').toUpperCase()
  if (normalized.includes('OPTIMO') || normalized.includes('EXCELENTE')) return 'valido'
  if (normalized.includes('BUENO')) return 'validado'
  if (normalized.includes('REGULAR')) return 'pendiente'
  if (normalized.includes('MALO') || normalized.includes('DEFECTUOSO')) return 'invalido'
  return 'pendiente'
}

const normalizeStatus = (status?: string) =>
  (status ?? '')
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

const matchesStatusFilter = (status: string | undefined, filter: string) => {
  if (filter === 'all') return true
  const normalized = normalizeStatus(status)
  switch (filter) {
    case 'en_revision':
      return normalized.includes('REVISION')
    case 'excelente':
      return normalized.includes('EXCELENTE') || normalized.includes('OPTIMO')
    case 'bueno':
      return normalized.includes('BUENO')
    case 'regular':
      return normalized.includes('REGULAR')
    case 'malo':
      return normalized.includes('MALO') || normalized.includes('DEFECTUOSO')
    default:
      return true
  }
}

const InternalDevicesListPage = () => {
  const {
    devices,
    openDetails,
    selectedDevice,
    deviceReviewsByDevice,
    isEditView,
    isReviewView,
    isCreateView,
    handleOpenDetails,
    handleCloseDetails,
    handleDeleteDevice,
    handleRefresh,
    handleEditInformation,
    handleCreateReview,
    handleCreateDevice,
    handleBackToDetails,
  } = useInternalDevicesList()

  const isMobile = useIsMobile()
  const [statusFilter, setStatusFilter] = React.useState('all')

  const rows = useMemo<InternalDeviceRow[]>(
    () =>
      devices.map((device, index) => ({
        ...device,
        id: device.device_id || String(index + 1),
        display_id: String(index + 1).padStart(3, '0'),
      })),
    [devices],
  )

  const searchableKeys = useMemo<(keyof InternalDeviceRow)[]>(
    () => [
      'display_id',
      'name',
      'model',
      'serial_number',
      'ip_address',
      'mac_address',
    ],
    [],
  )

  const columnsDesktop = useMemo<ColumnDefinition<InternalDeviceRow>[]>(
    () => [
      {
        key: 'display_id',
        label: 'ID',
        cellClass: 'w-1/12',
        headerClass: 'w-1/12',
      },
      {
        key: 'device_status',
        label: 'ESTATUS',
        cellClass: 'w-1/12',
        headerClass: 'w-1/12',
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
        cellClass: 'w-2/12',
        headerClass: 'w-2/12',
        render: (row) => row.device_type?.name ?? '-',
      },
      {
        key: 'device_brand',
        label: 'MARCA',
        cellClass: 'w-1/12',
        headerClass: 'w-1/12',
        render: (row) => row.device_brand?.name ?? '-',
      },
      {
        key: 'model',
        label: 'MODELO',
        cellClass: 'w-2/12',
        headerClass: 'w-2/12',
      },
      {
        key: 'serial_number',
        label: 'No. SERIE',
        cellClass: 'w-2/12',
        headerClass: 'w-2/12',
      },
      {
        key: 'name',
        label: 'NOMBRE',
        cellClass: 'w-2/12',
        headerClass: 'w-2/12',
      },
      {
        key: 'ip_address',
        label: 'DIR. IP',
        cellClass: 'w-1/12',
        headerClass: 'w-1/12',
      },
      {
        key: 'mac_address',
        label: 'DIR. MAC',
        cellClass: 'w-2/12',
        headerClass: 'w-2/12',
      },
      {
        key: 'assigned',
        label: 'ASIGNADO',
        cellClass: 'w-1/12',
        headerClass: 'w-1/12',
        render: (row) => (
          <Label
            type={row.assigned ? 'valido' : 'pendiente'}
            text={row.assigned ? 'ASIGNADO' : 'SIN ASIGNAR'}
          />
        ),
      },
      {
        key: 'actions' as keyof InternalDeviceRow,
        label: '',
        cellClass: 'w-1/12',
        headerClass: 'w-1/12',
        render: (row) => (
          <div data-tour="internaldevices-list-row-actions">
            <ActionMenuCell
              row={row}
              onDetails={() => handleOpenDetails(row)}
              onDelete={() => handleDeleteDevice(row)}
              permissions={{ details: true, delete: true }}
            />
          </div>
        ),
      },
    ],
    [handleOpenDetails, handleDeleteDevice],
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
              onDetails={() => handleOpenDetails(row)}
              onDelete={() => handleDeleteDevice(row)}
              permissions={{ details: true, delete: true }}
            />
          </div>
        ),
      },
    ],
    [handleOpenDetails, handleDeleteDevice],
  )

  const columns = isMobile ? columnsMobile : columnsDesktop
  const isDefaultView = !isReviewView && !isEditView && !isCreateView
  const statusFilterOptions = useMemo(
    () => [
      { label: 'Todos', value: 'all' },
      { label: 'En revision', value: 'en_revision' },
      { label: 'Excelente', value: 'excelente' },
      { label: 'Bueno', value: 'bueno' },
      { label: 'Regular', value: 'regular' },
      { label: 'Malo', value: 'malo' },
    ],
    [],
  )
  const filteredRows = useMemo(
    () => rows.filter((row) => matchesStatusFilter(row.device_status?.name, statusFilter)),
    [rows, statusFilter],
  )

  useTutorialAutoRun({
    moduleId: isDefaultView ? 'it-internaldevices-list' : '',
    tutorialId: isDefaultView ? 'it-internaldevices:list' : '',
  })

  return (
    <>
      {isReviewView ? (
        <InternalDeviceReview
          device={selectedDevice}
          onBack={handleBackToDetails}
        />
      ) : isEditView || isCreateView ? (
        <InternalDeviceEdit
          device={isCreateView ? null : selectedDevice}
          mode={isCreateView ? 'create' : 'edit'}
          onBack={handleBackToDetails}
        />
      ) : (
        <div data-tour="internaldevices-list-table">
          <DataTable<InternalDeviceRow>
            tables={[
              {
                title: 'Inventario de Dispositivos',
                columns,
            data: filteredRows,
                enableCollaps: true,
                enableSelection: false,
              },
            ]}
            textSize={{ mobile: 'text-d3', desktop: 'text-c2' }}
            enableInternalSearch
            searchableKeys={searchableKeys}
            showCalendar
            showFilter
            showRefresh
            showDownloadTable
            onRefreshPage={handleRefresh}
            filterTitle="Estatus"
            filterOptions={statusFilterOptions}
            filterValue={statusFilter}
            onFilterChange={(value) => setStatusFilter(value)}
            dataTableTitle="Inventario de Dispositivos"
            showButton={false}
            searchDataTour="internaldevices-list-search"
            calendarDataTour="internaldevices-list-calendar"
            refreshDataTour="internaldevices-list-refresh"
            rightContent={
              <Button
                hideIcon
                onClick={handleCreateDevice}
                data-tour="internaldevices-list-create"
              >
                Nuevo Dispositivo
              </Button>
            }
          />
        </div>
      )}

      {!isEditView && !isReviewView && !isCreateView && (
        <InternalDeviceDetail
          open={openDetails}
          onClose={handleCloseDetails}
          device={selectedDevice}
          reviews={deviceReviewsByDevice}
          onEditInformation={handleEditInformation}
          onCreateReview={handleCreateReview}
        />
      )}
    </>
  )
}
export default InternalDevicesListPage;

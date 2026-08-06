'use client'

import { Button } from '@/app/components/Button/Button'
import { DataTable } from '@/app/components/DataTable/DataTable'
import { useAuth } from '@/app/context/AuthContext/AuthContext'

import DeviceTypeForm from './components/DeviceTypeForm/DeviceTypeForm'
import useDeviceTypesPage from './hooks/useDeviceTypesPage'
import useDeviceTypesTable from './hooks/useDeviceTypesTable'
import type { DeviceTypeRow } from './types'

const DevicesTypesPage = () => {
  const { currentPagePermissions } = useAuth()
  const {
    deviceTypes,
    selectedType,
    isCreateView,
    isEditView,
    isListView,
    handleRefresh,
    handleOpenCreate,
    handleOpenEdit,
    handleDeleteType,
    handleBackToList,
  } = useDeviceTypesPage()
  const {
    columns,
    rows,
    searchableKeys,
    statusFilter,
    statusFilterOptions,
    handleStatusFilterChange,
  } = useDeviceTypesTable({
    deviceTypes,
    onEditType: handleOpenEdit,
    onDeleteType: handleDeleteType,
  })

  if (isCreateView || isEditView) {
    return (
      <DeviceTypeForm
        deviceType={isCreateView ? null : selectedType}
        mode={isCreateView ? 'create' : 'edit'}
        onBack={handleBackToList}
      />
    )
  }

  if (!isListView) return null

  return (
    <div data-tour="internaldevices-types-table">
      <DataTable<DeviceTypeRow>
        tables={[
          {
            title: 'Registro de tipo de dispositivo',
            columns,
            data: rows,
            enableCollaps: false,
            enableSelection: false,
          },
        ]}
        rightContent={currentPagePermissions?.createDeviceType ? (
          <Button hideIcon onClick={handleOpenCreate}>
            Nuevo tipo de dispositivo
          </Button>
        ) : null}
        textSize={{ mobile: 'text-d3', desktop: 'text-c2' }}
        enableInternalSearch
        searchableKeys={searchableKeys}
        showCalendar={false}
        showFilter
        showRefresh
        showDownloadTable
        onRefreshPage={handleRefresh}
        filterTitle="Estado"
        filterOptions={statusFilterOptions}
        filterValue={statusFilter}
        onFilterChange={handleStatusFilterChange}
        dataTableTitle="Registro de tipo de dispositivo"
        showButton={false}
      />
    </div>
  )
}

export default DevicesTypesPage

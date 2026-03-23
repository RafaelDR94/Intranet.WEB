'use client'

import { Button } from '@/app/components/Button/Button'
import { DataTable } from '@/app/components/DataTable/DataTable'

import DeviceBrandForm from './components/DeviceBrandForm/DeviceBrandForm'
import useDeviceBrandsPage from './hooks/useDeviceBrandsPage'
import useDeviceBrandsTable from './hooks/useDeviceBrandsTable'
import type { DeviceBrandRow } from './types'

const DevicesBrandsPage = () => {
  const {
    deviceBrands,
    selectedBrand,
    isCreateView,
    isEditView,
    isListView,
    handleRefresh,
    handleOpenCreate,
    handleOpenEdit,
    handleDeleteBrand,
    handleBackToList,
  } = useDeviceBrandsPage()
  const {
    columns,
    rows,
    searchableKeys,
    statusFilter,
    statusFilterOptions,
    handleStatusFilterChange,
  } = useDeviceBrandsTable({
    brands: deviceBrands,
    onEditBrand: handleOpenEdit,
    onDeleteBrand: handleDeleteBrand,
  })

  if (isCreateView || isEditView) {
    return (
      <DeviceBrandForm
        brand={isCreateView ? null : selectedBrand}
        mode={isCreateView ? 'create' : 'edit'}
        onBack={handleBackToList}
      />
    )
  }

  if (!isListView) return null

  return (
    <div data-tour="internaldevices-brands-table">
      <DataTable<DeviceBrandRow>
        tables={[
          {
            title: 'Registro de marcas',
            columns,
            data: rows,
            enableCollaps: true,
            enableSelection: false,
          },
        ]}
        rightContent={
          <Button hideIcon onClick={handleOpenCreate}>
            Nueva marca
          </Button>
        }
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
        dataTableTitle="Registro de marcas"
        showButton={false}
      />
    </div>
  )
}

export default DevicesBrandsPage

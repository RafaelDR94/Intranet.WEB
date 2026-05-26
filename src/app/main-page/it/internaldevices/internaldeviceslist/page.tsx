'use client'

import { Button } from '@/app/components/Button/Button'
import { DataTable } from '@/app/components/DataTable/DataTable'
import useTutorialAutoRun from '@/tutorials/engine/useTutorialAutoRun'

import InternalDeviceDetail from './components/InternalDeviceDetail/InternalDeviceDetail'
import InternalDeviceEdit from './components/InternalDeviceEdit/InternalDeviceEdit'
import InternalDeviceReview from './components/InternalDeviceReview/InternalDeviceReview'
import useInternalDevicesList from './hooks/useInternalDevicesList'
import useInternalDevicesListTable from './hooks/useInternalDevicesListTable'
import type { InternalDeviceRow } from './types'

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

  const isDefaultView = !isReviewView && !isEditView && !isCreateView
  const {
    columns,
    rows,
    searchableKeys,
    statusFilter,
    statusFilterOptions,
    handleStatusFilterChange,
  } = useInternalDevicesListTable({
    devices,
    onOpenDetails: handleOpenDetails,
    onDeleteDevice: handleDeleteDevice,
  })

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
                data: rows,
                enableCollaps: false,
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
            onFilterChange={handleStatusFilterChange}
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

export default InternalDevicesListPage

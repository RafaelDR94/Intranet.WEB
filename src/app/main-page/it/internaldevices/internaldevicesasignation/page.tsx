'use client'

import Breadcrumbs from '@/app/components/Breadcrumbs/Breadcrumbs'
import { Button } from '@/app/components/Button/Button'
import { Checkbox } from '@/app/components/CheckBox/CheckBox'
import CollapsibleSection from '@/app/components/CollapsibleSection/CollapsibleSection'
import { DataTable } from '@/app/components/DataTable/DataTable'
import DynamicForm from '@/app/components/DynamicForm/DynamicForm'
import DocumentViewer from '@/app/components/DocumentViewer/DocumentViewer'
import SignatureBox from '@/app/components/SignatureBox/SignatureBox'
import SignatureComponent from '@/app/components/SignatureComponent/SignatureComponent'
import { PopUp } from '@/app/components/PopUp/PopUp'
import { useAuth } from '@/app/context/AuthContext/AuthContext'

import AssignmentDetail from './components/AssignmentDetail/AssignmentDetail'
import InternalDeviceEdit from '../internaldeviceslist/components/InternalDeviceEdit/InternalDeviceEdit'
import InternalDeviceReview from '../internaldeviceslist/components/InternalDeviceReview/InternalDeviceReview'
import useInternalDevicesAsignationPage from './hooks/useInternalDevicesAsignationPage'
import type { InternalDeviceAssignmentRow } from './types'

const InternalDevicesAsignationPage = () => {
  const { currentPagePermissions } = useAuth()
  const {
    assignmentDevice,
    assignmentEmployeeName,
    canAdvance,
    columns,
    currentStep,
    deviceAssignment,
    deviceFields,
    formValues,
    formVersion,
    handleAssign,
    handleBackToDetails,
    handleBackToList,
    handleCloseDetails,
    handleCloseRegenerationPopup,
    handleCloseResponsive,
    handleCreateReview,
    handleConfirmRegeneration,
    handleEditInformation,
    handleNext,
    handleOpenCreate,
    handlePrevious,
    handleSignatureAuthorization,
    handleSignatureClick,
    handleStatusFilterChange,
    handleStepChangeFromBreadcrumbs,
    handleValuesChange,
    handleValidChange,
    handleRefresh,
    isCreateView,
    isEditView,
    isFirstStep,
    isLastStep,
    isMobile,
    isReviewView,
    openDetails,
    rows,
    searchableKeys,
    selectedDeviceByQuery,
    selectedEmployee,
    showResponsive,
    signatureOpen,
    stepLayouts,
    steps,
    statusFilter,
    statusFilterOptions,
    userSignature,
    userFullName,
    responsiveTitle,
    responsiveUrl,
    regenerationAssignment,
    regenerationMembretSelection,
    setSignatureOpen,
    setRegenerationMembretSelection,
    loadingDeviceAssignment,
  } = useInternalDevicesAsignationPage()

  if (isReviewView) {
    return (
      <InternalDeviceReview
        device={selectedDeviceByQuery}
        onBack={handleBackToDetails}
      />
    )
  }

  if (isEditView) {
    return (
      <InternalDeviceEdit
        device={selectedDeviceByQuery}
        mode="edit"
        onBack={handleBackToDetails}
      />
    )
  }

  if (isCreateView) {
    return (
      <div className="space-y-4">
        <CollapsibleSection
          title="Nueva Asignación de Dispositivo"
          enableCollapse={false}
          rightContent={
            currentPagePermissions?.createDeviceAssignment && <Button
              hideIcon
              onClick={handleAssign}
              data-tour="internaldevices-asignation-assign"
              disabled={!canAdvance || currentStep !== 'signature'}
              className={isMobile ? 'w-full mt-3' : ''}
            >
              Asignar dispositivo
            </Button>
          }
        >
          <div className="rounded-2xl bg-white-100 p-6 shadow-md">
            <div data-tour="internaldevices-asignation-steps">
              <Breadcrumbs
                activeId={currentStep}
                onActiveChange={handleStepChangeFromBreadcrumbs}
                dataTestId="internal-device-asignation-steps"
              >
                {steps.map((step) => (
                  <Breadcrumbs.Item
                    key={step.id}
                    id={step.id}
                    label={step.label}
                    renderContent={() => (
                      <div className="space-y-6">
                        {step.id === 'device' ? (
                          <div data-tour="internaldevices-asignation-form">
                            <DynamicForm
                              fields={deviceFields}
                              onSubmit={() => undefined}
                              onValuesChange={handleValuesChange}
                              onValidChange={(valid) =>
                                handleValidChange('device', valid)
                              }
                              responsiveLayoutMatrix={stepLayouts.device}
                              valuesVersion={formVersion}
                              valuesVersionActive
                              showSubmitIf={() => false}
                              dataTestId="internal-device-asignation-device"
                            />
                          </div>
                        ) : (
                          <div
                            className="rounded-2xl bg-white-100 p-6 shadow-sm"
                            data-tour="internaldevices-asignation-signature"
                          >
                            <div className="text-c2 text-gray-70">
                              Firma de Realizacion
                            </div>
                            <div className="min-h-[360px] w-full flex items-center justify-center">
                              {userSignature ? (
                                <div className="w-full">
                                  <SignatureBox
                                    title={
                                      selectedEmployee?.fullname || userFullName
                                    }
                                    imageUrl={userSignature}
                                  />
                                </div>
                              ) : (
                                <div className="flex h-full items-center justify-center">
                                  <Button
                                    hideIcon
                                    className="px-6"
                                    onClick={handleSignatureClick}
                                    data-tour="internaldevices-asignation-signature-button"
                                  >
                                    Click para Firmar
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        <div
                          className={
                            isMobile
                              ? 'flex flex-col gap-3'
                              : 'flex justify-end gap-4'
                          }
                        >
                          {!isFirstStep && (
                            <Button
                              variant="outline"
                              hideIcon
                              onClick={handlePrevious}
                              data-tour="internaldevices-asignation-prev"
                            >
                              Regresar
                            </Button>
                          )}
                          {!isLastStep && (
                            <Button
                              hideIcon
                              onClick={handleNext}
                              disabled={!canAdvance}
                              data-tour="internaldevices-asignation-next"
                            >
                              Siguiente
                            </Button>
                          )}
                          {isLastStep && (
                            <Button
                              variant="ghost"
                              hideIcon
                              onClick={handleBackToList}
                              data-tour="internaldevices-asignation-back"
                            >
                              Volver al listado
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  />
                ))}
              </Breadcrumbs>
            </div>
          </div>
        </CollapsibleSection>
        <SignatureComponent
          open={signatureOpen}
          onClose={() => setSignatureOpen(false)}
          onAuthorization={handleSignatureAuthorization}
          responsibleGuid={formValues.employee_id ?? ''}
        />
      </div>
    )
  }

  return (
    <>
      <div data-tour="internaldevices-asignation-table">
        <DataTable<InternalDeviceAssignmentRow>
          tables={[
            {
              title: 'Dispositivos Asignados',
              columns,
              data: rows,
              enableCollaps: false,
              enableSelection: false,
            },
          ]}
          textSize={{ mobile: 'text-d3', desktop: 'text-c2' }}
          enableInternalSearch
          searchableKeys={searchableKeys}
          dateKey="assignment_date"
          showCalendar
          showFilter
          showRefresh
          showDownloadTable
          onRefreshPage={handleRefresh}
          filterTitle="Estado de asignacion"
          filterOptions={statusFilterOptions}
          filterValue={statusFilter}
          onFilterChange={handleStatusFilterChange}
          dataTableTitle="Asignacion de Dispositivos"
          showButton={false}
          searchDataTour="internaldevices-asignation-search"
          calendarDataTour="internaldevices-asignation-calendar"
          refreshDataTour="internaldevices-asignation-refresh"
          rightContent={currentPagePermissions?.createDeviceAssignment ? (
            <Button
              hideIcon
              onClick={handleOpenCreate}
              data-tour="internaldevices-asignation-create"
            >
              Nueva Asignación
            </Button>
          ) : null}
        />
      </div>
      <AssignmentDetail
        open={openDetails}
        onClose={handleCloseDetails}
        loading={loadingDeviceAssignment}
        assignment={deviceAssignment}
        assignmentDevice={assignmentDevice}
        assignmentEmployeeName={assignmentEmployeeName}
        onEditInformation={handleEditInformation}
        onCreateReview={handleCreateReview}
      />
      {showResponsive && responsiveUrl && (
        <DocumentViewer
          fileUrl={responsiveUrl}
          title={responsiveTitle}
          onClose={handleCloseResponsive}
        />
      )}
      <PopUp
        open={Boolean(regenerationAssignment)}
        onClose={handleCloseRegenerationPopup}
        title="Regenerar responsiva"
        content="Elige el membrete que se usará en la nueva versión."
        showPrimaryButton
        primaryButtonText="Regenerar"
        onPrimaryButtonClick={handleConfirmRegeneration}
        showSecondaryButton
        secondaryButtonText="Cancelar"
        onSecondaryButtonClick={handleCloseRegenerationPopup}
      >
        <div className="space-y-3 pt-2">
          <Checkbox
            checked={regenerationMembretSelection === 'default'}
            onChange={(checked) => {
              if (checked) setRegenerationMembretSelection('default')
            }}
            label="Usar el membrete predeterminado del departamento del usuario"
            dataTestId="responsive-membret-default"
          />
          <Checkbox
            checked={regenerationMembretSelection !== 'default'}
            onChange={(checked) =>
              setRegenerationMembretSelection(checked ? 'DR' : 'default')
            }
            label="Seleccionar el membrete manualmente"
            dataTestId="responsive-membret-manual"
          />
          {regenerationMembretSelection !== 'default' && (
            <div className="ml-6 space-y-2">
              <Checkbox
                checked={regenerationMembretSelection === 'DR'}
                onChange={(checked) => {
                  if (checked) setRegenerationMembretSelection('DR')
                }}
                label="DR"
                dataTestId="responsive-membret-dr"
              />
              <Checkbox
                checked={regenerationMembretSelection === 'VIP'}
                onChange={(checked) => {
                  if (checked) setRegenerationMembretSelection('VIP')
                }}
                label="VIP Ingeniería"
                dataTestId="responsive-membret-vip"
              />
            </div>
          )}
        </div>
      </PopUp>
    </>
  )
}

export default InternalDevicesAsignationPage

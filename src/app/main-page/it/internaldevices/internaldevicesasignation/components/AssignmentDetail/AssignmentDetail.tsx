'use client'

import ButtonsNavigation from '@/app/components/ButtonsNavigation/ButtonsNavigation'
import DetailsPanelLayout from '@/app/components/DetailsPanelLayout/DetailsPanelLayout'
import Label from '@/app/components/Label/Label'

import HistoryAssignment from '../HistoryAssignment/HistoryAssignment'
import InformationAssignment from '../InformationAssignment/InformationAssignment'
import ReviewsAssignment from '../ReviewsAssignment/ReviewsAssignment'
import useAssignmentDetail from './hooks/useAssignmentDetail'
import type { AssignmentDetailProps } from './types'

const AssignmentDetail = ({
  open,
  onClose,
  loading,
  assignment,
  assignmentDevice,
  assignmentEmployeeName,
  onEditInformation,
  onCreateReview,
}: AssignmentDetailProps) => {
  const {
    assignmentStatusLabel,
    isMobile,
    resolvedDevice,
    resolvedDeviceId,
    statusLabelType,
    showStatusLabel,
  } = useAssignmentDetail({
    open,
    onClose,
    loading,
    assignment,
    assignmentDevice,
    assignmentEmployeeName,
    onEditInformation,
    onCreateReview,
  })

  return (
    <DetailsPanelLayout
      open={open}
      onClose={onClose}
      zIndex={10000}
      className={isMobile ? 'w-full' : ''}
      label={() =>
        showStatusLabel ? (
          <Label type={statusLabelType} text={assignmentStatusLabel} />
        ) : null
      }
    >
      {loading ? (
        <div className="text-center text-gray-70">Cargando detalle de asignacion...</div>
      ) : assignment ? (
        <div className="space-y-4">
          <>
            <div className="flex flex-col gap-2">
              <h2 className="text-h3 text-green-100">
                {assignmentDevice?.name || assignmentDevice?.serial_number || 'Asignacion'}
              </h2>
              <p className="text-b3 text-gray-70">
                {assignmentEmployeeName || assignment.employee_id}
              </p>
            </div>

            <ButtonsNavigation
              dataTestId="internaldevices-assignment-detail-nav"
              ariaLabel="Secciones de asignacion"
              buttonSize="small"
              activeVariant="solid"
              inactiveVariant="outline"
            >
              <ButtonsNavigation.Item
                id="info"
                label="Información"
                renderContent={
                  <InformationAssignment
                    device={resolvedDevice}
                    deviceId={resolvedDeviceId}
                    onEdit={onEditInformation}
                  />
                }
              />
              <ButtonsNavigation.Item
                id="reviews"
                label="Revisiones"
                renderContent={
                  <ReviewsAssignment
                    deviceId={resolvedDeviceId}
                    deviceName={resolvedDevice?.name || resolvedDevice?.serial_number}
                    deviceStatus={resolvedDevice?.device_status?.name}
                    onCreateReview={onCreateReview}
                  />
                }
              />
              <ButtonsNavigation.Item
                id="history"
                label="Historial"
                renderContent={<HistoryAssignment deviceId={resolvedDeviceId} />}
              />
            </ButtonsNavigation>
          </>
        </div>
      ) : (
        <div className="text-center text-gray-70">
          Selecciona una asignacion para ver el detalle.
        </div>
      )}
    </DetailsPanelLayout>
  )
}

export default AssignmentDetail

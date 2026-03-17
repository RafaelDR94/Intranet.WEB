'use client'

import React, { useEffect, useMemo } from 'react'
import { shallow } from 'zustand/shallow'

import ButtonsNavigation from '@/app/components/ButtonsNavigation/ButtonsNavigation'
import DetailsPanelLayout from '@/app/components/DetailsPanelLayout/DetailsPanelLayout'
import Label from '@/app/components/Label/Label'
import type { LabelType } from '@/app/components/Label/types'
import type {
  InternalDevice,
  InternalDeviceAssignment,
} from '@/app/mappings/internaldevices/internaldevices.types'
import InformationAssignment from '../InformationAssignment/InformationAssignment'
import ReviewsAssignment from '../ReviewsAssignment/ReviewsAssignment'
import HistoryAssignment from '../HistoryAssignment/HistoryAssignment'
import { useIsMobile } from '@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery'
import { useInternalDevicesStore } from '@/app/stores/useInternalDevicesStore/useInternalDevicesStore'

export interface AssignmentDetailProps {
  open: boolean
  onClose: () => void
  loading: boolean
  assignment: InternalDeviceAssignment | null
  assignmentDevice: InternalDevice | null
  assignmentEmployeeName: string
  onEditInformation?: () => void
  onCreateReview?: () => void
}

const statusToLabelType = (status?: string): LabelType => {
  const normalized = (status ?? '').toUpperCase()
  if (normalized.includes('OPTIMO') || normalized.includes('EXCELENTE')) return 'valido'
  if (normalized.includes('BUENO')) return 'validado'
  if (normalized.includes('REGULAR')) return 'pendiente'
  if (normalized.includes('MALO') || normalized.includes('DEFECTUOSO')) return 'invalido'
  return 'pendiente'
}

const AssignmentDetail: React.FC<AssignmentDetailProps> = ({
  open,
  onClose,
  loading,
  assignment,
  assignmentDevice,
  assignmentEmployeeName,
  onEditInformation,
  onCreateReview,
}) => {
  
  const assignmentStatusLabel = assignmentDevice?.device_status?.name ?? 'SIN ESTATUS'
  const isMobile = useIsMobile()
  const resolvedDeviceId = assignmentDevice?.device_id ?? assignment?.device_id ?? null
  const { devices, device, fetchDeviceById } = useInternalDevicesStore(
    (state) => ({
      devices: state.devices,
      device: state.device,
      fetchDeviceById: state.fetchDeviceById,
    }),
    shallow,
  )

  const storeDevice = useMemo(
    () => {
      if (!resolvedDeviceId) return null
      const fromList =
        devices.find((item) => item.device_id === resolvedDeviceId) ?? null
      if (fromList) return fromList
      return device?.device_id === resolvedDeviceId ? device : null
    },
    [device, devices, resolvedDeviceId],
  )

  const resolvedDevice = assignmentDevice ?? storeDevice

  useEffect(() => {
    if (!open || !resolvedDeviceId) return
    if (assignmentDevice || storeDevice) return
    void fetchDeviceById(resolvedDeviceId, true)
  }, [assignmentDevice, fetchDeviceById, open, resolvedDeviceId, storeDevice])

  return (
    <DetailsPanelLayout
      open={open}
      onClose={onClose}
      zIndex={10000}
      className={isMobile ? 'w-full' : ''}
      label={() =>
        assignmentDevice ? (
          <Label
            type={statusToLabelType(assignmentStatusLabel)}
            text={assignmentStatusLabel}
          />
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
                label="Informacion"
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

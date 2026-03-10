'use client'

import React from 'react'

import DetailsPanelLayout from '@/app/components/DetailsPanelLayout/DetailsPanelLayout'
import ButtonsNavigation from '@/app/components/ButtonsNavigation/ButtonsNavigation'
import Label from '@/app/components/Label/Label'
import type { LabelType } from '@/app/components/Label/types'
import type {
  InternalDevice,
  InternalDeviceReview,
} from '@/app/mappings/internaldevices/internaldevices.types'

import Information from './components/Information/Information'
import Revisiones from './components/Revisiones/Revisiones'
import { useIsMobile } from '@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery'

export interface InternalDeviceDetailProps {
  open: boolean
  onClose: () => void
  device: InternalDevice | null
  reviews: InternalDeviceReview[]
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

const InternalDeviceDetail: React.FC<InternalDeviceDetailProps> = ({
  open,
  onClose,
  device,
  reviews,
  onEditInformation,
  onCreateReview,
}) => {
  const statusLabel = device?.device_status?.name ?? 'SIN ESTATUS'
  const isMobile = useIsMobile()

  return (
    <DetailsPanelLayout
      open={open}
      onClose={onClose}
      className={isMobile ? 'w-full' : ''}
      zIndex={10000}
      label={() =>
        device ? <Label type={statusToLabelType(statusLabel)} text={statusLabel} /> : null
      }
    >
      {device ? (
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <h2 className="text-h3 text-blue-100">{device.name || device.serial_number}</h2>
          </div>

          <ButtonsNavigation
            dataTestId="internaldevices-detail-nav"
            ariaLabel="Secciones de dispositivo"
            buttonSize="small"
            activeVariant="solid"
            inactiveVariant="outline"
          >
            <ButtonsNavigation.Item
              id="info"
              label="Informacion"
              renderContent={<Information device={device} onEdit={onEditInformation} />}
            />
            <ButtonsNavigation.Item
              id="reviews"
              label="Revisiones"
              className="rounded-full"
              renderContent={<Revisiones reviews={reviews} onCreateReview={onCreateReview} />}
            />
          </ButtonsNavigation>
        </div>
      ) : (
        <div className="text-center text-gray-70">
          Selecciona un dispositivo para ver el detalle.
        </div>
      )}
    </DetailsPanelLayout>
  )
}

export default InternalDeviceDetail

import { useEffect, useMemo } from 'react'
import { shallow } from 'zustand/shallow'

import { useIsMobile } from '@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery'
import type { LabelType } from '@/app/components/Label/types'
import { useInternalDevicesStore } from '@/app/stores/useInternalDevicesStore/useInternalDevicesStore'

import type { AssignmentDetailProps } from '../types'

const statusToLabelType = (status?: string): LabelType => {
  const normalized = (status ?? '').toUpperCase()
  if (normalized.includes('OPTIMO') || normalized.includes('EXCELENTE')) return 'valido'
  if (normalized.includes('BUENO')) return 'validado'
  if (normalized.includes('REGULAR')) return 'pendiente'
  if (normalized.includes('MALO') || normalized.includes('DEFECTUOSO')) return 'invalido'
  return 'pendiente'
}

/**
 * Encapsulates derived data and store wiring for AssignmentDetail.
 */
const useAssignmentDetail = ({
  open,
  assignment,
  assignmentDevice,
}: AssignmentDetailProps) => {
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

  const storeDevice = useMemo(() => {
    if (!resolvedDeviceId) return null
    const fromList = devices.find((item) => item.device_id === resolvedDeviceId) ?? null
    if (fromList) return fromList
    return device?.device_id === resolvedDeviceId ? device : null
  }, [device, devices, resolvedDeviceId])

  const resolvedDevice = assignmentDevice ?? storeDevice
  const assignmentStatusLabel = resolvedDevice?.device_status?.name ?? 'SIN ESTATUS'
  const statusLabelType = statusToLabelType(assignmentStatusLabel)

  useEffect(() => {
    if (!open || !resolvedDeviceId) return
    if (assignmentDevice || storeDevice) return
    void fetchDeviceById(resolvedDeviceId, true)
  }, [assignmentDevice, fetchDeviceById, open, resolvedDeviceId, storeDevice])

  return {
    assignmentStatusLabel,
    isMobile,
    resolvedDevice,
    resolvedDeviceId,
    statusLabelType,
    showStatusLabel: Boolean(assignmentDevice),
  }
}

export default useAssignmentDetail

'use client'

import React, { useEffect, useMemo } from 'react'
import { shallow } from 'zustand/shallow'

import { Button } from '@/app/components/Button/Button'
import useQuery from '@/app/hooks/useQuery/useQuery'
import type { InternalDeviceReview } from '@/app/mappings/internaldevices/internaldevices.types'
import { useInternalDevicesStore } from '@/app/stores/useInternalDevicesStore/useInternalDevicesStore'
import HammerIcon from '@/assets/icons/tools/tools/hammer.svg'

export interface ReviewsAssignmentProps {
  deviceId?: string | null
  deviceName?: string | null
  deviceStatus?: string | null
  onCreateReview?: () => void
}

const getReviewDate = (review: InternalDeviceReview): string =>
  review.date ?? review.created_at ?? '-'

const getReviewResponsible = (review: InternalDeviceReview): string =>
  review.responsible ?? review.user_name ?? review.user_id ?? '-'

const ReviewsAssignment: React.FC<ReviewsAssignmentProps> = ({
  deviceId,
  onCreateReview,
}) => {
  const { updateQuery } = useQuery()
  const {
    deviceReviewsByDevice,
    loadingDeviceReviewsByDevice,
    fetchDeviceById,
    fetchDeviceReviewsByDeviceId,
  } = useInternalDevicesStore(
    (state) => ({
      deviceReviewsByDevice: state.deviceReviewsByDevice,
      loadingDeviceReviewsByDevice: state.loadingDeviceReviewsByDevice,
      fetchDeviceById: state.fetchDeviceById,
      fetchDeviceReviewsByDeviceId: state.fetchDeviceReviewsByDeviceId,
    }),
    shallow,
  )

  useEffect(() => {
    if (!deviceId) return
    void fetchDeviceById(deviceId, true)
    void fetchDeviceReviewsByDeviceId(deviceId, true)
  }, [deviceId, fetchDeviceById, fetchDeviceReviewsByDeviceId])

  const rows = useMemo<InternalDeviceReview[]>(
    () => deviceReviewsByDevice ?? [],
    [deviceReviewsByDevice],
  )

  const handleCreateReview = () => {
    if (onCreateReview) {
      onCreateReview()
      return
    }
    if (!deviceId) return
    updateQuery({ id: deviceId, view: 'review' })
  }

  if (loadingDeviceReviewsByDevice) {
    return <div className="text-center text-gray-70">Cargando revisiones...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-end">
        <Button
          size="small"
          variant="ghost"
          icon={HammerIcon}
          onClick={handleCreateReview}
        >
          Nueva Revision
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-20 bg-white shadow-sm">
        <table className="w-full text-left">
          <thead className="border-b border-gray-20">
            <tr className="text-gray-90">
              <th className="px-6 py-4 text-c2 font-semibold">FECHA</th>
              <th className="px-6 py-4 text-c2 font-semibold">DIAGNOSTICO</th>
              <th className="px-6 py-4 text-c2 font-semibold">RESPONSABLE</th>
            </tr>
          </thead>
          <tbody className="text-gray-70">
            {rows.length === 0 && (
              <tr>
                <td className="px-6 py-5 text-center text-c2" colSpan={3}>
                  Sin revisiones registradas.
                </td>
              </tr>
            )}
            {rows.map((review) => (
              <tr
                key={review.device_review_id}
                className="border-b border-gray-10 last:border-b-0"
              >
                <td className="px-6 py-4 text-c2">{getReviewDate(review)}</td>
                <td className="px-6 py-4 text-c2">
                  <span className="block max-w-[280px] truncate">
                    {review.description || 'Sin diagnostico'}
                  </span>
                </td>
                <td className="px-6 py-4 text-c2">{getReviewResponsible(review)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ReviewsAssignment

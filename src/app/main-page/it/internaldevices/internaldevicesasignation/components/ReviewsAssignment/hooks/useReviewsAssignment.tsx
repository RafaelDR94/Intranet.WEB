import { useCallback, useEffect, useMemo } from 'react'
import { shallow } from 'zustand/shallow'

import useQuery from '@/app/hooks/useQuery/useQuery'
import type { InternalDeviceReview } from '@/app/mappings/internaldevices/internaldevices.types'
import { useInternalDevicesStore } from '@/app/stores/useInternalDevicesStore/useInternalDevicesStore'

import type { ReviewRow, ReviewsAssignmentProps } from '../types'

const getReviewDate = (review: InternalDeviceReview): string =>
  review.date ?? review.created_at ?? '-'

const getReviewResponsible = (review: InternalDeviceReview): string =>
  review.responsible ?? review.user_name ?? review.user_id ?? '-'

/**
 * Encapsulates data fetching and handlers for ReviewsAssignment.
 */
const useReviewsAssignment = ({ deviceId, onCreateReview }: ReviewsAssignmentProps) => {
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

  const rows = useMemo<ReviewRow[]>(
    () =>
      (deviceReviewsByDevice ?? []).map((review) => ({
        id: review.device_review_id,
        dateLabel: getReviewDate(review),
        description: review.description || 'Sin diagnostico',
        responsible: getReviewResponsible(review),
      })),
    [deviceReviewsByDevice],
  )

  const handleCreateReview = useCallback(() => {
    if (onCreateReview) {
      onCreateReview()
      return
    }
    if (!deviceId) return
    updateQuery({ id: deviceId, view: 'review' })
  }, [deviceId, onCreateReview, updateQuery])

  return {
    handleCreateReview,
    loading: loadingDeviceReviewsByDevice,
    rows,
  }
}

export default useReviewsAssignment

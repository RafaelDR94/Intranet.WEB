'use client'

import React from 'react'

import { Button } from '@/app/components/Button/Button'
import type { InternalDeviceReview } from '@/app/mappings/internaldevices/internaldevices.types'
import HammerIcon from '@/assets/icons/tools/tools/hammer.svg'

export interface InternalDeviceReviewsProps {
  reviews: InternalDeviceReview[]
  onCreateReview?: () => void
}

const getReviewDate = (review: InternalDeviceReview): string => {
  const value = review.date ?? review.created_at
  if (!value) return '-'

  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/)
  return match ? `${match[3]}/${match[2]}/${match[1]}` : value
}

const getReviewResponsible = (review: InternalDeviceReview): string =>
  review.responsible ?? review.user_name ?? review.user_id ?? '-'

const Revisiones: React.FC<InternalDeviceReviewsProps> = ({
  reviews,
  onCreateReview,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h3 className="text-label text-blue-60 uppercase tracking-wide">Historial</h3>
        <Button
          size="small"
          variant="ghost"
          icon={HammerIcon}
          className="gap-2"
          onClick={onCreateReview}
        >
          Nueva revision
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-20 bg-white-100 shadow-sm">
        <table className="w-full text-left">
          <thead className="border-b border-gray-20">
            <tr className="text-gray-90">
              <th className="px-6 py-4 text-c2 font-semibold">FECHA</th>
              <th className="px-6 py-4 text-c2 font-semibold">DIAGNOSTICO</th>
              <th className="px-6 py-4 text-c2 font-semibold">RESPONSABLE</th>
            </tr>
          </thead>
          <tbody className="text-gray-70">
            {reviews.length === 0 && (
              <tr>
                <td className="px-6 py-5 text-center text-c2" colSpan={3}>
                  Sin revisiones registradas.
                </td>
              </tr>
            )}
            {reviews.map((review) => (
              <tr
                key={review.device_review_id}
                className="border-b border-gray-10 last:border-b-0"
              >
                <td className="px-6 py-4 text-c2">{getReviewDate(review)}</td>
                <td className="px-6 py-4 text-c2 align-top">
                  <span className="block whitespace-normal break-words">
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

export default Revisiones

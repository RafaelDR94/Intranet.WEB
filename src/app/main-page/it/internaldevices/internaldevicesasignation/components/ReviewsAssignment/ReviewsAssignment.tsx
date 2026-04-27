'use client'

import { Button } from '@/app/components/Button/Button'
import HammerIcon from '@/assets/icons/tools/tools/hammer.svg'

import useReviewsAssignment from './hooks/useReviewsAssignment'
import type { ReviewsAssignmentProps } from './types'

const ReviewsAssignment = (props: ReviewsAssignmentProps) => {
  const { handleCreateReview, loading, rows } = useReviewsAssignment(props)

  if (loading) {
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

      <div className="overflow-hidden rounded-2xl border border-gray-20 bg-white-70 shadow-sm">
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
                key={review.id}
                className="border-b border-gray-10 last:border-b-0"
              >
                <td className="px-6 py-4 text-c2">{review.dateLabel}</td>
                <td className="px-6 py-4 text-c2 align-top">
                  <span className="block whitespace-normal break-words">
                    {review.description}
                  </span>
                </td>
                <td className="px-6 py-4 text-c2">{review.responsible}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ReviewsAssignment

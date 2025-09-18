"use client";

import React, { useMemo, useState } from 'react'

import { Card } from '@/app/components/Card/Card'
import Pagination from '@/app/components/Pagination/Pagination'
import Default1 from '@/assets/images/DefautlImagesCards/Default1.png'
import Default2 from '@/assets/images/DefautlImagesCards/Default2.png'
import Default3 from '@/assets/images/DefautlImagesCards/Default3.png'

type KeyOrFn<T> = keyof T | ((row: T) => string)

export type CardsGridProps<T> = {
  data: T[]
  /** Adaptador con mapeos y acciones */
  adapt: {
    titleKey: KeyOrFn<T>
    labelKey?: KeyOrFn<T>
    descriptionKey?: KeyOrFn<T>
    imageKey?: KeyOrFn<T>
    onPrimaryAction: (row: T) => void
    primaryLabel?: string
    onSecondaryAction?: (row: T) => void
    secondaryLabel?: string
    showPrimaryButton?: boolean
    showSecondaryButton?: boolean
    cardsPerPage?: number
  }
  /** Fallback de elementos por página cuando el adaptador no lo indica */
  rowsPerPage?: number
}

const getVal = <T,>(row: T, k?: KeyOrFn<T>, fallback = ''): string => {
  if (!k) return fallback
  return typeof k === 'function' ? String(k(row) ?? fallback) : String((row as any)[k] ?? fallback)
}

export function CardsGrid<T>({ data, adapt, rowsPerPage = 6 }: CardsGridProps<T>) {
  // Enforce a maximum of 6 cards per page
  const pageSize = Math.min(6, adapt.cardsPerPage ?? rowsPerPage)
  // Use 1-based page index to integrate with Pagination component
  const [page, setPage] = useState(1)

  const { totalPages, pageItems } = useMemo(() => {
    const total = Math.max(1, Math.ceil((data?.length ?? 0) / Math.max(1, pageSize)))
    const start = (page - 1) * pageSize
    const end = start + pageSize
    return {
      totalPages: total,
      pageItems: (data ?? []).slice(start, end),
    }
  }, [data, page, pageSize])

  return (
    <div className="w-full">
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {pageItems.map((row, idx) => {
          // Determine absolute index in the full dataset to interleave defaults globally
          const absoluteIndex = (page - 1) * pageSize + idx
          const defaults = [Default1.src, Default2.src, Default3.src]
          const defaultSrc = defaults[absoluteIndex % defaults.length]
          const rawSrc = getVal(row, adapt.imageKey, '')
          const candidateSrc = rawSrc && rawSrc.trim().length > 0 ? rawSrc : defaultSrc

          return (
            <Card
              key={(row as any).id ?? idx}
              orientation="vertical"
              imageSrc={candidateSrc}
              // Pass fallback to handle runtime load errors
              fallbackSrc={defaultSrc}
              label={getVal(row, adapt.labelKey, '')}
              title={getVal(row, adapt.titleKey, '')}
              description={getVal(row, adapt.descriptionKey, '')}
              onAccept={() => adapt.onPrimaryAction(row)}
              onCancel={adapt.onSecondaryAction ? () => adapt.onSecondaryAction!(row) : undefined}
              showPrimaryButton={adapt.showPrimaryButton !== false}
              showSecondaryButton={!!adapt.showSecondaryButton}
              primaryLabel={adapt.primaryLabel ?? 'Ver'}
              secondaryLabel={adapt.secondaryLabel ?? 'Cancelar'}
            />
          )
        })}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center pr-3 pl-3">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}
    </div>
  )
}

export default CardsGrid

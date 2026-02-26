'use client'

import { useMemo } from 'react'
import { useSearchParams } from 'next/navigation'

/**
 * Resuelve el tipo de autorización a mostrar en el detalle.
 */
const useAuthorizationDetail = () => {
  const searchParams = useSearchParams()
  const kind = searchParams.get('kind') ?? ''
  const normalizedKind = useMemo(() => kind.toLowerCase(), [kind])

  const isRequisition = normalizedKind.includes('requis')
  const isVale = normalizedKind.includes('vale')

  return {
    kind,
    normalizedKind,
    isRequisition,
    isVale,
  }
}

export default useAuthorizationDetail

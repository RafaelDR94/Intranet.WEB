"use client"

import { useMemo } from 'react'
import { useSearchParams } from 'next/navigation'

/**
 * Resuelve el tipo de autorización a mostrar en el detalle.
 */
const useAuthorizationDetail = () => {
  const searchParams = useSearchParams()
  const kind = searchParams.get('kind') ?? ''
  const normalizedKind = useMemo(() => kind.toLowerCase(), [kind])
  const comparableKind = useMemo(
    () => normalizedKind.normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
    [normalizedKind],
  )

  const isPreRequisition = comparableKind.includes('solicitud de requisicion')
  const isRequisition = comparableKind.includes('requis')
  const isVale = comparableKind.includes('vale')

  return {
    kind,
    normalizedKind,
    isPreRequisition,
    isRequisition,
    isVale,
  }
}

export default useAuthorizationDetail

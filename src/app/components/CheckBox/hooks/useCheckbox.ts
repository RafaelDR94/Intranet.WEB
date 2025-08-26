import { useEffect } from 'react'

/**
 * Hook para gestionar el estado indeterminado de un checkbox
 */
export function useIndeterminate(
  ref: React.RefObject<HTMLInputElement | null>,
  indeterminate: boolean
) {
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate
  }, [ref, indeterminate])
}
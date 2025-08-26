// useResponsive.ts
import { useEffect, useState } from 'react'

/**
 * useMediaQuery
 * Observa un Media Query CSS y devuelve si coincide o no.
 *
 * @param query Cadena con el media query, p. ej. "(min-width: 768px)".
 * @param initialValue Valor inicial opcional para SSR o entornos sin `window`.
 * @returns `true` si el media query coincide, `false` en caso contrario.
 *
 * Detalles:
 * - Usa `window.matchMedia` y se suscribe a cambios con `addEventListener('change', ...)`.
 * - Fallback para Safari < 14 (`addListener`/`removeListener`).
 * - En SSR o pruebas sin DOM, utiliza `initialValue` y evita acceder a `window`.
 */
export function useMediaQuery(query: string, initialValue = false): boolean {
  const isClient =
    typeof window !== 'undefined' && typeof window.matchMedia !== 'undefined'

  const [matches, setMatches] = useState<boolean>(() => {
    if (!isClient) return initialValue
    return window.matchMedia(query).matches
  })

  useEffect(() => {
    if (!isClient) return

    const mql = window.matchMedia(query)
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches)

    // estado inicial (por si el query cambia durante la vida del componente)
    setMatches(mql.matches)

    // suscripción
    if (mql.addEventListener) {
      mql.addEventListener('change', onChange)
    } else {
      // Safari < 14
      mql.addListener(onChange)
    }

    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener('change', onChange)
      } else {
        mql.removeListener(onChange)
      }
    }
  }, [query, isClient])

  return matches
}

/**
 * Breakpoints reutilizables en toda la app.
 * Ajusta los valores según tu diseño.
 */
export const MQ = {
  mobile: '(max-width: 767px)',
  tablet: '(min-width: 768px) and (max-width: 1023px)',
  desktop: '(min-width: 1024px)',
} as const

/**
 * Hook específico para saber si estás en mobile.
 * Ejemplo:
 *   const isMobile = useIsMobile()
 */
export function useIsMobile(initialValue = false) {
  return useMediaQuery(MQ.mobile, initialValue)
}

/**
 * Hook que devuelve todos los flags a la vez.
 * Ejemplo:
 *   const { isMobile, isTablet, isDesktop } = useBreakpoint()
 */
export function useBreakpoint(initialValue = false) {
  const isMobile = useMediaQuery(MQ.mobile, initialValue)
  const isTablet = useMediaQuery(MQ.tablet, initialValue)
  const isDesktop = useMediaQuery(MQ.desktop, initialValue)
  return { isMobile, isTablet, isDesktop }
}

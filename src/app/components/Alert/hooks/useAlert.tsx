import { useEffect,useRef} from "react"

import { useAlertProps } from "./types"
export const useAlertComponent = ({title, description, type, variant,autoCloseMs, onClose}: useAlertProps) => {

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Cierre automático solo si autoCloseMs es un número válido
  useEffect(() => {
    if (autoCloseMs && typeof autoCloseMs === 'number' && autoCloseMs > 0) {
      // Limpia cualquier timer previo
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {

        onClose?.()
      }, autoCloseMs)
      
    }
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }
    // Reinicia el temporizador si cambian texto/tipo/tiempo (caso de reuso)
  }, [autoCloseMs, title, description, type, variant, onClose])

}

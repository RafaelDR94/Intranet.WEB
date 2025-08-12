/**
 * Rango de códigos de estado HTTP aceptado `[min, max]`.
 */
export type StatusRange = readonly [min: number, max: number]

/**
 * Estructura común para representar errores normalizados de una API.
 */
export type NormalizedError = {
  /** Mensaje amigable del error */
  message: string
  /** Código de estado HTTP si está disponible */
  status?: number
  /** Código específico del backend */
  code?: string | number
  /** Datos adicionales del error */
  details?: unknown
}
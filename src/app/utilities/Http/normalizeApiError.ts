// src/app/utilities/http/normalizeApiError.ts
import type { AxiosResponse } from 'axios'
import { NormalizedError } from './types'

const isAxiosResponse = (x: any): x is AxiosResponse =>
  x && typeof x === 'object' && typeof x.status === 'number' && 'data' in x

/**
 * Normaliza distintas estructuras de error (respuestas HTTP, AxiosError, strings)
 * en un objeto uniforme para manejar en la aplicación.
 *
 * @param err - Error original recibido.
 * @param fallback - Mensaje por defecto si no se puede determinar el error.
 * @returns Un {@link NormalizedError} con información estandarizada.
 */
export function normalizeApiError(err: unknown, fallback = 'Error desconocido'): NormalizedError {
  // Caso 1: nos pasaron directamente la respuesta HTTP
  if (isAxiosResponse(err)) {
    const data = err.data ?? {}
    const message =
      data?.error_Message ??
      data?.message ??
      err.statusText ??
      `HTTP ${err.status}`

    return {
      message: message || fallback,
      status: err.status,
      code: data?.error_Code ?? data?.code,
      details: data,
    }
  }

  // Caso 2: AxiosError / Error con posible response
  if (err instanceof Error) {
    const anyErr = err as any
    const res: AxiosResponse | undefined = anyErr?.response
    if (res) return normalizeApiError(res, fallback)
    return { message: err.message || fallback }
  }

  // Caso 3: string
  if (typeof err === 'string') {
    return { message: err || fallback }
  }

  // Caso 4: objeto plano con message
  if (err && typeof err === 'object' && 'message' in (err as any)) {
    return { message: String((err as any).message) }
  }

  return { message: fallback }
}

// src/app/utilities/http/requireGateway.ts
import type {
  IntranetGetType,
  IntranetPostType,
  IntranetPutType,
  IntranetDeleteType,
} from '@/app/hooks/useIntranetCRUD/types'
import { useIntranetGatewayStore } from '@/app/stores/system/useIntranetGatewayStore'

type GatewayFns = {
  get: IntranetGetType
  post: IntranetPostType
  put: IntranetPutType
  del: IntranetDeleteType
}

/**
 * Obtiene una función del gateway (get/post/put/del) o lanza si no está lista.
 * No es un hook — se puede usar dentro de utilities/acciones o stores.
 *
 * @example
 * const getFn = requireGateway('get')        // IntranetGetType
 * const res = await pGet(getFn)('/url')     // úsalo con promisifyIntranet
 */
export function requireGateway<K extends keyof GatewayFns>(key: K): GatewayFns[K] {
  const fn = useIntranetGatewayStore.getState()[key]
  if (!fn) throw new Error(`Intranet ${key.toUpperCase()} no inicializado`)
  return fn as GatewayFns[K]
}

/**
 * Útil si quieres revisar el flag sin lanzar.
 */
export function isGatewayReady() {
  return useIntranetGatewayStore.getState().isReady
}

/**
 * Si prefieres pedir todo el CRUD de una vez (y fallar si falta algo).
 */
export function requireFullGateway(): GatewayFns {
  const { get, post, put, del } = useIntranetGatewayStore.getState()
  if (!get || !post || !put || !del) {
    throw new Error('Intranet CRUD no inicializado completamente')
  }
  return { get, post, put, del }
}

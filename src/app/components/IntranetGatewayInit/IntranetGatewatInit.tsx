// src/app/(intranet)/IntranetGatewayInit.tsx
'use client'

import { useLayoutEffect } from 'react'

import useIntranetCRUD from '@/app/hooks/useIntranetCRUD/useIntranetCRUD'
import { useIntranetGatewayStore } from '@/app/stores/system/useIntranetGatewayStore'

/**
 * Tipo mínimo para describir las funciones CRUD que se registran en el store.
 * Ajusta las firmas si ya tienes tipos detallados en tu hook `useIntranetCRUD`.
 */
export type IntranetCRUD = {
  /** Realiza solicitudes GET al backend de la Intranet. */
  get: (...args: unknown[]) => unknown
  /** Realiza solicitudes POST al backend de la Intranet. */
  post: (...args: unknown[]) => unknown
  /** Realiza solicitudes PUT al backend de la Intranet. */
  put: (...args: unknown[]) => unknown
  /** Realiza solicitudes DELETE al backend de la Intranet. */
  del: (...args: unknown[]) => unknown
}

/**
 * IntranetGatewayInit
 *
 * Componente **no visual** que inicializa y registra las
 * funciones CRUD globales de la Intranet en el store (Zustand).
 *
 * - Usa `useLayoutEffect` para asegurar que el registro de CRUD
 *   ocurra **antes** de que los efectos de los componentes hijos
 *   se ejecuten, evitando condiciones de carrera cuando un hijo
 *   necesita el gateway inmediatamente al montar.
 *
 * - Debe renderizarse una sola vez en el árbol de la aplicación
 *   (por ejemplo, en `app/(intranet)/layout.tsx`).
 *
 * @example
 * // app/(intranet)/layout.tsx
 * export default function IntranetLayout({ children }: { children: React.ReactNode }) {
 *   return (
 *     <>
 *       <IntranetGatewayInit />
 *       {children}
 *     </>
 *   );
 * }
 */
export default function IntranetGatewayInit() {
  const { IntranetGet, IntranetPost, IntranetPut, IntranetDelete } = useIntranetCRUD()
  const setCRUD = useIntranetGatewayStore(s => s.setCRUD)

  // Registrar CRUD antes que los effects de los hijos
  useLayoutEffect(() => {
    setCRUD({ get: IntranetGet, post: IntranetPost, put: IntranetPut, del: IntranetDelete })
  }, [IntranetGet, IntranetPost, IntranetPut, IntranetDelete, setCRUD])

  return null
}

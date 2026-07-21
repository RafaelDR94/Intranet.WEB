import clsx from 'clsx'

import type { LabelType } from './types'

const base = 'inline-block text-center font-semibold text-label  px-3 py-1 rounded-full w-auto m-1 text-[11px]'
const variantMap: Record<LabelType, string> = {
  valido: 'bg-alert-green-10 text-alert-green-100 border border-alert-green-100 text-[11px]',
  validado: 'bg-alert-green-10 text-alert-green-100 border border-alert-green-100 text-[11px]',
  invalido: 'bg-alert-yellow-10 text-alert-yellow-100 border border-alert-yellow-100 text-[11px]',
  prohibido: 'bg-alert-red-10 text-alert-red-100 border border-alert-red-100 text-[11px]',
  actualizado: 'bg-alert-blue-10 text-alert-blue-100 border border-alert-blue-100 text-[11px]',
  pendiente: 'bg-alert-yellow-10 text-alert-yellow-100 border border-alert-yellow-100 text-[11px]',
  "en-proceso": "bg-alert-yellow-10 text-alert-yellow-100 border border-alert-yellow-100 text-[11px]",
  rechazado: 'bg-alert-red-10 text-alert-red-100 border border-alert-red-100 text-[11px]',
  restringido: 'bg-gray-20 text-gray-100 border border-gray-100 text-[11px]',
  purple: 'bg-alert-purple-10 text-alert-purple-100 border border-alert-purple-100 text-[11px]',
  "validado-op":"bg-alert-green-10 text-alert-green-100 border border-alert-green-100 text-[11px]",
  "sin-factura": "bg-alert-orange-10 text-alert-orange-100 border border-alert-orange-100 text-[11px]",
  "factura-rechazada": 'bg-gray-20 text-gray-100 border border-gray-100 text-c3',
  "sin-asignar": "bg-gray-20 text-gray-100 border border-gray-100 text-[11px]",
  "asignado": "bg-alert-blue-10 text-alert-blue-100 border border-alert-blue-100 text-[11px]",
  "borrador": 'bg-alert-purple-10 text-alert-purple-100 border border-alert-purple-100 text-[11px]',
  /**
   * NUEVOS: Tipos de Vale
   * - Vale Azul: chip con borde azul y fondo blanco (según el diseño).
   * - Vale Rosa: chip con fondo rosa suave.
   *
   * Nota: Incluimos clases “tokenizadas” (alert-*) si existen en tu design system,
   * y además un fallback Tailwind (bg-pink-100, text-pink-700, border-pink-300)
   * para el caso de que no exista la escala "alert-pink-*".
   */

  // Pastilla estilo "outlined" azul (fondo blanco)
  'vale-azul': "bg-alert-blue-10 text-alert-blue-100 border border-alert-blue-100 text-[11px]",

  // Pastilla rosa "filled" suave
  'vale-rosa': "bg-alert-pink-10 text-alert-pink-100 border border-alert-pink-100 text-[11px]",
}



/** Get class names for Label component */
export function getLabelClasses(type: LabelType) {
  return clsx(base, variantMap[type])
}

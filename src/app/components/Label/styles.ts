import clsx from 'clsx'

import type { LabelType } from './types'

const base = 'inline-block text-center font-semibold text-label px-3 py-1 rounded-full w-auto m-1'
const variantMap: Record<LabelType, string> = {
  valido: 'bg-alert-green-10 text-alert-green-100 border border-alert-green-100',
  invalido: 'bg-alert-yellow-10 text-alert-yellow-100 border border-alert-yellow-100',
  prohibido: 'bg-alert-red-10 text-alert-red-100 border border-alert-red-100',
  actualizado: 'bg-alert-blue-10 text-alert-blue-100 border border-alert-blue-100',
  pendiente: 'bg-alert-orange-10 text-alert-orange-100 border border-alert-orange-100',
  "en-proceso": "bg-alert-yellow-10 text-alert-yellow-100 border border-alert-yellow-100",
  rechazado: 'bg-alert-red-10 text-alert-red-100 border border-alert-red-100',
  restringido: 'bg-gray-20 text-gray-100 border border-gray-100',
  purple: 'bg-alert-purple-10 text-alert-purple-100 border border-alert-purple-100',
  "validado-op":"bg-alert-yellow-10 text-alert-yellow-100 border border-alert-yellow-100",

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
  'vale-azul': "bg-alert-blue-10 text-alert-blue-100 border border-alert-blue-100",

  // Pastilla rosa "filled" suave
  'vale-rosa': "bg-alert-pink-10 text-alert-pink-100 border border-alert-pink-100",
}



/** Get class names for Label component */
export function getLabelClasses(type: LabelType) {
  return clsx(base, variantMap[type])
}

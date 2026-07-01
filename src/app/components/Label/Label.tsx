import React from 'react'

import { getLabelClasses } from './styles'
import type { LabelProps } from './types'
/**
 * Etiqueta/badge de estado con variantes visuales (p. ej. válido, inválido, prohibido).
 *
 * Renderiza un `<span>` con las clases calculadas por `getLabelClasses(type)`.
 * El texto pasado en `text` se muestra tal cual; el color/estilo depende de `type`.
 *
 * @remarks
 * - Usa esta etiqueta para **comunicar estados** de registros/documentos de forma compacta.
 * - Mantén el texto corto. Si necesitas abreviaturas, agrega un `title` o `aria-label`
 *   en el contenedor padre para aportar contexto.
 *
 * @accessibility
 * - No relies solo en el color: el `text` debe expresar el estado (ej. “Válido”).
 * - Si colocas un tooltip o abreviatura, considera `aria-label` con el estado completo.
 *
 * @example
 * ```tsx
 * <Label type="valido" text="Válido" />
 * ```
 *
 * @example Abreviatura con ayuda
 * ```tsx
 * <span title="Documento inválido">
 *   <Label type="invalido" text="Inválido" />
 * </span>
 * <Label type="valido" text="Validado" />
 * <Label type="vale-azul" text="Vale Azul" />
 * <Label type="vale-rosa" text="Vale Rosa" />
 * ```
 */
export const Label: React.FC<LabelProps> = ({ type, text, className }) => (
  <span className={`${getLabelClasses(type ?? "pendiente")} ${className ?? ""}`}>
    {String(text ?? "").toUpperCase()}
  </span>
);

export default Label

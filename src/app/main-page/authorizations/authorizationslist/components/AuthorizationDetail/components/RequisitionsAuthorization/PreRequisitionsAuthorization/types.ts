import type { ReactNode } from 'react'

/**
 * Campo informativo que se muestra en el bloque superior de la prerequisicion.
 */
export type PreRequisitionField = {
  /** Etiqueta visible del campo. */
  label: string
  /** Valor mostrado dentro del campo. */
  value: string
  /** Tipo semantico del campo para renderizar controles no editables. */
  type?: 'text' | 'date'
}

/**
 * Fila del presupuesto de viaticos para la prerequisicion.
 */
export type PreRequisitionBudgetRow = {
  /** Identificador estable de la fila. */
  id: string
  /** Concepto del gasto. */
  concept: string
  /** Viaticos nacionales cotizados. */
  nationalQuoted: number
  /** Viaticos extranjeros cotizados. */
  foreignQuoted: number
  /** Numero de personas consideradas. */
  people: number
  /** Numero de dias considerados. */
  days: number
  /** Subtotal calculado o enviado por el consumidor. */
  subtotal: number
  /** Observaciones visibles para la fila. */
  observations?: string
}

/**
 * Props para renderizar una vista dinamica de autorizacion de prerequisiciones.
 */
export type PreRequisitionsAuthorizationProps = {
  /** Titulo del presupuesto, normalmente incluye la clave de requisicion. */
  title: string
  /** Campos del resumen superior. */
  fields: PreRequisitionField[]
  /** Texto con los colaboradores incluidos en la requisicion. */
  collaborators?: string
  /** Filas del presupuesto de viaticos. */
  rows: PreRequisitionBudgetRow[]
  /** Monto subtotal. Si no se manda, se calcula con la suma de filas. */
  subtotal?: number
  /** Monto total. Si no se manda, usa el subtotal. */
  total?: number
  /** Nota inferior de la vista. */
  note?: string
  /** Texto auxiliar del total. */
  totalHint?: string
  /** Contenido adicional debajo del presupuesto. */
  children?: ReactNode
  /** Controla si se muestran las acciones superiores. */
  showActions?: boolean
  /** Deshabilita el boton de rechazo. */
  rejectDisabled?: boolean
  /** Deshabilita el boton de aprobacion. */
  approveDisabled?: boolean
  /** Callback al rechazar la prerequisicion. */
  onReject?: () => void
  /** Callback al aprobar la prerequisicion. */
  onApprove?: () => void
}

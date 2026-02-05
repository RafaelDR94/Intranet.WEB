/**
 * Representa la evidencia de aprobaciÃ³n asociada a una requisiciÃ³n.
 */
export type BillingRequisitionImageUrl = {
  /** Id de la requisiciÃ³n. */
  idRequisition: string
  /** URL pÃºblica de la imagen. */
  imageUrl: string
}

/**
 * Payload para actualizar la evidencia de aprobaciÃ³n.
 */
export type BillingRequisitionImageUrlPut = {
  /** Id de la requisiciÃ³n. */
  idRequisition: string
  /** URL pÃºblica de la imagen. */
  imageUrl: string
}

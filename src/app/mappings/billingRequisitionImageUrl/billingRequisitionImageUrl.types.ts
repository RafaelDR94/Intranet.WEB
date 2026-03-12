/**
 * Representa la evidencia de aprobación asociada a una requisición.
 */
export type BillingRequisitionImageUrl = {
  /** Id de la requisición. */
  idRequisition: string
  /** URL póºblica de la imagen. */
  imageUrl: string
}

/**
 * Payload para actualizar la evidencia de aprobación.
 */
export type BillingRequisitionImageUrlPut = {
  /** Id de la requisición. */
  idRequisition: string
  /** URL póºblica de la imagen. */
  imageUrl: string
}

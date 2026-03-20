/**
 * Representa la responsiva asociada a una asignacion de dispositivo.
 */
export type DeviceAssignmentResponsiveUrl = {
  /** Id de la asignacion de dispositivo. */
  idDeviceAssignment: string
  /** URL publica de la responsiva. */
  responsiveUrl: string
}

/**
 * Payload para actualizar la responsiva de asignacion.
 */
export type DeviceAssignmentResponsiveUrlPut = {
  /** Id de la asignacion de dispositivo. */
  idDeviceAssignment: string
  /** URL publica de la responsiva. */
  responsiveUrl: string
}

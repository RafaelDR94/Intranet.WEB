import type {
  DeviceAssignmentResponsiveUrl,
  DeviceAssignmentResponsiveUrlPut,
} from "./deviceAssignmentResponsiveUrl.types";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

/**
 * Mapea la respuesta de la API para la responsiva de asignacion.
 */
export const DeviceAssignmentResponsiveUrlMap = (
  raw: unknown,
): DeviceAssignmentResponsiveUrl => {
  const data = isRecord(raw) ? raw : {};

  return {
    idDeviceAssignment: String(
      data.idDeviceAssignment ??
        data.id_device_assignment ??
        data.device_assigment_id ??
        data.device_assignment_id ??
        data.assignment_id ??
        data.id ??
        "",
    ),
    responsiveUrl: String(
      data.responsiveUrl ??
        data.responsive_url ??
        data.responsiveURL ??
        data.document_url ??
        data.documentUrl ??
        "",
    ),
  };
};

/**
 * Normaliza el payload para actualizar la responsiva de asignacion.
 */
export const DeviceAssignmentResponsiveUrlPutMap = (
  payload: DeviceAssignmentResponsiveUrlPut,
): DeviceAssignmentResponsiveUrlPut => ({
  idDeviceAssignment: String(payload.idDeviceAssignment ?? ""),
  responsiveUrl: String(payload.responsiveUrl ?? ""),
});

import type {
  BillingRequisitionImageUrl,
  BillingRequisitionImageUrlPut,
} from "./billingRequisitionImageUrl.types";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

/**
 * Mapea la respuesta de la API para la evidencia de requisiciÃ³n.
 */
export const BillingRequisitionImageUrlMap = (
  raw: unknown,
): BillingRequisitionImageUrl => {
  const data = isRecord(raw) ? raw : {};

  return {
    idRequisition: String(
      data.idRequisition ??
        data.id_requisition ??
        data.requisition_id ??
        data.billingrequisition_id ??
        "",
    ),
    imageUrl: String(data.imageUrl ?? data.image_url ?? data.image ?? ""),
  };
};

/**
 * Normaliza el payload para actualizar la evidencia de requisiciÃ³n.
 */
export const BillingRequisitionImageUrlPutMap = (
  payload: BillingRequisitionImageUrlPut,
): BillingRequisitionImageUrlPut => ({
  idRequisition: String(payload.idRequisition ?? ""),
  imageUrl: String(payload.imageUrl ?? ""),
});

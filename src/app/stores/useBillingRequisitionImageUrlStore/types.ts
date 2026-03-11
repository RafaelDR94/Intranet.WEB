import type {
  BillingRequisitionImageUrl,
  BillingRequisitionImageUrlPut,
} from "@/app/mappings/billingRequisitionImageUrl/billingRequisitionImageUrl.types";

/**
 * Estado del store para evidencia de requisiciones.
 */
export type BillingRequisitionImageUrlState = {
  /** Evidencia actual consultada. */
  requisitionImage?: BillingRequisitionImageUrl;
  /** Flags de carga. */
  loading: boolean;
  updating: boolean;
  /** Flags de ó©xito. */
  successGet: boolean;
  successPut: boolean;
  /** Error normalizado. */
  error?: string;
  /** Obtiene la evidencia por id de requisición. */
  fetchRequisitionImageUrlById: (
    id: string,
    force?: boolean,
  ) => Promise<BillingRequisitionImageUrl | null>;
  /** Actualiza la evidencia de una requisición. */
  updateRequisitionImageUrl: (
    payload: BillingRequisitionImageUrlPut,
  ) => Promise<BillingRequisitionImageUrl | null>;
  /** Resetea el estado completo. */
  reset: () => void;
  /** Limpia flags de proceso. */
  resetFlags: () => void;
};

/** Setter de Zustand. */
export type Set = (
  partial:
    | Partial<BillingRequisitionImageUrlState>
    | ((
        s: BillingRequisitionImageUrlState,
      ) => Partial<BillingRequisitionImageUrlState>),
) => void;

/** Getter de Zustand. */
export type Get = () => BillingRequisitionImageUrlState;

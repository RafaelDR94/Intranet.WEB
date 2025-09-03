import { BillingDocuments, BillingDocumentsSatTable } from "@/app/mappings/billingdocuments/billingdocuments.types";

/**
 * Argumentos para el hook {@link useDetailsPanel}.
 */
export interface UseDetailsPanelArgs {
  /** Documento seleccionado en el panel. */
  selected: BillingDocumentsSatTable | BillingDocuments | null;
  /** true: rechazado, false: restringido. */
  rejectType: boolean
  /** Controla la apertura del panel. */
  setPanelOpen: (open: boolean) => void;
  /** Indica si se ejecuta en modo operaciones. */
  operations:boolean
  /** Id de requisición relacionada. */
  reqisition?:string
}

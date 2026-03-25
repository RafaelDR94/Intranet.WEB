import { BillingDocuments, BillingDocumentsSatTable } from "@/app/mappings/billingdocuments/billingdocuments.types";

/**
 * Argumentos para el hook {@link useDetailsPanel}.
 */
export interface UseDetailsPanelArgs {
  /** Documento seleccionado en el panel. */
  selected: BillingDocumentsSatTable | BillingDocuments | null;
  /** true: rechazado, false: restringido. */
  rejectType: any
  /** Controla la apertura del panel. */
  setPanelOpen: (open: boolean) => void;
  /** Indica si se ejecuta en modo operaciones. */
  operations:any
  /** Id de requisición relacionada. */
  reqisition?:string
  /** Texto visible para el tipo de documento. */
  documentLabel?: string
}

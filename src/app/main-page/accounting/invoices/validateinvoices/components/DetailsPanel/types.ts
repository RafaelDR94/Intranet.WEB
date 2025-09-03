import { BillingDocuments ,BillingDocumentsSatTable} from "@/app/mappings/billingdocuments/billingdocuments.types";

/**
 * Props para el componente {@link DetailsPanel}.
 */
export interface DetailsPanelProps {
  /** Indica si el panel está abierto. */
  panelOpen: boolean;
  /** Controla el estado abierto/cerrado del panel. */
  setPanelOpen: (open: boolean) => void;
  /** Documento de factura seleccionado. */
  selected: BillingDocuments |BillingDocumentsSatTable | null;
  /** Modo solo texto. */
  onlyText?:boolean
  /** Indica si la factura es válida. */
  validInvoice?:boolean
  /** Indica si la factura está rechazada. */
  rejectInvoice?:boolean
  /** Indica si se enviará la factura a SAP. */
  sendInvoiceToSap?:boolean
  /** true: rechazado false: restringido  */
  rejectType?:boolean
  /** Indica si se usa en operaciones. */
  operations?:boolean
  /** Identificador de requisición asociado. */
  reqisition?:string
}
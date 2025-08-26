import { BillingDocuments ,BillingDocumentsSatTable} from "@/app/mappings/billingdocuments/billingdocuments.types";
export interface DetailsPanelProps {
  panelOpen: boolean;
  setPanelOpen: (open: boolean) => void;
  selected: BillingDocuments |BillingDocumentsSatTable | null;
  onlyText?:boolean
  validInvoice?:boolean
  rejectInvoice?:boolean
  sendInvoiceToSap?:boolean
  /** true: rechazado false: restringido  */
  rejectType?:boolean  
}
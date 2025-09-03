import { BillingDocuments, BillingDocumentsSatTable } from "@/app/mappings/billingdocuments/billingdocuments.types";
export interface UseDetailsPanelArgs {
  selected: BillingDocumentsSatTable | BillingDocuments | null;
  rejectType: boolean
  setPanelOpen: (open: boolean) => void;
  operations:boolean
  reqisition?:string
}

import { BillingDocuments, BillingDocumentsSatTable } from "@/app/mappings/billingdocuments/billingdocuments.types";
import { BillingImages } from "@/app/mappings/billingimages/billingimages.types";

export type DetailsPanelSelected =
  | BillingDocuments
  | BillingDocumentsSatTable
  | BillingImages
  | null;

/**
 * Props para el componente {@link DetailsPanel}.
 */
export interface DetailsPanelProps {
  panelOpen: boolean;
  setPanelOpen: (open: boolean) => void;
  selected: DetailsPanelSelected;
  onlyText?: boolean;
  validInvoice?: boolean;
  rejectInvoice?: boolean;
  sendInvoiceToSap?: boolean;
  rejectType?: boolean;
  operations?: boolean;
  reqisition?: string;
  onSendToSap?: any;
}

export interface DocumentsPanelProps extends DetailsPanelProps {
  selected: BillingDocuments | BillingDocumentsSatTable | null;
}

export interface ImagesPanelProps extends DetailsPanelProps {
  selected: BillingImages;
}

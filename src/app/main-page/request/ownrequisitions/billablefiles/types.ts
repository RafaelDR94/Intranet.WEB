import type { BillingDocuments } from "@/app/mappings/billingdocuments/billingdocuments.types";
import { BillingImages } from "@/app/mappings/billingimages/billingimages.types";

export type BillableFileStatus = "Pendiente" | "Rechazado" | "Validada";

export type BillableFileRow = {
  id: string;
  requisitionKey?: string;
  source: BillingDocuments|BillingImages|null;
  files: {
    xml?: boolean;
    pdf?: boolean;
    image?: boolean;
  };
  date: string;
  category: string;
  project?: string;
  status: BillableFileStatus;
  comments?: string;
};

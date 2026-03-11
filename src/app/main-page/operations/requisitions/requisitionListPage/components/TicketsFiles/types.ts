import type { BillingImages, BillingImagesTable } from "@/app/mappings/billingimages/billingimages.types";
export type TicketsFilesProps = {
  onSelectedTicketChange?: (ticket: BillingImagesTable | null) => void;
  selectedTicketId?: string | null;
  eneableSelection?: boolean;
};
export type TicketRow = {
  id: string;
  date: string;
  category: string;
  status: string;
  comments: string;
  userComments?: string;
  detail: string;
  imageUrls: string[];
  source: BillingImages;
  attachments?: string[];
};

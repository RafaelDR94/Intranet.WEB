import { BillingImagesTable } from "@/app/mappings/billingimages/billingimages.types";
export interface PicturesTableProps {
  setSelectedPictures: (picture: BillingImagesTable | null) => void;
}

import { BillingImagesTable } from "@/app/mappings/billingimages/billingimages.types";

/**
 * Props para el componente {@link PictureTable}.
 */
export interface PicturesTableProps {
  /** Callback ejecutado cuando se selecciona una imagen. */
  setSelectedPictures: (picture: BillingImagesTable | null) => void;
}

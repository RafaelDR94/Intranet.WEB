import { BillingImagesTable } from "@/app/mappings/billingimages/billingimages.types"

/**
 * Props para el componente {@link AddFilesComponent}.
 */
export type AddFilesComponentProps = {
  /** Imagen actualmente seleccionada. */
  billingImages: BillingImagesTable | null
  /** Actualiza la imagen seleccionada. */
  setSelectedPictures: (picture: BillingImagesTable | null) => void;
}

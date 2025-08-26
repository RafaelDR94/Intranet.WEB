import { BillingImagesTable } from "@/app/mappings/billingimages/billingimages.types"

export type AddFilesComponentProps = {
  billingImages: BillingImagesTable | null
  setSelectedPictures: (picture: BillingImagesTable | null) => void;
}

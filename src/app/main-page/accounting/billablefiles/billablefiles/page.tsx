import  {useState}  from "react";
import AddFilesComponent from "../../invoices/addFiles/components/AddFIlesComponent/AddFilesComponent";
import { BillingImagesTable } from "@/app/mappings/billingimages/billingimages.types";

const billablefiles = () => {
    const [selectedPicture, setSelectedPicture] = useState<BillingImagesTable | null>(null);
  
  return ( 
    <>
      <AddFilesComponent billingImages={selectedPicture} setSelectedPictures={setSelectedPicture} />
    </>
  )
};

export default billablefiles;
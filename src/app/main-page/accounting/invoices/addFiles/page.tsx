'use client'

import AddFilesComponent from './components/AddFIlesComponent/AddFilesComponent'
import PictureTable from './components/PicturesTable/PicturesTable'
import { useState } from 'react'
import { BillingImagesTable } from '@/app/mappings/billingimages/billingimages.types'


const AddFilesPage = () => {
  const [selectedPicture, setSelectedPicture] = useState<BillingImagesTable | null>(null);

  return (
    <>
      <AddFilesComponent billingImages={selectedPicture} setSelectedPictures={setSelectedPicture} />
      <PictureTable setSelectedPictures={setSelectedPicture} />
    </>
  )
}

export default AddFilesPage

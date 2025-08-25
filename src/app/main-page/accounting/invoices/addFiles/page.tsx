'use client'

import AddFilesComponent from './components/AddFIlesComponent/AddFilesComponent'
import PictureTable from './components/PicturesTable/PicturesTable'
import { useState, useEffect } from 'react'
import { BillingImagesTable } from '@/app/mappings/billingimages/billingimages.types'
import { useBillingDocumentsStore } from '@/app/stores/useBillingDocumentsStore/useBillingDocumentsStore'
import { useBillingImagesStore } from '@/app/stores/useBillingImagesStore/useBillingImagesStore'
import { shallow } from 'zustand/shallow'

const AddFilesPage = () => {
  const [selectedPicture, setSelectedPicture] = useState<BillingImagesTable | null>(null);
  const { successPost } = useBillingDocumentsStore(
    (s) => ({
      successPost: s.successPost,
    }),
    shallow
  )
  const { fetchBillingImages } = useBillingImagesStore(
    (s) => ({
      fetchBillingImages: s.fetchBillingImages,
    }),
    shallow
  )
  useEffect(() => {
    if(successPost)fetchBillingImages(true);

  }, [successPost])

  return (
    <>
      <AddFilesComponent billingImages={selectedPicture} setSelectedPictures={setSelectedPicture} />
      <PictureTable setSelectedPictures={setSelectedPicture} />
    </>
  )
}

export default AddFilesPage

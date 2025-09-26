'use client'

import React,{ useState, useEffect } from 'react'
import { shallow } from 'zustand/shallow'

import AddFilesComponent from './components/AddFIlesComponent/AddFilesComponent'
import PictureTable from './components/PicturesTable/PicturesTable'

import { BillingImagesTable } from '@/app/mappings/billingimages/billingimages.types'
import { useBillingDocumentsStore } from '@/app/stores/useBillingDocumentsStore/useBillingDocumentsStore'
import { useBillingImagesStore } from '@/app/stores/useBillingImagesStore/useBillingImagesStore'


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
    if (successPost) fetchBillingImages(true);
  }, [successPost, fetchBillingImages])

  return (
    <>
      <AddFilesComponent billingImages={selectedPicture} setSelectedPictures={setSelectedPicture} />
      <PictureTable setSelectedPictures={setSelectedPicture} />
    </>
  )
}

export default AddFilesPage

'use client'

import React, { useEffect, useState } from 'react'
import { shallow } from 'zustand/shallow'

import AddFilesComponent from '../../invoices/addFiles/components/AddFIlesComponent/AddFilesComponent'
import PictureTable from '../../invoices/addFiles/components/PicturesTable/PicturesTable'

import { BillingImagesTable } from '@/app/mappings/billingimages/billingimages.types'
import { useBillingDocumentsStore } from '@/app/stores/useBillingDocumentsStore/useBillingDocumentsStore'
import { useBillingImagesStore } from '@/app/stores/useBillingImagesStore/useBillingImagesStore'

const BillableFilesPage = () => {
  const [selectedPicture, setSelectedPicture] = useState<BillingImagesTable | null>(null)
  const { successPost } = useBillingDocumentsStore(
    (s) => ({
      successPost: s.successPost,
    }),
    shallow,
  )
  const { fetchBillingImages } = useBillingImagesStore(
    (s) => ({
      fetchBillingImages: s.fetchBillingImages,
    }),
    shallow,
  )

  useEffect(() => {
    if (successPost) fetchBillingImages(true)
  }, [successPost, fetchBillingImages])

  return (
    <>
      <AddFilesComponent billingImages={selectedPicture} setSelectedPictures={setSelectedPicture} />
      <PictureTable setSelectedPictures={setSelectedPicture} />
    </>
  )
}

export default BillableFilesPage

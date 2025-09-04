'use client'

import React from 'react'
import InvoicesForm from "@/app/main-page/accounting/personalInvoices/invoices/components/InvoicesForm/InvoicesForm"
import { InvoicesProvider } from "@/app/main-page/accounting/personalInvoices/invoices/context/InvoicesContext"
import { AddFilesComponentProps } from "./types"


const AddFilesComponent: React.FC<AddFilesComponentProps> = ({ billingImages, setSelectedPictures }) => {


    return (
        <InvoicesProvider>
            <InvoicesForm responsiveLayoutMatrix={{
                sm: [[10], [10], [10], [10], [10], [10], [10], [10], [10]],
                md: [[5, 5], [5, 5], [2.5, 2.5, 5], [5, 5]],
                lg: [[5, 5], [3.3, 3.3, 3.3], [2, 2, 3, 3]],
            }} withoutName billingImages={billingImages} onCloseImage={() => setSelectedPictures(null)} />
        </InvoicesProvider>
    )

}

export default AddFilesComponent

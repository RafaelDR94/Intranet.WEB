'use client'

import InvoicesForm from "@/app/main-page/accounting/personalInvoices/invoices/components/InvoicesForm/InvoicesForm"
import { InvoicesProvider } from "@/app/main-page/accounting/personalInvoices/invoices/context/InvoicesContext"
import { AddFilesComponentProps } from "./types"


const AddFilesComponent: React.FC<AddFilesComponentProps> = ({ billingImages, setSelectedPictures }) => {

    return (
        <InvoicesProvider>
            <InvoicesForm layoutMatrix={[[5,5], [5, 5]]} withoutName billingImages={billingImages} onCloseImage={() => setSelectedPictures(null)} />
        </InvoicesProvider>
    )

}

export default AddFilesComponent

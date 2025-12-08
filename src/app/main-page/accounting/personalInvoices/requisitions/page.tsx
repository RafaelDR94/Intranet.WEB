'use client'
import React from 'react'
import { useSearchParams } from 'next/navigation'

import RequisitionDetails from './componentes/RequisitionsDetails/RequisitionDetails'
import RequisitionsTable from './componentes/RequisitionsTable/RequisitionsTable'
import BillableFilesPage from '@/app/main-page/accounting/billablefiles/billablefiles/page'

const Requisitions: React.FC = () => {
  const searchParams = useSearchParams()
  const view = searchParams.get('view')
  const showBillableFiles = view === 'billablefiles'

  if (showBillableFiles) {
    return <BillableFilesPage />
  }

  return (<>
    <RequisitionDetails/>
    <RequisitionsTable />
  </>)
}

export default Requisitions;

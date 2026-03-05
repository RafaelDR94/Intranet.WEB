"use client"
import React from 'react'
import { useSearchParams } from 'next/navigation'

import RequisitionDetails from './componentes/RequisitionsDetails/RequisitionDetails'
import RequisitionsTable from './componentes/RequisitionsTable/RequisitionsTable'
import BillableFilesPage from '@/app/main-page/accounting/billablefiles/billablefiles/page'
import useTutorialAutoRun from '@/tutorials/engine/useTutorialAutoRun'

const Requisitions: React.FC = () => {
  const searchParams = useSearchParams()
  const view = searchParams.get('view')
  const requisitionId = searchParams.get('id')
  const showBillableFiles = view === 'billablefiles'

  useTutorialAutoRun({
    moduleId: showBillableFiles
      ? ''
      : requisitionId
        ? 'request-ownrequisitions-detail'
        : 'request-ownrequisitions-list',
    tutorialId: showBillableFiles
      ? ''
      : requisitionId
        ? 'request-ownrequisitions:detail'
        : 'request-ownrequisitions:list',
  })

  if (showBillableFiles) {
    return <BillableFilesPage />
  }

  return (<>
    <RequisitionDetails/>
    <RequisitionsTable />
  </>)
}

export default Requisitions;

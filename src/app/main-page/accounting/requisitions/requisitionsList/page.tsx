'use client'
import React from 'react'
import RequisitionDetails from './componentes/RequisitionsDetails/RequisitionDetails'
import RequisitionsTable from './componentes/RequisitionsTable/RequisitionsTable'

const RequisitionsList: React.FC = () => {


  return (<>
    <RequisitionDetails/>
    <RequisitionsTable />
  </>)
}

export default RequisitionsList

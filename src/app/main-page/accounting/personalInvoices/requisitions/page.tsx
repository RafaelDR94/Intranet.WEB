'use client'
import React from 'react'

import RequisitionDetails from './componentes/RequisitionsDetails/RequisitionDetails'
import RequisitionsTable from './componentes/RequisitionsTable/RequisitionsTable'

const Requisitions: React.FC = () => {


  return (<>
    <RequisitionDetails/>
    <RequisitionsTable />
  </>)
}

export default Requisitions;

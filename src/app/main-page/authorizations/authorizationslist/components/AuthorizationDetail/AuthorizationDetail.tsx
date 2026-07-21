"use client"

import React from 'react'

import PreRequisitionsAuthorizationCatalog from './components/RequisitionsAuthorization/PreRequisitionsAuthorization/PreRequisitionsAuthorizationCatalog'
import RequisitionsAuthorization from './components/RequisitionsAuthorization/RequisitionsAuthorization'
import ValesAuthorization from './components/ValesAuthorization/ValesAuthorization'
import useAuthorizationDetail from './hooks/useAuthorizationDetail'
import useTutorialAutoRun from '@/tutorials/engine/useTutorialAutoRun'

/**
 * Renderiza el detalle de autorizacion segun el tipo en el querystring.
 */
const AuthorizationDetail = () => {
  const { isPreRequisition, isRequisition, isVale } = useAuthorizationDetail()

  useTutorialAutoRun({
    moduleId: isRequisition
      ? 'authorizations-requisition-detail'
      : 'authorizations-vale-detail',
    tutorialId: isRequisition
      ? 'authorizations:requisition-detail'
      : 'authorizations:vale-detail',
  })

  if (isPreRequisition) {
    return <PreRequisitionsAuthorizationCatalog />
  }

  if (isRequisition) {
    return <RequisitionsAuthorization />
  }

  if (isVale) {
    return <ValesAuthorization />
  }

  return <ValesAuthorization />
}

export default AuthorizationDetail

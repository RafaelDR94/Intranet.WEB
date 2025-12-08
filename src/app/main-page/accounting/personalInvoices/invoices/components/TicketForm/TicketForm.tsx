'use client'

import React from 'react'

import { InvoicesFormProps } from '../types'
import useTicketForm from './hooks/useTicketForm'
import { ticketFormContainer } from './styles'

import DynamicForm from '@/app/components/DynamicForm/DynamicForm'
import FormsLayout from '@/app/components/FormsLayout/FormsLayout'
import { useAuth } from '@/app/context/AuthContext/AuthContext'

const TicketForm: React.FC<InvoicesFormProps> = ({ responsiveLayoutMatrix, externalSubmitRef, dataEdit }) => {
  const {
    fields,
    loadingFormInfo,
    submitRef,
    formReady,
    setFormReady,
    handleSubmit,
  } = useTicketForm({ dataEdit })

  const { currentPagePermissions } = useAuth()

  if (currentPagePermissions?.canAddPicture) return null

  if (externalSubmitRef) {
    return (
      <DynamicForm
        fields={fields}
        loadingFormInfo={loadingFormInfo}
        responsiveLayoutMatrix={responsiveLayoutMatrix}
        submitLabel="Enviar solicitud"
        onSubmit={handleSubmit}
        onValidChange={setFormReady}
        externalSubmitRef={externalSubmitRef}
        showSubmitIf={() => false}
      />
    )
  }

  return (
    <FormsLayout
      title="Sube aquí la imagen de tu ticket. Asegúrate de que sea legible y de buena calidad para evitar rechazos"
      primaryLabel="Subir Archivos"
      onPrimaryClick={() => submitRef.current?.()}
      primaryDisabled={!formReady}
      enableCollapse={true}
    >
        <div className={ticketFormContainer}>
          <DynamicForm
            fields={fields}
            loadingFormInfo={loadingFormInfo}
            responsiveLayoutMatrix={responsiveLayoutMatrix}
            submitLabel="Enviar solicitud"
            onSubmit={handleSubmit}
            onValidChange={setFormReady}
            externalSubmitRef={submitRef}
            showSubmitIf={() => false}
          />
        </div>
    </FormsLayout>
  )
}

export default TicketForm

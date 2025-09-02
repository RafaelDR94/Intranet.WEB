'use client'
import React from 'react'
import DynamicForm from '@/app/components/DynamicForm/DynamicForm'
import FormsLayout from '@/app/components/FormsLayout/FormsLayout'
import { InvoicesFormProps } from '../types'
import useTicketForm from './hooks/useTicketForm'

const TicketForm: React.FC<InvoicesFormProps> = ({ responsiveLayoutMatrix,externalSubmitRef,dataEdit }) => {
  const {
    fields,
    loadingFormInfo,
    submitRef,
    formReady,
    setFormReady,
    handleSubmit,
  } = useTicketForm({dataEdit})
  if(externalSubmitRef){
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
      enableCollapse={false}
    >
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
    </FormsLayout>
  )
}

export default TicketForm
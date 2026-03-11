"use client"

import React from 'react'

import { InvoicesFormProps } from '../types'
import useTicketForm from './hooks/useTicketForm'
import { ticketFormContainer } from './styles'

import DynamicForm from '@/app/components/DynamicForm/DynamicForm'
import FormsLayout from '@/app/components/FormsLayout/FormsLayout'

const TicketForm: React.FC<InvoicesFormProps> = ({
  responsiveLayoutMatrix,
  externalSubmitRef,
  dataEdit,
  disabled,
  suppressInitialTicketImage,
  onValidChange,
}) => {
  const {
    fields,
    formKey,
    loadingFormInfo,
    submitRef,
    formReady,
    setFormReady,
    handleSubmit,
  } = useTicketForm({ dataEdit, disabled, suppressInitialTicketImage })

  const handleValidChange = React.useCallback(
    (isValid: boolean) => {
      setFormReady(isValid)
      onValidChange?.(isValid)
    },
    [onValidChange, setFormReady],
  )

  if (externalSubmitRef) {
    return (
      <DynamicForm
        key={`ticket-form-${formKey}`}
        fields={fields}
        loadingFormInfo={loadingFormInfo}
        responsiveLayoutMatrix={responsiveLayoutMatrix}
        submitLabel="Enviar solicitud"
        onSubmit={handleSubmit}
        onValidChange={handleValidChange}
        valuesVersion={formKey}
        valuesVersionActive
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
          key={`ticket-form-${formKey}`}
          fields={fields}
          loadingFormInfo={loadingFormInfo}
          responsiveLayoutMatrix={responsiveLayoutMatrix}
          submitLabel="Enviar solicitud"
          onSubmit={handleSubmit}
          onValidChange={handleValidChange}
          valuesVersion={formKey}
          valuesVersionActive
            externalSubmitRef={submitRef}
            showSubmitIf={() => false}
          />
        </div>
    </FormsLayout>
  )
}

export default TicketForm

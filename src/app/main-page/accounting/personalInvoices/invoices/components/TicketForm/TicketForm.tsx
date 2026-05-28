"use client"

import React from 'react'

import { InvoicesFormProps } from '../types'
import useTicketForm from './hooks/useTicketForm'
import { ticketFormContainer } from './styles'

import DynamicForm from '@/app/components/DynamicForm/DynamicForm'
import FormsLayout from '@/app/components/FormsLayout/FormsLayout'

const defaultTitle =
  "Sube aqui la imagen de tu ticket. Asegurate de que sea legible y de buena calidad para evitar rechazos"

const TicketForm: React.FC<InvoicesFormProps> = ({
  responsiveLayoutMatrix,
  externalSubmitRef,
  dataEdit,
  disabled,
  suppressInitialTicketImage,
  onValidChange,
  layoutTitle,
  layoutPrimaryLabel,
  uploadFieldLabel,
  uploadFieldPlaceholder,
  uploadFieldButtonLabel,
  headerContent,
  showInlineEmployeeName,
  inlineEmployeeNameValue,
  onSubmitSuccess,
}) => {
  const {
    fields,
    formKey,
    loadingFormInfo,
    submitRef,
    formReady,
    setFormReady,
    handleSubmit,
  } = useTicketForm({
    dataEdit,
    disabled,
    suppressInitialTicketImage,
    onSubmitSuccess,
  })

  const resolvedFields = React.useMemo(
    () => {
      const nextFields = fields.map((field) => {
        if (field.name !== 'ticket') return field

        return {
          ...field,
          label: uploadFieldLabel ?? field.label,
          placeholder: uploadFieldPlaceholder ?? field.placeholder,
          buttonLabel: uploadFieldButtonLabel ?? field.buttonLabel,
        }
      })

      if (
        showInlineEmployeeName &&
        !nextFields.some((field) => field.name === 'debtorName')
      ) {
        nextFields.unshift({
          type: 'input',
          name: 'debtorName',
          label: 'Nombre',
          placeholder: 'Nombre del colaborador',
          value: inlineEmployeeNameValue ?? '',
          className: 'max-w-[400px]',
          onlyText: true,
          showIf: () => Boolean(inlineEmployeeNameValue),
        })
      }

      return nextFields
    },
    [
      fields,
      inlineEmployeeNameValue,
      showInlineEmployeeName,
      uploadFieldButtonLabel,
      uploadFieldLabel,
      uploadFieldPlaceholder,
    ],
  )

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
        fields={resolvedFields}
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
      title={layoutTitle ?? defaultTitle}
      primaryLabel={layoutPrimaryLabel ?? "Subir Archivos"}
      onPrimaryClick={() => submitRef.current?.()}
      primaryDisabled={!formReady}
      enableCollapse={true}
    >
      <div className={ticketFormContainer}>
        {headerContent}
        <DynamicForm
          key={`ticket-form-${formKey}`}
          fields={resolvedFields}
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

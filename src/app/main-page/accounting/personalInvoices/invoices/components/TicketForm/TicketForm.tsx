'use client'

import React from 'react'

import { InvoicesFormProps } from '../types'
import useTicketForm from './hooks/useTicketForm'

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

  if (!currentPagePermissions?.canAddPicture) return null

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
      enableCollapse={false}
    >
      <div className="flex w-full flex-col gap-6">
        <div className="flex flex-col gap-2 rounded-2xl bg-blue-5 px-6 py-5 text-blue-90 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide">Subir ticket</p>
          <p className="text-lg font-semibold leading-tight">Arrastra tu imagen o tómala con la cámara</p>
          <p className="text-sm text-gray-70">
            Asegúrate de que la foto sea legible, completa y en formato JPG o PNG. También puedes usar la cámara de tu dispositivo
            para capturarla al momento.
          </p>
          <div className="flex flex-wrap gap-4 text-xs text-gray-70">
            <span className="rounded-full bg-white-100 px-3 py-1 shadow-200">• Imagen nítida y completa</span>
            <span className="rounded-full bg-white-100 px-3 py-1 shadow-200">• Formatos JPG o PNG</span>
            <span className="rounded-full bg-white-100 px-3 py-1 shadow-200">• Requisición asociada</span>
          </div>
        </div>

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

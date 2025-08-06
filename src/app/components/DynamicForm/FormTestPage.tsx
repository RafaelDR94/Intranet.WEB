'use client'

import { useRef } from 'react'
import DynamicFormMatrix from './DynamicFormMatrix'
import { FieldModel } from '@/app/components/DynamicForm/types'
import { Button } from '@/app/components/Button/Button'

export default function FormTestPage() {
  const fields: FieldModel[] = [
    {
      type: 'input',
      name: 'debtorName',
      label: 'Nombre del Deudor',
      placeholder: 'Ingrese el nombre completo',
      value: '',
    },
    {
      type: 'select',
      name: 'project',
      label: 'Seleccionar Proyecto',
      placeholder: 'Proyecto',
      value: '',
      options: [
        { label: 'Proyecto A', value: 'a' },
        { label: 'Proyecto B', value: 'b' },
      ],
    },
    {
      type: 'select',
      name: 'expenseType',
      label: 'Tipo de Viáticos',
      placeholder: 'Seleccione tipo',
      value: '',
      options: [
        { label: 'Proyecto', value: 'proyecto' },
        { label: 'Administrativo', value: 'admin' },
      ],
    },
    {
      type: 'file',
      name: 'pdf',
      label: 'Subir archivo',
      value: null,
      accept: '.pdf',
      validations: [{ type: 'required' }],
    },
    {
      type: 'file',
      name: 'xml',
      label: 'Subir archivo',
      value: null,
      accept: '.xml',
      validations: [{ type: 'required' }],
    },
  ]

  const submitRef = useRef<() => void | Promise<void>>(null)

  return (

    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={() => submitRef.current?.()}>
          Enviar desde botón externo
        </Button>
      </div>
      <DynamicFormMatrix
        fields={fields}
        layoutMatrix={[[5], [5, 5], [5, 5]]}
        submitLabel="Enviar solicitud"
        onSubmit={(values) => {
          console.log('Valores enviados:', values)
        }}
        externalSubmitRef={submitRef}
        showSubmitIf={() => false} // Para ocultar botón interno
      />


    </div>
  )
}

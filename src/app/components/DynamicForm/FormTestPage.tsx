'use client'

import { useEffect, useRef, useState } from 'react'
import { useFormFieldsStore } from '@/app/hooks/useFormFieldsStore/useFormFieldsStore'
import { FieldModel } from '@/app/components/DynamicForm/types'
import DynamicForm from './DynamicForm'
import { Button } from '@/app/components/Button/Button'

// 🧪 Mock: emula backend
const fetchUbicaciones = async () => {
  return [
    { label: 'CDMX', value: 'cdmx' },
    { label: 'Monterrey', value: 'mty' },
  ]
}

const fetchEquiposPorUbicacion = async (ubicacion: string) => {
  const data: Record<string, { label: string; value: string }[]> = {
    cdmx: [
      { label: 'Laptop A', value: 'lapA' },
      { label: 'Tablet A', value: 'tabA' },
    ],
    mty: [
      { label: 'Laptop B', value: 'lapB' },
      { label: 'Tablet B', value: 'tabB' },
    ],
  }
  await new Promise((r) => setTimeout(r, 1000)) // simulate latency
  return data[ubicacion] || []
}

export default function FormTestPage() {
  const submitRef = useRef<() => void | Promise<void>>(null)
  const [formReady, setFormReady] = useState(false)
  const [loadingFormInfo, setLoadingFormInfo] = useState(false)
  const { fields, setFields, updateField } = useFormFieldsStore()

  useEffect(() => {
    const loadInitialFields = async () => {
      const ubicaciones = await fetchUbicaciones()

      const initialFields: FieldModel[] = [
        {
          type: 'input',
          name: 'name',
          label: 'Nombre',
          placeholder: 'Tu nombre',
          value: 'Bruno',
          className: 'max-w-[400px]',
          validations: [{ type: 'required' }, { type: 'minLength', value: 3 }]
        },
        {
          type: 'toggle',
          name: 'activo',
          label: '¿Está activo?',
          value: true,

        },
        {
          type: 'select',
          name: 'ubicacion',
          label: 'Ubicación',
          value: '',
          options: ubicaciones,
          onChange: async (value) => {
            updateField('equipo', { disabled: true, options: [] })
            setLoadingFormInfo(true)
            const nuevosEquipos = await fetchEquiposPorUbicacion(value)
            setLoadingFormInfo(false)
            updateField('equipo', {
              options: nuevosEquipos,
              value: '', // reset value
            })
          },

        },
        {
          type: 'select',
          name: 'equipo',
          label: 'Equipo',
          placeholder: 'Selecciona equipo',
          value: '',
          showIf: (values, fields) => {
            const equipoField = fields.find((ubi) => ubi.name == "equipo")
            console.log("ubicatioField", equipoField);
            if (equipoField?.options) return equipoField?.options?.length > 0
            return false
          },

        },
        {
          type: 'multiSelect',
          name: 'tecnologias',
          label: 'Tecnologías que manejas',
          value: [],
          options: [
            { label: 'React', value: 'react' },
            { label: 'Node.js', value: 'node' },
            { label: 'Python', value: 'python' },
          ],

        },

        {
          type: 'checkbox',
          name: 'acepto',
          label: 'Acepto los términos',
          value: true,

        },
        {
          type: 'file',
          name: 'cv',
          label: 'Subir CV (PDF)',
          accept: '.pdf',
          value: null,

        },
        {
          type: 'input',
          name: 'justificacion',
          label: 'Justificación',
          value: '',
          showIf: (values) => values?.tecnologias?.includes('node'),
        },
      ]

      setFields(initialFields)
    }

    loadInitialFields()
  }, [setFields, updateField])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-b3 font-semibold text-blue-60">Test de DynamicForm con Zustand</h2>
        <Button onClick={() => submitRef.current?.()} disabled={!formReady}>
          Enviar (botón externo)
        </Button>
      </div>

      <div className="bg-white-70 p-6 rounded-lg shadow-md">
        <DynamicForm
          fields={fields}
          loadingFormInfo={loadingFormInfo}
          // layoutMatrix={[[5, 5], [10], [10], [5, 5], [10]]}
          submitLabel="Enviar formulario"
          onSubmit={(values) => {
            console.log('✅ Valores enviados:', values)
            alert('Formulario enviado con éxito')
          }}
          externalSubmitRef={submitRef}
          showSubmitIf={() => true}
          onValidChange={(valid) => setFormReady(valid)}

        />
      </div>
    </div>
  )
}

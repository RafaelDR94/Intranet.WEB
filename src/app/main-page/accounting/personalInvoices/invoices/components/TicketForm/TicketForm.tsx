'use client'
import { useRef, useState } from 'react'
import { FieldModel } from '@/app/components/DynamicForm/types'
import DynamicForm from '@/app/components/DynamicForm/DynamicForm'
import FormsLayout from '@/app/components/FormsLayout/FormsLayout'
import { useAuth } from '@/app/context/AuthContext/AuthContext'
import { usePrincipal } from '@/app/context/PrincipalContext/PrincipalContext'

const TicketForm = () => {

  const initialformFields: FieldModel[] = [
    {
      type: 'input',
      name: 'debtorName',
      label: 'Nombre del Deudor',
      placeholder: 'Ingrese el nombre completo',
      value: "",
      className: 'max-w-[400px]',
      onlyText: true,
      showIf: (value) => value.debtorName
    },
    {
      type: 'select',
      name: 'project',
      label: 'Seleccionar Proyecto',
      placeholder: 'Proyecto',
      value: '',
      options: [
      ], className: 'max-w-[400px]', onlyText: false,
      showIf: (_v, all) => {
        const f = all.find(x => x.name === 'project');
        return Array.isArray(f?.options) && (f.options?.length ?? 0) > 0;
      },
    },
    {
      type: 'select',
      name: 'requisition',
      label: 'Código de Requisición',
      placeholder: 'Seleccione el código',
      value: '',
      options: [],
      className: 'max-w-[400px]',
      showIf: (_v, all) => {
        const f = all.find(x => x.name === 'requisition');
        return Array.isArray(f?.options) && (f.options?.length ?? 0) > 0;
      },
    },
    { type: 'file', name: 'xml', label: 'Documento XML', value: null, accept: '.xml', validations: [{ type: 'required' }], className: 'max-w-[300px]' },
    { type: 'file', name: 'pdf', label: 'Documento PDF', value: null, accept: '.pdf', validations: [{ type: 'required' }], className: 'max-w-[300px]' },
  ]
  const { user } = useAuth()

  // ⬇️ Loading + Alert globales (desde PrincipalContext)
  const { usePrincipalLoading, usePrincipalAlert } = usePrincipal()
  const { withLoading } = usePrincipalLoading
  const { showAlert, hideAlert } = usePrincipalAlert

  const submitRef = useRef<() => void | Promise<void>>(null)
  const [formReady, setFormReady] = useState(false)

  const fields: FieldModel[] = [
    {
      type: 'input',
      name: 'debtorName',
      label: 'Nombre del Deudor',
      placeholder: 'Ingrese el nombre completo',
      value: user?.fullName ?? '',
      className: 'max-w-[400px]',
      onlyText: true,
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
      className: 'max-w-[400px]',
      onlyText: false,
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
      className: 'max-w-[400px]',
    },

  ]

  // Simula tu request real (cámbialo por tu cliente/endpoint)
  const uploadTicket = async (values: Record<string, any>) => {
    const form = new FormData()
    form.append('debtorName', values.debtorName ?? '')
    form.append('project', values.project ?? '')
    form.append('expenseType', values.expenseType ?? '')

    const img: File | null = Array.isArray(values.pdf) ? values.pdf[0] : values.pdf ?? null
    if (img) form.append('ticket', img)

    // await fetch('/api/tickets/upload', { method: 'POST', body: form })
    await new Promise((r) => setTimeout(r, 1200)) // demo delay
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
        layoutMatrix={[[10], [5, 5], [5]]}
        submitLabel="Enviar solicitud"
        onSubmit={async (values) => {
          try {
            await withLoading(() => uploadTicket(values), {
              message: 'Enviando tu ticket…',
              spinnerSize: 'large',
            })
            showAlert({
              type: 'success',
              variant: 'filled',
              title: '¡Ticket enviado!',
              description: 'Tu imagen se cargó correctamente.',
              showPrimaryButton: true,
              primaryLabel: 'Cerrar',
              onPrimaryClick: hideAlert,
            })
          } catch (err: any) {
            showAlert({
              type: 'error',
              variant: 'filled',
              title: 'No se pudo enviar',
              description: err?.message ?? 'Ocurrió un error al subir tu ticket. Intenta de nuevo.',
              showPrimaryButton: true,
              primaryLabel: 'Entendido',
              onPrimaryClick: hideAlert,
              showSecondaryButton: true,
              secondaryLabel: 'Reintentar',
              onSecondaryClick: () => {
                hideAlert()
                submitRef.current?.()
              },
            })
          }
        }}
        onValidChange={setFormReady}
        externalSubmitRef={submitRef}
        showSubmitIf={() => false}
      />
    </FormsLayout>
  )
}

export default TicketForm

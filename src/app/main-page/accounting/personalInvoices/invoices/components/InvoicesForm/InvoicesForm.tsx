'use client'
import { useRef, useState } from 'react'
import { FieldModel } from '@/app/components/DynamicForm/types'
import DynamicForm from '@/app/components/DynamicForm/DynamicForm'
import FormsLayout from '@/app/components/FormsLayout/FormsLayout'
import { useAuth } from '@/app/context/AuthContext/AuthContext'
import { usePrincipal } from '@/app/context/PrincipalContext/PrincipalContext'

const InvoicesForm = () => {
  const { user } = useAuth();
  const { usePrincipalLoading, usePrincipalAlert } = usePrincipal()
  const { withLoading } = usePrincipalLoading
  const { showAlert, hideAlert } = usePrincipalAlert

  const submitRef = useRef<() => void | Promise<void>>(null)
  const [formReady, setFormReady] = useState(false)

  const fields: FieldModel[] = [
    { type: 'input', name: 'debtorName', label: 'Nombre del Deudor', placeholder: 'Ingrese el nombre completo', value: user?.fullName ?? '', className: 'max-w-[400px]', onlyText: true },
    { type: 'select', name: 'project', label: 'Seleccionar Proyecto', placeholder: 'Proyecto', value: '', options: [{ label: 'Proyecto A', value: 'a' }, { label: 'Proyecto B', value: 'b' }], className: 'max-w-[400px]', onlyText: false },
    { type: 'select', name: 'expenseType', label: 'Tipo de Viáticos', placeholder: 'Seleccione tipo', value: '', options: [{ label: 'Proyecto', value: 'proyecto' }, { label: 'Administrativo', value: 'admin' }], className: 'max-w-[400px]' },
    { type: 'file', name: 'xml', label: 'Documento XML', value: null, accept: '.xml', validations: [{ type: 'required' }], className: 'max-w-[300px]' },
    { type: 'file', name: 'pdf', label: 'Documento PDF', value: null, accept: '.pdf', validations: [{ type: 'required' }], className: 'max-w-[300px]' },
  ]

  const uploadInvoice = async (values: Record<string, any>) => {
    const form = new FormData()
    form.append('debtorName', values.debtorName ?? '')
    form.append('project', values.project ?? '')
    form.append('expenseType', values.expenseType ?? '')
    const xmlFile: File | null = Array.isArray(values.xml) ? values.xml[0] : values.xml ?? null
    const pdfFile: File | null = Array.isArray(values.pdf) ? values.pdf[0] : values.pdf ?? null
    if (xmlFile) form.append('xml', xmlFile)
    if (pdfFile) form.append('pdf', pdfFile)
    // await fetch('/api/invoices/upload', { method: 'POST', body: form })
    await new Promise(r => setTimeout(r, 1200))
  }

  return (
    <FormsLayout
      title="Si ya cuentas con la factura, sube aquí tus archivos XML y PDF"
      buttonLabel="Subir Archivos"
      onButtonClick={() => submitRef.current?.()}
      buttonDisabled={!formReady}
      enableCollapse={false}
    >
      <DynamicForm
        fields={fields}
        layoutMatrix={[[10], [5, 5], [5, 5]]}
        onSubmit={async (values) => {
          try {
            await withLoading(() => uploadInvoice(values), {
              message: 'Subiendo tus archivos…',
              spinnerSize: 'large',
            })
            showAlert({
              type: 'success',
              variant: 'filled',
              title: '¡Archivos enviados!',
              description: 'Tu XML y PDF fueron cargados correctamente.',
              showPrimaryButton: true,
              showSecondaryButton:false,
              primaryLabel: 'Cerrar',
              onPrimaryClick: hideAlert,
            })
          } catch (err: any) {
            showAlert({
              type: 'error',
              variant: 'filled',
              title: 'No se pudo enviar',
              description: err?.message ?? 'Ocurrió un error al subir los archivos. Intenta de nuevo.',
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

export default InvoicesForm

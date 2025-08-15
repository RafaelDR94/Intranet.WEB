'use client'


import DynamicForm from '@/app/components/DynamicForm/DynamicForm'
import FormsLayout from '@/app/components/FormsLayout/FormsLayout'
import { usePrincipal } from '@/app/context/PrincipalContext/PrincipalContext'
import { useInvoices } from '../../context/InvoicesContext'
import useInitInvoicesForms from '../../hooks/useInitInvoicesForms'
import { InvoicesFormProps } from '../types'
import { FieldModel } from '@/app/components/DynamicForm/types'
const TicketForm: React.FC<InvoicesFormProps> = ({  layoutMatrix ,type}) => {
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
    { type: 'file', name: 'jpg,png', label: 'Documento JPG/PNG', value: null, accept: '.jpg,.png', validations: [{ type: 'required' }], className: 'max-w-[300px]' },

]
  const { field2, formId2 } = useInvoices();
  const {loadingFormInfo,submitRef, formReady, setFormReady}=useInitInvoicesForms({initialformFields,field:field2, formId:formId2});
  // ⬇️ Loading + Alert globales (desde PrincipalContext)
  const { usePrincipalLoading, usePrincipalAlert } = usePrincipal()
  const { withLoading } = usePrincipalLoading
  const { showAlert, hideAlert } = usePrincipalAlert
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
        fields={field2}
        loadingFormInfo={loadingFormInfo}
        layoutMatrix={layoutMatrix}
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

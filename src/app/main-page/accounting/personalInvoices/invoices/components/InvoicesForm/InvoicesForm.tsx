'use client'


import DynamicForm from '@/app/components/DynamicForm/DynamicForm'
import FormsLayout from '@/app/components/FormsLayout/FormsLayout'
import { usePrincipal } from '@/app/context/PrincipalContext/PrincipalContext'
import { useInvoices } from '../../context/InvoicesContext'
import useInitInvoicesForms from '../../hooks/useInitInvoicesForms'
import { InvoicesFormProps } from '../types'
import { FieldModel } from '@/app/components/DynamicForm/types'
const InvoicesForm: React.FC<InvoicesFormProps> = ({ layoutMatrix }) => {
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
    { type: 'file', name: 'xml', label: 'Documento XML', value: null, accept: '.xml', validations: [{ type: 'required' }], className: 'max-w-[300px]' },
    { type: 'file', name: 'pdf', label: 'Documento PDF', value: null, accept: '.pdf', validations: [{ type: 'required' }], className: 'max-w-[300px]' },
  ]

  const { field1, formId1 } = useInvoices();
  const { loadingFormInfo, submitRef, formReady, setFormReady } = useInitInvoicesForms({ initialformFields, field: field1, formId: formId1 });
  const { usePrincipalLoading, usePrincipalAlert } = usePrincipal()
  const { withLoading } = usePrincipalLoading
  const { showAlert, hideAlert } = usePrincipalAlert

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
      primaryLabel="Subir Archivos"
      onPrimaryClick={() => submitRef.current?.()}
      primaryDisabled={!formReady}
      enableCollapse={false}

    >
      <DynamicForm
        fields={field1}
        layoutMatrix={layoutMatrix}
        loadingFormInfo={loadingFormInfo}
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
              showSecondaryButton: false,
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

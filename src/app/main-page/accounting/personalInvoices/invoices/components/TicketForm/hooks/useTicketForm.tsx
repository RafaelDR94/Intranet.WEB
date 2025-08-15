// src/app/.../hooks/useTicketForm.ts
import { useEffect, useMemo } from 'react'
import { shallow } from 'zustand/shallow'
import { FieldModel } from '@/app/components/DynamicForm/types'
import { useFirebase } from '@/app/context/FirebaseContext/FirebaseContext'
import { usePrincipal } from '@/app/context/PrincipalContext/PrincipalContext'
import { useInvoices } from '../../../context/InvoicesContext'
import useInitInvoicesForms from '../../../hooks/useInitInvoicesForms'
import { useBillingImagesStore } from '@/app/stores/useBillingImagesStore/useBillingImagesStore'
import { UseTicketFormReturn ,UseInvoicesFormProps} from './types'

const useTicketForm = ({ dataEdit }: UseInvoicesFormProps): UseTicketFormReturn => {
  const isEdit = Boolean(dataEdit)
  const { firebasestorage } = useFirebase()

  const {
    creating,
    updating,
    error,
    successPost,
    successPut,
    createBillingImage,
    updateBillingImage,
    resetFlags,
  } = useBillingImagesStore(
    (s) => ({
      creating: s.creating,
      updating: s.updating,
      error: s.error,
      successPost: s.successPost,
      successPut: s.successPut,
      resetFlags: s.resetFlags,
      createBillingImage: s.createBillingImage,
      updateBillingImage: s.updateBillingImage,
    }),
    shallow
  )

  // 🔁 Campos iniciales del formulario (condicional por modo)
  const initialformFields: FieldModel[] = useMemo(() => {
    if (isEdit) {
      return [
        {
          type: 'select',
          name: 'requisition',
          label: 'Código de Requisición',
          placeholder: 'Seleccione el código',
          value: dataEdit?.requisitionkey ?? '',
          options: [],
          className: 'max-w-[400px]',
          showIf: (_v, all) => {
            const f = all.find((x) => x.name === 'requisition')
            return Array.isArray(f?.options) && (f.options?.length ?? 0) > 0
          },
        },
        {
          type: 'file',
          name: 'ticket',
          label: 'Documento JPG/PNG',
          value: null,
          accept: '.jpg,.png',
          validations: [], // en edición es opcional
          className: 'max-w-[300px]',
        },
      ]
    }

    // 🟢 CREATE: mantiene debtorName como estaba originalmente
    return [
      {
        type: 'input',
        name: 'debtorName',
        label: 'Nombre del Deudor',
        placeholder: 'Ingrese el nombre completo',
        value: '',
        className: 'max-w-[400px]',
        onlyText: true,
        showIf: (value) => value.debtorName,
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
          const f = all.find((x) => x.name === 'requisition')
          return Array.isArray(f?.options) && (f.options?.length ?? 0) > 0
        },
      },
      {
        type: 'file',
        name: 'ticket',
        label: 'Documento JPG/PNG',
        value: null,
        accept: '.jpg,.png',
        validations: [{ type: 'required' }], // en create es requerido
        className: 'max-w-[300px]',
      },
    ]
  }, [dataEdit, isEdit])

  const { field2, formId2 } = useInvoices()
  const { loadingFormInfo, submitRef, formReady, setFormReady } =
    useInitInvoicesForms({ initialformFields, field: field2, formId: formId2 })

  // Loading + Alerts (desde PrincipalContext)
  const { usePrincipalLoading, usePrincipalAlert } = usePrincipal()
  const { showSpinner, hideSpinner } = usePrincipalLoading
  const { showAlert, hideAlert } = usePrincipalAlert

  const uploadIfNeeded = async (
    file: File | null | undefined,
    requisition: string
  ): Promise<string> => {
    if (file) {
      const url = await firebasestorage.uploadImage(
        file,
        `Billings/BillingTickets/${requisition}`
      )
      if (!url) throw new Error('Hubo un problema al subir la imagen')
      return url
    }
    if (isEdit && dataEdit?.image) return dataEdit.image
    throw new Error('No se encontró imagen válida para continuar')
  }

  const handleSubmit = async (values: Record<string, any>) => {
    showSpinner({ message: isEdit ? 'Actualizando ticket...' : 'Subiendo ticket...' })
    try {
      const imgUrl = await uploadIfNeeded(values.ticket, values.requisition)

      if (isEdit && dataEdit) {
        // UPDATE


        const payload = {
          billing_image_id: dataEdit?.billing_image_id,
          requisition_id: values?.requisition,
          Image: imgUrl,
          comments: dataEdit?.comments,
        }
        updateBillingImage(payload)
      } else {
        // CREATE
        const payload = {
          requisition_id: values.requisition,
          Image: imgUrl,
        }
        createBillingImage(payload)
      }
      // el efecto manejará success/error
    } catch (err) {
      hideSpinner()
      showAlert({
        type: 'error',
        variant: 'filled',
        title: isEdit ? 'No se pudo actualizar' : 'No se pudo enviar',
        description: String(err) ?? 'Ocurrió un error al procesar tu ticket. Intenta de nuevo.',
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
  }

  useEffect(() => {
    if (creating || updating) return

    hideSpinner()
    const hadError = Boolean(error)
    const postOk = Boolean(successPost)
    const putOk = Boolean(successPut)

    resetFlags()

    if (hadError) {
      showAlert({
        type: 'error',
        variant: 'filled',
        title: isEdit ? 'No se pudo actualizar' : 'No se pudo enviar',
        description: error ?? 'Ocurrió un error al procesar tu ticket. Intenta de nuevo.',
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
    } else if (postOk || putOk) {
      showAlert({
        type: 'success',
        variant: 'filled',
        title: isEdit ? 'Ticket actualizado con éxito' : 'Ticket subido con éxito',
        description: isEdit
          ? 'Tu ticket ha sido actualizado correctamente.'
          : 'Tu ticket ha sido subido correctamente.',
        showPrimaryButton: true,
        primaryLabel: 'Entendido',
        onPrimaryClick: hideAlert,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    creating,
    updating,
    error,
    successPost,
    successPut,
    hideAlert,
    hideSpinner,
    resetFlags,
    showAlert,
    showSpinner,
    submitRef,
    isEdit,
  ])

  return {
    fields: field2,
    loadingFormInfo,
    submitRef,
    formReady,
    setFormReady,
    handleSubmit,
  }
}

export default useTicketForm

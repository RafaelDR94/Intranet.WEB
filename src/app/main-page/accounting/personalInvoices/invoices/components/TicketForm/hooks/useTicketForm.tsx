// src/app/.../hooks/useTicketForm.ts
import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { shallow } from 'zustand/shallow'

import { useInvoices } from '../../../context/InvoicesContext'
import useInitInvoicesForms from '../../../hooks/useInitInvoicesForms'
import { createTicketFields } from '../../../utilities/InitialFields'
import { ticketFormDropzoneClasses } from '../styles'

import { UseTicketFormReturn, UseInvoicesFormProps } from './types'

import { FieldModel } from '@/app/components/DynamicForm/types'
import { useAuth } from '@/app/context/AuthContext/AuthContext'
import { useFirebase } from '@/app/context/FirebaseContext/FirebaseContext'
import { usePrincipal } from '@/app/context/PrincipalContext/PrincipalContext'
import { useBillingHistoryStore } from '@/app/stores/useBillingHistoryStore/useBillingHistoryStore'
import { useBillingAllDocumentsByEmployeeStore } from '@/app/stores/useBillingAllDocumentsByEmployeeStore/useBillingAllDocumentsByEmployeeStore'
import { useBillingImagesStore } from '@/app/stores/useBillingImagesStore/useBillingImagesStore'
import { SelectedImage } from '@/app/components/ImageUploaderExpanded/types'
const useTicketForm = ({
  dataEdit,
  disabled,
  suppressInitialTicketImage,
}: UseInvoicesFormProps): UseTicketFormReturn => {
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
  const { forceFetchBillingHistory } = useBillingHistoryStore(
    (s) => ({
      forceFetchBillingHistory: s.forceFetchBillingHistory,
    }),
    shallow
  );
  const { fetchBillingAllDocumentsByEmployee } = useBillingAllDocumentsByEmployeeStore(
    (s) => ({
      fetchBillingAllDocumentsByEmployee: s.fetchBillingAllDocumentsByEmployee,
    }),
    shallow,
  );

  const { user: authUser } = useAuth()

  // 🔁 Campos iniciales del formulario (condicional por modo)
  const initialformFields: FieldModel[] = useMemo(() => {
    if (isEdit) {
      const initialTicketUrl = !suppressInitialTicketImage
        ? dataEdit?.image
        : undefined;
      return [
        {
          type: "select",
          name: "category",
          label: "Categoría",
          placeholder: "Seleccione una categoría ",
          value: "",
          options: [],
          className: "max-w-[400px]",
          showIf: (_v, all) => {
            const f = all.find((x) => x.name === "category");
            return Array.isArray(f?.options) && (f.options?.length ?? 0) > 0;
          },
          validations: [{ type: "required" }],
        },
        {
          type: 'imageUploaderExpanded',
          name: 'ticket',
          label: 'Imagen del ticket (JPG o PNG)',
          placeholder: 'Arrastra o selecciona la foto del ticket',
          value: null,
          initialFile: initialTicketUrl
            ? { name: 'ticket', url: initialTicketUrl }
            : undefined,
          accept: '.jpg,.png',
          validations: [], // en edición es opcional
          className: ticketFormDropzoneClasses,
          buttonLabel: 'Seleccionar imagen',
          cameraButtonAriaLabel: 'Tomar foto del ticket',
          preview: true,
          multiple: false,
        },
      ]
    }

    // 🟢 CREATE: mantiene debtorName como estaba originalmente
    return createTicketFields()
  }, [dataEdit, isEdit, suppressInitialTicketImage])

  const { field2, formId2, user } = useInvoices()
  const searchParams = useSearchParams()
  const requisitionIdFromQuery = searchParams.get('idRequisition') ?? searchParams.get('id') ?? ''
  const { loadingFormInfo, submitRef, formReady, setFormReady, ResetForm, updateField } =
    useInitInvoicesForms({ initialformFields, field: field2, formId: formId2, dataEdit, })
  const lastUploadedRef = useRef<SelectedImage[] | null>(null)
  const [formKey, setFormKey] = useState(0)
  const hasInitializedRef = useRef(false)

  // Loading + Alerts (desde PrincipalContext)
  const { usePrincipalLoading, usePrincipalAlert } = usePrincipal()
  const { showSpinner, hideSpinner } = usePrincipalLoading
  const { showAlert, hideAlert } = usePrincipalAlert

  useEffect(() => {
    if (hasInitializedRef.current) return
    if (field2.length === 0) return
    setFormKey((prev) => prev + 1)
    hasInitializedRef.current = true
  }, [field2.length])

  const uploadIfNeeded = async (
    files: SelectedImage[] | File[] | File | null | undefined,
    requisition?: string
  ): Promise<string[]> => {
    const fileList: SelectedImage[] = Array.isArray(files)
      ? (files as SelectedImage[])
      : files
      ? [{ id: 'single', name: (files as File).name, file: files as File, selected: true }]
      : []

    const selectedList = fileList.filter((item) => item.selected !== false)
    if (selectedList.length === 0 && isEdit && dataEdit?.image) return [dataEdit.image]
    if (selectedList.length === 0) throw new Error('No se encontró imagen válida para continuar')

    const uploads = await Promise.all(
      selectedList
        .map(async (item, index) => {
          if (item.url && !item.file) return item.url
          if (!item.file) throw new Error('Imagen inválida')
          const requisitionFolder = requisition?.trim() ? requisition : 'no-requisition'
          const url = await firebasestorage.uploadImage(
            item.file,
            `Billings/BillingTickets/${requisitionFolder}/${index}`
          )
          if (!url) throw new Error('Hubo un problema al subir la imagen')
          return url
        })
    )
    return uploads
  }

  const handleSubmit = async (values: Record<string, any>) => {
    showSpinner({ message: isEdit ? 'Actualizando ticket...' : 'Subiendo ticket...' })
    try {
      const requisition =
        values?.requisition || dataEdit?.billingrequisition_id || requisitionIdFromQuery || ''

      const imgUrl = await uploadIfNeeded(values.ticket, requisition)
      lastUploadedRef.current = imgUrl.map((url, index) => ({
        id: `uploaded-${Date.now()}-${index}`,
        name: `ticket-${index + 1}`,
        url,
        selected: true,
      }))
      if (isEdit && dataEdit) {
        const payload = {
          billing_image_id: dataEdit?.billing_image_id,
          requisition_id: requisition,
          image: imgUrl[0],
          comments: dataEdit?.comments,
          user_comments: "",
          numnights: values.numnights,
          numpersons: values.numpersons,
          description: values?.description,
          category_id: values?.category,
        }
        updateBillingImage(payload)
      } else {
        // CREATE
        const employeeId =
          authUser?.idEmployee ??
          user?.idEmployee ??
          (user as { employee_id?: string | null } | null)?.employee_id ??
          ''
        if (!employeeId) {
          throw new Error('No se pudo identificar el empleado logueado')
        }
        const payload = {
          requisition_id: requisition || undefined,
          employee_id: employeeId,
          images: imgUrl,
          description: values?.description,
          numpersons: values?.numpersons,
          numnights: values?.numnights,
          category_id: values?.category
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
        description: String(err) || 'Ocurrió un error al procesar tu ticket. Intenta de nuevo.',
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
        description: error || 'Ocurrió un error al procesar tu ticket. Intenta de nuevo.',
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
      if (postOk) {
        lastUploadedRef.current = null;
        updateField(formId2, "ticket", {
          value: [],
          initialFiles: [],
        });
        updateField(formId2, "category", { value: "" });
        ResetForm();
        setFormKey((prev) => prev + 1);
      }
      if (putOk) {
        const employeeId = authUser?.idEmployee ?? user?.idEmployee ?? "";
        if (employeeId) {
          forceFetchBillingHistory(employeeId);
          fetchBillingAllDocumentsByEmployee(employeeId, true);
        }
      }
      showAlert({
        type: 'success',
        variant: 'filled',
        title: isEdit ? 'Ticket actualizado con éxito' : 'Ticket subido con éxito',
        description: isEdit
          ? 'Tu ticket ha sido actualizado correctamente.'
          : 'Tu ticket ha sido subido correctamente.',
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1500,
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
    submitRef,
    isEdit,
  ])

  const resolvedFields = useMemo(
    () =>
      disabled
        ? field2.map((field) => ({ ...field, disabled: true }))
        : field2,
    [disabled, field2],
  );

  return {
    fields: resolvedFields,
    formKey,
    loadingFormInfo,
    submitRef,
    formReady,
    setFormReady,
    handleSubmit,
  }
}

export default useTicketForm

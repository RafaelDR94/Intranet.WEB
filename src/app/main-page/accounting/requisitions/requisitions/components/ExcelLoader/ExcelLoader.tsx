// src/app/.../ExcelLoader.tsx
'use client'
import { useRef, useState, useEffect, useMemo } from 'react'
import { shallow } from 'zustand/shallow'
import FormsLayout from '@/app/components/FormsLayout/FormsLayout'
import FileUploaderExpanded from '@/app/components/FileUploaderexpanded/FileUploaderExpanded'
import { usePrincipal } from '@/app/context/PrincipalContext/PrincipalContext'
import { useRequisitionsStore } from '@/app/stores/useRequisitionStore/useRequisitionStore'
import { useIntranetGatewayStore } from '@/app/stores/system/useIntranetGatewayStore'

const ExcelLoader = () => {
  const { usePrincipalLoading, usePrincipalAlert } = usePrincipal()
  const { showSpinner, hideSpinner } = usePrincipalLoading
  const { showAlert, hideAlert } = usePrincipalAlert

  // opcional: deshabilitar botón hasta que el gateway esté listo
  const isGatewayReady = useIntranetGatewayStore(s => s.isReady)

  // ---- Requisitions (store directo)
  const {
    updateExcelRequisition,
    resetFlags,
    updatingExcel,
    successUpdateExcel,
    error,
    warning
  } = useRequisitionsStore(s => ({
    updateExcelRequisition: s.updateExcelRequisition,
    resetFlags: s.resetFlags,
    updatingExcel: s.updatingExcel,
    successUpdateExcel: s.successUpdateExcel,
    error: s.error,
    warning: s.warning,
  }), shallow)

  // mismo criterio que en tu hook
  const requisitionExcelError = useMemo(
    () => (!updatingExcel && !successUpdateExcel ? error : undefined),
    [updatingExcel, successUpdateExcel, error]
  )

  const submitRef = useRef<() => void | Promise<void>>(null)
  const [file, setFile] = useState<File | null>(null)
  const [ready, setReady] = useState(false)

  const handleFile = (incoming: File | File[] | null) => {
    const f = Array.isArray(incoming) ? incoming[0] ?? null : incoming
    setFile(f)
    setReady(!!f)
    // limpiar flags cuando cambia el archivo
    resetFlags()
  }

  const doUpload = async () => {
    if (!file) throw new Error('Selecciona un archivo Excel primero.')
    const response = await updateExcelRequisition(file);
    console.log("response", response);
  }

  useEffect(() => {
    submitRef.current = doUpload
  }, [file, updateExcelRequisition])

  useEffect(() => {
    if (updatingExcel) {
      showSpinner({ message: 'Subiendo tu archivo…', spinnerSize: 'large' })
      return
    }

    hideSpinner();
    if (warning) {
      console.log(warning);
      showAlert({
        type: 'warning',
        variant: 'filled',
        title: 'Advertencia',
        description: warning ?? 'Ocurrió una advertencia al subir el archivo. Intenta de nuevo.',
        showPrimaryButton: true,
        showSecondaryButton: false,
        primaryLabel: 'Entendido',
        onPrimaryClick: () => { hideAlert(); resetFlags() },
      })
    }

    if (successUpdateExcel) {
      showAlert({
        type: 'success',
        variant: 'filled',
        title: '¡Archivo enviado!',
        description: 'Tu Excel fue cargado correctamente.',
        showPrimaryButton: true,
        showSecondaryButton: false,
        primaryLabel: 'Cerrar',
        onPrimaryClick: () => { hideAlert(); setFile(null); setReady(false); resetFlags() },
      })
    }

    if (requisitionExcelError) {
      showAlert({
        type: 'error',
        variant: 'filled',
        title: 'No se pudo enviar',
        description: String(requisitionExcelError) ?? 'Ocurrió un error al subir el archivo. Intenta de nuevo.',
        showPrimaryButton: true,
        primaryLabel: 'Entendido',
        onPrimaryClick: () => { hideAlert(); resetFlags() },
        showSecondaryButton: true,
        secondaryLabel: 'Reintentar',
        onSecondaryClick: async () => {
          hideAlert()
          await submitRef.current?.()
        },
      })

      resetFlags()
    }
  }, [updatingExcel, successUpdateExcel, requisitionExcelError, warning])

  return (
    <FormsLayout
      title="Sube aquí tus requisiciones"
      buttonLabel="Subir Archivo"
      onButtonClick={() => submitRef.current?.()}
      buttonDisabled={!ready || !isGatewayReady}  // <- opcional, pero recomendado
      enableCollapse={false}
    >
      <FileUploaderExpanded
        accept=".xlsx,.xls"
        onFile={handleFile}
        label="Selecciona el archivo excel a subir"
      />
    </FormsLayout>
  )
}

export default ExcelLoader

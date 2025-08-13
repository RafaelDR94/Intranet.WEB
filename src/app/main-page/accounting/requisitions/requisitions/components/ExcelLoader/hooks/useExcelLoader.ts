'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { shallow } from 'zustand/shallow';
import { usePrincipal } from '@/app/context/PrincipalContext/PrincipalContext';
import { useRequisitionsStore } from '@/app/stores/useRequisitionStore/useRequisitionStore';
import { useIntranetGatewayStore } from '@/app/stores/system/useIntranetGatewayStore';
import { SubmitFn } from './types';


export const useExcelLoader = () => {
  const { usePrincipalLoading, usePrincipalAlert } = usePrincipal();
  const { showSpinner, hideSpinner } = usePrincipalLoading;
  const { showAlert, hideAlert } = usePrincipalAlert;
  const isGatewayReady = useIntranetGatewayStore((s) => s.isReady);

  const {
    updateExcelRequisition,
    resetFlags,
    updatingExcel,
    successUpdateExcel,
    error,
    warning,
  } = useRequisitionsStore(
    (s) => ({
      updateExcelRequisition: s.updateExcelRequisition,
      resetFlags: s.resetFlags,
      updatingExcel: s.updatingExcel,
      successUpdateExcel: s.successUpdateExcel,
      error: s.error,
      warning: s.warning,
    }),
    shallow
  );

  const requisitionExcelError = useMemo(
    () => (!updatingExcel && !successUpdateExcel ? error : undefined),
    [updatingExcel, successUpdateExcel, error]
  );

  const submitRef = useRef<SubmitFn | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [ready, setReady] = useState(false);

  const handleFile = (incoming: File | File[] | null) => {
    const f = Array.isArray(incoming) ? incoming[0] ?? null : incoming;
    setFile(f);
    setReady(!!f);
    resetFlags();
  };

  const doUpload = async () => {
    if (!file) throw new Error('Selecciona un archivo Excel primero.');
    const response = await updateExcelRequisition(file);
    // Si deseas manejar algo adicional con response, hazlo aquí.
    console.log('response', response);
  };

  useEffect(() => {
    submitRef.current = doUpload;
  }, [file, updateExcelRequisition]);

  useEffect(() => {
    if (updatingExcel) {
      showSpinner({ message: 'Subiendo tu archivo…', spinnerSize: 'large' });
      return;
    }
    hideSpinner();
    if (warning) {
      setFile(null);
      showAlert({
        type: 'warning',
        variant: 'filled',
        title: 'Advertencia',
        description:
          warning ?? 'Ocurrió una advertencia al subir el archivo. Intenta de nuevo.',
        showPrimaryButton: true,
        showSecondaryButton: false,
        primaryLabel: 'Entendido',
        onPrimaryClick: () => {
          hideAlert();
          resetFlags();
        },
      });
    }

    if (successUpdateExcel) {
      setFile(null);
      showAlert({
        type: 'success',
        variant: 'filled',
        title: '¡Archivo enviado!',
        description: 'Tu Excel fue cargado correctamente.',
        showPrimaryButton: true,
        showSecondaryButton: false,
        primaryLabel: 'Cerrar',
        onPrimaryClick: () => {
          hideAlert();
          setFile(null);
          setReady(false);
          resetFlags();
        },
      });
    }

    if (requisitionExcelError) {
      showAlert({
        type: 'error',
        variant: 'filled',
        title: 'No se pudo enviar',
        description:
          String(requisitionExcelError) ??
          'Ocurrió un error al subir el archivo. Intenta de nuevo.',
        showPrimaryButton: true,
        primaryLabel: 'Entendido',
        onPrimaryClick: () => {
          hideAlert();
          resetFlags();
        },
        showSecondaryButton: true,
        secondaryLabel: 'Reintentar',
        onSecondaryClick: async () => {
          hideAlert();
          await submitRef.current?.();
        },
      });

      resetFlags();
    }
  }, [
    updatingExcel,
    successUpdateExcel,
    requisitionExcelError,
    warning,
    hideAlert,
    hideSpinner,
    resetFlags,
    showAlert,
    showSpinner,
  ]);

  return {
    file,
    ready,
    isGatewayReady,
    handleFile,
    onSubmit: () => submitRef.current?.(),
    buttonDisabled: !ready || !isGatewayReady,
  };
};

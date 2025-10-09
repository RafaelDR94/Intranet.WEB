'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { shallow } from 'zustand/shallow';

import { usePrincipal } from '@/app/context/PrincipalContext/PrincipalContext';
import useReportBuilderStore from '@/app/stores/useReportBuilderStore/useReportBuilderStore';
import type { Refaction } from '@/app/mappings/reports/reports.types';

export type RefactionFormValues = Refaction;

const emptyValues: RefactionFormValues = {
  description: '',
  brand: '',
  model: '',
  serialnumber: '',
  partnumber: '',
};

const sanitize = (value: string) => value?.trim() ?? '';

type Options = {
  refactionIndex: number | null;
  onSuccess: () => void;
};

const useRefactionForm = ({ refactionIndex, onSuccess }: Options) => {
  const submitRef = useRef<(() => void | Promise<void>) | null>(null);

  const { usePrincipalAlert, usePrincipalLoading } = usePrincipal();
  const { showAlert, hideAlert } = usePrincipalAlert;
  const { showSpinner, hideSpinner } = usePrincipalLoading;

  const { refactions, updateRefactions } = useReportBuilderStore(
    (state) => ({
      refactions: state.report.refactions ?? [],
      updateRefactions: state.updateRefactions,
    }),
    shallow
  );

  const initialValues = useMemo<RefactionFormValues>(() => {
    if (refactionIndex == null) return emptyValues;
    const target = refactions[refactionIndex];
    if (!target) return emptyValues;
    return { ...emptyValues, ...target };
  }, [refactionIndex, refactions]);

  const [values, setValues] = useState<RefactionFormValues>(initialValues);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    setValues(initialValues);
    const hasAllValues = Object.values(initialValues).every((value) => Boolean(String(value ?? '').trim()));
    setIsValid(hasAllValues);
  }, [initialValues]);

  useEffect(() => () => hideSpinner(), [hideSpinner]);

  const handleSubmit = useCallback(
    async (formValues: Record<string, any>) => {
      const payload: Refaction = {
        description: sanitize(String(formValues.description ?? '')),
        brand: sanitize(String(formValues.brand ?? '')),
        model: sanitize(String(formValues.model ?? '')),
        serialnumber: sanitize(String(formValues.serialnumber ?? '')),
        partnumber: sanitize(String(formValues.partnumber ?? '')),
      };

      showSpinner({ message: refactionIndex == null ? 'Guardando refacción...' : 'Actualizando refacción...' });

      try {
        const next = [...refactions];
        if (refactionIndex == null) {
          next.push(payload);
        } else {
          next[refactionIndex] = payload;
        }
        updateRefactions(next);

        showAlert({
          type: refactionIndex == null ? 'success' : 'info',
          variant: 'filled',
          title: refactionIndex == null ? 'Refacción agregada' : 'Refacción actualizada',
          description: 'Los cambios se guardaron correctamente.',
          autoCloseMs: 3000,
          showPrimaryButton: false,
          showSecondaryButton: false,
          onClose: hideAlert,
        });

        onSuccess();
      } catch (error) {
        showAlert({
          type: 'error',
          variant: 'filled',
          title: 'No se pudo guardar la refacción',
          description: String(error),
          autoCloseMs: 4000,
          showPrimaryButton: false,
          showSecondaryButton: false,
          onClose: hideAlert,
        });
      } finally {
        hideSpinner();
      }
    },
    [hideAlert, hideSpinner, onSuccess, refactionIndex, refactions, showAlert, showSpinner, updateRefactions]
  );

  return {
    values,
    setValues,
    isValid,
    setIsValid,
    submitRef,
    handleSubmit,
  };
};

export default useRefactionForm;

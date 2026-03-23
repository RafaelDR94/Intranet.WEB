'use client';
import { useCallback, useMemo, useState } from 'react';

import type { SpinnerSize } from '@/app/components/Spinner/types';

export type LoadingState = {
  open: boolean;
  message?: string;
  spinnerSize?: SpinnerSize;
};

export type UseLoadingOverlay = {
  open: boolean;
  message?: string;
  spinnerSize: SpinnerSize;
  showSpinner: (opts?: { message?: string; spinnerSize?: SpinnerSize }) => void;
  hideSpinner: () => void;
  withLoading: <T>(task: () => Promise<T>, opts?: { message?: string; spinnerSize?: SpinnerSize }) => Promise<T>;
};

const useLoadingOverlay = (): UseLoadingOverlay => {
  const [state, setState] = useState<LoadingState>({ open: false, spinnerSize: 'medium' });

  const showSpinner: UseLoadingOverlay['showSpinner'] = useCallback((opts) => {
    console.log("Mostrando spinner");
    if (process.env.NODE_ENV !== 'production') {
      console.trace('[spinner] show');
    }
    setState((prev) => {
      const next = {
        open: true,
        message: opts?.message ?? 'Procesando…',
        spinnerSize: opts?.spinnerSize ?? 'medium',
      } as LoadingState;
      // Evitar updates innecesarios para no disparar efectos en cascada
      if (
        prev.open === next.open &&
        prev.message === next.message &&
        prev.spinnerSize === next.spinnerSize
      ) {
        return prev;
      }
      return next;
    });
  }, []);

  const hideSpinner = useCallback(
    () => {
  
      if (process.env.NODE_ENV !== 'production') {
        console.trace('[spinner] hide');
      }
      setState((s) => {
        // No-op si ya está oculto
        if (!s.open) return s;
        return { ...s, open: false };
      })
    },
    []
  );

  const withLoading = useCallback<UseLoadingOverlay['withLoading']>(
    async (task, opts) => {
      showSpinner(opts);
      try {
        return await task();
      } finally {
        hideSpinner();
      }
    },
    [showSpinner, hideSpinner]
  );

  return useMemo(
    () => ({
      open: state.open,
      message: state.message,
      spinnerSize: state.spinnerSize ?? 'medium',
      showSpinner,
      hideSpinner,
      withLoading,
    }),
    [state, showSpinner, hideSpinner, withLoading]
  );
};

export default useLoadingOverlay;

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
    setState({
      open: true,
      message: opts?.message ?? 'Procesando…',
      spinnerSize: opts?.spinnerSize ?? 'medium',
    });
  }, []);

  const hideSpinner = useCallback(() => setState(s => ({ ...s, open: false })), []);

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
    [state]
  );
};

export default useLoadingOverlay;

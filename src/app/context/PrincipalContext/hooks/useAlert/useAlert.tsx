// context/PrincipalContext/hooks/useAlert/useAlert.ts
import { useState, useCallback } from 'react';
import { AlertProps } from '@/app/components/Alert/types';

/**
 * Hook para controlar alertas globales.
 */
export default function useAlert() {
  const [alert, setAlert] = useState<AlertProps | null>(null);

  const showAlert = useCallback((props: AlertProps) => {
    setAlert(props);
  }, []);

  const hideAlert = useCallback(() => {
    setAlert(null);
  }, []);

  return {
    alert,
    showAlert,
    hideAlert,
  };
}



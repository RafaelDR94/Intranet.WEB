import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePrincipal } from '@/app/context/PrincipalContext/PrincipalContext';
import type { FieldModel } from '@/app/components/DynamicForm/types';

/** Campos del formulario de recuperación de contraseña */
export const recoverPasswordFields: FieldModel[] = [
  {
    name: 'email',
    type: 'email',
    label: 'Usuario',
    placeholder: 'usuario@drsecurity.net',
    value: '',
    validations: [
      { type: 'required', message: 'El correo es obligatorio' },
      { type: 'email', message: 'Formato de correo inválido' },
    ],
  },
];

export interface UseRecoverPassword {
  /** Indica si la solicitud está en curso */
  isLoading: boolean;
  /** Envía el correo para recuperar la contraseña */
  handleRecover: (values: Record<string, any>) => Promise<void>;
}

/**
 * Maneja el flujo de recuperación de contraseña.
 * @param routerOverride Router opcional para pruebas
 * @returns Estado y acciones del proceso
 */
export default function useRecoverPassword(
  routerOverride?: ReturnType<typeof useRouter>
): UseRecoverPassword {
  const router = routerOverride ?? useRouter();
  const { usePrincipalAlert } = usePrincipal();
  const { showAlert, hideAlert } = usePrincipalAlert;
  const [isLoading, setIsLoading] = useState(false);

  const handleRecover = useCallback(
    async (values: Record<string, any>) => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `https://localhost:7040/Auth/RecoverPassword?username=${encodeURIComponent(
            values.email
          )}`
        );
        if (!res.ok) throw new Error('No se pudo enviar el correo');
        router.push(
          `/login/recover-password/recovery-email?email=${encodeURIComponent(
            values.email
          )}`
        );
      } catch (error: any) {
        showAlert({
          type: 'error',
          variant: 'subtle',
          title: 'Error',
          description:
            error?.message ?? 'No se pudo enviar el correo de recuperación',
          onPrimaryClick: hideAlert,
          onSecondaryClick: hideAlert,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [router, showAlert, hideAlert]
  );

  return { isLoading, handleRecover };
}


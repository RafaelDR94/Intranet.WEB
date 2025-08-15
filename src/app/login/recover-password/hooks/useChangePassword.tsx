import { useCallback, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { usePrincipal } from '@/app/context/PrincipalContext/PrincipalContext';
import type { FieldModel } from '@/app/components/DynamicForm/types';

/** Campos del formulario para cambiar contraseña */
export const changePasswordFields: FieldModel[] = [
  {
    name: 'newPassword',
    type: 'password',
    label: 'Contraseña Nueva',
    placeholder: 'Escribe una nueva contraseña',
    value: '',
    validations: [
      { type: 'required' },
      { type: 'minLength', value: 6 },
    ],
  },
  {
    name: 'confirmPassword',
    type: 'password',
    label: 'Confirmar contraseña',
    placeholder: 'Confirma tu nueva contraseña',
    value: '',
    validations: [{ type: 'required' }],
  },
];

export interface UseChangePassword {
  /** Indica si la solicitud está en curso */
  isLoading: boolean;
  /** Envía la nueva contraseña */
  handleChange: (values: Record<string, any>) => Promise<void>;
}

/**
 * Maneja el cambio de contraseña desde un enlace de recuperación.
 * @param routerOverride Router opcional para pruebas
 * @param searchParamsOverride SearchParams opcional para pruebas
 */
export default function useChangePassword(
  routerOverride?: ReturnType<typeof useRouter>,
  searchParamsOverride?: ReturnType<typeof useSearchParams>
): UseChangePassword {
  const router = routerOverride ?? useRouter();
  const searchParams = searchParamsOverride ?? useSearchParams();
  const email = searchParams.get('email') ?? '';
  const { usePrincipalAlert } = usePrincipal();
  const { showAlert, hideAlert } = usePrincipalAlert;
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = useCallback(
    async (values: Record<string, any>) => {
      if (values.newPassword !== values.confirmPassword) {
        showAlert({
          type: 'error',
          variant: 'subtle',
          title: 'Error',
          description: 'Las contraseñas no coinciden',
          onPrimaryClick: hideAlert,
          onSecondaryClick: hideAlert,
        });
        return;
      }
      setIsLoading(true);
      try {
        const res = await fetch('https://localhost:7040/Auth/ChangePassword', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            newPassword: values.newPassword,
            changePassword: true,
          }),
        });
        if (!res.ok) throw new Error('No se pudo cambiar la contraseña');
        showAlert({
          type: 'success',
          variant: 'subtle',
          title: 'Contraseña guardada',
          description: 'La contraseña se actualizó correctamente',
          onPrimaryClick: () => {
            hideAlert();
            router.push('/login');
          },
          onSecondaryClick: () => {
            hideAlert();
            router.push('/login');
          },
        });
      } catch (error: any) {
        showAlert({
          type: 'error',
          variant: 'subtle',
          title: 'Error',
          description:
            error?.message ?? 'No se pudo cambiar la contraseña',
          onPrimaryClick: hideAlert,
          onSecondaryClick: hideAlert,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [email, showAlert, hideAlert, router]
  );

  return { isLoading, handleChange };
}


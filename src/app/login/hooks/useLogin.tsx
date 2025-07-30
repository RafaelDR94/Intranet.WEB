import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext/AuthContext';
import { useTheme } from '../../context/ThemeContext/ThemeContext';
import type { FieldModel } from '../../components/DynamicForm/types';

/**
 * Campos del formulario de inicio de sesión.
 */
export const loginFields: FieldModel[] = [
  {
    name: 'email',
    type: 'email',
    label: 'Usuario',
    placeholder: 'Escribe aquí tu correo electrónico',
    value: '',
    validations: [{ type: 'required' }, { type: 'email' }],
  },
  {
    name: 'password',
    type: 'password',
    label: 'Contraseña',
    placeholder: 'Escribe aquí tu contraseña',
    value: '',
    validations: [{ type: 'required' }, { type: 'minLength', value: 6 }],
  },
];

/**
 * Estado y acciones para la página de Login.
 */
export interface UseLogin {
  /** Indica si el usuario quiere ser recordado. */
  remeberStatus: boolean;
  /** Indica si se está procesando la autenticación. */
  isLoading: boolean;
  /** Mensaje de error en caso de fallo. */
  failMessage: string;
  /** Maneja el cambio en la opción "Recordarme". */
  handleRemeber: (remeber: boolean) => void;
  /** Envía las credenciales de login. */
  handleLogin: (values: Record<string, any>) => Promise<void>;
}

/**
 * Hook que centraliza la lógica de la página de inicio de sesión.
 *
 * @returns Controles y estado para `LoginPage`.
 */
export const useLogin = (routerOverride?: ReturnType<typeof useRouter>): UseLogin => {
  const router = routerOverride ?? useRouter();
  const { login, handleRemeberMe, userRemebered } = useAuth();
  const { setDarkTheme, theme } = useTheme();

  const [isLoading, setIsLoading] = useState(false);
  const [remeberStatus, setRemeberStatus] = useState(false);
  const [failMessage, setFailMessage] = useState('');

  const handleRemeber = (remeber: boolean) => {
    setRemeberStatus(remeber);
    handleRemeberMe(remeber);
  };

  const handleLogin = async (values: Record<string, any>) => {
    setIsLoading(true);
    setFailMessage('');
    const loginValues = {
      email: values.email,
      password: values.password,
    };
    try {
      await login(loginValues);
      router.push('/main-page/dashboard');
    } catch (error: any) {
      const messageError =
        error?.response?.data?.error_Message ??
        'No se logró acceder, revise sus datos e intentelo de nuevo';
      setFailMessage(messageError);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userRemebered) setRemeberStatus(true);
  }, [userRemebered]);

  useEffect(() => {
    if (theme === 'light') {
      setDarkTheme();
    }
  }, [theme, setDarkTheme]);

  return {
    remeberStatus,
    isLoading,
    failMessage,
    handleRemeber,
    handleLogin,
  };
};

export default useLogin;

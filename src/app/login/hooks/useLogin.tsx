import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext/AuthContext';
import { usePrincipal } from '@/app/context/PrincipalContext/PrincipalContext';
import type { FieldModel } from '../../components/DynamicForm/types';

/** Campos base (sin valores dinámicos) */
const baseLoginFields: FieldModel[] = [
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

export interface UseLogin {
  rememberStatus: boolean;
  isLoading: boolean;
  failMessage: string;
  loginFields: FieldModel[];
  handleRemember: (remember: boolean, currentEmail?: string, currentPassword?: string) => void;
  handleLogin: (values: Record<string, any>) => Promise<void>;
}

const REMEMBER_EMAIL_KEY = 'drs.remember.email';
const REMEMBER_PASS_KEY = 'drs.remember.password';
const REMEMBER_FLAG_KEY = 'drs.remember.flag';

const useLogin = (routerOverride?: ReturnType<typeof useRouter>): UseLogin => {
  const router = routerOverride ?? useRouter();
  const { login, logout } = useAuth();
  const { usePrincipalTheme } = usePrincipal();
  const { setDarkTheme, theme } = usePrincipalTheme;

  const [isLoading, setIsLoading] = useState(false);
  const [rememberStatus, setRememberStatus] = useState(false);
  const [failMessage, setFailMessage] = useState('');
  const [rememberedEmail, setRememberedEmail] = useState<string>('');
  const [rememberedPassword, setRememberedPassword] = useState<string>('');

  // Carga inicial desde localStorage
  useEffect(() => {
    try {
      const flag = localStorage.getItem(REMEMBER_FLAG_KEY) === '1';
      const email = localStorage.getItem(REMEMBER_EMAIL_KEY) || '';
      const pass = localStorage.getItem(REMEMBER_PASS_KEY) || '';
      setRememberStatus(flag);
      setRememberedEmail(flag ? email : '');
      setRememberedPassword(flag ? pass : '');
    } catch { /* noop */ }
  }, []);

  // Tema oscuro por defecto
  useEffect(() => {
    if (theme === 'light') setDarkTheme();
  }, [theme, setDarkTheme]);

  // Campos con valores iniciales
  const loginFields = useMemo<FieldModel[]>(
    () =>
      baseLoginFields.map((f) => {
        if (f.name === 'email') return { ...f, value: rememberedEmail };
        if (f.name === 'password') return { ...f, value: rememberedPassword };
        return f;
      }),
    [rememberedEmail, rememberedPassword]
  );

  const persistRemember = (remember: boolean, email?: string, password?: string) => {
    try {
      if (remember) {
        localStorage.setItem(REMEMBER_FLAG_KEY, '1');
        if (email !== undefined) localStorage.setItem(REMEMBER_EMAIL_KEY, email ?? '');
        if (password !== undefined) localStorage.setItem(REMEMBER_PASS_KEY, password ?? '');
      } else {
        localStorage.removeItem(REMEMBER_FLAG_KEY);
        localStorage.removeItem(REMEMBER_EMAIL_KEY);
        localStorage.removeItem(REMEMBER_PASS_KEY);
      }
    } catch { /* noop */ }
  };

  const handleRemember = (remember: boolean, currentEmail?: string, currentPassword?: string) => {
    setRememberStatus(remember);
    if (remember) {
      if (currentEmail !== undefined) setRememberedEmail(currentEmail ?? '');
      if (currentPassword !== undefined) setRememberedPassword(currentPassword ?? '');
      persistRemember(true, currentEmail, currentPassword);
    } else {
      setRememberedEmail('');
      setRememberedPassword('');
      persistRemember(false);
    }
  };

  const handleLogin = async (values: Record<string, any>) => {
    setIsLoading(true);
    setFailMessage('');
    const loginValues = { email: values.email, password: values.password };

    try {
      await login(loginValues);

      // Recordarme: guarda email y contraseña en localStorage
      if (rememberStatus) {
        persistRemember(true, values.email, values.password);
        setRememberedEmail(values.email);
        setRememberedPassword(values.password);
      } else {
        persistRemember(false);
        setRememberedEmail('');
        setRememberedPassword('');
      }

      router.push('/main-page');
    } catch (error: any) {
      const messageError =
        error?.response?.data?.error_Message ??
        'No se logró acceder, revise sus datos e inténtelo de nuevo';
      setFailMessage(messageError);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    logout();
  }, [])
  return {
    rememberStatus,
    isLoading,
    failMessage,
    loginFields,
    handleRemember,
    handleLogin,
  };
};

export default useLogin;

'use client';
import React from 'react';
import { DynamicForm } from '../components/DynamicForm/DynamicForm';
import Image from 'next/image';
import logo from '@/assets/images/Walpapers/Wallpaper-1.png';
import { Alert } from '../components/Alert/Alert';
import { ToggleButton } from '../components/ToogleButton.tsx/ToogleButton';
import Link from 'next/link';
import useLogin, { loginFields } from './hooks/useLogin';
import { loginStyles } from './styles';
import { LoginPageProps } from './types';

/**
 * `LoginPage` es la vista principal de autenticación de la intranet.
 * 
 * Permite al usuario iniciar sesión utilizando el componente `DynamicForm`.
 * Incluye un interruptor de "Recordarme", enlace para recuperar contraseña
 * y una alerta para errores de inicio de sesión.
 * 
 * También muestra una imagen de fondo en la parte derecha.
 *
 * @component
 * @example
 * return (
 *   <LoginPage />
 * )
 *
 * @param {LoginPageProps} props - Props para inyectar router simulado en Storybook o pruebas.
 * @param {AppRouterInstance} [props.routerOverride] - Instancia opcional de router mockeado para test o Storybook.
 * 
 * @returns {JSX.Element} Página de login con formulario interactivo.
 */

const  LoginPage:React.FC<LoginPageProps>=({ routerOverride })=>{
  const {
    handleLogin,
    handleRemeber,
    remeberStatus,
    failMessage,
    isLoading,
  } = useLogin(routerOverride);

  return (
    <div className={loginStyles.page}>
      {/* Columna izquierda - Formulario */}
      <div className={loginStyles.formContainer}>
        <div className={loginStyles.formWrapper}>
          <DynamicForm
            fields={loginFields}
            onSubmit={handleLogin}
            submitLabel="Iniciar sesión"
            loading={isLoading}
          >
            {/* Link "¿Olvidaste tu contraseña?" */}
            <div className={loginStyles.rememberContainer}>
              <ToggleButton
                checked={remeberStatus}
                onChange={handleRemeber}
                label="Recordarme"
                labelColor="text-black-100"
              />
              <Link href="/login/recover-password" className="text-label hover:text-black-100">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            {failMessage && (
              <Alert
                type="error"
                variant="subtle"
                title="Login incorrecto"
                description={failMessage}
                showPrimaryButton={false}
                showSecondaryButton={false}
              />
            )}
          </DynamicForm>
        </div>
      </div>

      {/* Columna derecha - Logo */}
      <div className={loginStyles.logoContainer}>
        <Image
          src={logo}
          alt="Fondo DR Security"
          fill
          priority
          className={loginStyles.logo}
        />
      </div>
    </div>
  );
}
export default LoginPage
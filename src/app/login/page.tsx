"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import DynamicForm from "../components/DynamicForm/DynamicForm";
import { Alert } from "../components/Alert/Alert";
import { ToggleButton } from "../components/ToogleButton/ToogleButton";
import useLogin from "./hooks/useLogin";
import { loginStyles } from "./styles";
import logoDesktop from "@/assets/images/Walpapers/Wallpaper-1.png";
import logoMobile from "@/assets/images/Walpapers/wallpaper-mobile.png";

const LoginPage = () => {
  const {
    handleLogin,
    handleRemember,
    rememberStatus,
    failMessage,
    isLoading,
    loginFields, // ← con email y password precargados (si los hay)
  } = useLogin();

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
            <div className={loginStyles.rememberContainer}>
              <ToggleButton
                checked={rememberStatus}
                onChange={(checked) => handleRemember(checked)}
                label="Recordarme"
                labelColor="text-black-100"
              />
              <Link
                href="/login/recover-password"
                className="text-label hover:text-black-100"
                prefetch={false}
              >
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

      {/* Columna derecha - Imagen de fondo */}
      <div className={loginStyles.logoContainer}>
        <Image
          src={logoDesktop}
          alt="Fondo DR Security (desktop)"
          fill
          priority
          className={`${loginStyles.logo} hidden md:block`}
          sizes="(min-width: 768px) 60vw, 0px"
        />
        <Image
          src={logoMobile}
          alt="Fondo DR Security (mobile)"
          fill
          className={`${loginStyles.logo} md:hidden`}
          sizes="(max-width: 767px) 100vw, 0px"
        />
      </div>
    </div>
  );
};

export default LoginPage;

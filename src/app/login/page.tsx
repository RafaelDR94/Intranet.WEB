"use client";

import Link from "next/link";
import React from "react";

import { Alert } from "../components/Alert/Alert";
import { Checkbox } from "../components/CheckBox/CheckBox";
import DynamicForm from "../components/DynamicForm/DynamicForm";

import AuthSplitLayout from "./components/AuthSplitLayout";
import useLogin from "./hooks/useLogin";
import { loginStyles } from "./styles";

const LoginPage = () => {
  const {
    handleLogin,
    handleRemember,
    handleForgotPassword,
    handleLoginValuesChange,
    rememberStatus,
    failMessage,
    isLoading,
    loginFields,
  } = useLogin();

  return (
    <AuthSplitLayout
      header={
        <div className={loginStyles.header}>
          <h1 className={loginStyles.title}>Bienvenido de vuelta</h1>
          <p className={loginStyles.subtitle}>Ingresa a la intranet</p>
        </div>
      }
    >
      <div className={`${loginStyles.panel} ${loginStyles.formSkin}`}>
        <DynamicForm
          fields={loginFields}
          onSubmit={handleLogin}
          onValuesChange={handleLoginValuesChange}
          submitLabel="Iniciar sesión"
          loading={isLoading}
          dataTestId="login"
        >
          <div className={loginStyles.rememberContainer}>
            <Checkbox
              checked={rememberStatus}
              onChange={(checked) => handleRemember(checked)}
              label="Recordarme"
              className={loginStyles.rememberCheckbox}
              dataTestId="login-remeberme"
            />
            <button
              type="button"
              onClick={handleForgotPassword}
              className={loginStyles.forgotPasswordLink}
              data-testid="login-forgorpassword"
            >
              ¿Olvidaste tu contraseña?
            </button>
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

        <div className={loginStyles.supportContainer}>
          ¿Problemas para acceder?{" "}
          <Link href="https://drsecurity.atlassian.net/servicedesk/customer/portals" target="_blank" rel="noopener noreferrer" className={loginStyles.supportLink}>
            Contacta a soporte
          </Link>
        </div>
      </div>
    </AuthSplitLayout>
  );
};

export default LoginPage;


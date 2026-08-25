"use client";

import Link from "next/link";
import React from "react";

import { Alert } from "../components/Alert/Alert";
import { Checkbox } from "../components/CheckBox/CheckBox";
import DynamicForm from "../components/DynamicForm/DynamicForm";

import AuthSplitLayout from "./components/AuthSplitLayout";
import useLogin from "./hooks/useLogin";
import { loginStyles } from "./styles";
import MailIcon from "@/assets/icons/Comunicacion/mail.svg";
import SmartphoneIcon from "@/assets/icons/Devices/smartphone-device.svg";

const mfaViewStyles = {
  wrapper: "mx-auto flex w-full max-w-[382px] flex-col gap-6",
  introText: "text-sm leading-6 text-white/80",
  methods: "space-y-4",
  methodsLabel: "text-xs font-medium leading-4 text-white/80",
  optionButton:
    "flex w-full items-start gap-4 rounded-[20px] border px-5 py-6 text-left transition",
  optionSelected: "border-white bg-white-100/15",
  optionIdle: "border-white/35 bg-transparent hover:border-white/70",
  optionDisabled: "cursor-not-allowed opacity-60",
  radioOuter:
    "mt-1 flex size-8 shrink-0 items-center justify-center rounded-full border-2",
  radioOuterSelected:
    "border-[#58becc] bg-[rgba(88,190,204,0.1)] shadow-[0_0_0_1px_rgba(88,190,204,0.2)]",
  radioOuterIdle: "border-[#58becc]",
  radioInner: "size-4 rounded-full bg-[#58becc] transition",
  iconWrap:
    "mt-0.5 flex size-10 shrink-0 items-center justify-center overflow-visible text-white",
  icon: "size-8 shrink-0 overflow-visible",
  optionContent: "flex min-w-0 flex-col gap-1",
  optionTitle:
    "text-[15px] font-medium leading-5 text-white sm:text-base sm:leading-6",
  optionDescription: "text-sm leading-5 text-[#58becc]",
  submitButton:
    "mt-2 flex h-12 w-full items-center justify-center rounded-xl bg-green-80 px-5 text-[16px] font-semibold leading-[29px] text-white-100 transition hover:bg-green-70 disabled:cursor-not-allowed disabled:bg-gray-40/40",
  linkWrap: "flex justify-center pt-2",
} as const;

const LoginPage = () => {
  const {
    step,
    enteredEmail,
    maskedResolvedEmail,
    handleLogin,
    handleEnteredEmailChange,
    handleEmailStepSubmit,
    handleEditEmail,
    handleRemember,
    handleForgotPassword,
    handleLoginValuesChange,
    rememberStatus,
    failMessage,
    isLoading,
    lookupLoading,
    loginFields,
    mfaRequiredData,
    selectedMfaMethod,
    mfaOptions,
    mfaLoading,
    canUsePasskey,
    setSelectedMfaMethod,
    handleSendMfaCode,
    handleBackToLoginFromMfa,
    handlePasskeyLogin,
  } = useLogin();

  const isMfaStep = Boolean(mfaRequiredData?.requiresMfa);

  return (
    <AuthSplitLayout
      header={
        <div className={loginStyles.header}>
          <h1 className={loginStyles.title}>
            {isMfaStep ? "Código de verificación" : "Portal Corporativo"}
          </h1>
          <p className={loginStyles.subtitle}>
            {isMfaStep
              ? "Te enviaremos un código de verificación"
              : "Accede a tu espacio de trabajo en Grupo Cantabria"}
          </p>
        </div>
      }
    >
      <div className={`${loginStyles.panel} ${loginStyles.formSkin}`}>
        {isMfaStep ? (
          <div className={mfaViewStyles.wrapper}>
            <div className={mfaViewStyles.introText}>
              Elige cómo deseas recibir el código de verificación.
            </div>

            <div className={mfaViewStyles.methods}>
              <div className={mfaViewStyles.methodsLabel}>Método de verificación</div>
              {mfaOptions.map((option) => {
                const selected = selectedMfaMethod === option.type;
                const Icon = option.type === "Email" ? MailIcon : SmartphoneIcon;

                return (
                  <button
                    key={option.type}
                    type="button"
                    disabled={mfaLoading}
                    onClick={() => setSelectedMfaMethod(option.type)}
                    className={[
                      mfaViewStyles.optionButton,
                      selected ? mfaViewStyles.optionSelected : mfaViewStyles.optionIdle,
                      mfaLoading ? mfaViewStyles.optionDisabled : "",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        mfaViewStyles.radioOuter,
                        selected
                          ? mfaViewStyles.radioOuterSelected
                          : mfaViewStyles.radioOuterIdle,
                      ].join(" ")}
                    >
                      <span
                        className={[
                          mfaViewStyles.radioInner,
                          selected ? "opacity-100" : "opacity-0",
                        ].join(" ")}
                      />
                    </span>

                    <span className={mfaViewStyles.iconWrap}>
                      <Icon className={mfaViewStyles.icon} />
                    </span>

                    <span className={mfaViewStyles.optionContent}>
                      <span className={mfaViewStyles.optionTitle}>
                        {option.type === "Email" ? "Correo electrónico" : "Mensaje SMS"}
                      </span>
                      <span className={mfaViewStyles.optionDescription}>{option.value}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            {failMessage && (
              <Alert
                type="error"
                variant="subtle"
                title="No se pudo continuar"
                description={failMessage}
                showPrimaryButton={false}
                showSecondaryButton={false}
              />
            )}

            <button
              type="button"
              onClick={handleSendMfaCode}
              className={mfaViewStyles.submitButton}
              disabled={mfaLoading || mfaOptions.length === 0}
            >
              Enviar código de verificación
            </button>

            <div className={mfaViewStyles.linkWrap}>
              <button
                type="button"
                onClick={handleBackToLoginFromMfa}
                className={loginStyles.forgotPasswordLink}
              >
                Volver al inicio de sesión
              </button>
            </div>
          </div>
        ) : step === "emailLookup" ? (
          <div className={loginStyles.emailStepPanel}>
            <form
              className={loginStyles.emailStepForm}
              onSubmit={(event) => {
                event.preventDefault();
                void handleEmailStepSubmit();
              }}
            >
              <div>
                <label className={loginStyles.emailStepLabel} htmlFor="login-email">
                  Correo electrónico
                </label>
                <input
                  id="login-email"
                  data-testid="login-email"
                  type="email"
                  value={enteredEmail}
                  onChange={(event) => handleEnteredEmailChange(event.target.value)}
                  placeholder="tu@empresa.com"
                  className={loginStyles.emailStepInput}
                  autoComplete="email"
                />
              </div>

              {failMessage && (
                <Alert
                  type="error"
                  variant="subtle"
                  title="No se pudo continuar"
                  description={failMessage}
                  showPrimaryButton={false}
                  showSecondaryButton={false}
                />
              )}

              <button
                type="submit"
                className={loginStyles.emailStepButton}
                disabled={lookupLoading}
                data-testid="login-next"
              >
                {lookupLoading ? "Validando..." : "Siguiente"}
              </button>
            </form>
          </div>
        ) : (
          <>
            {canUsePasskey && (
              <>
                <button
                  type="button"
                  className={loginStyles.passkeyButton}
                  onClick={() => {
                    void handlePasskeyLogin();
                  }}
                  disabled={isLoading}
                >
                  Iniciar sesión con Dispositivo
                </button>

                <div className="mb-4 flex items-center gap-4 text-white/70">
                  <span className="h-px flex-1 bg-white/40" />
                  <span className="text-sm font-medium">ó</span>
                  <span className="h-px flex-1 bg-white/40" />
                </div>
              </>
            )}

            <div className={loginStyles.readOnlyEmailWrap}>
              <div className={loginStyles.readOnlyEmailHeader}>
                <span className={loginStyles.emailStepLabel}>Correo electrónico</span>
                <button
                  type="button"
                  onClick={handleEditEmail}
                  className={loginStyles.editEmailButton}
                  data-testid="login-edit-email"
                >
                  Cambiar correo
                </button>
              </div>
              <div
                className={loginStyles.readOnlyEmailValue}
                data-testid="login-email-masked"
              >
                {maskedResolvedEmail}
              </div>
            </div>

            <DynamicForm
              fields={loginFields}
              onSubmit={handleLogin}
              onValuesChange={handleLoginValuesChange}
              submitLabel="Iniciar sesión"
              loading={isLoading}
              dataTestId="login"
              plain
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
              <Link
                href="https://drsecurity.atlassian.net/servicedesk/customer/portals"
                target="_blank"
                rel="noopener noreferrer"
                className={loginStyles.supportLink}
              >
                Contacta a soporte
              </Link>
            </div>
          </>
        )}
      </div>
    </AuthSplitLayout>
  );
};

export default LoginPage;

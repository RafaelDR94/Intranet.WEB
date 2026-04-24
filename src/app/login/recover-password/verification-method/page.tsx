"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import AuthSplitLayout from "../../components/AuthSplitLayout";
import { useRecoverPasswordFlow } from "../../context/RecoverPasswordFlowContext";
import { loginStyles } from "../../styles";

import { Alert } from "@/app/components/Alert/Alert";
import MailIcon from "@/assets/icons/Comunicacion/mail.svg";
import SmartphoneIcon from "@/assets/icons/Devices/smartphone-device.svg";

import useRecoverPassword from "../hooks/useRecoverPassword/useRecoverPassword";

const viewStyles = {
  wrapper: "mx-auto flex w-full max-w-[382px] flex-col gap-6",
  introText: "text-sm leading-6 text-white/80",
  fieldGroup: "space-y-2",
  fieldLabel: "text-[12px] font-medium leading-4 text-white/70",
  fieldValue: "text-[20px] font-medium leading-7 text-white",
  methods: "space-y-4",
  methodsLabel: "text-xs font-medium leading-4 text-white/70",
  optionButton:
    "flex w-full items-start gap-4 rounded-[20px] border px-5 py-6 text-left transition",
  optionSelected: "border-white bg-[#163c4b]",
  optionIdle: "border-white/35 bg-transparent hover:border-white/70",
  optionDisabled: "cursor-not-allowed opacity-60",
  radioOuter:
    "mt-1 flex size-8 shrink-0 items-center justify-center rounded-full border-2",
  radioOuterSelected:
    "border-[#2a8c97] bg-[rgba(42,140,151,0.08)] shadow-[0_0_0_1px_rgba(42,140,151,0.15)]",
  radioOuterIdle: "border-[#2a8c97]",
  radioInner: "size-4 rounded-full bg-[#2a8c97] transition",
  iconWrap:
    "mt-0.5 flex size-10 shrink-0 items-center justify-center overflow-visible text-white",
  icon: "size-8 shrink-0 overflow-visible",
  optionContent: "flex min-w-0 flex-col gap-1",
  optionTitle:
    "text-[15px] font-medium leading-5 text-white sm:text-base sm:leading-6",
  optionDescription: "text-sm leading-5 text-[#8ac6e6]",
  linkWrap: "flex justify-center pt-2",
  submitButton:
    "mt-2 flex h-12 w-full items-center justify-center rounded-xl bg-[#59c2b8] px-5 text-[16px] font-semibold leading-[29px] text-white transition hover:bg-[#67cfc5] disabled:cursor-not-allowed disabled:bg-[#295f68]",
} as const;

const RecoverPasswordVerificationMethodPage = () => {
  const router = useRouter();
  const { email, recoverChannels } = useRecoverPasswordFlow();
  const {
    handleRecover,
    isLoading,
    selectedMethod,
    selectedChannelValue,
    setSelectedMethod,
    submitError,
    verificationOptions,
  } = useRecoverPassword();

  useEffect(() => {
    if (!email || recoverChannels.length === 0) {
      router.replace("/login");
    }
  }, [email, recoverChannels.length, router]);

  const visibleFieldLabel =
    selectedMethod === "SMS" ? "Teléfono registrado" : "Correo electrónico";

  return (
    <AuthSplitLayout
      header={
        <div className={loginStyles.header}>
          <h1 className={loginStyles.title}>Recuperar contraseña</h1>
          <p className={loginStyles.subtitle}>
            Te enviaremos un código de verificación
          </p>
        </div>
      }
    >
      <div className={`${loginStyles.panel} ${loginStyles.formSkin}`}>
        <div className={viewStyles.wrapper}>
          <div className={viewStyles.introText}>
            Elige cómo deseas recibir el código de verificación.
          </div>

          <div className={viewStyles.fieldGroup}>
            <div className={viewStyles.fieldLabel}>{visibleFieldLabel}</div>
            <p className={viewStyles.fieldValue}>{selectedChannelValue}</p>
          </div>

          <div className={viewStyles.methods}>
            <div className={viewStyles.methodsLabel}>Método de verificación</div>
            {verificationOptions.map((option) => {
              const selected = selectedMethod === option.value;
              const Icon = option.value === "Email" ? MailIcon : SmartphoneIcon;

              return (
                <button
                  key={option.value}
                  type="button"
                  disabled={isLoading}
                  onClick={() => setSelectedMethod(option.value)}
                  className={[
                    viewStyles.optionButton,
                    selected ? viewStyles.optionSelected : viewStyles.optionIdle,
                    isLoading ? viewStyles.optionDisabled : "",
                  ].join(" ")}
                >
                  <span
                    className={[
                      viewStyles.radioOuter,
                      selected
                        ? viewStyles.radioOuterSelected
                        : viewStyles.radioOuterIdle,
                    ].join(" ")}
                  >
                    <span
                      className={[
                        viewStyles.radioInner,
                        selected ? "opacity-100" : "opacity-0",
                      ].join(" ")}
                    />
                  </span>

                  <span className={viewStyles.iconWrap}>
                    <Icon className={viewStyles.icon} />
                  </span>

                  <span className={viewStyles.optionContent}>
                    <span className={viewStyles.optionTitle}>{option.title}</span>
                    <span className={viewStyles.optionDescription}>
                      {option.description}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          {submitError && (
            <Alert
              type="error"
              variant="subtle"
              title="No se pudo enviar el código"
              description={submitError}
              showPrimaryButton={false}
              showSecondaryButton={false}
            />
          )}

          <div className={viewStyles.linkWrap}>
            <Link
              href="/login"
              className={loginStyles.forgotPasswordLink}
              prefetch={false}
            >
              Volver al inicio de sesión
            </Link>
          </div>

          <button
            type="button"
            onClick={handleRecover}
            className={viewStyles.submitButton}
            disabled={isLoading || verificationOptions.length === 0}
          >
            Enviar código de verificación
          </button>
        </div>
      </div>
    </AuthSplitLayout>
  );
};

export default RecoverPasswordVerificationMethodPage;

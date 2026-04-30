"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import AuthSplitLayout from "../components/AuthSplitLayout";
import { useRecoverPasswordFlow } from "../context/RecoverPasswordFlowContext";
import { loginStyles } from "../styles";

import { Alert } from "@/app/components/Alert/Alert";
import DynamicForm from "@/app/components/DynamicForm/DynamicForm";
import type { FieldModel } from "@/app/components/DynamicForm/types";
import { useAuthStore } from "@/app/stores/useAuthStore/useAuthStore";
import ArrowLeftIcon from "@/assets/icons/navegacion/arrow-left.svg";

const recoverPasswordIntroStyles = {
  panel: "mx-auto flex w-full max-w-[382px] flex-col gap-6",
  introText: "text-sm leading-6 text-white/80",
  submitSpacing:
    "[&_button[type='submit']]:mt-1 [&_button[type='submit']]:bg-[#295b6b] [&_button[type='submit']]:hover:bg-[#2f6879]",
  backLink:
    "inline-flex items-center justify-center gap-2 self-center px-3 py-2 text-[12px] font-medium leading-4 text-[#66f3ec] transition hover:text-[#8cf7f1]",
  backIcon: "size-4 shrink-0 text-inherit",
} as const;

const RecoverPasswordPage = () => {
  const router = useRouter();
  const { email, clearFlow, setLookupData, setVerificationChallenge } =
    useRecoverPasswordFlow();
  const fetchRecoverChannels = useAuthStore(
    (state) => state.fetchRecoverChannels,
  );
  const recoverPassword = useAuthStore((state) => state.recoverPassword);
  const clearRecoverPasswordState = useAuthStore(
    (state) => state.clearRecoverPasswordState,
  );
  const [submitError, setSubmitError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const introFields = useMemo<FieldModel[]>(
    () => [
      {
        name: "email",
        type: "email",
        label: "Correo electrónico",
        placeholder: "Escribe aquí tu correo corporativo",
        value: email,
        validations: [{ type: "required" }, { type: "email" }],
        className:
          "h-12 rounded-xl border-[1.5px] border-gray-40 bg-transparent px-3 py-3 text-sm leading-5 text-white placeholder:text-white/40 hover:border-white/80 focus:border-green-40 focus:bg-transparent",
      },
    ],
    [email],
  );

  const handleContinue = async (values: Record<string, unknown>) => {
    const nextEmail = String(values.email ?? "").trim();

    setSubmitError("");
    setIsLoading(true);
    clearRecoverPasswordState();

    const channels = await fetchRecoverChannels(nextEmail);
    const availableChannels =
      channels?.filter((channel) => Boolean(channel.value?.trim())) ?? [];

    setIsLoading(false);

    if (availableChannels.length === 0) {
      clearFlow();
      setSubmitError(
        "No encontramos métodos de verificación disponibles para ese correo.",
      );
      return;
    }

    if (availableChannels.length === 1) {
      const selectedMethod = availableChannels[0].type;
      const challenge = await recoverPassword({
        email: nextEmail,
        type: selectedMethod,
      });

      setIsLoading(false);

      if (!challenge) {
        setSubmitError(
          "No se pudo enviar el cÃ³digo de verificaciÃ³n. IntÃ©ntalo de nuevo.",
        );
        return;
      }

      setLookupData(nextEmail, channels ?? []);
      setVerificationChallenge(challenge, selectedMethod);
      clearRecoverPasswordState();
      router.push("/login/recover-password/recovery-email/");
      return;
    }

    setLookupData(nextEmail, channels ?? []);
    router.push("/login/recover-password/verification-method/");
  };

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
      <div
        className={`${loginStyles.panel} ${loginStyles.formSkin} ${recoverPasswordIntroStyles.submitSpacing}`}
      >
        <div className={recoverPasswordIntroStyles.panel}>
          <p className={recoverPasswordIntroStyles.introText}>
            Ingresa tu correo electrónico corporativo:
          </p>

          <DynamicForm
            fields={introFields}
            submitLabel="Siguiente"
            onSubmit={handleContinue}
            loading={isLoading}
            disabled={isLoading}
            dataTestId="recover-password-intro"
            valuesVersion={email ? 1 : 0}
            valuesVersionActive
          >
            {submitError && (
              <Alert
                type="error"
                variant="subtle"
                title="No se pudo validar el correo"
                description={submitError}
                showPrimaryButton={false}
                showSecondaryButton={false}
              />
            )}

            <div className="flex justify-center pt-1">
              <Link
                href="/login"
                className={recoverPasswordIntroStyles.backLink}
                prefetch={false}
              >
                <ArrowLeftIcon className={recoverPasswordIntroStyles.backIcon} />
                Volver al inicio de sesión
              </Link>
            </div>
          </DynamicForm>
        </div>
      </div>
    </AuthSplitLayout>
  );
};

export default RecoverPasswordPage;

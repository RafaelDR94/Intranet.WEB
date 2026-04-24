"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ClipboardEvent,
  type FormEvent,
  type KeyboardEvent,
} from "react";

import { Alert } from "@/app/components/Alert/Alert";
import { Spinner } from "@/app/components/Spinner/Spinner";
import AuthSplitLayout from "@/app/login/components/AuthSplitLayout";
import { useRecoverPasswordFlow } from "@/app/login/context/RecoverPasswordFlowContext";
import { loginStyles } from "@/app/login/styles";
import { useAuthStore } from "@/app/stores/useAuthStore/useAuthStore";
import MailOpenedIcon from "@/assets/icons/Comunicacion/mail-opened.svg";
import SmartphoneIcon from "@/assets/icons/Devices/smartphone-device.svg";
import ArrowLeftIcon from "@/assets/icons/navegacion/arrow-left.svg";

const viewStyles = {
  wrapper: "mx-auto flex w-full max-w-[382px] flex-col gap-5 sm:gap-6",
  section: "flex flex-col gap-6",
  infoRow: "flex items-start gap-3 text-left text-white/85",
  infoIcon: "mt-0.5 size-6 shrink-0 text-[#87d9ff]",
  infoText: "space-y-1 text-[14px] leading-5 text-white/85",
  infoTextStrong:
    "break-words text-[14px] font-medium leading-5 text-[#8ac6e6]",
  codeGroup: "flex flex-col gap-3",
  codeLabel: "text-[14px] font-medium leading-5 text-white",
  codeInputs: "grid grid-cols-6 gap-2 sm:flex sm:items-center sm:justify-between",
  codeInput:
    "h-12 w-full min-w-0 rounded-[8px] border border-[#4296c5] bg-transparent text-center text-[18px] font-semibold text-white outline-none transition focus:border-[#74d5ff] disabled:cursor-not-allowed disabled:opacity-70 sm:w-[59px] sm:text-[20px]",
  submitButton:
    "flex h-12 w-full items-center justify-center rounded-xl bg-[#33959f] px-5 text-[16px] font-semibold leading-[29px] text-white transition hover:bg-[#3ca3ad] disabled:cursor-not-allowed disabled:bg-[#295f68]",
  resendText: "text-center text-[14px] leading-5 text-white/80",
  resendButton:
    "text-center text-[14px] font-medium leading-5 text-[#66f3ec] transition hover:text-[#8cf7f1] disabled:cursor-not-allowed disabled:text-white/60",
  changeMethod:
    "inline-flex items-center justify-center gap-2 self-center px-3 py-2 text-[12px] font-semibold leading-4 text-[#33959f] transition hover:text-[#57c7d1]",
  changeMethodIcon: "size-5 shrink-0 text-inherit",
} as const;

const RecoverEmailClient = () => {
  const router = useRouter();
  const {
    email,
    selectedMethod,
    verificationChallenge,
    setResetChallenge,
    setVerificationChallenge,
  } = useRecoverPasswordFlow();
  const [challengeId, setChallengeId] = useState(
    verificationChallenge?.challengeId ?? "",
  );
  const [method, setMethod] = useState<"Email" | "SMS">(
    verificationChallenge?.type ?? selectedMethod,
  );
  const [destinationMasked, setDestinationMasked] = useState(
    verificationChallenge?.maskedDestination ?? "",
  );
  const [resendCountdown, setResendCountdown] = useState(
    Math.max(0, Math.min(60, verificationChallenge?.expiresInSeconds || 60)),
  );
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [localError, setLocalError] = useState("");
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const {
    error,
    recoveringPassword,
    verifyingPasswordRecovery,
    recoverPassword,
    verifyPasswordRecoveryCode,
    verifyPasswordRecoverySms,
    clearRecoverPasswordState,
  } = useAuthStore((state) => ({
    error: state.error,
    recoveringPassword: state.recoveringPassword,
    verifyingPasswordRecovery: state.verifyingPasswordRecovery,
    recoverPassword: state.recoverPassword,
    verifyPasswordRecoveryCode: state.verifyPasswordRecoveryCode,
    verifyPasswordRecoverySms: state.verifyPasswordRecoverySms,
    clearRecoverPasswordState: state.clearRecoverPasswordState,
  }));

  useEffect(() => {
    if (!email || !verificationChallenge?.challengeId) {
      router.replace("/login");
    }
  }, [email, router, verificationChallenge?.challengeId]);

  useEffect(() => {
    if (resendCountdown <= 0) {
      return;
    }

    const timer = window.setTimeout(() => {
      setResendCountdown((current) => current - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [resendCountdown]);

  const HintIcon = useMemo(
    () => (method === "SMS" ? SmartphoneIcon : MailOpenedIcon),
    [method],
  );

  const hintDestination = destinationMasked || email;
  const code = digits.join("");
  const isSubmitting = recoveringPassword || verifyingPasswordRecovery;
  const hasChallenge = Boolean(challengeId);
  const canSubmit = code.length === 6 && hasChallenge && !isSubmitting;

  const focusInput = (index: number) => {
    const input = inputsRef.current[index];

    if (input) {
      input.focus();
      input.select();
    }
  };

  const handleDigitChange = (index: number, rawValue: string) => {
    const nextDigit = rawValue.replace(/\D/g, "").slice(-1);

    setDigits((current) => {
      const next = [...current];
      next[index] = nextDigit;
      return next;
    });
    setLocalError("");

    if (nextDigit && index < 5) {
      focusInput(index + 1);
    }
  };

  const handleKeyDown = (
    index: number,
    event: KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      setDigits((current) => {
        const next = [...current];
        next[index - 1] = "";
        return next;
      });
      focusInput(index - 1);
      return;
    }

    if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      focusInput(index - 1);
      return;
    }

    if (event.key === "ArrowRight" && index < 5) {
      event.preventDefault();
      focusInput(index + 1);
    }
  };

  const handlePaste = (event: ClipboardEvent<HTMLDivElement>) => {
    event.preventDefault();

    const pastedDigits = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6)
      .split("");

    if (pastedDigits.length === 0) {
      return;
    }

    setDigits((current) =>
      current.map((_, index) => pastedDigits[index] ?? ""),
    );
    setLocalError("");
    focusInput(Math.min(pastedDigits.length, 6) - 1);
  };

  const handleResend = async () => {
    setLocalError("");

    const response = await recoverPassword({ email, type: method });

    if (!response) {
      return;
    }

    setChallengeId(response.challengeId);
    setMethod(response.type);
    setDestinationMasked(
      response.type === "SMS"
        ? response.phoneMasked ?? ""
        : response.emailMasked ?? "",
    );
    setVerificationChallenge(response, response.type);
    setDigits(Array(6).fill(""));
    setResendCountdown(
      Math.max(0, Math.min(60, response.expiresInSeconds || 60)),
    );
    clearRecoverPasswordState();
    focusInput(0);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!challengeId) {
      setLocalError(
        "No encontramos un desafío activo. Solicita un nuevo código.",
      );
      return;
    }

    if (code.length !== 6) {
      setLocalError("Ingresa los 6 dígitos del código.");
      return;
    }

    setLocalError("");

    const response =
      method === "SMS"
        ? await verifyPasswordRecoverySms({
            challengeId,
            token: code,
          })
        : await verifyPasswordRecoveryCode({
            challengeId,
            code,
          });

    if (response?.nextStep !== "ResetPassword") {
      return;
    }

    setResetChallenge(response.challengeId);
    clearRecoverPasswordState();
    router.push("/login/recover-password/recovery-new-password/");
  };

  return (
    <AuthSplitLayout
      header={
        <div className={loginStyles.header}>
          <h1 className={loginStyles.title}>Verificación</h1>
          <p className={loginStyles.subtitle}>Ingresa el código que recibiste</p>
        </div>
      }
    >
      <div className={`${loginStyles.panel} ${loginStyles.formSkin}`}>
        <form className={viewStyles.wrapper} onSubmit={handleSubmit}>
          <div className={viewStyles.section}>
            <div className={viewStyles.infoRow}>
              <HintIcon className={viewStyles.infoIcon} />
              <div className={`${viewStyles.infoText} min-w-0`}>
                <p>Hemos enviado un código de 6 dígitos a:</p>
                <p className={viewStyles.infoTextStrong}>{hintDestination}</p>
              </div>
            </div>

            <div className={viewStyles.codeGroup}>
              <label className={viewStyles.codeLabel}>
                Código de verificación
              </label>
              <div className={viewStyles.codeInputs} onPaste={handlePaste}>
                {digits.map((digit, index) => (
                  <input
                    key={`digit-${index}`}
                    ref={(element) => {
                      inputsRef.current[index] = element;
                    }}
                    value={digit}
                    onChange={(event) =>
                      handleDigitChange(index, event.target.value)
                    }
                    onKeyDown={(event) => handleKeyDown(index, event)}
                    className={viewStyles.codeInput}
                    inputMode="numeric"
                    maxLength={1}
                    autoComplete="one-time-code"
                    aria-label={`Dígito ${index + 1} del código`}
                    disabled={isSubmitting}
                  />
                ))}
              </div>
            </div>

            {(localError || error) && (
              <Alert
                type="error"
                variant="subtle"
                title="No se pudo verificar el código"
                description={localError || error || ""}
                showPrimaryButton={false}
                showSecondaryButton={false}
              />
            )}

            <button
              type="submit"
              className={viewStyles.submitButton}
              disabled={!canSubmit}
            >
              {isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <Spinner size="small" />
                  Verificando
                </span>
              ) : (
                "Enviar código de verificación"
              )}
            </button>

            {resendCountdown > 0 ? (
              <p className={viewStyles.resendText}>
                Reenviar código en {resendCountdown}s
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                className={viewStyles.resendButton}
                disabled={isSubmitting}
              >
                {recoveringPassword ? (
                  <span className="inline-flex items-center gap-2">
                    <Spinner size="small" />
                    Reenviando
                  </span>
                ) : (
                  "Reenviar código"
                )}
              </button>
            )}

            <Link
              href="/login/recover-password/verification-method/"
              className={viewStyles.changeMethod}
              prefetch={false}
            >
              <ArrowLeftIcon className={viewStyles.changeMethodIcon} />
              Usar otro método
            </Link>
          </div>
        </form>
      </div>
    </AuthSplitLayout>
  );
};

export default RecoverEmailClient;

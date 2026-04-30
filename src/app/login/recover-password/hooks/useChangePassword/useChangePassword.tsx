import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { shallow } from "zustand/shallow";

import { useRecoverPasswordFlow } from "@/app/login/context/RecoverPasswordFlowContext";
import { useAuthStore } from "@/app/stores/useAuthStore/useAuthStore";

export type PasswordRequirement = {
  id: "minLength" | "upper" | "lower" | "number" | "special";
  label: string;
  satisfied: boolean;
};

export interface UseChangePassword {
  challengeId: string;
  newPassword: string;
  confirmPassword: string;
  isLoading: boolean;
  isSuccess: boolean;
  successMessage: string;
  submitError: string;
  showNewPassword: boolean;
  showConfirmPassword: boolean;
  requirements: PasswordRequirement[];
  canSubmit: boolean;
  setNewPassword: (value: string) => void;
  setConfirmPassword: (value: string) => void;
  toggleNewPasswordVisibility: () => void;
  toggleConfirmPasswordVisibility: () => void;
  handleSubmit: () => Promise<void>;
  handleGoToLogin: () => void;
}

const buildRequirements = (password: string): PasswordRequirement[] => [
  {
    id: "minLength",
    label: "Mínimo 8 caracteres",
    satisfied: password.length >= 8,
  },
  {
    id: "upper",
    label: "Al menos una letra mayúscula",
    satisfied: /[A-ZÁÉÍÓÚÑ]/.test(password),
  },
  {
    id: "lower",
    label: "Al menos una letra minúscula",
    satisfied: /[a-záéíóúñ]/.test(password),
  },
  {
    id: "number",
    label: "Al menos un número",
    satisfied: /\d/.test(password),
  },
  {
    id: "special",
    label: "Al menos un carácter especial (!@#$%...)",
    satisfied: /[^A-Za-zÁÉÍÓÚáéíóúÑñ0-9]/.test(password),
  },
];

export default function useChangePassword(
  routerOverride?: ReturnType<typeof useRouter>,
): UseChangePassword {
  const routerFromHook = useRouter();
  const router = routerOverride ?? routerFromHook;
  const { clearFlow, resetChallenge } = useRecoverPasswordFlow();
  const challengeId = resetChallenge?.challengeId ?? "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    error,
    user,
    loading,
    resettingPasswordRecovery,
    successChangePassword,
    resetPasswordRecovery,
    changePassword,
    resetFlags,
  } = useAuthStore(
    (state) => ({
      error: state.error,
      user: state.user,
      loading: state.loading,
      resettingPasswordRecovery: state.resettingPasswordRecovery,
      successChangePassword: state.successChangePassword,
      resetPasswordRecovery: state.resetPasswordRecovery,
      changePassword: state.changePassword,
      resetFlags: state.resetFlags,
    }),
    shallow,
  );

  const userEmail = user?.email ?? user?.userName ?? "";
  const isForcedPasswordChangeFlow =
    !challengeId && user?.changePassword === true && Boolean(userEmail);

  const requirements = useMemo(() => buildRequirements(newPassword), [newPassword]);

  const allRequirementsSatisfied = requirements.every((requirement) => requirement.satisfied);
  const passwordsMatch =
    newPassword.length > 0 &&
    confirmPassword.length > 0 &&
    newPassword === confirmPassword;
  const canSubmit =
    (Boolean(challengeId) || isForcedPasswordChangeFlow) &&
    allRequirementsSatisfied &&
    passwordsMatch &&
    !resettingPasswordRecovery &&
    !loading;

  useEffect(() => {
    if (!challengeId && !isForcedPasswordChangeFlow) {
      router.replace("/login");
    }
  }, [challengeId, isForcedPasswordChangeFlow, router]);

  useEffect(() => {
    if (error) {
      setSubmitError(error);
    }
  }, [error]);

  useEffect(() => {
    if (!successChangePassword || !isForcedPasswordChangeFlow) {
      return;
    }

    setIsSuccess(true);
    setSuccessMessage("Tu contraseña fue actualizada correctamente.");
    resetFlags();
  }, [isForcedPasswordChangeFlow, resetFlags, successChangePassword]);

  useEffect(() => {
    return () => {
      resetFlags();
    };
  }, [resetFlags]);

  const handleSubmit = useCallback(async () => {
    if (!challengeId && !isForcedPasswordChangeFlow) {
      setSubmitError("No encontramos un desafío activo para restablecer la contraseña.");
      return;
    }

    if (!allRequirementsSatisfied) {
      setSubmitError("La nueva contraseña aún no cumple todos los requisitos.");
      return;
    }

    if (!passwordsMatch) {
      setSubmitError("Las contraseñas no coinciden.");
      return;
    }

    setSubmitError("");

    if (isForcedPasswordChangeFlow) {
      await changePassword({
        email: userEmail,
        newPassword,
        changePassword: false,
      });
      return;
    }

    const response = await resetPasswordRecovery({
      challengeId,
      newPassword,
      confirmPassword,
    });

    if (!response?.success) {
      return;
    }

    setIsSuccess(true);
    setSuccessMessage(response.message);
    resetFlags();
  }, [
    allRequirementsSatisfied,
    changePassword,
    challengeId,
    confirmPassword,
    isForcedPasswordChangeFlow,
    newPassword,
    passwordsMatch,
    resetFlags,
    resetPasswordRecovery,
    userEmail,
  ]);

  const handleGoToLogin = useCallback(() => {
    resetFlags();
    clearFlow();
    router.push("/login");
  }, [clearFlow, resetFlags, router]);

  return {
    challengeId,
    newPassword,
    confirmPassword,
    isLoading: resettingPasswordRecovery || loading,
    isSuccess,
    successMessage,
    submitError,
    showNewPassword,
    showConfirmPassword,
    requirements,
    canSubmit,
    setNewPassword: (value) => {
      setSubmitError("");
      setNewPassword(value);
    },
    setConfirmPassword: (value) => {
      setSubmitError("");
      setConfirmPassword(value);
    },
    toggleNewPasswordVisibility: () => setShowNewPassword((current) => !current),
    toggleConfirmPasswordVisibility: () =>
      setShowConfirmPassword((current) => !current),
    handleSubmit,
    handleGoToLogin,
  };
}

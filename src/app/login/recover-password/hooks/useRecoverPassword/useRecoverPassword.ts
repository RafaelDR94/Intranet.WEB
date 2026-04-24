import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { shallow } from "zustand/shallow";

import { useRecoverPasswordFlow } from "@/app/login/context/RecoverPasswordFlowContext";
import type { RecoverChannel } from "@/app/mappings/auth/auth.types";
import { useAuthStore } from "@/app/stores/useAuthStore/useAuthStore";

export interface VerificationOption {
  value: "Email" | "SMS";
  title: string;
  description: string;
  channelValue: string | null;
}

export interface UseRecoverPassword {
  email: string;
  isLoading: boolean;
  selectedMethod: "Email" | "SMS";
  selectedChannelValue: string;
  submitError: string;
  verificationOptions: VerificationOption[];
  setSelectedMethod: (method: "Email" | "SMS") => void;
  handleRecover: () => Promise<void>;
}

export default function useRecoverPassword(
  routerOverride?: ReturnType<typeof useRouter>,
): UseRecoverPassword {
  const routerFromHook = useRouter();
  const router = routerOverride ?? routerFromHook;
  const {
    email,
    recoverChannels,
    selectedMethod,
    setSelectedMethod,
    setVerificationChallenge,
  } = useRecoverPasswordFlow();
  const [submitError, setSubmitError] = useState("");

  const { error, recoveringPassword, recoverPassword, clearRecoverPasswordState } =
    useAuthStore(
      (state) => ({
        error: state.error,
        recoveringPassword: state.recoveringPassword,
        recoverPassword: state.recoverPassword,
        clearRecoverPasswordState: state.clearRecoverPasswordState,
      }),
      shallow,
    );

  const verificationOptions = useMemo<VerificationOption[]>(() => {
    const definitions: Array<Omit<VerificationOption, "channelValue">> = [
      {
        value: "Email",
        title: "Correo electrónico",
        description: "Recibirás un código en tu correo corporativo",
      },
      {
        value: "SMS",
        title: "Mensaje SMS",
        description: "Recibirás un código en el teléfono registrado",
      },
    ];

    return definitions
      .map((definition) => {
        const matchingChannel = recoverChannels.find(
          (channel: RecoverChannel) => channel.type === definition.value,
        );

        return {
          ...definition,
          channelValue: matchingChannel?.value ?? null,
        };
      })
      .filter((option) => Boolean(option.channelValue?.trim()));
  }, [recoverChannels]);

  const selectedChannelValue = useMemo(() => {
    const selectedOption = verificationOptions.find(
      (option) => option.value === selectedMethod,
    );

    return selectedOption?.channelValue ?? "";
  }, [selectedMethod, verificationOptions]);

  useEffect(() => {
    if (error) {
      setSubmitError(error);
    }
  }, [error]);

  const handleRecover = useCallback(async () => {
    if (!email) {
      router.replace("/login");
      return;
    }

    setSubmitError("");

    const response = await recoverPassword({ email, type: selectedMethod });

    if (!response) {
      return;
    }

    setVerificationChallenge(response, selectedMethod);
    clearRecoverPasswordState();
    router.push("/login/recover-password/recovery-email/");
  }, [
    clearRecoverPasswordState,
    email,
    recoverPassword,
    router,
    selectedMethod,
    setVerificationChallenge,
  ]);

  return {
    email,
    isLoading: recoveringPassword,
    selectedMethod,
    selectedChannelValue,
    submitError,
    verificationOptions,
    setSelectedMethod,
    handleRecover,
  };
}

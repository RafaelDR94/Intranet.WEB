"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import type {
  RecoverChannel,
  RecoverPasswordResponse,
} from "@/app/mappings/auth/auth.types";

type VerificationChallenge = {
  challengeId: string;
  type: "Email" | "SMS";
  purpose: "PasswordRecovery" | "LoginMfa";
  maskedDestination: string;
  expiresInSeconds: number;
  nextStep: string;
};

type ResetChallenge = {
  challengeId: string;
};

type RecoverPasswordFlowContextValue = {
  email: string;
  recoverChannels: RecoverChannel[];
  selectedMethod: "Email" | "SMS";
  verificationChallenge: VerificationChallenge | null;
  resetChallenge: ResetChallenge | null;
  setLookupData: (email: string, channels: RecoverChannel[]) => void;
  setSelectedMethod: (method: "Email" | "SMS") => void;
  setVerificationChallenge: (
    challenge: RecoverPasswordResponse,
    method: "Email" | "SMS",
    purpose?: "PasswordRecovery" | "LoginMfa",
  ) => void;
  setResetChallenge: (challengeId: string) => void;
  clearFlow: () => void;
};

const RecoverPasswordFlowContext = createContext<
  RecoverPasswordFlowContextValue | undefined
>(undefined);

const getDefaultMethod = (
  channels: RecoverChannel[],
): "Email" | "SMS" => {
  const availableChannels = channels.filter((channel) =>
    Boolean(channel.value?.trim()),
  );

  if (availableChannels.some((channel) => channel.type === "Email")) {
    return "Email";
  }

  return availableChannels[0]?.type === "SMS" ? "SMS" : "Email";
};

export const RecoverPasswordFlowProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [email, setEmail] = useState("");
  const [recoverChannels, setRecoverChannels] = useState<RecoverChannel[]>([]);
  const [selectedMethod, setSelectedMethodState] = useState<"Email" | "SMS">(
    "Email",
  );
  const [verificationChallenge, setVerificationChallengeState] =
    useState<VerificationChallenge | null>(null);
  const [resetChallenge, setResetChallengeState] =
    useState<ResetChallenge | null>(null);

  const setLookupData = useCallback(
    (nextEmail: string, channels: RecoverChannel[]) => {
      setEmail(nextEmail);
      setRecoverChannels(channels);
      setSelectedMethodState(getDefaultMethod(channels));
      setVerificationChallengeState(null);
      setResetChallengeState(null);
    },
    [],
  );

  const setSelectedMethod = useCallback((method: "Email" | "SMS") => {
    setSelectedMethodState(method);
  }, []);

  const setVerificationChallenge = useCallback(
    (
      challenge: RecoverPasswordResponse,
      method: "Email" | "SMS",
      purpose: "PasswordRecovery" | "LoginMfa" = "PasswordRecovery",
    ) => {
      setSelectedMethodState(method);
      setVerificationChallengeState({
        challengeId: challenge.challengeId,
        type: challenge.type,
        purpose,
        maskedDestination:
          challenge.type === "SMS"
            ? challenge.phoneMasked ?? ""
            : challenge.emailMasked ?? "",
        expiresInSeconds: challenge.expiresInSeconds,
        nextStep: challenge.nextStep,
      });
    },
    [],
  );

  const setResetChallenge = useCallback((challengeId: string) => {
    setResetChallengeState({ challengeId });
  }, []);

  const clearFlow = useCallback(() => {
    setEmail("");
    setRecoverChannels([]);
    setSelectedMethodState("Email");
    setVerificationChallengeState(null);
    setResetChallengeState(null);
  }, []);

  const value = useMemo<RecoverPasswordFlowContextValue>(
    () => ({
      email,
      recoverChannels,
      selectedMethod,
      verificationChallenge,
      resetChallenge,
      setLookupData,
      setSelectedMethod,
      setVerificationChallenge,
      setResetChallenge,
      clearFlow,
    }),
    [
      clearFlow,
      email,
      recoverChannels,
      resetChallenge,
      selectedMethod,
      setLookupData,
      setResetChallenge,
      setSelectedMethod,
      setVerificationChallenge,
      verificationChallenge,
    ],
  );

  return (
    <RecoverPasswordFlowContext.Provider value={value}>
      {children}
    </RecoverPasswordFlowContext.Provider>
  );
};

export const useRecoverPasswordFlow = () => {
  const context = useContext(RecoverPasswordFlowContext);

  if (!context) {
    throw new Error(
      "useRecoverPasswordFlow debe usarse dentro de RecoverPasswordFlowProvider",
    );
  }

  return context;
};

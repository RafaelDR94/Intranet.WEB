export type ChallengeMethod = "Email" | "SMS";

export type ChallengePurpose = "PasswordRecovery" | "LoginMfa";

export type PostRecoverPasswordChallengeStart = {
  purpose: ChallengePurpose;
  method: ChallengeMethod;
  email: string;
  phoneNumber: string;
};

export type RecoverPasswordChallengeStartResponse = {
  type: ChallengeMethod;
  challengeId: string;
  phoneMasked?: string;
  emailMasked?: string;
  message: string;
  expiresInSeconds: number;
  nextStep: string;
};

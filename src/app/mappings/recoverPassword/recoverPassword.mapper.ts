import type {
  PostRecoverPasswordChallengeStart,
  RecoverPasswordChallengeStartResponse,
} from "./recoverPassword.types";

type RecoverPasswordSource = {
  purpose?: unknown;
  email?: unknown;
  type?: unknown;
  challengeId?: unknown;
  challengedat?: unknown;
  challengeData?: unknown;
  idUser?: unknown;
  userId?: unknown;
};

const toString = (value: unknown, fallback = ""): string =>
  value == null ? fallback : String(value);

const toNumber = (value: unknown, fallback = 0): number => {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? fallback : parsed;
};

const toMethod = (value: unknown): "Email" | "SMS" =>
  toString(value).toUpperCase() === "SMS" ? "SMS" : "Email";

const toPurpose = (value: unknown): "PasswordRecovery" | "LoginMfa" =>
  toString(value).toUpperCase() === "LOGINMFA"
    ? "LoginMfa"
    : "PasswordRecovery";

/**
 * Mapea el payload de recuperación de contraseña al contrato de Challenge Start.
 */
export const PostRecoverPasswordChallengeStartMap = (
  src: RecoverPasswordSource,
): PostRecoverPasswordChallengeStart => ({
  purpose: toPurpose(src.purpose),
  method: toMethod(src.type),
  email: toString(src.email),
  challengeId: toString(src.challengeId ?? src.challengedat ?? src.challengeData),
  idUser: toString(src.idUser ?? src.userId),
});

/**
 * Normaliza la respuesta de `/Auth/Challenge/Start` a la forma usada por el flujo de recuperación.
 */
export const RecoverPasswordChallengeStartResponseMap = (
  raw: unknown,
): RecoverPasswordChallengeStartResponse => {
  const response = (raw as { data?: unknown } | null | undefined)?.data;
  const source =
    response && typeof response === "object"
      ? (response as Record<string, unknown>)
      : raw && typeof raw === "object"
        ? (raw as Record<string, unknown>)
        : {};

  return {
    type: toMethod(source.type),
    challengeId: toString(source.challengeId),
    phoneMasked:
      source.phoneMasked == null ? undefined : toString(source.phoneMasked),
    emailMasked:
      source.emailMasked == null ? undefined : toString(source.emailMasked),
    message: toString(source.message),
    expiresInSeconds: toNumber(source.expiresInSeconds),
    nextStep: toString(source.nextStep),
  };
};


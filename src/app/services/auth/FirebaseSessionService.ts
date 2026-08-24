import { intranetClient } from "@/app/configurations/Axios/Clients";
import { AuthFirebaseToken, AuthLogout } from "@/app/configurations/Axios/urls";

type FirebaseTokenResponse = {
  data?: unknown;
  success?: boolean;
  error_Message?: string;
  error_Code?: number;
};

/** Obtiene y valida el Custom Token emitido para la sesión backend actual. */
export const fetchFirebaseCustomToken = async (backendToken: string): Promise<string> => {
  if (!backendToken.trim()) {
    throw new Error("No hay un token de sesión backend para solicitar el Custom Token.");
  }

  const response = await intranetClient.post<FirebaseTokenResponse>(
    AuthFirebaseToken,
    undefined,
    {
      headers: {
        Authorization: `Bearer ${backendToken}`,
      },
    },
  );
  const payload = response.data;

  if (payload?.success !== true || typeof payload.data !== "string" || !payload.data.trim()) {
    throw new Error(payload?.error_Message?.trim() || "No se obtuvo un Custom Token válido de Firebase.");
  }

  return payload.data;
};

/**
 * El logout remoto se activa cuando el ambiente define su ruta. Esto evita
 * inventar un contrato mientras el backend lo termina de publicar.
 */
export const logoutBackendSession = async (): Promise<void> => {
  if (!AuthLogout) return;
  await intranetClient.post(AuthLogout);
};

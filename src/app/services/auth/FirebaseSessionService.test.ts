import { beforeEach, describe, expect, it, vi } from "vitest";

const postMock = vi.hoisted(() => vi.fn());

vi.mock("@/app/configurations/Axios/Clients", () => ({
  intranetClient: { post: postMock },
}));

vi.mock("@/app/configurations/Axios/urls", () => ({
  AuthFirebaseToken: "/Auth/FirebaseToken",
  AuthLogout: undefined,
}));

import { fetchFirebaseCustomToken, logoutBackendSession } from "./FirebaseSessionService";

describe("FirebaseSessionService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("solicita el Custom Token al endpoint autenticado", async () => {
    postMock.mockResolvedValueOnce({ data: { success: true, data: "custom-token" } });

    await expect(fetchFirebaseCustomToken("backend-token")).resolves.toBe("custom-token");
    expect(postMock).toHaveBeenCalledWith(
      "/Auth/FirebaseToken",
      undefined,
      { headers: { Authorization: "Bearer backend-token" } },
    );
  });

  it("rechaza una respuesta de backend sin Custom Token válido", async () => {
    postMock.mockResolvedValueOnce({
      data: { success: false, data: "", error_Message: "Sesión inválida" },
    });

    await expect(fetchFirebaseCustomToken("backend-token")).rejects.toThrow("Sesión inválida");
  });

  it("rejects a missing backend token before issuing the request", async () => {
    await expect(fetchFirebaseCustomToken("")).rejects.toThrow("No hay un token de sesión backend");
    expect(postMock).not.toHaveBeenCalled();
  });

  it("no inventa una ruta de logout si el entorno no la configuró", async () => {
    await logoutBackendSession();
    expect(postMock).not.toHaveBeenCalled();
  });
});

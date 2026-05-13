import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import useLogin from "./useLogin";

const pushMock = vi.fn();
const mockLogin = vi.fn();
const mockLogout = vi.fn();
const mockUpdateUser = vi.fn();
const mockFetchRecoverChannels = vi.fn();
const mockRecoverPassword = vi.fn();
const mockClearRecoverPasswordState = vi.fn();
const mockClearFlow = vi.fn();
const mockSetLookupData = vi.fn();
const mockSetVerificationChallenge = vi.fn();
const mockFetchAuthenticationMethods = vi.fn();
const mockIsPasskeySupported = vi.fn(async () => true);
const mockPasskeyLoginWithPasskey = vi.fn();
const mockAuthStoreState = {
  user: null as { changePassword?: boolean } | null,
};

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

vi.mock("../../context/AuthContext/AuthContext", () => ({
  useAuth: () => ({ login: mockLogin, logout: mockLogout, UpdateUser: mockUpdateUser }),
}));

vi.mock("@/app/services/auth/AuthenticationMethodsService", () => ({
  fetchAuthenticationMethods: (email: string) =>
    mockFetchAuthenticationMethods(email),
}));

vi.mock("@/app/services/passkeys/PasskeyService", () => ({
  PasskeyService: {
    loginWithPasskey: (email: string) => mockPasskeyLoginWithPasskey(email),
  },
  isPasskeySupported: () => mockIsPasskeySupported(),
}));

vi.mock("../context/RecoverPasswordFlowContext", () => ({
  useRecoverPasswordFlow: () => ({
    clearFlow: mockClearFlow,
    setLookupData: mockSetLookupData,
    setVerificationChallenge: mockSetVerificationChallenge,
  }),
}));

vi.mock("@/app/stores/useAuthStore/useAuthStore", () => ({
  useAuthStore: Object.assign(
    (selector: (state: any) => unknown) =>
      selector({
        fetchRecoverChannels: mockFetchRecoverChannels,
        recoverPassword: mockRecoverPassword,
        clearRecoverPasswordState: mockClearRecoverPasswordState,
      }),
    {
      getState: () => mockAuthStoreState,
      setState: vi.fn(),
    },
  ),
}));

vi.mock("@/app/context/AuthContext/utilities/AuthService", () => ({
  saveUser: vi.fn(),
  LoginMfaRequiredError: class LoginMfaRequiredError extends Error {
    payload: unknown;

    constructor(payload: unknown) {
      super("MFA_REQUIRED");
      this.payload = payload;
    }
  },
}));

vi.mock("@/app/stores/useAuthStore/utilities/interceptor", () => ({
  setInterceptor: vi.fn(),
}));

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key) => store[key] ?? null),
    setItem: vi.fn((key, value) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, "localStorage", { value: localStorageMock });

describe("useLogin hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    mockFetchRecoverChannels.mockResolvedValue(null);
    mockRecoverPassword.mockResolvedValue(null);
    mockFetchAuthenticationMethods.mockResolvedValue([]);
    mockIsPasskeySupported.mockResolvedValue(true);
    mockAuthStoreState.user = null;
  });

  it("carga credenciales recordadas y prellena el paso de correo", () => {
    localStorage.setItem("drs.remember.flag", "1");
    localStorage.setItem("drs.remember.email", "test@drs.com");
    localStorage.setItem("drs.remember.password", "123456");

    const { result } = renderHook(() => useLogin());

    expect(result.current.rememberStatus).toBe(true);
    expect(result.current.enteredEmail).toBe("test@drs.com");
    expect(result.current.loginFields.find((f) => f.name === "password")?.value).toBe(
      "123456",
    );
  });

  it("avanza al paso de contraseña tras resolver el correo", async () => {
    const { result } = renderHook(() => useLogin());

    act(() => {
      result.current.handleEnteredEmailChange("admin@dr.com");
    });

    await act(async () => {
      await result.current.handleEmailStepSubmit();
    });

    expect(mockFetchAuthenticationMethods).toHaveBeenCalledWith("admin@dr.com");
    expect(result.current.step).toBe("passwordLogin");
    expect(result.current.resolvedEmail).toBe("admin@dr.com");
    expect(result.current.maskedResolvedEmail).toBe("ad***@dr.com");
  });

  it("habilita passkey si el lookup lo devuelve y el navegador lo soporta", async () => {
    mockFetchAuthenticationMethods.mockResolvedValueOnce([
      { type: "Passkey", value: "admin@dr.com" },
    ]);

    const { result } = renderHook(() => useLogin());

    act(() => {
      result.current.handleEnteredEmailChange("admin@dr.com");
    });

    await act(async () => {
      await result.current.handleEmailStepSubmit();
    });

    expect(result.current.canUsePasskey).toBe(true);
  });

  it("oculta passkey cuando el lookup falla y aun así avanza", async () => {
    mockFetchAuthenticationMethods.mockRejectedValueOnce(new Error("boom"));

    const { result } = renderHook(() => useLogin());

    act(() => {
      result.current.handleEnteredEmailChange("admin@dr.com");
    });

    await act(async () => {
      await result.current.handleEmailStepSubmit();
    });

    expect(result.current.step).toBe("passwordLogin");
    expect(result.current.canUsePasskey).toBe(false);
  });

  it("handlePasskeyLogin usa el correo resuelto", async () => {
    mockFetchAuthenticationMethods.mockResolvedValueOnce([
      { type: "Passkey", value: "admin@dr.com" },
    ]);
    mockPasskeyLoginWithPasskey.mockResolvedValueOnce({
      token: "token",
      treeFirebase: "{}",
    });

    const { result } = renderHook(() => useLogin({ push: pushMock } as any));

    act(() => {
      result.current.handleEnteredEmailChange("admin@dr.com");
    });

    await act(async () => {
      await result.current.handleEmailStepSubmit();
    });

    await act(async () => {
      await result.current.handlePasskeyLogin();
    });

    expect(mockPasskeyLoginWithPasskey).toHaveBeenCalledWith("admin@dr.com");
  });

  it("permite volver al paso 1 para editar el correo", async () => {
    const { result } = renderHook(() => useLogin());

    act(() => {
      result.current.handleEnteredEmailChange("admin@dr.com");
    });

    await act(async () => {
      await result.current.handleEmailStepSubmit();
    });

    act(() => {
      result.current.handleEditEmail();
    });

    expect(result.current.step).toBe("emailLookup");
    expect(result.current.enteredEmail).toBe("admin@dr.com");
    expect(result.current.resolvedEmail).toBe("");
  });

  it("login exitoso usa el correo resuelto y redirige a main-page", async () => {
    mockLogin.mockResolvedValueOnce({});

    const { result } = renderHook(() => useLogin({ push: pushMock } as any));

    act(() => {
      result.current.handleEnteredEmailChange("user@drs.com");
    });

    await act(async () => {
      await result.current.handleEmailStepSubmit();
    });

    await act(async () => {
      await result.current.handleLogin({ password: "mypassword" });
    });

    expect(mockLogin).toHaveBeenCalledWith({
      email: "user@drs.com",
      password: "mypassword",
    });
    expect(pushMock).toHaveBeenCalledWith("/main-page");
  });

  it("si el email resuelto es valido y hay un solo canal disponible inicia challenge y va a recovery-email", async () => {
    const channels = [{ type: "Email", value: "us***@drsecurity.net" }];
    mockFetchRecoverChannels.mockResolvedValueOnce(channels);
    mockRecoverPassword.mockResolvedValueOnce({
      type: "Email",
      challengeId: "challenge-id",
      emailMasked: "us***@drsecurity.net",
      expiresInSeconds: 300,
      nextStep: "VerifyCode",
    });

    const { result } = renderHook(() => useLogin({ push: pushMock } as any));

    act(() => {
      result.current.handleEnteredEmailChange("user@drsecurity.net");
    });

    await act(async () => {
      await result.current.handleEmailStepSubmit();
    });

    await act(async () => {
      await result.current.handleForgotPassword();
    });

    expect(mockFetchRecoverChannels).toHaveBeenCalledWith("user@drsecurity.net");
    expect(mockSetLookupData).toHaveBeenCalledWith(
      "user@drsecurity.net",
      channels,
    );
    expect(mockRecoverPassword).toHaveBeenCalledWith({
      email: "user@drsecurity.net",
      type: "Email",
    });
    expect(pushMock).toHaveBeenCalledWith(
      "/login/recover-password/recovery-email/",
    );
  });

  it("muestra error normalizado cuando falla login", async () => {
    mockFetchAuthenticationMethods.mockResolvedValueOnce([]);
    mockLogin.mockRejectedValueOnce({
      response: { data: { error_Message: "Credenciales invÃ¡lidas" } },
    });

    const { result } = renderHook(() => useLogin());

    act(() => {
      result.current.handleEnteredEmailChange("wrong@drs.com");
    });

    await act(async () => {
      await result.current.handleEmailStepSubmit();
    });

    await act(async () => {
      await result.current.handleLogin({ password: "bad" });
    });

    await waitFor(() => {
      expect(result.current.failMessage).toBe("Credenciales invÃ¡lidas");
    });
  });
});

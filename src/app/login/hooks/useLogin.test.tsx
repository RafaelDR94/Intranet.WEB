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
const mockAuthStoreState = {
  user: null as { changePassword?: boolean } | null,
};

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

vi.mock("../../context/AuthContext/AuthContext", () => ({
  useAuth: () => ({ login: mockLogin, logout: mockLogout, UpdateUser: mockUpdateUser }),
}));

vi.mock("@/app/services/passkeys/PasskeyService", () => ({
  PasskeyService: {
    loginWithPasskey: vi.fn(),
  },
  isPasskeySupported: vi.fn(async () => true),
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
    },
  ),
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
    mockAuthStoreState.user = null;
  });

  it("carga credenciales recordadas desde localStorage", () => {
    localStorage.setItem("drs.remember.flag", "1");
    localStorage.setItem("drs.remember.email", "test@drs.com");
    localStorage.setItem("drs.remember.password", "123456");

    const { result } = renderHook(() => useLogin());

    expect(result.current.rememberStatus).toBe(true);
    expect(result.current.loginFields.find((f) => f.name === "email")?.value).toBe(
      "test@drs.com",
    );
    expect(
      result.current.loginFields.find((f) => f.name === "password")?.value,
    ).toBe("123456");
  });

  it("handleRemember guarda credenciales en localStorage", () => {
    const { result } = renderHook(() => useLogin());

    act(() => {
      result.current.handleRemember(true, "user@drs.com", "mypassword");
    });

    expect(localStorage.setItem).toHaveBeenCalledWith(
      "drs.remember.email",
      "user@drs.com",
    );
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "drs.remember.password",
      "mypassword",
    );
  });

  it("login exitoso redirige y guarda credenciales si rememberStatus = true", async () => {
    mockLogin.mockResolvedValueOnce({});
    const { result } = renderHook(() => useLogin({ push: pushMock } as any));

    act(() => {
      result.current.handleRemember(true);
    });

    await act(async () => {
      await result.current.handleLogin({
        email: "user@drs.com",
        password: "mypassword",
      });
    });

    expect(mockLogin).toHaveBeenCalledWith({
      email: "user@drs.com",
      password: "mypassword",
    });
    expect(pushMock).toHaveBeenCalledWith("/main-page");
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "drs.remember.email",
      "user@drs.com",
    );
  });

  it("login fallido muestra mensaje de error", async () => {
    mockLogin.mockRejectedValueOnce({
      response: { data: { error_Message: "Credenciales inválidas" } },
    });

    const { result } = renderHook(() => useLogin());

    await act(async () => {
      await result.current.handleLogin({ email: "wrong@drs.com", password: "bad" });
    });

    await waitFor(() => {
      expect(result.current.failMessage).toBe("Credenciales inválidas");
    });
  });

  it("usa error.message cuando el login rechaza con error normalizado", async () => {
    mockLogin.mockRejectedValueOnce({
      message: "Credenciales incorrectas",
    });

    const { result } = renderHook(() => useLogin());

    await act(async () => {
      await result.current.handleLogin({
        email: "wrong@drs.com",
        password: "bad",
      });
    });

    await waitFor(() => {
      expect(result.current.failMessage).toBe("Credenciales incorrectas");
    });
  });

  it("si el email es valido y hay un solo canal disponible inicia challenge y va a recovery-email", async () => {
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
      result.current.handleLoginValuesChange({ email: "user@drsecurity.net" });
    });

    await act(async () => {
      await result.current.handleForgotPassword();
    });

    expect(mockClearRecoverPasswordState).toHaveBeenCalledTimes(2);
    expect(mockFetchRecoverChannels).toHaveBeenCalledWith("user@drsecurity.net");
    expect(mockSetLookupData).toHaveBeenCalledWith(
      "user@drsecurity.net",
      channels,
    );
    expect(mockRecoverPassword).toHaveBeenCalledWith({
      email: "user@drsecurity.net",
      type: "Email",
    });
    expect(mockSetVerificationChallenge).toHaveBeenCalledTimes(1);
    expect(mockClearRecoverPasswordState).toHaveBeenCalledTimes(2);
    expect(pushMock).toHaveBeenCalledWith(
      "/login/recover-password/recovery-email/",
    );
  });

  it("si no hay email valido va directo a recover-password sin consumir el get", async () => {
    const { result } = renderHook(() => useLogin({ push: pushMock } as any));

    act(() => {
      result.current.handleLoginValuesChange({ email: "correo-invalido" });
    });

    await act(async () => {
      await result.current.handleForgotPassword();
    });

    expect(mockFetchRecoverChannels).not.toHaveBeenCalled();
    expect(mockClearFlow).toHaveBeenCalled();
    expect(pushMock).toHaveBeenCalledWith("/login/recover-password/");
  });

  it("si hay dos o mas canales mantiene la vista de seleccion de metodo", async () => {
    const channels = [
      { type: "Email", value: "us***@drsecurity.net" },
      { type: "SMS", value: "+52******1234" },
    ];
    mockFetchRecoverChannels.mockResolvedValueOnce(channels);

    const { result } = renderHook(() => useLogin({ push: pushMock } as any));

    act(() => {
      result.current.handleLoginValuesChange({ email: "user@drsecurity.net" });
    });

    await act(async () => {
      await result.current.handleForgotPassword();
    });

    expect(mockRecoverPassword).not.toHaveBeenCalled();
    expect(mockSetVerificationChallenge).not.toHaveBeenCalled();
    expect(pushMock).toHaveBeenCalledWith(
      "/login/recover-password/verification-method/",
    );
  });
});

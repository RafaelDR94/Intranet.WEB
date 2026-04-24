import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import useRecoverPassword from "./useRecoverPassword";

type MockState = {
  error: string | null;
  recoveringPassword: boolean;
  clearRecoverPasswordState: () => void;
  recoverPassword: (payload: unknown) => Promise<unknown>;
};

const mockClearRecoverPasswordState = vi.fn();
const mockRecoverPassword = vi.fn();
const mockSetSelectedMethod = vi.fn();
const mockSetVerificationChallenge = vi.fn();
let mockState: MockState;
let mockFlowState: any;

vi.mock("@/app/stores/useAuthStore/useAuthStore", () => ({
  useAuthStore: (selector: (state: MockState) => unknown) => selector(mockState),
}));

vi.mock("@/app/login/context/RecoverPasswordFlowContext", () => ({
  useRecoverPasswordFlow: () => mockFlowState,
}));

const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
} as unknown as ReturnType<typeof import("next/navigation").useRouter>;

describe("useRecoverPassword", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockState = {
      error: null,
      recoveringPassword: false,
      clearRecoverPasswordState: mockClearRecoverPasswordState,
      recoverPassword: mockRecoverPassword.mockResolvedValue(null),
    };

    mockFlowState = {
      email: "user@drsecurity.net",
      recoverChannels: [
        { type: "Email", value: "us***@drsecurity.net" },
        { type: "SMS", value: null },
      ],
      selectedMethod: "Email",
      setSelectedMethod: mockSetSelectedMethod,
      setVerificationChallenge: mockSetVerificationChallenge,
    };
  });

  it("devuelve isLoading=false al inicio", () => {
    const { result } = renderHook(() => useRecoverPassword(mockRouter));
    expect(result.current.isLoading).toBe(false);
  });

  it("filtra los canales nulos y deja seleccionado Email por default", () => {
    const { result } = renderHook(() => useRecoverPassword(mockRouter));

    expect(result.current.verificationOptions).toEqual([
      {
        value: "Email",
        title: "Correo electrónico",
        description: "Recibirás un código en tu correo corporativo",
        channelValue: "us***@drsecurity.net",
      },
    ]);
    expect(result.current.selectedChannelValue).toBe("us***@drsecurity.net");
  });

  it("handleRecover dispara recoverPassword con el email del contexto y el método", async () => {
    const { result } = renderHook(() => useRecoverPassword(mockRouter));

    await act(async () => {
      await result.current.handleRecover();
    });

    expect(mockRecoverPassword).toHaveBeenCalledTimes(1);
    expect(mockRecoverPassword).toHaveBeenCalledWith({
      email: "user@drsecurity.net",
      type: "Email",
    });
  });

  it("en éxito guarda el challenge en contexto y navega a recovery-email", async () => {
    mockRecoverPassword.mockResolvedValueOnce({
      type: "Email",
      challengeId: "uuid",
      emailMasked: "ka***@drsecurity.net",
      message: "Correo enviado",
      expiresInSeconds: 300,
      nextStep: "VerifyCode",
    });

    const { result } = renderHook(() => useRecoverPassword(mockRouter));

    await act(async () => {
      await result.current.handleRecover();
    });

    expect(mockSetVerificationChallenge).toHaveBeenCalledTimes(1);
    expect(mockClearRecoverPasswordState).toHaveBeenCalledTimes(1);
    expect(mockRouter.push).toHaveBeenCalledWith(
      "/login/recover-password/recovery-email/",
    );
  });

  it("en error expone el mensaje", () => {
    const { result, rerender } = renderHook(() => useRecoverPassword(mockRouter));

    mockState.error = "Service unavailable";
    rerender();

    expect(mockRouter.push).not.toHaveBeenCalled();
    expect(result.current.submitError).toBe("Service unavailable");
  });

  it("permite cambiar el método de verificación", () => {
    const { result } = renderHook(() => useRecoverPassword(mockRouter));

    act(() => {
      result.current.setSelectedMethod("SMS");
    });

    expect(mockSetSelectedMethod).toHaveBeenCalledWith("SMS");
  });
});

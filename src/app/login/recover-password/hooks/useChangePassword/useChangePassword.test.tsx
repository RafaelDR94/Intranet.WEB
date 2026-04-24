import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import useChangePassword from "./useChangePassword";

type MockState = {
  error: string | null;
  resettingPasswordRecovery: boolean;
  resetPasswordRecovery: (payload: unknown) => Promise<unknown>;
  resetFlags: () => void;
};

const mockResetFlags = vi.fn();
const mockResetPasswordRecovery = vi.fn();
const mockClearFlow = vi.fn();
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

describe("useChangePassword", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockState = {
      error: null,
      resettingPasswordRecovery: false,
      resetPasswordRecovery: mockResetPasswordRecovery.mockResolvedValue(null),
      resetFlags: mockResetFlags,
    };
    mockFlowState = {
      clearFlow: mockClearFlow,
      resetChallenge: { challengeId: "challenge-1" },
    };
  });

  it("inicia con submit deshabilitado", () => {
    const { result } = renderHook(() => useChangePassword(mockRouter));

    expect(result.current.canSubmit).toBe(false);
    expect(result.current.isSuccess).toBe(false);
  });

  it("envía el payload correcto cuando la contraseña cumple reglas", async () => {
    mockResetPasswordRecovery.mockResolvedValue({
      success: true,
      message: "Contraseña actualizada correctamente.",
    });

    const { result } = renderHook(() => useChangePassword(mockRouter));

    act(() => {
      result.current.setNewPassword("NuevaSegura123!");
      result.current.setConfirmPassword("NuevaSegura123!");
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(mockResetPasswordRecovery).toHaveBeenCalledWith({
      challengeId: "challenge-1",
      newPassword: "NuevaSegura123!",
      confirmPassword: "NuevaSegura123!",
    });
    expect(result.current.isSuccess).toBe(true);
  });

  it("reporta error si las contraseñas no coinciden", async () => {
    const { result } = renderHook(() => useChangePassword(mockRouter));

    act(() => {
      result.current.setNewPassword("NuevaSegura123!");
      result.current.setConfirmPassword("OtraSegura123!");
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(mockResetPasswordRecovery).not.toHaveBeenCalled();
    expect(result.current.submitError).toBe("Las contraseñas no coinciden.");
  });

  it("redirige al login desde la pantalla final y limpia el flujo", () => {
    const { result } = renderHook(() => useChangePassword(mockRouter));

    act(() => {
      result.current.handleGoToLogin();
    });

    expect(mockClearFlow).toHaveBeenCalledTimes(1);
    expect(mockRouter.push).toHaveBeenCalledWith("/login");
  });

  it("toma el error del store", () => {
    const { result, rerender } = renderHook(() => useChangePassword(mockRouter));

    mockState.error = "Error del servicio";
    rerender();

    expect(result.current.submitError).toBe("Error del servicio");
  });
});

// useRecoverPassword.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useRecoverPassword from "./useRecoverPassword";

// ---- Mocks del store (Zustand) ----
type MockState = {
  error: string | null;
  successRecoverPassword: boolean;
  recoveringPassword: boolean;
  resetFlags: () => void;
  recoverPassword: (p: any) => void;
};

const mockResetFlags = vi.fn();
const mockRecoverPassword = vi.fn();
let mockState: MockState;

vi.mock("@/app/stores/useAuthStore/useAuthStore", () => ({
  useAuthStore: (selector: (s: MockState) => any) => selector(mockState),
}));

// ---- Router mock (usamos el override del hook) ----
const mockRouter = {
  push: vi.fn(),
} as unknown as ReturnType<typeof import("next/navigation").useRouter>;

// ---- Tests ----
describe("useRecoverPassword", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockState = {
      error: null,
      successRecoverPassword: false,
      recoveringPassword: false,
      resetFlags: mockResetFlags,
      recoverPassword: mockRecoverPassword,
    };
  });

  it("devuelve isLoading=false al inicio", () => {
    const { result } = renderHook(() => useRecoverPassword(mockRouter));
    expect(result.current.isLoading).toBe(false);
  });

  it("handleRecover dispara recoverPassword con el email", async () => {
    const { result } = renderHook(() => useRecoverPassword(mockRouter));

    await act(async () => {
      await result.current.handleRecover({ email: "user@drsecurity.net" });
    });

    expect(mockRecoverPassword).toHaveBeenCalledTimes(1);
    expect(mockRecoverPassword).toHaveBeenCalledWith({
      username: "user@drsecurity.net",
    });

    // No afirmamos sobre isLoading aquí porque el efecto puede apagarlo de inmediato.
  });

  it("mientras recoveringPassword está activo, isLoading=true", () => {
    const { result, rerender } = renderHook(() => useRecoverPassword(mockRouter));

    mockResetFlags.mockClear();
    mockState.recoveringPassword = true;
    rerender();

    expect(result.current.isLoading).toBe(true);
    expect(mockResetFlags).not.toHaveBeenCalled();
  });

  it("en éxito navega con el email y resetea flags (una sola vez)", async () => {
    const { result, rerender } = renderHook(() => useRecoverPassword(mockRouter));

    // Simula envío para setear submittedEmail
    await act(async () => {
      await result.current.handleRecover({ email: "katherine@drsecurity.net" });
    });

    mockResetFlags.mockClear();
    mockRouter.push = vi.fn();

    // Termina con éxito
    mockState.recoveringPassword = false;
    mockState.error = null;
    mockState.successRecoverPassword = true;
    rerender();

    expect(mockRouter.push).toHaveBeenCalledTimes(1);
    expect(mockRouter.push).toHaveBeenCalledWith(
      "/login/recover-password/recovery-email/?email=katherine%40drsecurity.net"
    );
    expect(mockResetFlags).toHaveBeenCalledTimes(1);

    // Re-render para confirmar que didRedirectRef evita doble navegación
    rerender();
    expect(mockRouter.push).toHaveBeenCalledTimes(1);
  });

  it("en error resetea flags y no navega", () => {
    const { rerender } = renderHook(() => useRecoverPassword(mockRouter));

    mockResetFlags.mockClear();

    mockState.recoveringPassword = false;
    mockState.error = "Service unavailable";
    mockState.successRecoverPassword = false;
    rerender();

    expect(mockRouter.push).not.toHaveBeenCalled();
    expect(mockResetFlags).toHaveBeenCalledTimes(1);
  });

  it("si termina sin éxito ni error, limpia flags (edge case)", () => {
    const { rerender } = renderHook(() => useRecoverPassword(mockRouter));

    // Simula que estuvo en curso y luego terminó sin éxito ni error
    mockState.recoveringPassword = true;
    rerender();

    mockResetFlags.mockClear();

    mockState.recoveringPassword = false;
    mockState.error = null;
    mockState.successRecoverPassword = false;
    rerender();

    expect(mockResetFlags).toHaveBeenCalledTimes(1);
  });
});

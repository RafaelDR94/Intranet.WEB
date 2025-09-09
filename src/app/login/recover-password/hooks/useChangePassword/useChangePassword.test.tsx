// useChangePassword.test.tsx
import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import useChangePassword from "./useChangePassword";

// ---- Mocks de dependencias ----
const mockShowAlert = vi.fn();
const mockHideAlert = vi.fn();
vi.mock("@/app/context/PrincipalContext/PrincipalContext", () => ({
  usePrincipal: () => ({
    usePrincipalAlert: {
      showAlert: mockShowAlert,
      hideAlert: mockHideAlert,
    },
  }),
}));

type MockState = {
  error: string | null;
  successRecoverPassword: boolean;
  recoveringPassword: boolean;
  resetFlags: () => void;
  changePassword: (p: any) => void;
};

const mockResetFlags = vi.fn();
const mockChangePassword = vi.fn();
let mockState: MockState;

vi.mock("@/app/stores/useAuthStore/useAuthStore", () => ({
  useAuthStore: (selector: (s: MockState) => any) => selector(mockState),
}));

const makeSearchParams = (email: string) =>
  ({
    get: (key: string) => (key === "user" ? email : null),
  } as unknown as ReturnType<typeof import("next/navigation").useSearchParams>);

const mockRouter = {
  push: vi.fn(),
} as unknown as ReturnType<typeof import("next/navigation").useRouter>;

// ---- Tests ----
describe("useChangePassword", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockState = {
      error: null,
      successRecoverPassword: false,
      recoveringPassword: false,
      resetFlags: mockResetFlags,
      changePassword: mockChangePassword,
    };
  });

  it("devuelve estado inicial con isLoading=false", () => {
    const { result } = renderHook(() =>
      useChangePassword(mockRouter, makeSearchParams("user@test.com"))
    );
    expect(result.current.isLoading).toBe(false);
  });

  it("muestra alerta y NO llama changePassword si las contraseñas no coinciden", async () => {
    const { result } = renderHook(() =>
      useChangePassword(mockRouter, makeSearchParams("user@test.com"))
    );

    await act(async () => {
      await result.current.handleChange({
        newPassword: "abc123",
        confirmPassword: "xyz987",
      });
    });

    expect(mockShowAlert).toHaveBeenCalledTimes(1);
    expect(mockChangePassword).not.toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
  });

  it("llama changePassword con el payload correcto cuando las contraseñas coinciden", async () => {
    const email = "katherine@drsecurity.net";
    const { result } = renderHook(() =>
      useChangePassword(mockRouter, makeSearchParams(email))
    );

    await act(async () => {
      await result.current.handleChange({
        newPassword: "segura123",
        confirmPassword: "segura123",
      });
    });

    expect(mockShowAlert).not.toHaveBeenCalled();
    expect(mockChangePassword).toHaveBeenCalledTimes(1);
    expect(mockChangePassword).toHaveBeenCalledWith({
      email,
      newPassword: "segura123",
      changePassword: true,
    });
    expect(result.current.isLoading).toBe(true);
  });

  it("usa el email proveniente de searchParams", async () => {
    const email = "desde-searchparams@example.com";
    const { result } = renderHook(() =>
      useChangePassword(mockRouter, makeSearchParams(email))
    );

    await act(async () => {
      await result.current.handleChange({
        newPassword: "abc123",
        confirmPassword: "abc123",
      });
    });

    expect(mockChangePassword).toHaveBeenCalledWith(
      expect.objectContaining({ email })
    );
  });

  it("ejecuta resetFlags cuando cambian los flags (error)", () => {
    const { rerender } = renderHook(() =>
      useChangePassword(mockRouter, makeSearchParams("u@test.com"))
    );

    // El efecto del mount ya llamó resetFlags(); limpiamos para contar SOLO el cambio
    mockResetFlags.mockClear();

    mockState.error = "Algo salió mal";
    rerender();

    expect(mockResetFlags).toHaveBeenCalledTimes(1);
  });

  it("ejecuta resetFlags cuando cambian los flags (successRecoverPassword)", () => {
    const { rerender } = renderHook(() =>
      useChangePassword(mockRouter, makeSearchParams("u@test.com"))
    );

    // El efecto del mount ya llamó resetFlags(); limpiamos para contar SOLO el cambio
    mockResetFlags.mockClear();

    mockState.successRecoverPassword = true;
    rerender();

    expect(mockResetFlags).toHaveBeenCalledTimes(1);
  });

  it("no hace nada en el efecto si recoveringPassword está activo", () => {
    // Inicializamos el estado con recoveringPassword = true ANTES del render
    mockState.recoveringPassword = true;

    renderHook(() =>
      useChangePassword(mockRouter, makeSearchParams("u@test.com"))
    );

    expect(mockResetFlags).not.toHaveBeenCalled();
  });
});

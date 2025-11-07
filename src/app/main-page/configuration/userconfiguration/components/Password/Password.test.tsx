import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import Password from "./Password";

const mockShowAlert = vi.fn();
const mockWithLoading = vi.fn(async (task: () => Promise<unknown> | unknown) => {
  return await task();
});

const mockChangePassword = vi.fn();
const mockResetFlags = vi.fn();

const dynamicFormMock = vi.hoisted(() => {
  const mock = vi.fn();
  mock.displayName = "DynamicFormMock";
  return mock;
});

type MockAuthState = {
  user: { email?: string; password?: string } | null;
  changePassword: typeof mockChangePassword;
  successChangePassword: boolean;
  error?: string;
  resetFlags: typeof mockResetFlags;
};

vi.mock("@/app/context/PrincipalContext/PrincipalContext", () => ({
  usePrincipal: () => ({
    usePrincipalLoading: { withLoading: mockWithLoading },
    usePrincipalAlert: { showAlert: mockShowAlert },
  }),
}));

let mockState: MockAuthState;

vi.mock("@/app/stores/useAuthStore/useAuthStore", () => ({
  useAuthStore: (selector: (state: MockAuthState) => any) => selector(mockState),
}));

let formValues: Record<string, any> = {
  newPassword: "Seguro123",
  confirmPassword: "Seguro123",
};

vi.mock("@/app/components/DynamicForm/DynamicForm", () => ({
  __esModule: true,
  default: dynamicFormMock,
  DynamicForm: dynamicFormMock,
}));

describe("User configuration password card", () => {
  beforeEach(() => {
    mockState = {
      user: { email: "user@test.com", password: "ClaveSecreta1" },
      changePassword: mockChangePassword,
      successChangePassword: false,
      error: undefined,
      resetFlags: mockResetFlags,
    };
    formValues = {
      newPassword: "Seguro123",
      confirmPassword: "Seguro123",
    };
    vi.clearAllMocks();
    dynamicFormMock.mockImplementation((props: any) => (
      <div>
        <button type="button" onClick={() => props.onSubmit(formValues)}>
          {props.submitLabel}
        </button>
      </div>
    ));
  });

  it("envía el payload correcto cuando las contraseñas coinciden", async () => {
    render(<Password />);

    expect(screen.getByText(/contraseña actual/i)).toBeInTheDocument();
    expect(dynamicFormMock).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: /cambiar contraseña/i }));

    expect(dynamicFormMock).toHaveBeenCalledTimes(1);

    const submitButton = await screen.findByRole("button", {
      name: /guardar contraseña/i,
    });
    fireEvent.click(submitButton);

    expect(mockWithLoading).toHaveBeenCalledTimes(1);
    expect(mockChangePassword).toHaveBeenCalledWith({
      email: "user@test.com",
      newPassword: "Seguro123",
      changePassword: true,
    });
    expect(mockShowAlert).not.toHaveBeenCalled();
  });

  it("muestra una alerta cuando las contraseñas no coinciden", async () => {
    formValues = {
      newPassword: "Seguro123",
      confirmPassword: "OtraClave",
    };

    render(<Password />);

    fireEvent.click(screen.getByRole("button", { name: /cambiar contraseña/i }));
    const submitButton = await screen.findByRole("button", {
      name: /guardar contraseña/i,
    });
    fireEvent.click(submitButton);

    expect(mockShowAlert).toHaveBeenCalled();
    expect(mockChangePassword).not.toHaveBeenCalled();
    expect(mockWithLoading).not.toHaveBeenCalled();
  });

  it("muestra una alerta si no existe email disponible", async () => {
    mockState.user = null;

    render(<Password />);

    fireEvent.click(screen.getByRole("button", { name: /cambiar contraseña/i }));
    const submitButton = await screen.findByRole("button", {
      name: /guardar contraseña/i,
    });
    fireEvent.click(submitButton);

    expect(mockShowAlert).toHaveBeenCalled();
    expect(mockChangePassword).not.toHaveBeenCalled();
  });

  it("reinicia el formulario cuando la operación es exitosa", () => {
    const { rerender } = render(<Password />);

    fireEvent.click(screen.getByRole("button", { name: /cambiar contraseña/i }));

    expect(dynamicFormMock).toHaveBeenCalledTimes(1);
    const initialProps = dynamicFormMock.mock.calls[0][0];
    expect(initialProps.valuesVersion).toBe(0);

    mockState.successChangePassword = true;

    act(() => {
      rerender(<Password />);
    });

    expect(mockShowAlert).toHaveBeenCalled();
    expect(mockResetFlags).toHaveBeenCalled();

    expect(screen.getByRole("button", { name: /cambiar contraseña/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /cambiar contraseña/i }));

    const lastProps = dynamicFormMock.mock.calls.at(-1)?.[0];
    expect(lastProps?.valuesVersion).toBeGreaterThan(0);
  });

  it("muestra la alerta de error cuando la actualización falla", () => {
    mockState.error = "Ocurrió un error";

    render(<Password />);

    expect(mockShowAlert).toHaveBeenCalledWith(
      expect.objectContaining({
        title: expect.stringMatching(/no se pudo actualizar la contraseña/i),
      })
    );
    expect(mockResetFlags).toHaveBeenCalled();
  });
});

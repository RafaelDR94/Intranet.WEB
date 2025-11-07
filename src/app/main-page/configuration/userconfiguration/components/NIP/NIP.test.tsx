import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import Nip from "./NIP";

const mockShowAlert = vi.fn();
const mockWithLoading = vi.fn(async (task: () => Promise<unknown> | unknown) => {
  return await task();
});

const mockChangeNip = vi.fn();
const mockResetFlags = vi.fn();

const dynamicFormMock = vi.hoisted(() => {
  const mock = vi.fn();
  mock.displayName = "DynamicFormMock";
  return mock;
});

type MockAuthState = {
  user: { idUser?: string } | null;
  changeNip: typeof mockChangeNip;
  successChangeNIP: boolean;
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

let formValues: Record<string, any> = { nip: "1234" };

vi.mock("@/app/components/DynamicForm/DynamicForm", () => ({
  __esModule: true,
  default: dynamicFormMock,
  DynamicForm: dynamicFormMock,
}));

describe("User configuration NIP card", () => {
  beforeEach(() => {
    mockState = {
      user: { idUser: "15" },
      changeNip: mockChangeNip,
      successChangeNIP: false,
      error: undefined,
      resetFlags: mockResetFlags,
    };
    formValues = { nip: "1234" };
    vi.clearAllMocks();
    mockChangeNip.mockResolvedValue(undefined);
    mockWithLoading.mockImplementation(async (task: () => any) => task());
    dynamicFormMock.mockImplementation((props: any) => (
      <div>
        <button type="button" onClick={() => props.onSubmit(formValues)}>
          {props.submitLabel}
        </button>
      </div>
    ));
  });

  it("envía el payload correcto cuando el NIP es válido", async () => {
    render(<Nip />);

    const props = dynamicFormMock.mock.calls.at(-1)?.[0];
    expect(props?.onSubmit).toBeDefined();

    await act(async () => {
      await props?.onSubmit(formValues);
    });

    expect(mockChangeNip).toHaveBeenCalledWith({ idUser: 15, nip: "1234" });
  });

  it("muestra una alerta si el id del usuario no está disponible", () => {
    mockState.user = null;

    render(<Nip />);

    fireEvent.click(screen.getByRole("button", { name: /guardar nip/i }));

    expect(mockShowAlert).toHaveBeenCalled();
    expect(mockChangeNip).not.toHaveBeenCalled();
  });

  it("muestra una alerta cuando el NIP no tiene 4 dígitos", () => {
    formValues = { nip: "12" };

    render(<Nip />);

    fireEvent.click(screen.getByRole("button", { name: /guardar nip/i }));

    expect(mockShowAlert).toHaveBeenCalled();
    expect(mockChangeNip).not.toHaveBeenCalled();
  });

  it("reinicia el formulario cuando la operación es exitosa", () => {
    const { rerender } = render(<Nip />);

    const initialProps = dynamicFormMock.mock.calls[0][0];
    expect(initialProps.valuesVersion).toBe(0);

    mockState.successChangeNIP = true;

    act(() => {
      rerender(<Nip />);
    });

    expect(mockShowAlert).toHaveBeenCalled();
    expect(mockResetFlags).toHaveBeenCalled();
    const lastProps = dynamicFormMock.mock.calls.at(-1)?.[0];
    expect(lastProps?.valuesVersion).toBeGreaterThan(0);
  });

  it("muestra la alerta de error cuando la actualización falla", () => {
    mockState.error = "Error";

    render(<Nip />);

    expect(mockShowAlert).toHaveBeenCalledWith(
      expect.objectContaining({
        title: expect.stringMatching(/no se pudo actualizar el nip/i),
      })
    );
    expect(mockResetFlags).toHaveBeenCalled();
  });
});

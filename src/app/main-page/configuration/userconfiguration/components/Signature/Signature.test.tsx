import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import Signature from "./Signature";

type MockAuthState = {
  user: { idEmployee?: string; signature?: string } | null;
  signature?: string;
};

let mockState: MockAuthState;

const signatureComponentMock = vi.hoisted(() => vi.fn());

vi.mock("@/app/stores/useAuthStore/useAuthStore", () => ({
  useAuthStore: (selector: (state: MockAuthState) => any) => selector(mockState),
}));

vi.mock("@/app/components/SignatureComponent/SignatureComponent", () => ({
  __esModule: true,
  default: signatureComponentMock,
}));

describe("User configuration signature card", () => {
  beforeEach(() => {
    mockState = {
      user: {
        idEmployee: "99",
        signature: "data:image/png;base64,old",
      },
      signature: undefined,
    };
    vi.clearAllMocks();
    signatureComponentMock.mockImplementation(({ children }: any) => (
      <div data-testid="signature-component">{children}</div>
    ));
  });

  it("muestra la firma existente del usuario", () => {
    render(<Signature />);

    const image = screen.getByAltText(/firma digital/i) as HTMLImageElement;
    expect(image.src).toContain("data:image/png;base64,old");
  });

  it("muestra el placeholder cuando no existe firma", () => {
    mockState.user = { idEmployee: "99" };

    render(<Signature />);

    expect(screen.getByText(/aún no tienes una firma registrada/i)).toBeInTheDocument();
  });

  it("habilita el modal de firma cuando se da clic en actualizar", () => {
    render(<Signature />);

    fireEvent.click(screen.getByRole("button", { name: /actualizar firma/i }));

    const lastCall = signatureComponentMock.mock.calls.at(-1)?.[0];
    expect(lastCall?.open).toBe(true);
    expect(lastCall?.responsibleGuid).toBe("99");
  });

  it("actualiza la vista previa cuando se recibe una nueva firma", () => {
    render(<Signature />);

    const props = signatureComponentMock.mock.calls.at(-1)?.[0];
    expect(props).toBeDefined();

    act(() => {
      props?.onAuthorization?.({ state: true, signature: "data:image/png;base64,new" });
    });

    const image = screen.getByAltText(/firma digital/i) as HTMLImageElement;
    expect(image.src).toContain("data:image/png;base64,new");
  });

  it("deshabilita el botón cuando no existe id del empleado", () => {
    mockState.user = { idEmployee: "" };

    render(<Signature />);

    expect(screen.getByRole("button", { name: /actualizar firma/i })).toBeDisabled();
  });
});

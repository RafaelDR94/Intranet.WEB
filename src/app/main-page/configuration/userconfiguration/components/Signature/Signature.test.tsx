import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";

// 🧩 Mocks explícitos de componentes e íconos
vi.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} data-testid="mocked-image" />
  ),
}));

vi.mock("@/app/components/Button/Button", () => ({
  Button: ({ children, onClick, disabled }: any) => (
    <button onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
}));

vi.mock("@/app/components/SignatureComponent/SignatureComponent", () => ({
  __esModule: true,
  default: ({ open, onClose, onAuthorization }: any) => (
    <div data-testid="signature-component">
      {open ? (
        <>
          <p>Signature Component Opened</p>
          <button onClick={onClose}>Close</button>
          <button
            onClick={() =>
              onAuthorization({ signature: "https://test-signature.png" })
            }
          >
            Authorize
          </button>
        </>
      ) : (
        <p>Signature Component Closed</p>
      )}
    </div>
  ),
}));

// 🧠 Mock del store Zustand
type MockAuthState = {
  user: { idEmployee?: string; signature?: string } | null;
  signature: string;
};

let mockState: MockAuthState;

const useAuthStoreMock = vi.fn(
  (selector?: (state: MockAuthState) => unknown) =>
    typeof selector === "function" ? selector(mockState) : mockState,
);

vi.mock("@/app/stores/useAuthStore/useAuthStore", () => ({
  useAuthStore: (selector?: (state: MockAuthState) => unknown) =>
    useAuthStoreMock(selector),
}));
import Signature from "./Signature";

// 🧹 Limpieza antes de cada test
beforeEach(() => {
  mockState = {
    user: { idEmployee: "123", signature: "" },
    signature: "",
  };
  vi.clearAllMocks();
  useAuthStoreMock.mockClear();
});

describe("Signature component", () => {
  it("muestra el mensaje cuando no hay firma registrada", () => {
    render(<Signature />);

    expect(
      screen.getByText("Aún no tienes una firma registrada.")
    ).toBeInTheDocument();
    expect(screen.getByText("Actualizar Firma")).toBeEnabled();
  });

  it("renderiza la imagen cuando existe una firma", () => {
    mockState = {
      user: { idEmployee: "123", signature: "https://firma.png" },
      signature: "",
    };

    render(<Signature />);

    const img = screen.getByTestId("mocked-image");
    expect(img).toHaveAttribute("src", "https://firma.png");
  });

  it("deshabilita el botón si el usuario no tiene idEmployee", () => {
    mockState = {
      user: { idEmployee: undefined },
      signature: "",
    };

    render(<Signature />);
    const button = screen.getByText("Actualizar Firma");
    expect(button).toBeDisabled();
  });

  it("abre el componente de firma al hacer clic en el botón", () => {
    mockState = {
      user: { idEmployee: "456", signature: "" },
      signature: "",
    };

    render(<Signature />);
    const button = screen.getByText("Actualizar Firma");

    fireEvent.click(button);
    expect(screen.getByText("Signature Component Opened")).toBeInTheDocument();
  });

  it("actualiza la vista previa después de la autorización", () => {
    mockState = {
      user: { idEmployee: "789", signature: "" },
      signature: "",
    };

    render(<Signature />);

    fireEvent.click(screen.getByText("Actualizar Firma"));
    fireEvent.click(screen.getByText("Authorize"));

    const img = screen.getByTestId("mocked-image");
    expect(img).toHaveAttribute("src", "https://test-signature.png");
  });

  it("cierra el modal al presionar 'Close'", () => {
    mockState = {
      user: { idEmployee: "789", signature: "" },
      signature: "",
    };

    render(<Signature />);

    fireEvent.click(screen.getByText("Actualizar Firma"));
    expect(screen.getByText("Signature Component Opened")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Close"));
    expect(screen.getByText("Signature Component Closed")).toBeInTheDocument();
  });
});

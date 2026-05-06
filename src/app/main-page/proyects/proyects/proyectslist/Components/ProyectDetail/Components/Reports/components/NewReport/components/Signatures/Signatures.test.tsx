import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import Signatures from "./Signatures";

const hookState = {
  openSignaturePopUp: false,
  openClientSignaturePopUp: false,
  clientSignature: null as any,
  userSignature: "",
  user: { fullName: "Laura Campos", idEmployee: "EMP-1" },
  handleAuthorization: vi.fn(),
  handleClientAuthorization: vi.fn(),
  handleClick: vi.fn(),
  setOpenSignaturePopUp: vi.fn(),
  setOpenClientSignaturePopUp: vi.fn(),
};

vi.mock("./hooks/useSignatures", () => ({
  __esModule: true,
  default: () => hookState,
}));

vi.mock("@/app/components/Button/Button", () => ({
  Button: ({ children, onClick, ...rest }: any) => (
    <button type="button" onClick={onClick} {...rest}>
      {children}
    </button>
  ),
}));

vi.mock("@/app/components/SignatureComponent/SignatureComponent", () => ({
  __esModule: true,
  default: (props: any) => (
    <div data-testid={`signature-component-${props.externalSignature ? "client" : "employee"}`}>
      <button type="button" onClick={() => props.onAuthorization?.({ signature: "data", state: true })}>
        autorizar
      </button>
    </div>
  ),
}));

vi.mock("@/app/components/SignatureBox/SignatureBox", () => ({
  __esModule: true,
  default: (props: any) => (
    <div data-testid="signature-box" data-title={props.title}>
      {props.imageUrl}
    </div>
  ),
}));

vi.mock("@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery", () => ({
  useIsMobile: () => false,
}));

describe("Signatures", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    hookState.openSignaturePopUp = false;
    hookState.openClientSignaturePopUp = false;
    hookState.clientSignature = null;
    hookState.userSignature = "";
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renderiza boton para firmar cuando no existe firma previa", () => {
    render(<Signatures isSaveValid={false} />);

    expect(screen.queryAllByTestId("signature-box")).toHaveLength(0);
    fireEvent.click(screen.getByText(/Click para firmar/i));
    expect(hookState.handleClick).toHaveBeenCalled();
  });

  it("muestra firmas existentes y ajusta el CTA para la firma del cliente", () => {
    hookState.userSignature = "https://cdn.example.com/user.png";
    hookState.clientSignature = {
      signature: "https://cdn.example.com/client.png",
      external: { name: "Cliente Demo", workposition: "Supervisor" },
    };

    render(<Signatures isSaveValid={true} />);

    const boxes = screen.getAllByTestId("signature-box");
    expect(boxes).toHaveLength(2);
    expect(boxes[0]).toHaveAttribute("data-title", hookState.user.fullName);
    expect(boxes[1]).toHaveAttribute("data-title", hookState.clientSignature.external.name);
    expect(screen.queryByText(/Click para firma del cliente/i)).toBeNull();
  });

  it("incluye los componentes de captura para empleado y cliente", () => {
    render(<Signatures isSaveValid={true} />);

    expect(screen.getByTestId("signature-component-employee")).toBeInTheDocument();
    expect(screen.getByTestId("signature-component-client")).toBeInTheDocument();
  });
});

import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import RefactionsForm from "./RefactionsForm";
import { RefactionFormValues } from "./hooks/useRefactionForm";

const hookState = {
  values: {
    description: "",
    brand: "",
    model: "",
    serialnumber: "",
    partnumber: "",
  } as RefactionFormValues,
  setValues: vi.fn(),
  isValid: true,
  setIsValid: vi.fn(),
  submitRef: { current: vi.fn() },
  handleSubmit: vi.fn(),
};

const dynamicFormSpy = vi.fn();

vi.mock("./hooks/useRefactionForm", () => ({
  __esModule: true,
  default: () => hookState,
}));

vi.mock("@/app/components/Button/Button", () => ({
  Button: ({ children, onClick, disabled }: any) => (
    <button type="button" data-disabled={disabled ? "true" : "false"} onClick={onClick}>
      {children}
    </button>
  ),
}));

vi.mock("@/app/components/DynamicForm/DynamicForm", () => ({
  __esModule: true,
  default: (props: any) => {
    dynamicFormSpy(props);
    return <form data-testid="refaction-dynamic-form" />;
  },
}));

describe("RefactionsForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    hookState.isValid = true;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("omite el render cuando no hay refaccion seleccionada", () => {
    const { container } = render(
      <RefactionsForm selectedRowId={null} onClose={vi.fn()} onSaved={vi.fn()} />
    );

    expect(container.firstChild).toBeNull();
  });

  it("renderiza el formulario y delega los eventos principales", () => {
    const onClose = vi.fn();
    const onSaved = vi.fn();

    render(<RefactionsForm selectedRowId="__new__" onClose={onClose} onSaved={onSaved} />);

    expect(screen.getByTestId("refaction-dynamic-form")).toBeInTheDocument();
    expect(dynamicFormSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        onSubmit: hookState.handleSubmit,
        externalSubmitRef: hookState.submitRef,
      })
    );

    fireEvent.click(screen.getByText(/Cancelar/i));
    expect(onClose).toHaveBeenCalled();

    fireEvent.click(screen.getByText(/Guardar refacción/i));
    expect(hookState.submitRef.current).toHaveBeenCalled();
  });

  it("deshabilita el boton principal cuando el formulario no es valido", () => {
    hookState.isValid = false;

    render(<RefactionsForm selectedRowId="__new__" onClose={vi.fn()} />);

    expect(screen.getByText(/Guardar refacción/i)).toHaveAttribute("data-disabled", "true");
  });
});

import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import DevicesForm from "./DevicesForm";

const hookState = {
  values: { brand: "", model: "", serialnumber: "" },
  setValues: vi.fn(),
  isValid: true,
  setIsValid: vi.fn(),
  submitting: false,
  submitRef: { current: null as null | (() => void | Promise<void>) },
  handleSubmit: vi.fn(),
  title: "Registrar equipo",
  description: "Completa la informacion.",
};

const dynamicFormSpy = vi.fn();

vi.mock("./hooks/useDeviceForm", () => ({
  __esModule: true,
  useDeviceForm: () => hookState,
}));

vi.mock("@/app/components/Button/Button", () => ({
  Button: ({ children, onClick, disabled }: any) => (
    <button
      type="button"
      data-disabled={disabled ? "true" : "false"}
      onClick={onClick}
    >
      {children}
    </button>
  ),
}));

vi.mock("@/app/components/DynamicForm/DynamicForm", () => ({
  __esModule: true,
  default: (props: any) => {
    dynamicFormSpy(props);
    return <form data-testid="devices-dynamic-form" />;
  },
}));

describe("DevicesForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    hookState.isValid = true;
    hookState.submitting = false;
    hookState.submitRef.current = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("no se renderiza cuando no existe un id seleccionado", () => {
    const { container } = render(
      <DevicesForm selectedRowId={null} onClose={vi.fn()} />
    );

    expect(container.firstChild).toBeNull();
  });

  it("renderiza el formulario y delega acciones de guardado/cancelacion", () => {
    const onClose = vi.fn();

    render(
      <DevicesForm selectedRowId="__new__" onClose={onClose} onSaved={vi.fn()} />
    );

    expect(screen.getByTestId("devices-dynamic-form")).toBeInTheDocument();
    expect(dynamicFormSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        dataTestId: "devices-form",
        onSubmit: hookState.handleSubmit,
        externalSubmitRef: hookState.submitRef,
      })
    );

    fireEvent.click(screen.getByText("Cancelar"));
    expect(onClose).toHaveBeenCalled();

    fireEvent.click(screen.getByText(/guardar/i));
    expect(hookState.submitRef.current).toHaveBeenCalled();
  });

  it("deshabilita el boton de guardado cuando el formulario es invalido", () => {
    hookState.isValid = false;

    render(<DevicesForm selectedRowId="__new__" onClose={vi.fn()} />);

    expect(screen.getByText(/guardar equipo/i)).toHaveAttribute("data-disabled", "true");
  });
});

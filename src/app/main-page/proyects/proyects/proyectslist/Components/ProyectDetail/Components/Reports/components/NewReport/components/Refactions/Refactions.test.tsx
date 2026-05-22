import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

import Refactions, { NEW_REFACTION_ID } from "./Refactions";

const listSpy = vi.fn();
const formSpy = vi.fn();

vi.mock("./Components/RefactionsList/RefactionsList", () => ({
  __esModule: true,
  default: (props: any) => {
    listSpy(props);
    return (
      <div data-testid="refactions-list">
        <button type="button" onClick={() => props.onCreate()}>
          crear
        </button>
        <button type="button" onClick={() => props.onEdit("1")}>
          editar
        </button>
      </div>
    );
  },
}));

vi.mock("./Components/ReportRefactionsCrudForm/ReportRefactionsCrudForm", () => ({
  __esModule: true,
  default: (props: any) => {
    formSpy(props);
    return (
      <div data-testid="refactions-form">
        <button type="button" onClick={() => props.onSaved?.()}>
          guardar
        </button>
        <button type="button" onClick={() => props.onClose()}>
          cerrar
        </button>
      </div>
    );
  },
}));

describe("Refactions", () => {
  it("renderiza la lista por defecto", () => {
    render(<Refactions />);

    expect(screen.getByTestId("refactions-list")).toBeInTheDocument();
    expect(listSpy).toHaveBeenCalled();
    expect(screen.queryByTestId("refactions-form")).toBeNull();
  });

  it("muestra el formulario para crear una refaccion y vuelve a la lista al finalizar", () => {
    render(<Refactions />);

    fireEvent.click(screen.getByText("crear"));

    expect(screen.getByTestId("refactions-form")).toBeInTheDocument();
    expect(formSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        selectedRowId: NEW_REFACTION_ID,
      })
    );

    fireEvent.click(screen.getByText("guardar"));
    expect(screen.getByTestId("refactions-list")).toBeInTheDocument();
  });

  it("permite editar una refaccion existente", () => {
    render(<Refactions />);

    fireEvent.click(screen.getByText("editar"));
    expect(formSpy).toHaveBeenLastCalledWith(expect.objectContaining({ selectedRowId: "1" }));

    fireEvent.click(screen.getByText("cerrar"));
    expect(screen.getByTestId("refactions-list")).toBeInTheDocument();
  });
});

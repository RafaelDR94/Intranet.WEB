import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

import { EditableViaticsTable } from "./EditableViaticsTable";
import { EditableViaticsRow } from "./types";

const rows: EditableViaticsRow[] = [
  {
    id: "1",
    concept: "Renta de automóvil",
    nationalQuoted: "00",
    foreignQuoted: "00",
    people: "00",
    days: "00",
    subtotal: "00",
    observations: "Escribe aquí",
  },
  {
    id: "2",
    concept: "Boleto de autobús",
    nationalQuoted: "600",
    foreignQuoted: "00",
    people: "2",
    days: "2",
    subtotal: "2,400",
    observations: "ida y vuelta",
  },
];

describe("EditableViaticsTable", () => {
  it("renderiza encabezados y filas", () => {
    render(
      <EditableViaticsTable defaultValue={rows} dataTestId="viatics-table" />,
    );
    expect(screen.getByTestId("viatics-table")).toHaveClass(
      "bg-white-100",
      "rounded-lg",
    );
    expect(screen.getByText("Concepto")).toBeInTheDocument();
    expect(screen.getByText("Renta de automóvil")).toBeInTheDocument();
  });

  it("actualiza una celda y emite onChange", () => {
    const onChange = vi.fn();
    render(<EditableViaticsTable defaultValue={rows} onChange={onChange} />);

    const input = screen.getByLabelText("Renta de automóvil-nationalQuoted");
    fireEvent.change(input, { target: { value: "900" } });

    expect(onChange).toHaveBeenCalled();
    const nextRows = onChange.mock.calls.at(-1)?.[0] as EditableViaticsRow[];
    expect(nextRows[0].nationalQuoted).toBe("900");
  });

  it("permite escribir en la celda de subtotal y emite onChange", () => {
    const onChange = vi.fn();
    render(<EditableViaticsTable defaultValue={rows} onChange={onChange} />);

    const input = screen.getByLabelText(/Renta de autom.vil-subtotal/);
    fireEvent.change(input, { target: { value: "1500" } });

    expect(onChange).toHaveBeenCalled();
    const nextRows = onChange.mock.calls.at(-1)?.[0] as EditableViaticsRow[];
    expect(nextRows[0].subtotal).toBe("1500");
  });

  it("calcula subtotal desde la columna subtotal", () => {
    render(<EditableViaticsTable defaultValue={rows} />);
    expect(screen.getAllByText("2,400")).toHaveLength(2);
  });

  it("dispara onBlurCell con contexto de fila y campo", () => {
    const onBlurCell = vi.fn();
    render(
      <EditableViaticsTable defaultValue={rows} onBlurCell={onBlurCell} />,
    );

    const input = screen.getByLabelText("Boleto de autobús-observations");
    fireEvent.change(input, { target: { value: "actualizado" } });
    fireEvent.blur(input);

    expect(onBlurCell).toHaveBeenCalledWith("2", "observations", "actualizado");
  });

  it("limpia valores vacíos visuales al enfocar y los restaura al salir vacíos", async () => {
    render(<EditableViaticsTable defaultValue={rows} />);

    const amountInput = screen.getByLabelText(
      "Renta de automóvil-nationalQuoted",
    ) as HTMLInputElement;
    const observationInput = screen.getByLabelText(
      "Renta de automóvil-observations",
    ) as HTMLInputElement;

    fireEvent.focus(amountInput);
    await waitFor(() => expect(amountInput.value).toBe(""));

    fireEvent.blur(screen.getByLabelText("Renta de automóvil-nationalQuoted"));
    await waitFor(() =>
      expect(
        (
          screen.getByLabelText(
            "Renta de automóvil-nationalQuoted",
          ) as HTMLInputElement
        ).value,
      ).toBe("00"),
    );

    fireEvent.focus(observationInput);
    await waitFor(() => expect(observationInput.value).toBe(""));

    fireEvent.blur(screen.getByLabelText("Renta de automóvil-observations"));
    await waitFor(() =>
      expect(
        (
          screen.getByLabelText(
            "Renta de automóvil-observations",
          ) as HTMLInputElement
        ).value,
      ).toBe("Escribe aquí"),
    );
  });

  it("mantiene valores capturados al enfocar", () => {
    render(<EditableViaticsTable defaultValue={rows} />);

    const amountInput = screen.getByLabelText(
      "Boleto de autobús-nationalQuoted",
    ) as HTMLInputElement;
    const observationInput = screen.getByLabelText(
      "Boleto de autobús-observations",
    ) as HTMLInputElement;

    fireEvent.focus(amountInput);
    fireEvent.focus(observationInput);

    expect(amountInput.value).toBe("600");
    expect(observationInput.value).toBe("ida y vuelta");
  });

  it("agrega una fila con un concepto personalizado", () => {
    const onChange = vi.fn();
    render(<EditableViaticsTable defaultValue={rows} onChange={onChange} />);

    fireEvent.click(screen.getByText("Agregar otro concepto"));
    fireEvent.change(screen.getByLabelText("Nuevo concepto"), {
      target: { value: "Casetas" },
    });
    fireEvent.click(screen.getByLabelText("Confirmar concepto"));

    expect(onChange).toHaveBeenCalled();
    const nextRows = onChange.mock.calls.at(-1)?.[0] as EditableViaticsRow[];
    expect(nextRows.at(-1)).toMatchObject({
      concept: "Casetas",
      nationalQuoted: "00",
      foreignQuoted: "00",
      people: "00",
      days: "00",
      subtotal: "00",
      observations: "Escribe aquí",
    });
    expect(screen.getByText("Casetas")).toBeInTheDocument();
  });

  it("oculta la accion de agregar concepto en modo lectura", () => {
    render(<EditableViaticsTable defaultValue={rows} readOnly />);

    expect(screen.queryByText("Agregar otro concepto")).not.toBeInTheDocument();
  });
});

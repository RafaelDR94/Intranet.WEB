import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, it, expect } from "vitest";

import { ProgressBar } from "./ProgressBar";

describe("ProgressBar", () => {
  it("muestra el valor por defecto como porcentaje cuando no se proporciona label", () => {
    render(<ProgressBar value={40} />);
    expect(screen.getByText("40%")).toBeInTheDocument();
  });

  it("muestra una etiqueta personalizada si se proporciona", () => {
    render(<ProgressBar value={40} label="Cargando..." />);
    expect(screen.getByText("Cargando...")).toBeInTheDocument();
  });

  it("no muestra porcentaje si showPercentage está en false", () => {
    render(<ProgressBar value={50} showPercentage={false} />);
    // No debe haber texto visible con "50%" ni ningún otro label
    expect(screen.queryByText(/%/)).not.toBeInTheDocument();
  });

  it("aplica el ancho correcto al relleno de la barra", () => {
    render(<ProgressBar value={75} />);
    const fill = screen.getByTestId("progress-fill");

    expect(fill).toHaveStyle({ width: "75%" });
  });
});

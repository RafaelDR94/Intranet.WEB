import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

import CheckBoxList from "./CheckBoxList";
import type { CheckBoxListOption } from "./types";

const sampleOptions: CheckBoxListOption[] = [
  { value: "card", label: "Tarjeta de circulación" },
  { value: "fuel", label: "Tarjeta de combustible" },
  { value: "tag", label: "Tag o pase" },
];

describe("CheckBoxList", () => {
  it("renderiza título y opciones", () => {
    render(<CheckBoxList title="Documentos" options={sampleOptions} />);

    expect(screen.getByText("Documentos")).toBeInTheDocument();
    sampleOptions.forEach((option) =>
      expect(screen.getByText(option.label)).toBeInTheDocument()
    );
  });

  it("permite selección en modo no controlado y dispara onChange", () => {
    const handleChange = vi.fn();
    render(
      <CheckBoxList
        title="Documentos"
        options={sampleOptions}
        defaultValue={["card"]}
        onChange={handleChange}
      />
    );

    const tagCheckbox = screen.getByLabelText("Tag o pase");
    fireEvent.click(tagCheckbox);

    expect(handleChange).toHaveBeenCalledWith(["card", "tag"]);
  });

  it("respeta el modo controlado y el estado disabled", () => {
    const handleChange = vi.fn();
    render(
      <CheckBoxList
        title="Documentos"
        options={sampleOptions}
        value={["fuel"]}
        onChange={handleChange}
        disabled
      />
    );

    const fuelCheckbox = screen.getByLabelText("Tarjeta de combustible") as HTMLInputElement;
    expect(fuelCheckbox.checked).toBe(true);

    fireEvent.click(fuelCheckbox);

    expect(handleChange).not.toHaveBeenCalled();
    expect(fuelCheckbox.checked).toBe(true);
  });

  it("selecciona y deselecciona todas las opciones con el maestro", () => {
    const handleChange = vi.fn();
    render(
      <CheckBoxList
        title="Documentos"
        options={sampleOptions}
        defaultValue={["card"]}
        onChange={handleChange}
        showSelectAll
      />,
    );

    const selectAllCheckbox = screen.getByLabelText("Seleccionar todo");
    fireEvent.click(selectAllCheckbox);

    expect(handleChange).toHaveBeenLastCalledWith([
      "card",
      "fuel",
      "tag",
    ]);
    sampleOptions.forEach(({ label }) => {
      expect((screen.getByLabelText(label) as HTMLInputElement).checked).toBe(
        true,
      );
    });

    fireEvent.click(selectAllCheckbox);

    expect(handleChange).toHaveBeenLastCalledWith([]);
    sampleOptions.forEach(({ label }) => {
      expect((screen.getByLabelText(label) as HTMLInputElement).checked).toBe(
        false,
      );
    });
  });

  it("renderiza opciones agrupadas y conserva seleccionar todo", () => {
    const handleChange = vi.fn();

    render(
      <CheckBoxList
        title="Areas"
        options={sampleOptions}
        optionGroups={[
          {
            label: "Empresa 1",
            options: [sampleOptions[0], sampleOptions[1]],
          },
          {
            label: "Empresa 2",
            options: [sampleOptions[2]],
          },
        ]}
        onChange={handleChange}
        showSelectAll
        columns={2}
      />,
    );

    expect(screen.getByText("Empresa 1")).toBeInTheDocument();
    expect(screen.getByText("Empresa 2")).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("Seleccionar todo"));

    expect(handleChange).toHaveBeenLastCalledWith(["card", "fuel", "tag"]);
  });
});


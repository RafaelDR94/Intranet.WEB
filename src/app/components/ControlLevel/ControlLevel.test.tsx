import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ControlLevel } from "./ControlLevel";

describe("ControlLevel", () => {
  it("initializes internal level using initialValue", () => {
    render(
      <ControlLevel
        showSemicircle={false}
        showLinear
        min={0}
        max={1}
        divisions={4}
        initialValue={0.75}
      />
    );

    const slider = screen.getByRole("slider");
    expect(Number(slider.getAttribute("aria-valuenow"))).toBeCloseTo(0.75);
  });

  it("updates level and notifies onChange when interacting with the linear slider", () => {
    const handleChange = vi.fn();

    render(
      <ControlLevel
        showSemicircle={false}
        showLinear
        min={0}
        max={1}
        divisions={4}
        initialValue={0.75}
        onChange={handleChange}
      />
    );

    const slider = screen.getByRole("slider");

    fireEvent.keyDown(slider, { key: "ArrowRight" });

    expect(handleChange).toHaveBeenCalledWith(1);
    expect(Number(slider.getAttribute("aria-valuenow"))).toBe(1);
  });

  it("updates the displayed label when the semicircle slider changes", () => {
    render(
      <ControlLevel
        showSemicircle
        showLinear={false}
        min={0}
        max={1}
        divisions={4}
        initialValue={0.5}
      />
    );

    const slider = screen.getByRole("slider");
    expect(screen.getByText("2/4")).toBeInTheDocument();

    fireEvent.keyDown(slider, { key: "ArrowRight" });

    expect(screen.getByText("3/4")).toBeInTheDocument();
  });
});

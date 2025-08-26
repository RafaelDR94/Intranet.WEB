import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Control } from "./Control";
import { ControlProps } from "./types";

const baseProps: ControlProps = {
  value: 1,
  onIncrement: vi.fn(),
  onDecrement: vi.fn(),
};

describe("Control component", () => {
  it("renders correctly with default variant", () => {
    render(<Control {...baseProps} />);

    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBe(2);

    // Verifica que estén los íconos
    expect(screen.getByTestId("minus-icon")).toBeInTheDocument();
    expect(screen.getByTestId("plus-icon")).toBeInTheDocument();
  });

  it("calls onIncrement when '+' button is clicked", () => {
    render(<Control {...baseProps} />);
    const incrementBtn = screen.getAllByRole("button")[1];
    fireEvent.click(incrementBtn);
    expect(baseProps.onIncrement).toHaveBeenCalledTimes(1);
  });

  it("calls onDecrement when '-' button is clicked", () => {
    render(<Control {...baseProps} />);
    const decrementBtn = screen.getAllByRole("button")[0];
    fireEvent.click(decrementBtn);
    expect(baseProps.onDecrement).toHaveBeenCalledTimes(1);
  });

  it("applies 'filled' styles when variant is filled", () => {
  const { container } = render(<Control {...baseProps} variant="filled" />);
  const wrapper = container.firstChild as HTMLElement;

  expect(wrapper.className).toContain("bg-green-10");
  expect(wrapper.className).toContain("border-transparent");
  });

  it("applies 'outlined' styles when variant is outlined", () => {
  const { container } = render(<Control {...baseProps} variant="outlined" />);
  const wrapper = container.firstChild as HTMLElement;

  expect(wrapper.className).toContain("border-green-50");
  expect(wrapper.className).toContain("bg-transparent");
  });

});

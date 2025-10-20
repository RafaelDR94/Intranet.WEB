import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { ComponentProps } from "react";
import LinearLevel from "./LinearLevel";

const createRect = (overrides: Partial<DOMRect> = {}): DOMRect =>
  ({
    x: 0,
    y: 0,
    width: 200,
    height: 16,
    top: 0,
    left: 0,
    bottom: 16,
    right: 200,
    toJSON: () => ({}),
    ...overrides,
  }) as DOMRect;

describe("LinearLevel", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  const renderComponent = (overrideProps: Partial<ComponentProps<typeof LinearLevel>> = {}) => {
    const setLevel = vi.fn();
    const props: ComponentProps<typeof LinearLevel> = {
      min: 0,
      max: 1,
      divisions: 4,
      level: 0.5,
      setLevel,
      labelMode: "fraction",
      decimals: 2,
      ...overrideProps,
    };

    const view = render(<LinearLevel {...props} />);
    const slider = screen.getByRole("slider");

    return { ...view, slider, setLevel: props.setLevel };
  };

  it("renders the expected number of tick markers", () => {
    const { slider } = renderComponent({ divisions: 4 });

    const tickElements = slider.querySelectorAll("div[style*='left:']");
    expect(tickElements).toHaveLength(5); // divisions + 1
  });

  it("invokes setLevel when arrow keys are pressed", () => {
    const { slider, setLevel } = renderComponent({ level: 0.5 });

    fireEvent.keyDown(slider, { key: "ArrowRight" });
    fireEvent.keyDown(slider, { key: "ArrowLeft" });

    expect(setLevel).toHaveBeenNthCalledWith(1, 0.75);
    expect(setLevel).toHaveBeenNthCalledWith(2, 0.25);
  });

  it("computes level based on pointer interaction", () => {
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue(createRect());

    const { slider, setLevel } = renderComponent({
      min: 0,
      max: 10,
      level: 3,
    });

    fireEvent.mouseDown(slider, { clientX: 100 });

    expect(setLevel).toHaveBeenCalledWith(5);
  });
});

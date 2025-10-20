import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { ComponentProps } from "react";
import SemicircleLevel from "./SemiCircle";
import { defaultActiveClasses, defaultBackgroundClass } from "./styles";

const createRect = (overrides: Partial<DOMRect> = {}): DOMRect =>
  ({
    x: 0,
    y: 0,
    width: 220,
    height: 126,
    top: 0,
    left: 0,
    bottom: 126,
    right: 220,
    toJSON: () => ({}),
    ...overrides,
  }) as DOMRect;

describe("SemicircleLevel", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  const renderComponent = (overrideProps: Partial<ComponentProps<typeof SemicircleLevel>> = {}) => {
    const setLevel = vi.fn();
    const props: ComponentProps<typeof SemicircleLevel> = {
      min: 0,
      max: 1,
      divisions: 4,
      level: 1,
      setLevel,
      label: "Valor",
      labelMode: "fraction",
      decimals: 2,
      ...overrideProps,
    };

    const view = render(<SemicircleLevel {...props} />);
    const svg = view.container.querySelector("svg") as SVGSVGElement;

    return { ...view, svg, setLevel: props.setLevel };
  };

  it("renders background and active slices along with the label", () => {
    const { svg } = renderComponent({ level: 1, label: "1" });

    const backgroundSlices = svg.querySelectorAll(`.${defaultBackgroundClass}`);
    const activeSlices = svg.querySelectorAll(
      defaultActiveClasses.map((cls) => `.${cls}`).join(", ")
    );

    expect(backgroundSlices).toHaveLength(4);
    expect(activeSlices.length).toBeGreaterThan(0);
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("invokes setLevel on keyboard interaction", () => {
    const { svg, setLevel } = renderComponent({ level: 0.5 });

    fireEvent.keyDown(svg, { key: "ArrowRight" });
    fireEvent.keyDown(svg, { key: "ArrowLeft" });

    expect(setLevel).toHaveBeenNthCalledWith(1, 0.75);
    expect(setLevel).toHaveBeenNthCalledWith(2, 0.25);
  });

  it("responds to pointer interaction within bounds", () => {
    vi.spyOn(SVGElement.prototype, "getBoundingClientRect").mockReturnValue(createRect());

    const { svg, setLevel } = renderComponent({
      min: 0,
      max: 1,
      level: 0.5,
    });

    fireEvent.mouseDown(svg, { clientX: 110, clientY: 20 });

    expect(setLevel).toHaveBeenCalled();
    const value = setLevel.mock.calls[0][0] as number;
    expect(value).toBeGreaterThanOrEqual(0);
    expect(value).toBeLessThanOrEqual(1);
  });
});

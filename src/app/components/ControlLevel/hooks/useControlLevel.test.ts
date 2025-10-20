import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import useControlLevel from "./useControlLevel";

describe("useControlLevel", () => {
  it("returns default configuration and computed label", () => {
    const { result } = renderHook(() => useControlLevel({}));

    expect(result.current.title).toBe("Nivel");
    expect(result.current.level).toBe(0);
    expect(result.current.label).toBe("0");
    expect(result.current.shouldOffsetLinear).toBe(true);
  });

  it("initializes uncontrolled state using initialValue when provided", () => {
    const { result } = renderHook(() =>
      useControlLevel({
        min: 0,
        max: 1,
        divisions: 4,
        initialValue: 0.75,
      })
    );

    expect(result.current.level).toBeCloseTo(0.75);
  });

  it("clamps initialValue to the provided range", () => {
    const { result } = renderHook(() =>
      useControlLevel({
        min: 0,
        max: 1,
        divisions: 4,
        initialValue: 5,
      })
    );

    expect(result.current.level).toBe(1);
  });

  it("delegates updates to external setLevel and triggers onChange in controlled mode", () => {
    const onChange = vi.fn();
    const externalSetLevel = vi.fn();

    const { result } = renderHook(() =>
      useControlLevel({
        min: 0,
        max: 1,
        divisions: 4,
        level: 0.3,
        setLevel: externalSetLevel,
        onChange,
      })
    );

    act(() => {
      result.current.setLevel(0.9);
    });

    expect(externalSetLevel).toHaveBeenCalledWith(0.9);
    expect(onChange).toHaveBeenCalledWith(0.9);
    expect(result.current.level).toBe(0.3);
  });

  it("updates the internal state and notifies onChange in uncontrolled mode", () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useControlLevel({
        min: 0,
        max: 1,
        divisions: 4,
        onChange,
      })
    );

    act(() => {
      result.current.setLevel(0.5);
    });

    expect(result.current.level).toBeCloseTo(0.5);
    expect(onChange).toHaveBeenCalledWith(0.5);
  });
});


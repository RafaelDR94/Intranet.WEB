import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import useDevices, { NEW_DEVICE_ID } from "./useDevices";

describe("useDevices", () => {
  it("administra el id seleccionado y expone helpers para la vista", () => {
    const { result } = renderHook(() => useDevices());

    expect(result.current.selectedRowId).toBeNull();

    act(() => {
      result.current.handleCreate();
    });
    expect(result.current.selectedRowId).toBe(NEW_DEVICE_ID);

    act(() => {
      result.current.handleEdit("DEV-1");
    });
    expect(result.current.selectedRowId).toBe("DEV-1");

    act(() => {
      result.current.handleCloseForm();
    });
    expect(result.current.selectedRowId).toBeNull();
  });
});

import { describe, expect, it } from "vitest";

import { interpretPermission, cancelPermissionKeys, truthyPermissionStrings, falsyPermissionStrings } from "./permissions";

describe("permissions utilities", () => {
  it("interprets booleans and numbers correctly", () => {
    expect(interpretPermission(true)).toBe(true);
    expect(interpretPermission(false)).toBe(false);
    expect(interpretPermission(1)).toBe(true);
    expect(interpretPermission(0)).toBe(false);
  });

  it("maps known truthy and falsy strings", () => {
    for (const value of truthyPermissionStrings) {
      expect(interpretPermission(value)).toBe(true);
    }
    for (const value of falsyPermissionStrings) {
      expect(interpretPermission(value)).toBe(false);
    }
  });

  it("returns undefined when value cannot be interpreted", () => {
    expect(interpretPermission(undefined)).toBeUndefined();
    expect(interpretPermission(null)).toBeUndefined();
    expect(interpretPermission(" ")).toBeUndefined();
    expect(interpretPermission("unknown")).toBeUndefined();
  });

  it("lists fallback keys used to infer cancel permissions", () => {
    expect(cancelPermissionKeys).toEqual(
      expect.arrayContaining([
        "cancel",
        "cancelvoucher",
        "cancel_petty_cash",
        "remove",
      ]),
    );
  });
});

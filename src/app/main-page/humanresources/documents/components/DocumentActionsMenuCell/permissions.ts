export const truthyPermissionStrings = new Set([
  "true",
  "1",
  "yes",
  "y",
  "si",
  "sí",
  "allow",
]);

export const falsyPermissionStrings = new Set(["false", "0", "no", "deny"]);

export const cancelPermissionKeys = [
  "delete",
  "cancel",
  "cancelvoucher",
  "cancelVoucher",
  "cancelvale",
  "cancelVale",
  "cancelpettycash",
  "cancelPettycash",
  "cancel_petty_cash",
  "cancelPettyCash",
  "deleteVoucher",
  "deleteVale",
  "deletevoucher",
  "deletevale",
  "remove",
];

export const interpretPermission = (value: unknown): boolean | undefined => {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (!normalized) return undefined;
    if (truthyPermissionStrings.has(normalized)) return true;
    if (falsyPermissionStrings.has(normalized)) return false;
  }
  return undefined;
};

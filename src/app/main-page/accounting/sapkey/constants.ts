import type { ResponsiveLayoutMatrix } from "@/app/components/DynamicForm/types";
import type { SAPKey } from "@/app/mappings/sapkeys/sapkeys.types";

export const SAPKEY_PATH = "/main-page/accounting/sapkey";

export const SAPKEY_FORM_LAYOUT: ResponsiveLayoutMatrix = {
  sm: [[10], [10], [10], [10], [10], [10]],
  md: [
    [5, 5],
    [5, 5],
    [5, 5],
  ],
  lg: [
    [3.3, 3.3, 3.3],
    [3.3, 3.3, 3.3],
  ],
};

export const SAPKEY_SEARCHABLE_KEYS = [
  "internalKey",
  "descriptionInternalKey",
  "ivaLabel",
  "satKey",
  "descriptionSatKey",
  "gtsTypeLabel",
] as const;

export const SAPKEY_IVA_OPTIONS = [
  {
    label: "IVA ACREDITABLE 0 % - 0.00",
    value: "iva_0",
    numericValue: 0,
  },
  {
    label: "IVA ACREDITABLE 8 % - 0.08",
    value: "iva_8",
    numericValue: 0.08,
  },
  {
    label: "IVA ACREDITABLE 16 % - 0.16",
    value: "iva_16",
    numericValue: 0.16,
  },
  {
    label: "IVA POR ACREDITABLE EXENTO - 0.00",
    value: "iva_exento",
    numericValue: 0,
  },
] as const;

export const SAPKEY_GTS_TYPE_OPTIONS = [
  { label: "Administrativo", value: "A" },
  { label: "Operativo", value: "O" },
] as const;

const SAPKEY_EXEMPT_HINTS = ["EXENTO", "EXENTA"];

const normalizeNumber = (value?: number | null) => Number(value ?? 0);

const normalizeText = (value?: string | null) =>
  String(value ?? "")
    .trim()
    .toUpperCase();

export const getGTSTypeLabel = (value?: string | null) => {
  const normalizedValue = normalizeText(value);

  if (normalizedValue === "A") return "Administrativo";
  if (normalizedValue === "O") return "Operativo";

  return normalizedValue || "-";
};

export const getIvaNumericValue = (optionId?: string | null) =>
  SAPKEY_IVA_OPTIONS.find((option) => option.value === optionId)
    ?.numericValue ?? 0;

export const getIvaOptionId = (
  iva?: number | null,
  sapKey?: Partial<SAPKey> | null,
) => {
  const normalizedIva = normalizeNumber(iva);

  if (Math.abs(normalizedIva - 0.16) < 0.0001) return "iva_16";
  if (Math.abs(normalizedIva - 0.08) < 0.0001) return "iva_8";

  const descriptiveText = normalizeText(
    [
      sapKey?.descriptionInternalKey,
      sapKey?.descriptionSatKey,
      sapKey?.internalKey,
      sapKey?.satKey,
    ]
      .filter(Boolean)
      .join(" "),
  );

  if (SAPKEY_EXEMPT_HINTS.some((hint) => descriptiveText.includes(hint))) {
    return "iva_exento";
  }

  return "iva_0";
};

export const getIvaLabel = (sapKey?: Partial<SAPKey> | null) => {
  const optionId = getIvaOptionId(sapKey?.iva, sapKey);

  return (
    SAPKEY_IVA_OPTIONS.find((option) => option.value === optionId)?.label ?? "-"
  );
};

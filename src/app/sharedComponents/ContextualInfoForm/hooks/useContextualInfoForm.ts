"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

import type { ContextualInfoFormProps } from "../types";
import {
  defaultContextualInfoVariants,
  resolveContextualInfoFieldValue,
  resolveContextualInfoVariant,
} from "../utilities/contextualInfoForm";

const VARIANT_QUERY_KEYS = ["formVariant", "variant", "view", "context"];

/**
 * Hook que resuelve la variante y los valores visibles del formulario desde
 * props y query params.
 *
 * @param props Props relevantes del formulario contextual.
 * @returns Campos resueltos con sus valores finales.
 */
export function useContextualInfoForm({
  values = {},
  variant,
  variants,
  emptyValue = "",
}: Pick<
  ContextualInfoFormProps,
  "values" | "variant" | "variants" | "emptyValue"
>) {
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();

  return useMemo(() => {
    const params = new URLSearchParams(queryString);
    const mergedVariants = {
      ...defaultContextualInfoVariants,
      ...variants,
    };
    const variantName =
      variant ??
      VARIANT_QUERY_KEYS.map((key) => params.get(key)).find((value) =>
        Boolean(value),
      );
    const resolvedVariant = resolveContextualInfoVariant(
      variantName,
      mergedVariants,
    );

    return resolvedVariant.fields.map((field) => ({
      ...field,
      value: resolveContextualInfoFieldValue(field, values, params, emptyValue),
    }));
  }, [emptyValue, queryString, values, variant, variants]);
}

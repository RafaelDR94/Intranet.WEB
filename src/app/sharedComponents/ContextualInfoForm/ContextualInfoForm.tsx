"use client";

import clsx from "clsx";
import React, { useCallback, useMemo } from "react";

import DynamicForm from "@/app/components/DynamicForm/DynamicForm";
import type {
  FieldModel,
  ResponsiveLayoutMatrix,
} from "@/app/components/DynamicForm/types";
import { useContextualInfoForm } from "./hooks/useContextualInfoForm";
import { contextualInfoFormStyles as styles } from "./styles";
import type { ContextualInfoFormProps } from "./types";

const contextualInfoLayout: ResponsiveLayoutMatrix = {
  sm: [[10], [10], [10], [10], [10], [10], [10]],
  md: [
    [2.5, 2.5, 2.5, 2.5],
    [2.5, 2.5, 2.5],
  ],
  lg: [
    [2.5, 2.5, 2.5, 2.5],
    [2.5, 2.5, 2.5],
  ],
};

/**
 * Formulario de solo lectura para informacion contextual compartida entre
 * modulos. Lee la URL por defecto y cambia sus campos segun la variante activa.
 *
 * @param props Configuracion del formulario contextual.
 */
export function ContextualInfoForm({
  values,
  variant,
  variants,
  emptyValue = "",
  className,
  dataTestId = "contextual-info-form",
}: ContextualInfoFormProps) {
  const fields = useContextualInfoForm({
    values,
    variant,
    variants,
    emptyValue,
  });
  const dynamicFields = useMemo<FieldModel[]>(
    () =>
      fields.map((field) => ({
        type: field.isDate ? "date" : "input",
        name: field.id,
        label: field.label,
        value: field.value,
        disabled: true,
        inputSize: "md",
        containerClassName: styles.fieldContainer,
        labelClassName: styles.fieldLabel,
        className: styles.fieldInput,
      })),
    [fields],
  );
  const handleSubmit = useCallback(() => undefined, []);

  return (
    <section
      className={clsx(styles.container, className)}
      data-testid={dataTestId}
    >
      <DynamicForm
        dataTestId={`${dataTestId}-dynamic`}
        disabled
        fields={dynamicFields}
        formClassName={styles.form}
        onSubmit={handleSubmit}
        responsiveLayoutMatrix={contextualInfoLayout}
        rowClassName={styles.row}
        showSubmitIf={() => false}
      />
    </section>
  );
}

export default ContextualInfoForm;

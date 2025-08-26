"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Formik, Form } from "formik";
import type {
  DynamicFormProps,
  Breakpoints,
  ResponsiveLayoutMatrix,
} from "./types";
import { useDynamicForm } from "./hooks/useDynamicForm";
import { FieldRenderer } from "./components/FieldRenderer";
import { Button } from "../Button/Button";
import { dynamicFormStyles } from "./styles";
import { Spinner } from "../Spinner/Spinner";

/** =========================
 *  Hook: media breakpoints
 *  ========================= */
function useMediaBreakpoints(bps: Breakpoints = { sm: 640, md: 1024 }) {
  const { sm, md } = bps;
  const [width, setWidth] = useState<number>(() =>
    typeof window === "undefined" ? md + 1 : window.innerWidth
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const onResize = () => setWidth(window.innerWidth);

    // matchMedia para reducir re-render si cambia el rango
    const mqSm = window.matchMedia(`(max-width: ${sm}px)`);
    const mqMd = window.matchMedia(
      `(min-width: ${sm + 1}px) and (max-width: ${md}px)`
    );
    const mqLg = window.matchMedia(`(min-width: ${md + 1}px)`);

    const listener = () => onResize();

    mqSm.addEventListener?.("change", listener);
    mqMd.addEventListener?.("change", listener);
    mqLg.addEventListener?.("change", listener);
    window.addEventListener("resize", onResize);

    // init
    onResize();

    return () => {
      mqSm.removeEventListener?.("change", listener);
      mqMd.removeEventListener?.("change", listener);
      mqLg.removeEventListener?.("change", listener);
      window.removeEventListener("resize", onResize);
    };
  }, [sm, md]); // <- dependencias pulidas

  const current: "sm" | "md" | "lg" = width <= sm ? "sm" : width <= md ? "md" : "lg";
  return { width, current };
}

/** =========================
 *  DynamicForm con responsive
 *  ========================= */
const DynamicForm: React.FC<DynamicFormProps> = ({
  fields,
  onSubmit,
  title,
  submitLabel = "Submit",
  showSubmitIf,
  showSecondaryButtonIf,
  onSecondaryButtonClick,
  secondaryButtonLabel,
  children,
  loading,
  layoutMatrix, // fijo (prioridad)
  responsiveLayoutMatrix, // por breakpoint
  breakpoints, // opcional
  externalSubmitRef,
  onValidChange,
  loadingFormInfo,
}) => {
  const { initialValues, validationSchema, cleanValues, resolveVariant } =
    useDynamicForm(fields);

  // 1) Resolver layout efectivo (fijo vs responsive)
  const { current } = useMediaBreakpoints(
    breakpoints ?? { sm: 640, md: 1024 }
  );

  const effectiveLayoutMatrix = useMemo(() => {
    if (layoutMatrix?.length) return layoutMatrix; // prioridad
    if (!responsiveLayoutMatrix) return undefined;

    // preferencia: layout del breakpoint actual, si no existe, fallback hacia abajo y luego hacia arriba
    const order: Array<keyof ResponsiveLayoutMatrix> =
      current === "lg" ? ["lg", "md", "sm"] : current === "md" ? ["md", "sm", "lg"] : ["sm", "md", "lg"];

    for (const key of order) {
      const candidate = responsiveLayoutMatrix[key];
      if (candidate?.length) return candidate;
    }
    return undefined;
  }, [layoutMatrix, responsiveLayoutMatrix, current]);

  return (
    <div className={dynamicFormStyles.container}>
      {title && <h2 className={dynamicFormStyles.heading}>{title}</h2>}
      {loadingFormInfo && (
        <div className={dynamicFormStyles.loadingInfo}>
          <Spinner size="large" />
        </div>
      )}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize
        validateOnMount
        onSubmit={(values) => {
          const cleaned = cleanValues(values);
          onSubmit(cleaned);
        }}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          setFieldValue,
          submitForm,
          isValid,
        }) => {
          if (externalSubmitRef) {
            externalSubmitRef.current = submitForm;
          }
          const previousIsValid = useRef<boolean | undefined>(undefined);
          useEffect(() => {
            if (previousIsValid.current !== isValid) {
              previousIsValid.current = isValid;
              onValidChange?.(isValid);
            }
          }, [isValid, onValidChange]);

          const visibleFields = fields.filter(
            (field) => !field.showIf || field.showIf(values, fields)
          );

          // helper para index lineal dado row/col
          const linearIndex = (rowIndex: number, colIndex: number, matrix: number[][]) =>
            matrix.slice(0, rowIndex).reduce((acc, r) => acc + r.length, 0) + colIndex;

          return (
            <Form className={dynamicFormStyles.form}>
              {effectiveLayoutMatrix
                ? effectiveLayoutMatrix.map((row, rowIndex) => (
                    <div
                      key={`row-${rowIndex}`}
                      className="flex w-full gap-4 mb-4"
                    >
                      {row.map((width, colIndex) => {
                        const fieldIndex = linearIndex(
                          rowIndex,
                          colIndex,
                          effectiveLayoutMatrix
                        );

                        const field = visibleFields[fieldIndex];
                        if (!field) return null;

                        const value = values[field.name];
                        const { variant, helperText } = resolveVariant(
                          field,
                          touched as Record<string, boolean | undefined>,
                          errors,
                          value
                        );

                        return (
                          <div
                            key={field.name}
                            style={{ width: `${(width / 10) * 100}%` }}
                          >
                            <FieldRenderer
                              field={field}
                              value={value}
                              allValues={values}
                              onChange={(val) => setFieldValue(field.name, val)}
                              onBlur={handleBlur}
                              variant={variant}
                              helperText={helperText}
                            />
                          </div>
                        );
                      })}
                    </div>
                  ))
                : // Sin layout provisto: render lineal uno debajo del otro
                  visibleFields.map((field) => {
                    const value = values[field.name];
                    const { variant, helperText } = resolveVariant(
                      field,
                      touched as Record<string, boolean | undefined>,
                      errors,
                      value
                    );

                    return (
                      <FieldRenderer
                        key={field.name}
                        field={field}
                        value={value}
                        allValues={values}
                        onChange={(val) => setFieldValue(field.name, val)}
                        onBlur={handleBlur}
                        variant={variant}
                        helperText={helperText}
                      />
                    );
                  })}

              {children}

              <div className={dynamicFormStyles.actions}>
                {showSecondaryButtonIf?.(values) && onSecondaryButtonClick && (
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => onSecondaryButtonClick(values)}
                  >
                    {secondaryButtonLabel}
                  </Button>
                )}

                {showSubmitIf?.(values) !== false &&
                  !externalSubmitRef &&
                  (loading ? (
                    <div className="w-full flex justify-center items-center">
                      <Spinner size="medium" />
                    </div>
                  ) : (
                    <Button
                      type="submit"
                      className={
                        !showSecondaryButtonIf?.(values) ? "w-full" : ""
                      }
                    >
                      {submitLabel}
                    </Button>
                  ))}
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export { DynamicForm };
export default DynamicForm;

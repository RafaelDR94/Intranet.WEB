"use client";

import { Formik, Form } from "formik";
import React, { useEffect, useMemo, useRef } from "react";

import { Button } from "../Button/Button";
import { Spinner } from "../Spinner/Spinner";

import { FieldRenderer } from "./components/FieldRenderer";
import { useDynamicForm } from "./hooks/useDynamicForm";
import { useMediaBreakpoints } from "./hooks/useMediaBreakpoints";
import { dynamicFormStyles } from "./styles";
import type {
  DynamicFormProps,
  ResponsiveLayoutMatrix,
} from "./types";


type FormStateWatcherProps = {
  isValid: boolean;
  onValidChange?: (v: boolean) => void;
  values: Record<string, any>;
  onValuesChange?: (vals: Record<string, any>) => void;
};

const FormStateWatcher: React.FC<FormStateWatcherProps> = ({
  isValid,
  onValidChange,
  values,
  onValuesChange,
}) => {
  const prevIsValid = useRef<boolean | undefined>(undefined);
  const prevValuesSnapshot = useRef<string | null>(null);

  useEffect(() => {
    if (prevIsValid.current !== isValid) {
      prevIsValid.current = isValid;
      onValidChange?.(isValid);
    }
  }, [isValid, onValidChange]);

  useEffect(() => {
    if (!onValuesChange) return;
    const serialized = JSON.stringify(values);
    if (prevValuesSnapshot.current === serialized) return;
    prevValuesSnapshot.current = serialized;
    onValuesChange(values);
  }, [values, onValuesChange]);

  return null;
};

/**
 * Formulario dinámico con renderizado de campos a partir de un modelo (`FieldModel[]`),
 * validaciones (Yup via `useDynamicForm`), estados visuales y **layout responsivo**.
 *
 * @remarks
 * - **Layout**:
 *   - `layoutMatrix` (prioridad) define filas con proporciones (cada fila suma 10).
 *   - `responsiveLayoutMatrix` permite variantes por breakpoint (`sm|md|lg`) con fallback inteligente.
 * - **Validación**:
 *   - Usa `useDynamicForm` para construir `initialValues`, `validationSchema`, `cleanValues` y `resolveVariant`.
 *   - Dispara `onValidChange?` cuando cambia la validez global (`Formik.isValid`).
 * - **Acciones**:
 *   - `showSubmitIf?` y `showSecondaryButtonIf?` controlan visibilidad de botones.
 *   - `externalSubmitRef?` expone `submitForm` para disparar envío desde afuera.
 * - **Estados**:
 *   - `loadingFormInfo` muestra un spinner superior (ej. carga de metadatos).
 *   - `loading` reemplaza el botón por un spinner.
 *   - `disabled` deshabilita todos los campos visibles.
 *
 * @accessibility
 * - Cada campo debe proveer `label` y `name` en su `FieldModel`; `FieldRenderer` es responsable del vínculo accesible.
 * - Los botones usan elementos nativos y mantienen el foco según el flujo estándar de formulario.
 *
 * @example Uso básico
 * ```tsx
 * <DynamicForm
 *   fields={[
 *     { type: 'input', name: 'fullName', label: 'Nombre completo', value: '' },
 *     { type: 'email', name: 'email', label: 'Correo', value: '' },
 *   ]}
 *   onSubmit={(vals) => console.log(vals)}
 * />
 * ```
 *
 * @example Layout responsivo
 * ```tsx
 * <DynamicForm
 *   fields={fields}
 *   responsiveLayoutMatrix={{
 *     sm: [[10],[10],[10]],
 *     md: [[5,5],[10],[5,5]],
 *     lg: [[5,5],[10],[5,5],[10]]
 *   }}
 * />
 * ```
 *
 * @example Envío externo
 * ```tsx
 * const submitRef = useRef<() => void>(null);
 * <DynamicForm fields={fields} externalSubmitRef={submitRef} showSubmitIf={() => false} />
 * <button onClick={() => submitRef.current?.()}>Enviar</button>
 * ```
 */
const DynamicForm: React.FC<DynamicFormProps> = ({
  fields,
  onSubmit,
  title,
  submitLabel = "Submit",
  showSubmitIf,
  showSecondaryButtonIf,
  onSecondaryButtonClick,
  onValuesChange,
  secondaryButtonLabel,
  children,
  loading,
  layoutMatrix, // fijo (prioridad)
  responsiveLayoutMatrix, // por breakpoint
  breakpoints, // opcional
  externalSubmitRef,
  onValidChange,
  loadingFormInfo,
  disabled,
  dataTestId,
}) => {
  const { initialValues, validationSchema, cleanValues, resolveVariant } =
    useDynamicForm(fields);

  // 1) Resolver layout efectivo (fijo vs responsive)
  const { current } = useMediaBreakpoints(breakpoints ?? { sm: 640, md: 1024 });

  const effectiveLayoutMatrix = useMemo(() => {
    if (layoutMatrix?.length) return layoutMatrix; // prioridad
    if (!responsiveLayoutMatrix) return undefined;

    // preferencia: layout del breakpoint actual, si no existe, fallback hacia abajo y luego hacia arriba
    const order: Array<keyof ResponsiveLayoutMatrix> =
      current === "lg"
        ? ["lg", "md", "sm"]
        : current === "md"
        ? ["md", "sm", "lg"]
        : ["sm", "md", "lg"];

    for (const key of order) {
      const candidate = responsiveLayoutMatrix[key];
      if (candidate?.length) return candidate;
    }
    return undefined;
  }, [layoutMatrix, responsiveLayoutMatrix, current]);

  return (
    <div className={dynamicFormStyles.container} data-testid={dataTestId}>
      {title && <h2 className={dynamicFormStyles.heading}>{title}</h2>}
      {loadingFormInfo && (
        <div className={dynamicFormStyles.loadingInfo}>
          <Spinner size="large" dataTestId={dataTestId ? `${dataTestId}-spinner` : undefined} />
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
          setFieldTouched,
          submitForm,
          isValid,
        }) => {
          if (externalSubmitRef) {
            externalSubmitRef.current = submitForm;
          }
          // Notificar cambios de validez usando un subcomponente para respetar las reglas de hooks
          const visibleFields = fields.filter(
            (field) => !field.showIf || field.showIf(values, fields)
          );

          // helper para index lineal dado row/col
          const linearIndex = (
            rowIndex: number,
            colIndex: number,
            matrix: number[][]
          ) =>
            matrix.slice(0, rowIndex).reduce((acc, r) => acc + r.length, 0) +
            colIndex;

          return (
            <Form className={dynamicFormStyles.form}>
              <FormStateWatcher isValid={isValid} onValidChange={onValidChange} values={values} onValuesChange={onValuesChange} />
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
                              field={disabled ? { ...field, disabled } : field}
                              value={value}
                              allValues={values}
                              onChange={(val) => {
                                // valida inmediatamente y marca como tocado
                                setFieldValue(field.name, val, true);
                                setFieldTouched(field.name, true, false);
                              }}
                              onBlur={handleBlur}
                              variant={variant}
                              helperText={helperText}
                              formDataTestId={dataTestId}
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
                        formDataTestId={dataTestId}
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
                    dataTestId={dataTestId ? `${dataTestId}-secondary` : undefined}
                  >
                    {secondaryButtonLabel}
                  </Button>
                )}

                {showSubmitIf?.(values) !== false &&
                  !externalSubmitRef &&
                  (loading ? (
                    <div className="w-full flex justify-center items-center">
                      <Spinner size="medium" dataTestId={dataTestId ? `${dataTestId}-spinner` : undefined} />
                    </div>
                  ) : (
                    <Button
                      type="submit"
                      hideIcon={true}
                      className={
                        !showSecondaryButtonIf?.(values) ? "w-full" : ""
                      }
                      dataTestId={dataTestId ? `${dataTestId}-primary` : undefined}
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

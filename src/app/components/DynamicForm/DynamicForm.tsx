'use client';

import React from 'react';
import { Formik, Form } from 'formik';
import { DynamicFormProps } from './types';
import { useDynamicForm } from './hooks/useDynamicForm';
import { FieldRenderer } from './components/FieldRenderer';
import { Button } from '../Button/Button';
import { dynamicFormStyles } from './styles';

/**
 * Formulario dinámico que construye campos a partir de un modelo.
 *
 * @param fields Definición de campos
 * @param onSubmit Función que recibe los valores limpios
 * @param title Título opcional
 * @param submitLabel Texto del botón de envío
 * @param showSubmitIf Condición para mostrar el botón submit
 * @param showSecondaryButtonIf Condición para mostrar el botón secundario
 * @param onSecondaryButtonClick Acción del botón secundario
 * @param secondaryButtonLabel Etiqueta del botón secundario
 */
export const DynamicForm: React.FC<DynamicFormProps> = ({
  fields,
  onSubmit,
  title,
  submitLabel = 'Submit',
  showSubmitIf,
  showSecondaryButtonIf,
  onSecondaryButtonClick,
  secondaryButtonLabel,
}) => {
  const {
    initialValues,
    validationSchema,
    cleanValues,
    resolveVariant,
  } = useDynamicForm(fields);

  return (
    <div className={dynamicFormStyles.container}>
      {title && <h2 className={dynamicFormStyles.heading}>{title}</h2>}

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          const cleaned = cleanValues(values);
          onSubmit(cleaned);
        }}
      >
        {({ values, errors, touched, handleBlur, setFieldValue }) => (
          <Form className={dynamicFormStyles.form}>
            {fields
              .filter((field) => !field.showIf || field.showIf(values))
              .map((field) => {
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
                    onChange={(val) => setFieldValue(field.name, val)}
                    onBlur={handleBlur}
                    variant={variant}
                    helperText={helperText}
                  />
                );
              })}

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

              {showSubmitIf?.(values) !== false && (
                <Button type="submit">{submitLabel}</Button>
              )}
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

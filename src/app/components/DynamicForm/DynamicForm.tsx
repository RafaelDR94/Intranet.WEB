'use client';

import React from 'react';
import { Formik, Form } from 'formik';
import { DynamicFormProps } from './types';
import { useDynamicForm } from './hooks/useDynamicForm';
import { FieldRenderer } from './components/FieldRenderer';
import { Button } from '../Button/Button';
import { dynamicFormStyles } from './styles';
import { Spinner } from '../Spinner/Spinner';
/**
 * Formulario dinámico que construye campos a partir de un modelo.
 *
 * @param fields Definición de campos del formulario
 * @param onSubmit Función que recibe los valores limpios al enviar el formulario
 * @param title Título opcional que se muestra encima del formulario
 * @param submitLabel Texto opcional del botón de envío (por defecto "Submit")
 * @param showSubmitIf Función para condicionar si se muestra el botón de envío
 * @param showSecondaryButtonIf Función para condicionar si se muestra el botón secundario
 * @param onSecondaryButtonClick Acción que se ejecuta al hacer clic en el botón secundario
 * @param secondaryButtonLabel Texto del botón secundario
 * @param children Contenido adicional que se renderiza dentro del formulario (por ejemplo, enlaces)
 * @param loading Si es true, muestra un Spinner en lugar del botón de envío
 * @param externalSubmitRef Referencia opcional para disparar el submit desde fuera del componente
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
  children,
  loading,
  externalSubmitRef
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
        {({ values, errors, touched, handleBlur, setFieldValue, submitForm }) => {
          if (externalSubmitRef) {
            externalSubmitRef.current = submitForm;
          }
          return (
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

                {showSubmitIf?.(values) !== false && !externalSubmitRef && (
                  loading ? (
                    <div className="w-full flex justify-center items-center">
                      <Spinner size="medium" />
                    </div>
                  ) : (
                    <Button type="submit" className={!showSecondaryButtonIf?.(values) ? 'w-full' : ''}>
                      {submitLabel}
                    </Button>
                  )
                )}
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

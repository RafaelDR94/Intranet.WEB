'use client';

import React from 'react';
import { Formik, Form } from 'formik';
import { DynamicFormProps } from './types';
import { useDynamicForm } from './hooks/useDynamicForm';
import { FieldRenderer } from './components/FieldRenderer';
import { Button } from '../Button/Button';

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
    <div className="w-full max-w-2xl mx-auto p-4 space-y-6">
      {title && <h2 className="text-2xl font-bold">{title}</h2>}

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          const cleaned = cleanValues(values);
          onSubmit(cleaned);
        }}
      >
        {({ values, errors, touched, handleBlur, setFieldValue }) => (
          <Form className="space-y-6">
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

            <div className="flex justify-center gap-4">
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

'use client';

import React, { useEffect, useRef } from 'react';
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
 * @param layoutMatrix Matriz de proporciones para distribuir los inputs por fila (suma de cada fila debe ser 10)
 */
const DynamicForm: React.FC<DynamicFormProps> = ({
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
    layoutMatrix,
    externalSubmitRef,
    onValidChange,
    loadingFormInfo
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
            {loadingFormInfo && (
                <div className={dynamicFormStyles.loadingInfo}>
                    <Spinner size="large" />
                </div>
            )}
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                    const cleaned = cleanValues(values);
                    onSubmit(cleaned);
                }}
            >
                {({ values, errors, touched, handleBlur, setFieldValue, submitForm, isValid }) => {
                    if (externalSubmitRef) {
                        externalSubmitRef.current = submitForm;
                    }
                    const previousIsValid = useRef<boolean | undefined>(true);
                    useEffect(() => {
                        if (previousIsValid.current !== isValid) {
                            previousIsValid.current = isValid;
                            onValidChange?.(isValid);
                        }
                    }, [isValid]);
                    const visibleFields = fields.filter((field) => !field.showIf || field.showIf(values, fields));

                    return (
                        <Form className={dynamicFormStyles.form}>
                            {layoutMatrix
                                ? layoutMatrix.map((row, rowIndex) => (
                                    <div key={`row-${rowIndex}`} className="flex w-full gap-4 mb-4">
                                        {row.map((width, colIndex) => {
                                            const fieldIndex = layoutMatrix
                                                .slice(0, rowIndex)
                                                .reduce((acc, r) => acc + r.length, 0) + colIndex;

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
                                                    // className={`w-[${(width / 10) * 100}%]`}
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
                                : visibleFields.map((field) => {
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
export default DynamicForm

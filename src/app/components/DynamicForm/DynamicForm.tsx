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

 * @param fields Lista de campos del formulario. Cada campo define su tipo (`input`, `select`, etc.), su valor inicial, validaciones, opciones, y lógica condicional (`showIf`, `onChange`).
 *
 * @param onSubmit Función que se ejecuta al enviar el formulario. Recibe un objeto con los valores limpios de los campos visibles y activos.
 *
 * @param title (Opcional) Título que se muestra como encabezado del formulario. Útil para distinguir formularios en pantallas reutilizables.
 *
 * @param submitLabel (Opcional) Texto personalizado del botón de envío. Por defecto: `"Submit"`.
 *
 * @param showSubmitIf (Opcional) Función que determina si el botón de envío debe mostrarse. Recibe los valores actuales del formulario. Útil para validaciones condicionales externas o permisos.
 *
 * @param showSecondaryButtonIf (Opcional) Función que controla la visibilidad del botón secundario. Útil para acciones como "Vista previa", "Guardar como borrador", etc.
 *
 * @param onSecondaryButtonClick (Opcional) Función que se ejecuta al hacer clic en el botón secundario. Recibe todos los valores actuales del formulario.
 *
 * @param secondaryButtonLabel (Opcional) Texto del botón secundario. Requiere que `onSecondaryButtonClick` esté definido.
 *
 * @param children (Opcional) Contenido adicional que puede ser renderizado debajo de los campos. Puede incluir links, mensajes informativos, acciones complementarias, etc.
 *
 * @param loading (Opcional) Si se establece en `true`, reemplaza el botón de envío con un `Spinner`. Ideal para indicar que se está procesando el envío.
 *
 * @param layoutMatrix (Opcional) Matriz de proporciones por fila para distribuir los campos horizontalmente. Cada número representa una proporción sobre 10. Ej: `[[5, 5], [10]]` coloca dos campos por fila seguidos de uno completo.
 *
 * @param externalSubmitRef (Opcional) Referencia React que permite disparar el envío del formulario desde fuera del componente. El método referenciado se comporta igual que un clic en el botón de envío.
 *
 * @param onValidChange (Opcional) Función que se ejecuta cada vez que cambia el estado de validez del formulario. Recibe `true` o `false`. Útil para activar/desactivar botones externos o navegación condicional.
 *
 * @param loadingFormInfo (Opcional) Si se establece en `true`, se muestra un overlay encima del formulario con un `Spinner`. Se recomienda para cuando los `fields` están cargando dinámicamente desde una API.
 *
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
export { DynamicForm };
export default DynamicForm

'use client';

import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import type {

    NumberSchema,

    AnyObject,

    Flags,
} from 'yup';
import { Input } from '../Input/Input';
import { Select, SelectOption } from '../Select/Select';
import { Button } from '../Button/Button';
import { ToggleButton } from '../ToogleButton.tsx/ToogleButton';
import { Checkbox } from '../CheckBox/CheckBox';
type InputType = 'input' | 'email' | 'password' | 'number' | 'select' | 'multiSelect' | 'checkbox' | 'toggle';


type ValidationRule =
    | { type: 'required' }
    | { type: 'email' }
    | { type: 'min' | 'max' | 'minLength' | 'maxLength'; value: number }
    | { type: 'noSpecialCharacters' }
    | { type: 'noSpecialCharactersOrNumbers' }
    | { type: 'alphaNumericSpaces' }
    | { type: 'noInitialSpaces' }
    | { type: 'noNumbers' };
interface WarningRule {
    type:
    | 'minLengthWarning'
    | 'maxLengthWarning'
    | 'weakPassword'
    | 'deprecatedEmailDomain'
    | 'ageIsLowButValid'
    | 'ageIsHighButValid'
    | 'unverifiedLanguage';
    value?: number;
}

export interface FieldModel {
    type: InputType;
    name: string;
    label: string;
    placeholder?: string;
    value: string | string[] | number | boolean;
    helperText?: string;
    inputSize?: 'md' | 'lg';
    variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
    options?: SelectOption[];
    validations?: ValidationRule[];
    warningRules?: WarningRule[];
    showIf?: (values: Record<string, any>) => boolean;
}

interface DynamicFormProps {
    fields: FieldModel[];
    onSubmit: (values: { [key: string]: any }) => void;
    title?: string;
    submitLabel?: string;
    showSubmitIf?: (values: Record<string, any>) => boolean;
    showSecondaryButtonIf?: (values: Record<string, any>) => boolean;
    onSecondaryButtonClick?: (values: Record<string, any>) => void;
    secondaryButtonLabel?: string;
}

type Variant = 'default' | 'success' | 'warning' | 'error' | 'info';

function resolveVariant(
    field: FieldModel,
    touched: Record<string, boolean | undefined>,
    errors: Record<string, any>,
    value: any
): { variant: Variant; helperText?: string } {
    const touchedField = touched[field.name];
    const error = errors[field.name];
    const warnings = field.warningRules || [];

    if (!touchedField) return { variant: 'default', helperText: field.helperText };

    if (error) return { variant: 'error', helperText: error };

    for (const rule of warnings) {
        if (rule.type === 'minLengthWarning' && typeof value === 'string' && value.length < (rule.value ?? 0)) {
            return {
                variant: 'warning',
                helperText: `Sugerencia: usa al menos ${rule.value} caracteres`,
            };
        }

        if (rule.type === 'maxLengthWarning' && typeof value === 'string' && value.length > (rule.value ?? 0)) {
            return {
                variant: 'warning',
                helperText: `Sugerencia: usa menos de ${rule.value} caracteres`,
            };
        }

        if (rule.type === 'weakPassword' && typeof value === 'string') {
            const isWeak = value.length < 8 || !/[A-Z]/.test(value) || !/[0-9]/.test(value);
            if (isWeak) {
                return {
                    variant: 'warning',
                    helperText: 'Sugerencia: usa al menos 8 caracteres, una mayúscula y un número',
                };
            }
        }

        if (rule.type === 'deprecatedEmailDomain' && typeof value === 'string') {
            const deprecated = ['hotmail.com', 'aol.com', 'live.com'];
            if (deprecated.some((d) => value.endsWith(`@${d}`))) {
                return {
                    variant: 'warning',
                    helperText: 'Sugerencia: usa un dominio de correo moderno',
                };
            }
        }

        if (rule.type === 'ageIsLowButValid' && typeof value === 'number' && value < 21) {
            return {
                variant: 'warning',
                helperText: 'Advertencia: puede que seas menor de edad para ciertos trámites',
            };
        }

        if (rule.type === 'ageIsHighButValid' && typeof value === 'number' && value > 80) {
            return {
                variant: 'warning',
                helperText: 'Advertencia: revise bien su edad, parece elevada',
            };
        }

        if (rule.type === 'unverifiedLanguage' && Array.isArray(value)) {
            const trusted = ['es', 'en', 'fr'];
            const unverified = value.find((v) => !trusted.includes(v));
            if (unverified) {
                return {
                    variant: 'warning',
                    helperText: `Idioma no verificado: ${unverified}`,
                };
            }
        }
    }

    return { variant: 'success', helperText: field.helperText };
}


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
    const initialValues = fields.reduce((acc, field) => {
        acc[field.name] = field.type === 'multiSelect' ? (field.value || []) : field.value || '';
        return acc;
    }, {} as Record<string, any>);

    const validationSchema = Yup.object(
        fields.reduce((acc, field) => {
            if (field.type === 'multiSelect') {
                let schema = Yup.array()
                    .of(Yup.string())
                    .typeError('Seleccione al menos una opción');
                field.validations?.forEach((rule) => {
                    if (rule.type === 'required') {
                        schema = schema.min(1, 'Seleccione al menos una opción');
                    }
                });
                acc[field.name] = schema;
            } else if (field.type === 'number') {
                let schema: NumberSchema<
                    number | undefined,
                    AnyObject,
                    number | undefined,
                    Flags
                > = Yup.number().typeError('Debe ser un número válido');
                field.validations?.forEach((rule) => {
                    if (rule.type === 'required') {
                        schema = schema.required('Este campo es requerido');
                    }
                    if (rule.type === 'min') {
                        const minValue = Number(rule.value ?? 0);
                        schema = schema.min(minValue, `Mínimo ${minValue}`);
                    }
                    if (rule.type === 'max') {
                        const maxValue = Number(rule.value ?? 0);
                        schema = schema.max(maxValue, `Máximo ${maxValue}`);
                    }
                });
                acc[field.name] = schema;
            } else {
                let schema = Yup.string();
                field.validations?.forEach((rule) => {
                    if (rule.type === 'required') {
                        schema = schema.required('Este campo es requerido');
                    }
                    if (rule.type === 'email') {
                        schema = schema
                            .email('Debe ser un email válido')
                            .test('no-dot-before-at', 'No puede tener punto justo antes del @', (value) => {
                                if (!value) return true;
                                const at = value.indexOf('@');
                                return at <= 0 || value[at - 1] !== '.';
                            });
                    }
                    if (rule.type === 'minLength' && typeof rule.value === 'number') {
                        schema = schema.min(rule.value, `Debe tener al menos ${rule.value} caracteres`);
                    }

                    if (rule.type === 'maxLength' && typeof rule.value === 'number') {
                        schema = schema.max(rule.value, `Debe tener máximo ${rule.value} caracteres`);
                    }
                    if (rule.type === 'noSpecialCharacters') {
                        schema = schema.matches(
                            /^[A-Za-z0-9]+$/,
                            'No se permiten espacios ni caracteres especiales'
                        );
                    }
                    if (rule.type === 'noSpecialCharactersOrNumbers') {
                        schema = schema.matches(
                            /^[A-Za-z\s]+$/,
                            'Solo letras, sin números ni caracteres especiales'
                        );
                    }
                    if (rule.type === 'alphaNumericSpaces') {
                        schema = schema.matches(
                            /^(?!\s)(?!.*\s$)[A-Za-z0-9\s]+$/,
                            'Letras, números y espacios sin espacios al inicio/final'
                        );
                    }
                    if (rule.type === 'noInitialSpaces') {
                        schema = schema.matches(/^(?!\s).+$/, 'No puede iniciar con espacio');
                    }
                    if (rule.type === 'noNumbers') {
                        schema = schema.matches(/^[^0-9]+$/, 'No se permiten números');
                    }
                });
                acc[field.name] = schema;
            }
            return acc;
        }, {} as Record<string, Yup.AnySchema>)
    );

    return (
        <div className="w-full max-w-2xl mx-auto p-4 space-y-6">
            {title && <h2 className="text-2xl font-bold">{title}</h2>}
            <Formik initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                    const cleanedValues = { ...values };
                    fields.forEach((field) => {
                        const isVisible = !field.showIf || field.showIf(values);
                        if (!isVisible) {
                            // Limpieza según tipo de campo
                            switch (field.type) {
                                case 'multiSelect':
                                    cleanedValues[field.name] = [];
                                    break;
                                case 'checkbox':
                                case 'toggle':
                                    cleanedValues[field.name] = false;
                                    break;
                                case 'number':
                                    cleanedValues[field.name] = null;
                                    break;
                                default:
                                    cleanedValues[field.name] = '';
                                    break;
                            }
                        }
                    });

                    onSubmit(cleanedValues);
                }}>
                {({ values, errors, touched, handleChange, handleBlur, setFieldValue }) => (
                    <Form className="space-y-6">
                        {fields
                            .filter((field) => !field.showIf || field.showIf(values)) // 👈 Aplica showIf
                            .map((field) => {
                                const value = values[field.name];
                                const { variant, helperText } = resolveVariant(
                                    field,
                                    touched as Record<string, boolean | undefined>,
                                    errors,
                                    value
                                );

                                const baseProps = {
                                    label: field.label,
                                    name: field.name,
                                    placeholder: field.placeholder,
                                    helperText,
                                    variant,
                                    inputSize: field.inputSize || 'md',
                                };

                                if (field.type === 'select') {
                                    return (
                                        <Select
                                            key={field.name}
                                            {...baseProps}
                                            selected={[value]}
                                            onChange={(vals) => setFieldValue(field.name, vals[0])}
                                            options={field.options || []}
                                        />
                                    );
                                }

                                if (field.type === 'multiSelect') {
                                    return (
                                        <Select
                                            key={field.name}
                                            {...baseProps}
                                            multiple
                                            selected={value}
                                            onChange={(vals) => setFieldValue(field.name, vals)}
                                            options={field.options || []}
                                        />
                                    );
                                }
                                // Checkbox
                                if (field.type === 'checkbox') {
                                    return (
                                        <div key={field.name}>
                                            <Checkbox
                                                checked={value}
                                                onChange={(val) => setFieldValue(field.name, val)}
                                                label={field.label}
                                                disabled={field.validations?.some(v => v.type === 'required') && false}
                                            />
                                        </div>
                                    );
                                }

                                // Toggle
                                if (field.type === 'toggle') {
                                    return (
                                        <div key={field.name}>
                                            <ToggleButton
                                                checked={value}
                                                onChange={(val) => setFieldValue(field.name, val)}
                                                label={field.label}
                                            />
                                        </div>
                                    );
                                }

                                return (
                                    <Input
                                        key={field.name}
                                        {...baseProps}
                                        value={value}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        type={field.type === 'email' ? 'email' : field.type}
                                    />
                                );
                            })}

                        <div className="flex justify-center  gap-4">
                            {showSecondaryButtonIf?.(values) && onSecondaryButtonClick && (
                                <Button
                                    variant="outline"
                                    type="button"
                                    onClick={() => onSecondaryButtonClick(values)}
                                >
                                    {secondaryButtonLabel || 'Acción secundaria'}
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

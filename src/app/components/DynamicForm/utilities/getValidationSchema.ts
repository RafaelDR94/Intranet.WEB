// DynamicForm/hooks/useValidationSchema.ts
import * as Yup from 'yup';
import type { NumberSchema, AnyObject, Flags } from 'yup';

import { FieldModel } from '../types';
/** Genera un esquema Yup a partir de los campos. */

export const getValidationSchema = (fields: FieldModel[]) => {
  return Yup.object(
    fields.reduce((acc, field) => {
      if (field.type === 'multiSelect') {
        let schema = Yup.array().of(Yup.string()).typeError('Seleccione al menos una opción');
        field.validations?.forEach((rule) => {
          if (rule.type === 'required') {
            schema = schema.min(1, 'Seleccione al menos una opción');
          }
        });
        acc[field.name] = schema;
      } else if (field.type === 'number' || field.type === 'numberControl') {
        let schema: NumberSchema<number | undefined, AnyObject, number | undefined, Flags> =
          Yup.number().typeError('Debe ser un número válido');
        field.validations?.forEach((rule) => {
          if (rule.type === 'required') {
            schema = schema.required('Este campo es requerido');
          }
          if (rule.type === 'min') {
            schema = schema.min(rule.value, `Mínimo ${rule.value}`);
          }
          if (rule.type === 'max') {
            schema = schema.max(rule.value, `Máximo ${rule.value}`);
          }
        });
        acc[field.name] = schema;
      } else if (field.type === 'file') {
        let schema = Yup.mixed();
        field.validations?.forEach((rule) => {
          if (rule.type === 'required') {
            schema = schema.required('Este campo es requerido');
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
              .test(
                'no-dot-before-at',
                'No puede tener punto justo antes del @',
                (value) => !value || value.indexOf('@') <= 0 || value[value.indexOf('@') - 1] !== '.'
              );
          }
          if (rule.type === 'minLength') {
            schema = schema.min(rule.value, `Debe tener al menos ${rule.value} caracteres`);
          }
          if (rule.type === 'maxLength') {
            schema = schema.max(rule.value, `Debe tener máximo ${rule.value} caracteres`);
          }
          if (rule.type === 'noSpecialCharacters') {
            schema = schema.matches(/^[A-Za-z0-9]+$/, 'No se permiten espacios ni caracteres especiales');
          }
          if (rule.type === 'noSpecialCharactersOrNumbers') {
            schema = schema.matches(/^[A-Za-z\s]+$/, 'Solo letras, sin números ni caracteres especiales');
          }
          if (rule.type === 'alphaNumericSpaces') {
            schema = schema.matches(/^(?!\s)(?!.*\s$)[A-Za-z0-9\s]+$/, 'Letras, números y espacios sin espacios al inicio/final');
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
};

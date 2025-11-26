// DynamicForm/hooks/useValidationSchema.ts
import * as Yup from 'yup';
import type { NumberSchema, AnyObject, Flags } from 'yup';

import { FieldModel } from '../types';
/** Genera un esquema Yup a partir de los campos. */

export const getValidationSchema = (fields: FieldModel[]) => {
  return Yup.object(
    fields.reduce((acc, field) => {
      if (field.type === 'multiSelect' || field.type === 'checkboxList') {
        let schema = Yup.array().of(Yup.string()).typeError('Seleccione al menos una opción');
        field.validations?.forEach((rule) => {
          if (rule.type === 'required') {
            schema = schema.min(1, 'Seleccione al menos una opción');
          }
        });
        acc[field.name] = schema;
      } else if (field.type === 'number' || field.type === 'numberControl' || field.type === 'controlLevel') {
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
      } else if (field.type === 'file' || field.type === 'imageUploaderExpanded') {
        // Para archivos/imágenes consideramos válido si existe un valor (File)
        // o si viene un archivo inicial (initialFile) ya cargado/mostrado.
        // Esto evita que, al editar un registro con imagen precargada,
        // la validación "required" falle antes de que el loader asincrónico
        // convierta initialFile en File.
        const schema = Yup.mixed()
          .nullable()
          .test('file-or-initial', 'Este campo es requerido', (val) => {
            const hasValue = val != null;
            const hasInitial = !!field.initialFile;
            // Si el campo es requerido, aceptamos que exista valor o initialFile
            const required = field.validations?.some((v) => v.type === 'required');
            return required ? (hasValue || hasInitial) : true;
          });

        // Mantiene compatibilidad por si en el futuro se agregan otras reglas
        field.validations?.forEach((rule) => {
          if (rule.type === 'required') {
            // Ya validamos en el test anterior, no añadimos required aquí para no
            // sobrescribir la lógica personalizada.
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

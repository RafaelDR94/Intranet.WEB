import { FieldModel } from '../types';
import { cleanHiddenFields } from '../utilities/cleanHiddenFields';
import { getInitialValues } from '../utilities/getInitialValues';
import { getValidationSchema } from '../utilities/getValidationSchema';
import { resolveVariant } from '../utilities/resolveVariant';


/**
 * Crea utilidades derivadas de un conjunto de campos para construir un formulario dinámico.
 *
 * @param fields Definiciones de los campos que se renderizarán.
 * @returns Valores iniciales, esquema de validación, función para limpiar campos ocultos y resolvedor de variantes visuales.
 */
export const useDynamicForm = (fields: FieldModel[]) => {
  // Valores iniciales obtenidos del modelo
  const initialValues = getInitialValues(fields);

  // Esquema de validación basado en Yup
  const validationSchema = getValidationSchema(fields);

  // Limpieza de campos ocultos
  const cleanValues = (values: Record<string, unknown>) =>
    cleanHiddenFields(fields, values);


  return { initialValues, validationSchema, resolveVariant, cleanValues };
};
import { FieldModel } from '../types';
import { getInitialValues } from '../utilities/getInitialValues';
import { getValidationSchema } from '../utilities/getValidationSchema';
import { cleanHiddenFields } from '../utilities/cleanHiddenFields';
import { resolveVariant } from '../utilities/resolveVariant';
export const useDynamicForm = (fields: FieldModel[]) => {
  // 1) Valores iniciales
  const initialValues = getInitialValues(fields);

  // 2) Esquema Yup
  const validationSchema = getValidationSchema(fields);

  // 3) Limpieza de campos ocultos
  const cleanValues = (values: Record<string, any>) =>
    cleanHiddenFields(fields, values);

  return { initialValues, validationSchema, resolveVariant,cleanValues };
};
import { FieldModel } from '../types';

/** Obtiene los valores iniciales para un conjunto de campos. */
export const getInitialValues = (fields: FieldModel[]) => {
  return fields.reduce((acc, field) => {
    switch (field.type) {
      case 'multiSelect':
        acc[field.name] = field.value || [];
        break;
      case 'checkbox':
      case 'toggle':
        acc[field.name] = field.value ?? false;
        break;
      case 'number':
      case 'numberControl':
        acc[field.name] = field.value ?? null;
        break;
      case 'file':
        acc[field.name] = field.value ?? null;
        break;
      default:
        acc[field.name] = field.value ?? '';
    }
    return acc;
  }, {} as Record<string, any>);
};

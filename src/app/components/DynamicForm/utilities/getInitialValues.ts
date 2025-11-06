import { FieldModel } from '../types';

/** Obtiene los valores iniciales para un conjunto de campos. */
export const getInitialValues = (fields: FieldModel[]) => {
  return fields.reduce((acc, field) => {
    switch (field.type) {
      case 'multiSelect':
      case 'checkboxList':
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
      case 'controlLevel': {
        const fallback =
          field.controlLevelProps?.initialValue ??
          field.controlLevelProps?.min ??
          0;
        const value =
          typeof field.value === 'number' ? field.value : fallback;
        acc[field.name] = value;
        break;
      }
      case 'file':
      case 'imageUploaderExpanded':
        acc[field.name] = field.value ?? null;
        break;
      default:
        acc[field.name] = field.value ?? '';
    }
    return acc;
  }, {} as Record<string, any>);
};

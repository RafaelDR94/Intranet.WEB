import { FieldModel } from '../types';

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
        acc[field.name] = field.value ?? null;
        break;
      default:
        acc[field.name] = field.value ?? '';
    }
    return acc;
  }, {} as Record<string, any>);
};

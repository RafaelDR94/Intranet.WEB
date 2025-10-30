import { FieldModel } from "../types";
/** Limpia los valores de campos ocultos. */
export const cleanHiddenFields = (fields: FieldModel[], values: Record<string, any>) => {
  const cleanedValues = { ...values };

  fields.forEach((field) => {
    const isVisible = !field.showIf || field.showIf(values, fields);
    if (!isVisible) {
      switch (field.type) {
        case 'multiSelect':
        case 'checkboxList':
          cleanedValues[field.name] = [];
          break;
        case 'checkbox':
        case 'toggle':
          cleanedValues[field.name] = false;
          break;
        case 'number':
        case 'numberControl':
        case 'controlLevel':
          cleanedValues[field.name] = null;
          break;
        case 'file':
          cleanedValues[field.name] = null;
          break;
        default:
          cleanedValues[field.name] = '';
          break;
      }
    }
  });

  return cleanedValues;
};

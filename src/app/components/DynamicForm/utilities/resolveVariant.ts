import { FieldModel, Variant, WarningRule } from '../types';

export const resolveVariant = (
  field: FieldModel,
  touched: Record<string, boolean | undefined>,
  errors: Record<string, any>,
  value: any
): { variant: Variant; helperText?: string } => {
  const touchedField = touched[field.name];
  const error = errors[field.name];
  const warnings: WarningRule[] = field.warningRules || [];

  if (!touchedField) return { variant: 'default', helperText: field.helperText };
  if (error) return { variant: 'error', helperText: error };

  for (const rule of warnings) {
    if (rule.type === 'minLengthWarning' && typeof value === 'string' && value.length < (rule.value ?? 0)) {
      return { variant: 'warning', helperText: `Sugerencia: usa al menos ${rule.value} caracteres` };
    }

    if (rule.type === 'maxLengthWarning' && typeof value === 'string' && value.length > (rule.value ?? 0)) {
      return { variant: 'warning', helperText: `Sugerencia: usa menos de ${rule.value} caracteres` };
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
        return { variant: 'warning', helperText: 'Sugerencia: usa un dominio de correo moderno' };
      }
    }

    if (rule.type === 'ageIsLowButValid' && typeof value === 'number' && value < 21) {
      return { variant: 'warning', helperText: 'Advertencia: puede que seas menor de edad para ciertos trámites' };
    }

    if (rule.type === 'ageIsHighButValid' && typeof value === 'number' && value > 80) {
      return { variant: 'warning', helperText: 'Advertencia: revise bien su edad, parece elevada' };
    }

    if (rule.type === 'unverifiedLanguage' && Array.isArray(value)) {
      const trusted = ['es', 'en', 'fr'];
      const unverified = value.find((v) => !trusted.includes(v));
      if (unverified) {
        return { variant: 'warning', helperText: `Idioma no verificado: ${unverified}` };
      }
    }
  }

  return { variant: 'success', helperText: field.helperText };
}
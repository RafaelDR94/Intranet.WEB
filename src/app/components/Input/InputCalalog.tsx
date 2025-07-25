'use client';

import { Input } from './Input';

const variants = [
  'default',
  'filled',
  'disabled',
  'success',
  'info',
  'warning',
  'error',
] as const;

const sizes = ['lg', 'md'] as const;

const helperMessages: Record<(typeof variants)[number], string> = {
  default: 'Texto de ayuda general.',
  filled: 'Con fondo lleno.',
  disabled: 'Campo desactivado.',
  success: 'Entrada válida.',
  info: 'Información adicional.',
  warning: 'Revisa este campo.',
  error: 'Campo obligatorio.',
};

export const InputCatalog = () => {
  return (
    <div className="space-y-8 px-4">
      {sizes.map((size) => (
        <div key={size}>
          <h2 className="text-xl font-bold mb-4">{size === 'lg' ? 'Grande' : 'Mediano'}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 border border-dashed p-6 rounded-xl">
            {variants.map((variant) => (
              <Input
                key={`${size}-${variant}`}
                inputSize={size}
                variant={variant}
                label={`Input ${variant}`}
                placeholder="Placeholder"
                helperText={helperMessages[variant]}
                disabled={variant === 'disabled'}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

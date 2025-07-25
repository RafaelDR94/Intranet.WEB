'use client';

import React, { useState } from 'react';
import { Select, SelectOption } from './Select';

const variants = [
  'default',
  'success',
  'info',
  'warning',
  'error',
] as const;

const sizes = ['md', 'lg'] as const;

const sampleOptions: SelectOption[] = [
  { label: 'Option One', value: '1' },
  { label: 'Option Two', value: '2' },
  { label: 'Option Three', value: '3' },
];

const helperMessages: Record<(typeof variants)[number], string> = {
  default: 'Texto de ayuda general.',
  success: '¡Selección correcta!',
  info: 'Información adicional útil.',
  warning: 'Ten cuidado al seleccionar.',
  error: 'Este campo es obligatorio.',
};

export const SelectCatalog = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const [multiSelected, setMultiSelected] = useState<string[]>(['2']);

  return (
    <div className="p-6 space-y-12">
      {sizes.map((size) => (
        <div key={size}>
          <h2 className="text-xl font-bold mb-4 capitalize">Size: {size}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {variants.map((variant) => (
              <Select
                key={`${size}-${variant}`}
                label={`Select ${variant}`}
                placeholder="Choose an option"
                size={size}
                variant={variant}
                multiple={false}
                selected={selected}
                onChange={setSelected}
                options={sampleOptions}
                helperText={helperMessages[variant]}
              />
            ))}
            <Select
              key={`${size}-disabled`}
              label="Select disabled"
              placeholder="No disponible"
              size={size}
              disabled
              variant="default"
              multiple={false}
              selected={[]}
              onChange={() => {}}
              options={sampleOptions}
              helperText="Este campo está desactivado."
            />
          </div>
        </div>
      ))}

      <div>
        <h2 className="text-xl font-bold mb-4">Multiselect Example</h2>
        <Select
          label="Select multiple"
          placeholder="Choose options"
          size="lg"
          multiple
          selected={multiSelected}
          onChange={setMultiSelected}
          options={[
            ...sampleOptions,
            { label: 'Disabled Option', value: '4', disabled: true },
          ]}
          helperText="Puedes elegir más de una opción"
          variant="info"
        />
      </div>
    </div>
  );
};

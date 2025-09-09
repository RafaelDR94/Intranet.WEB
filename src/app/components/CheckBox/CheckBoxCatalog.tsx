'use client';

import { useState } from 'react';

import { Checkbox } from './CheckBox';

type RowState = {
  label: string;
  checked: boolean;
  indeterminate: boolean;
  disabled: boolean;
};

export default function CheckboxCatalog() {
  const [rows, setRows] = useState<RowState[]>([
    { label: 'Default', checked: false, indeterminate: false, disabled: false },
    { label: 'Hover', checked: true, indeterminate: false, disabled: false },
    { label: 'Focus', checked: true, indeterminate: false, disabled: false },
    { label: 'Selected', checked: true, indeterminate: false, disabled: false },
    { label: 'Indeterminate', checked: false, indeterminate: true, disabled: false },
    { label: 'Disabled', checked: false, indeterminate: false, disabled: true },
  ]);

  const handleToggle = (index: number) => {
    setRows((prev) =>
      prev.map((row, i) =>
        i === index
          ? {
              ...row,
              checked: !row.checked,
              // si estaba indeterminate, lo quitamos y activamos checked
              indeterminate: false,
            }
          : row
      )
    );
  };

  return (
    <div className="p-8">
      <h2 className="text-h3 font-display mb-6">Checkbox</h2>
      <div className="grid grid-cols-[120px_80px_1fr_1fr] gap-4 items-center">
        {/* Header */}
        <div />
        <div />
        <div className="border-dashed border-r border-purple-300 pr-4" />
        <div />

        {rows.map((row, i) => (
          <div key={i} className="contents">
            {/* Etiqueta (Default, Hover, etc.) */}
            <div className="font-medium">{row.label}</div>

            {/* Checkbox sin label */}
            <div>
              <Checkbox
                checked={row.checked}
                indeterminate={row.indeterminate}
                disabled={row.disabled}
                onChange={() => handleToggle(i)}
              />
            </div>

            {/* Checkbox con label a la derecha */}
            <div className="border-dashed border-r border-purple-300 pr-4">
              <Checkbox
                label="Texto"
                checked={row.checked}
                indeterminate={row.indeterminate}
                disabled={row.disabled}
                onChange={() => handleToggle(i)}
                labelPosition="right"
              />
            </div>

            {/* Checkbox con label a la izquierda */}
            <div>
              <Checkbox
                label="Texto"
                checked={row.checked}
                indeterminate={row.indeterminate}
                disabled={row.disabled}
                onChange={() => handleToggle(i)}
                labelPosition="left"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

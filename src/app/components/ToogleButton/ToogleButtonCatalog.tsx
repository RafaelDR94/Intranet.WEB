'use client';

import { useState } from 'react';

import { ToggleButton } from './ToogleButton';

type RowState = {
  label: string;
  checked: boolean;
  disabled: boolean;
};

export default function ToogleButtonCatalog() {
  const [rows, setRows] = useState<RowState[]>([
    { label: 'Default Off', checked: false, disabled: false },
    { label: 'Checked On', checked: true, disabled: false },
    { label: 'Disabled Off', checked: false, disabled: true },
    { label: 'Disabled On', checked: true, disabled: true },
  ]);

  const handleToggle = (index: number) => {
    setRows((prev) =>
      prev.map((row, i) =>
        i === index
          ? {
              ...row,
              checked: !row.checked,
            }
          : row
      )
    );
  };

  return (
    <div className="p-8">
      <h2 className="text-h3 font-display mb-6">ToggleButton</h2>
      <div className="grid grid-cols-[140px_80px_1fr_1fr] gap-4 items-center">
        {rows.map((row, i) => (
          <div key={i} className="contents">
            <div className="font-medium">{row.label}</div>
            <div>
              <ToggleButton
                checked={row.checked}
                disabled={row.disabled}
                onChange={() => handleToggle(i)}
              />
            </div>
            <div className="border-dashed border-r border-purple-300 pr-4">
              <ToggleButton
                label="Etiqueta Derecha"
                checked={row.checked}
                disabled={row.disabled}
                onChange={() => handleToggle(i)}
                labelPosition="right"
              />
            </div>
            <div>
              <ToggleButton
                label="Etiqueta Izquierda"
                checked={row.checked}
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

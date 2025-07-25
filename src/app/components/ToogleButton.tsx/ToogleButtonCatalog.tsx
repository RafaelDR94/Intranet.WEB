'use client';
// ToggleButtonCatalog.tsx
import React, { useState } from 'react';
import { ToggleButton } from './ToogleButton';

export const ToggleButtonCatalog: React.FC = () => {
  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(true);
  const [checked3, setChecked3] = useState(false);
  const [checked4, setChecked4] = useState(true);

  const rowClass = 'flex items-center gap-6';

  return (
    <div className="p-8  rounded-xl shadow-md max-w-4xl mx-auto space-y-4">
      <h2 className="text-2xl font-semibold text-black-80">Toggle</h2>

      <div className="grid grid-cols-4 gap-x-6 gap-y-4 text-sm text-black-100">
        <div className="space-y-4">
          <div className={rowClass}>
            <span>Default</span>
          </div>
          <div className={rowClass}>
            <span>Hover</span>
          </div>
          <div className={rowClass}>
            <span>Focus</span>
          </div>
          <div className={rowClass}>
            <span>Disabled</span>
          </div>
        </div>

        {/* Toggle sin texto */}
        <div className="space-y-4 border border-dashed border-purple-300 p-2">
          <ToggleButton checked={false} onChange={() => {}} />
          <ToggleButton checked={true} onChange={() => {}} />
          <ToggleButton checked={false} onChange={setChecked1} />
          <ToggleButton checked={false} onChange={() => {}} disabled />
        </div>

        {/* Toggle con texto (label a la derecha) */}
        <div className="space-y-4 border border-dashed border-purple-300 p-2">
          <ToggleButton checked={false} onChange={() => {}} label="Texto" />
          <ToggleButton checked={true} onChange={() => {}} label="Texto" />
          <ToggleButton checked={true} onChange={() => {}} label="Texto" />
          <ToggleButton
            checked={false}
            onChange={() => {}}
            label="Texto"
            disabled
          />
        </div>

        {/* Toggle con texto (label a la izquierda) */}
        <div className="space-y-4 border border-dashed border-purple-300 p-2">
          <ToggleButton
            checked={false}
            onChange={() => {}}
            label="Texto"
            labelPosition="left"
          />
          <ToggleButton
            checked={false}
            onChange={() => {}}
            label="Texto"
            labelPosition="left"
          />
          <ToggleButton
            checked={true}
            onChange={() => {}}
            label="Texto"
            labelPosition="left"
          />
          <ToggleButton
            checked={false}
            onChange={() => {}}
            label="Texto"
            labelPosition="left"
            disabled
          />
        </div>
      </div>
    </div>
  );
};

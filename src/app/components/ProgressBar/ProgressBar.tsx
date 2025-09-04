'use client'
import React from 'react';
import { progressBarStyles } from './styles';
import { ProgressBarProps } from './types';

/**
 * Barra de **progreso** visual (0–100).
 *
 * Muestra un contenedor con el “track” completo y una franja rellena según `value`.
 * Opcionalmente, renderiza una etiqueta con el porcentaje o un texto personalizado.
 *
 * @remarks
 * - El componente **no almacena estado**; pinta según la prop `value`.
 * - Se **clampa** internamente `value` a `[0, 100]` para evitar overflow visual.
 * - Si `showPercentage` es `true`, muestra `label ?? \`\${value}%\``.
 *
 * @accessibility
 * - Usa `role="progressbar"` y expone `aria-valuemin`, `aria-valuemax` y `aria-valuenow`.
 * - Si no pasas `label`, se usará “Progreso” como nombre accesible.
 * - Si quieres un texto más rico para lectores de pantalla, pasa `label` (se usa como `aria-valuetext`).
 *
 * @example
 * ```tsx
 * <ProgressBar value={42} />
 * ```
 *
 * @example Con etiqueta personalizada
 * ```tsx
 * <ProgressBar value={75} label="Subiendo archivo…" showPercentage />
 * ```
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  label,
  showPercentage = true,
}) => {
  return (
    <div className={progressBarStyles.ProgressBarCtn}>
      
      {/* Etiqueta opcional del progreso (porcentaje o personalizada) */}
      {showPercentage && (
        <span className={progressBarStyles.ProgressBarLabel}>
          {label ?? `${value}%`}
        </span>
      )}
      
      {/* Contenedor de la barra de fondo y progreso */}
      <div className={progressBarStyles.ProgressBarBg}>
        
        {/* Fondo completo para referencia visual del 100% */}
        <div
          className={progressBarStyles.ProgressBarBgFull}
          style={{ width: '100%' }}
        />

        {/* Barra de progreso rellena dinámicamente según valor */}
        <div
          className={progressBarStyles.ProgressBarFill}
          style={{ width: `${value}%` }}
          data-testid="progress-fill"
        />
      </div>
    </div>
  );
};

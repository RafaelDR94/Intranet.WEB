'use client'
import React from 'react';
import { progressBarStyles } from './styles';
import { ProgressBarProps } from './types';

/**
 * Componente de barra de progreso visual.
 *
 * @param {number} value - Valor numérico del progreso (de 0 a 100).
 * @param {string} [label] - Texto opcional a mostrar como etiqueta (por defecto, el porcentaje).
 * @param {boolean} [showPercentage=true] - Si se debe mostrar o no la etiqueta de porcentaje.
 * @returns {JSX.Element} Elemento visual de barra de progreso.
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

'use client';
import React from 'react';
import { classes } from './styles';
import { Spinner } from '@/app/components/Spinner/Spinner';
import { LoadingOverlayProps } from './types';

const clampOpacity = (v: number) => Math.min(Math.max(v, 0), 100);

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  open,
  message = 'Espera un momento, tu información se está enviando',
  spinnerSize = 'medium',
  blur = true,
  backdropOpacity, // <- solo se aplica si viene definido, para no cambiar el look actual
  ariaLabel = 'Cargando',
  scope = 'viewport', // <- por defecto pantalla completa (o ajusta a 'container' si prefieres)
}) => {
  if (!open) return null;

  // Solo aplicamos opacidad dinámica si la prop viene definida (para no alterar el estilo actual)
  const bgStyle =
    typeof backdropOpacity === 'number'
      ? { backgroundColor: `rgba(75, 75, 75, ${clampOpacity(backdropOpacity) / 100})` }
      : undefined;

  const node = (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={ariaLabel}
      className={classes.overlay({ blur, backdropOpacity: backdropOpacity ?? 60 })}
      data-testid="loading-overlay"
      style={bgStyle}
    >
      <div className={classes.box}>
        <Spinner size={spinnerSize} />
        <p className={classes.text}>{message}</p>
      </div>
    </div>
  );

  // Si quieres solo el contenedor: devuelve el overlay directo (absolute + inset-0).
  // Si quieres pantalla completa: lo envolvemos en un wrapper fixed + inset-0.
  return scope === 'container' ? node : (
    <div className="fixed inset-0 z-[60]">
      {node}
    </div>
  );
};

export default LoadingOverlay;

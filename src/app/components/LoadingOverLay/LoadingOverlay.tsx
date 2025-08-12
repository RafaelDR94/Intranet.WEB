'use client';
import React from 'react';
import { classes } from './styles';
import { Spinner } from '@/app/components/Spinner/Spinner';
import type { SpinnerSize } from '@/app/components/Spinner/types';

export type LoadingOverlayProps = {
  open: boolean;
  message?: string;
  spinnerSize?: SpinnerSize;
  blur?: boolean;
  backdropOpacity?: number; 
  ariaLabel?: string;
};

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  open,
  message = 'Espera un momento, tu información se está enviando',
  spinnerSize = 'medium',
  blur = true,
  backdropOpacity = 80,
  ariaLabel = 'Cargando',
}) => {
  if (!open) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={ariaLabel}
      className={classes.overlay({ blur, backdropOpacity })}
      data-testid="loading-overlay"
    >
      <div className={classes.box}>
        <Spinner size={spinnerSize} />
        <p className={classes.text}>{message}</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;

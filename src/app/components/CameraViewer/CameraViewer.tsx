'use client';

import clsx from 'clsx';
import React from 'react';

import { Button } from '@/app/components/Button/Button';

import { useCameraViewer } from './hooks/useCameraViewer';
import {
  controlsClasses,
  errorMessageClasses,
  overlayClasses,
  panelClasses,
  videoClasses,
  mirroredVideoClasses,
} from './styles';
import { CameraViewerProps } from './types';

/**
 * Modal reutilizable para mostrar el getUserMedia del navegador y capturar una foto.
 *
 * Encapsula la logica de inicializar/cambiar camara (useCameraViewer), mostrar estados
 * de carga/errores y exponer acciones predefinidas (cerrar, alternar camara, capturar).
 * Tras tomar una fotografia, la convierte en File y la devuelve mediante onCapture.
 */
export const CameraViewer: React.FC<CameraViewerProps> = ({
  isOpen,
  onClose,
  onCapture,
  defaultFacingMode = 'environment',
  captureButtonLabel = 'Capturar',
  switchButtonLabel = 'Cambiar camara',
  closeButtonLabel = 'Cerrar',
  className,
  onError,
}) => {
  const { videoRef, facingMode, isLoading, error, toggleFacingMode, capturePhoto, closeStream } =
    useCameraViewer({ isOpen, defaultFacingMode, onError });

  const finalizeClose = () => {
    closeStream();
    onClose();
  };

  const handleCapture = async () => {
    const file = await capturePhoto();
    if (!file) return;
    onCapture(file);
    finalizeClose();
  };

  if (!isOpen) return null;

  return (
    <div className={clsx(overlayClasses, className)} role="dialog" aria-modal="true">
      <div className={panelClasses}>
        <video
          ref={videoRef}
          className={clsx(videoClasses, facingMode === 'user' && mirroredVideoClasses)}
          autoPlay
          playsInline
          muted
        />

        {isLoading && <p className="text-sm text-gray-70 text-center">Activando camara...</p>}
        {error && <p className={errorMessageClasses}>{error}</p>}

        <div className={controlsClasses}>
          <Button type="button" variant="ghost" hideIcon onClick={finalizeClose} disabled={isLoading}>
            {closeButtonLabel}
          </Button>
          <Button type="button" variant="ghost" hideIcon onClick={toggleFacingMode} disabled={isLoading || !!error}>
            {switchButtonLabel}
          </Button>
          <Button
            type="button"
            variant="solid"
            hideIcon
            onClick={handleCapture}
            disabled={isLoading || !!error}
          >
            {captureButtonLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CameraViewer;


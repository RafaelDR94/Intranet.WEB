'use client';

import clsx from 'clsx';
import React from 'react';

import CameraIcon from '@/assets/icons/Fotos y Videos/camera.svg';
import { Button } from '@/app/components/Button/Button';
import { labelClasses } from '@/app/components/Input/styles';
import { CameraViewer } from '@/app/components/CameraViewer/CameraViewer';
import CloseIcon from '@/assets/icons/acciones/cancel.svg';

import { useImageUploaderExpanded } from './hooks/useImageUploaderExpanded';
import {
  buttonWrapperClasses,
  cameraButtonClasses,
  cameraIconClasses,
  containerClasses,
  dropzoneBaseClasses,
  dropzoneDisabledClasses,
  dropzoneDraggingClasses,
  dropzoneIdleClasses,
  helperTextClasses,
  separatorClasses,
  previewWrapperClasses,
  previewImageClasses,
  previewActionsClasses,
  previewCancelButtonClasses,
} from './styles';
import { ImageUploaderExpandedProps } from './types';

/**
 * Componente para subir imagenes con dropzone, boton clasico y captura desde camara.
 *
 * Ofrece tres interacciones sincronizadas:
 * - Drag & Drop sobre la tarjeta principal.
 * - Seleccion manual mediante un <input type="file" /> oculto y un boton Button.
 * - captura directa al abrir CameraViewer, que rellena el input oculto tras tomar la foto.
 *
 * El hook interno tambien cierra la camara cuando el contenedor deja de ser visible en pantalla
 * (via IntersectionObserver), y respeta disabled para bloquear cualquier accion.
 */
export const ImageUploaderExpanded: React.FC<ImageUploaderExpandedProps> = ({
  label,
  placeholder,
  onImage,
  disabled = false,
  className,
  defaultFacingMode = 'environment',
  accept = 'image/*',
  buttonLabel = 'Seleccionar Imagen',
  cameraLabels,
  cameraButtonAriaLabel = 'Abrir camara',
  initialFile,
  dataTestId,
  preview = false,
}) => {
  const [isChanging, setIsChanging] = React.useState(false);
  const {
    inputRef,
    handleButtonClick,
    handleChange,
    isDragging,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    displayText,
    containerRef,
    isCameraOpen,
    openCamera,
    closeCamera,
    handleCaptureFromCamera,
    previewUrl,
    openPreview,
  } = useImageUploaderExpanded({
    onImage,
    accept,
    disabled,
    placeholder,
    initialFile,
  });

  // Mantener modo "cambiar" hasta que el usuario seleccione/capture otra imagen.
  // Se cerrará explícitamente en los handlers (input, drop, camera).

  const dropzoneClasses = clsx(
    className || dropzoneBaseClasses,
    isDragging ? dropzoneDraggingClasses : dropzoneIdleClasses,
    disabled && dropzoneDisabledClasses,

  );

  const { capture: captureLabel, switchCamera, close } = cameraLabels ?? {};

  const isPreviewVisible = preview && !!previewUrl && !isChanging;

  return (
    <div className={containerClasses} ref={containerRef} data-testid={dataTestId}>
      {label && <label className={labelClasses()}>{label}</label>}

      {isPreviewVisible ? (
        <div className={previewWrapperClasses}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl ?? ''}
            alt="Vista previa"
            className={previewImageClasses}
            onClick={openPreview}
          />

          <div className={previewActionsClasses}>
            <Button
              type="button"
              variant="outline"
              hideIcon
              onClick={() => setIsChanging(true)}
              disabled={disabled}
              className="px-8"
            >
              Cambiar imagen
            </Button>
          </div>
        </div>
      ) : (
        <div
          className={dropzoneClasses}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={(e) => {
            handleDrop(e);
            if (preview) setIsChanging(false);
          }}
        >
          {/* Botón cancelar cuando estamos en modo cambio dentro de preview */}
          {preview && isChanging && (
            <div className={previewCancelButtonClasses}>
              <Button
                variant="ghost"
                size="small"
                iconOnly
                aria-label="Cancelar cambio de imagen"
                icon={() => <CloseIcon className="h-6 w-6" />}
                onClick={() => setIsChanging(false)}
              />
            </div>
          )}

          <button
            type="button"
            className={cameraButtonClasses}
            onClick={openCamera}
            disabled={disabled}
            aria-label={cameraButtonAriaLabel}
          >
            <CameraIcon className={cameraIconClasses} />
          </button>

          <span className={separatorClasses}>o</span>
          <p className={helperTextClasses}>{displayText}</p>

          <input
            type="file"
            accept={accept}
            ref={inputRef}
            onChange={(e) => {
              handleChange(e);
              if (preview) setIsChanging(false);
            }}
            className="hidden"
            disabled={disabled}
          />

          <div className={buttonWrapperClasses}>
            <Button
              type="button"
              variant="outline"
              hideIcon
              onClick={handleButtonClick}
              disabled={disabled}
              className="px-8"
            >
              {buttonLabel}
            </Button>
          </div>
        </div>
      )}

      <CameraViewer
        isOpen={isCameraOpen}
        onClose={closeCamera}
        onCapture={(file) => {
          handleCaptureFromCamera(file);
          if (preview) setIsChanging(false);
        }}
        defaultFacingMode={defaultFacingMode}
        captureButtonLabel={captureLabel ?? 'Capturar'}
        switchButtonLabel={switchCamera ?? 'Cambiar camara'}
        closeButtonLabel={close ?? 'Cerrar'}
      />
    </div>
  );
};

export default ImageUploaderExpanded;


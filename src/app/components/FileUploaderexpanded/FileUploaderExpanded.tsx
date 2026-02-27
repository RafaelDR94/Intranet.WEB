// src/app/components/FileUploaderExpanded/FileUploaderExpanded.tsx
'use client';

import clsx from 'clsx';
import React from 'react';

import { useFileUploaderExpanded } from './hooks/useFileUploaderExpanded';
import {
  dropzoneBase,
  dropzoneIdle,
  dropzoneDragging,
  dropzoneDisabled,
  textBase,
  textIdle,
  buttonWrapper,
} from './styles';

import { Button } from '@/app/components/Button/Button';
import { FileUploaderProps } from '@/app/components/FileUploader/types';
import { labelClasses } from '@/app/components/Input/styles';


/**
 * Uploader con **zona de arrastre y suelta** (drag & drop) y botón de selección.
 *
 * Renderiza una “dropzone” estilizada que:
 * - Acepta archivos arrastrados (muestra estado visual durante el drag).
 * - Permite seleccionar manualmente con un botón (abre el diálogo del sistema).
 * - Muestra el nombre del archivo seleccionado (o un `placeholder`).
 *
 * @remarks
 * - `onFile(File|null)` es el punto único de salida: el hook interno normaliza
 *   el flujo tanto para drag&drop como para selección manual.
 * - `accept` soporta patrones `.pdf`, `.xml`, `image/*`, `application/pdf`, etc.
 * - `initialFile` permite precargar un archivo (p. ej. en modo edición) y mostrar su nombre.
 * - El texto principal de la zona se determina con prioridad: **archivo > placeholder > texto por defecto**.
 *
 * @accessibility
 * - Si se provee `label`, se renderiza encima y actúa como nombre accesible.
 * - Para anunciar el nombre del archivo a lectores de pantalla, puedes envolver el texto en
 *   un contenedor con `aria-live="polite"` (ver comentario en `<p>`).
 * - La dropzone reacciona a eventos de drag; el botón es el control interactivo principal.
 * - Considera añadir instrucciones visibles si los formatos/tamaños son relevantes.
 *
 * @example Uso básico
 * ```tsx
 * <FileUploaderExpanded
 *   label="Comprobante"
 *   accept=".pdf"
 *   onFile={(file) => console.log(file)}
 * />
 * ```
 *
 * @example Con placeholder y archivo inicial
 * ```tsx
 * <FileUploaderExpanded
 *   label="XML CFDI"
 *   accept=".xml"
 *   placeholder="Arrastra o selecciona un XML"
 *   initialFile={{ name: 'factura-123.xml', url: '/files/factura-123.xml' }}
 *   onFile={(file) => {/* manejar archivo }}
 * />
 * ```
 *
 * @fires onFile Se invoca con el archivo seleccionado (`File`) o `null` si se limpió/canceló.
 */

export const FileUploaderExpanded: React.FC<FileUploaderProps> = ({
  accept,
  label,
  placeholder, // opcional: si prefieres sobreescribir el texto por defecto
  onFile,
  disabled = false,
  className,
  initialFile,
}) => {
  const {
    inputRef,
    fileName,
    handleButtonClick,
    handleChange,
    isDragging,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    mainText,
  } = useFileUploaderExpanded(onFile, accept, disabled, initialFile);

  const textToShow = fileName ?? placeholder ?? mainText;

  return (
    <div className="flex flex-col gap-2 w-full">
      {label && <label className={labelClasses()}>{label}</label>}

      <div
        className={clsx(
          dropzoneBase,
          isDragging ? dropzoneDragging : dropzoneIdle,
          disabled && dropzoneDisabled,
          className
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept={accept}
          ref={inputRef}
          onChange={handleChange}
          className="hidden"
          disabled={disabled}
        />

        <p className={clsx(textBase, !fileName && textIdle)}>{textToShow}</p>

        <Button
          type="button"
          onClick={handleButtonClick}
          disabled={disabled}
          hideIcon
          className={buttonWrapper}
          variant="outline"
        >
          Seleccionar Archivo
        </Button>
      </div>
    </div>
  );
};

export default FileUploaderExpanded;

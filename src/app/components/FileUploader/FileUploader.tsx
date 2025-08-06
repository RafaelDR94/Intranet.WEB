'use client';

import React, { SVGProps } from 'react';
import clsx from 'clsx';
import UploadIcon from '@/assets/icons/acciones/upload.svg';
import { Button } from '../Button/Button';
import { FileUploaderProps } from './types';
import { useFileUploader } from './hooks/useFileUploader';
import { filenamestyle,typelabelstyle,buttoncontainerstyle } from './styles';
import { labelClasses} from '../Input/styles';

/**
 * Componente para subir archivos mediante un botón estilizado.
 *
 * @param accept Tipos de archivos aceptados (ej: ".pdf", ".xml", "image/*").
 * @param label Texto que se muestra sobre el botón.
 * @param placeholder Texto dentro del botón cuando no hay archivo.
 * @param onFile Callback que recibe el archivo seleccionado (File o null).
 * @param disabled Si se desactiva el botón de carga.
 * @param className Clases adicionales para personalizar el botón.
 * @param icon Ícono personalizado a mostrar en el botón (SVG React component). Si no se proporciona, usa el ícono por defecto `UploadIcon`.
 */
export const FileUploader: React.FC<FileUploaderProps> = ({
  accept,
  label,
  placeholder,
  onFile,
  disabled = false,
  className,
  icon,
  initialFile,
}) => {
  const {
    inputRef,
    fileName,
    handleButtonClick,
    handleChange,
    allowedTypesLabel,
  } = useFileUploader(onFile, accept, disabled, initialFile);

  const IconToUse: React.FC<SVGProps<SVGSVGElement>> = icon ?? UploadIcon;

  return (
    <div className="flex flex-col gap-2">
      {label && <label className={labelClasses()}>{label}</label>}
      <div className={buttoncontainerstyle}>
        <input
          type="file"
          accept={accept}
          ref={inputRef}
          onChange={handleChange}
          className="hidden"
          disabled={disabled}
        />
        <Button
          type="button"
          onClick={handleButtonClick}
          icon={IconToUse}
          disabled={disabled}
          className={clsx(className ?? 'w-full')}
        >
          {placeholder ?? label}
        </Button>
        {fileName && (
          <span className={filenamestyle}>{fileName}</span>
        )}
      </div>
      {allowedTypesLabel && (
        <p className={typelabelstyle}>{allowedTypesLabel}</p>
      )}
    </div>
  );
};

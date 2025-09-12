'use client';

import clsx from 'clsx';
import React, { SVGProps } from 'react';


import { Button } from '../Button/Button';
import { labelClasses} from '../Input/styles';

import { useFileUploader } from './hooks/useFileUploader';
import { filenamestyle,typelabelstyle,buttoncontainerstyle } from './styles';
import { FileUploaderProps } from './types';

import UploadIcon from '@/assets/icons/acciones/upload.svg';

/**
 * Componente para subir archivos mediante un botón estilizado.
 *
 * Renderiza un `<input type="file" />` oculto y un `<Button>` que dispara el selector
 * del sistema. Muestra el nombre del archivo seleccionado y una leyenda de tipos
 * permitidos derivada de `accept`.
 *
 * @remarks
 * - **Control de archivo:** el archivo seleccionado se entrega por `onFile(File|null)`.
 * - **Tipos permitidos:** `accept` puede ser patrones como `.pdf`, `.xml`, `image/*`, etc.
 * - **Icono:** si no pasas `icon`, se usa `UploadIcon` por defecto.
 * - **Archivo inicial:** `initialFile` permite mostrar un nombre/estado inicial (p. ej. al editar).
 *
 * @accessibility
 * - El `label` (si se proporciona) sirve como nombre accesible del control.
 * - Considera añadir un texto de ayuda visible para indicar formatos/tamaños admitidos.
 * - Si quieres anunciar cambios de archivo a lectores de pantalla, puedes envolver
 *   el nombre del archivo en un contenedor con `aria-live="polite"`.
 *
 * @example Uso básico (solo PDF)
 * ```tsx
 * <FileUploader
 *   label="Currículum"
 *   placeholder="Selecciona un PDF"
 *   accept=".pdf"
 *   onFile={(file) => console.log(file)}
 * />
 * ```
 *
 * @example Con ícono personalizado
 * ```tsx
 * import { Upload as UploadIcon } from 'lucide-react';
 * <FileUploader
 *   label="XML CFDI"
 *   accept=".xml"
 *   icon={UploadIcon}
 *   onFile={(file) => manejar archivo }
 * />
 * ```
 *
 * @example Archivo inicial (modo edición)
 * ```tsx
 * <FileUploader
 *   label="Contrato"
 *   accept=".pdf"
 *   initialFile={{ name: 'contrato-2025.pdf', url: '/files/contrato-2025.pdf' }}
 *   onFile={(file) => reemplazar o mantener }
 * />
 * ```
 *
 * @fires onFile Se invoca con el archivo seleccionado (`File`) o `null` si se limpia.
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
  dataTestId,
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
      <div className="flex flex-col gap-2" data-testid={dataTestId}>
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

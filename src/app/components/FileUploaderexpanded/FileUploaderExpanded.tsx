// src/app/components/FileUploaderExpanded/FileUploaderExpanded.tsx
'use client';

import React from 'react';
import clsx from 'clsx';
import { Button } from '@/app/components/Button/Button';
import { FileUploaderProps } from '@/app/components/FileUploader/types';
import { labelClasses } from '@/app/components/Input/styles';
import {
  dropzoneBase,
  dropzoneIdle,
  dropzoneDragging,
  dropzoneDisabled,
  textBase,
  textIdle,
  buttonWrapper,
} from './styles';
import { useFileUploaderExpanded } from './hooks/useFileUploaderExpanded';

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
          className={buttonWrapper}
          variant="outline"
          hideIcon
        >
          Seleccionar archivo
        </Button>
      </div>
    </div>
  );
};

export default FileUploaderExpanded;

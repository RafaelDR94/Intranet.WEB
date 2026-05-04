'use client';

import { useRef, useState, ChangeEvent, useEffect } from 'react';

import { InitialFile } from '../types';

/**
 * Hook que encapsula toda la lógica de un uploader de archivos:
 * - Maneja el ref del input file.
 * - Permite disparar el input desde un botón.
 * - Guarda el nombre del archivo seleccionado.
 * - Genera la etiqueta de extensiones permitidas.
 */
export const useFileUploader = (
  onFile: (file: File) => void,
  accept: string = '',
  disabled = false,
  initialFile?: InitialFile,
  value?: File | null
) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const onFileRef = useRef(onFile);

  useEffect(() => {
    onFileRef.current = onFile;
  }, [onFile]);

  useEffect(() => {
    setFileName(initialFile?.name ?? null);
  }, [initialFile?.name]);

  useEffect(() => {
    if (value instanceof File) {
      setFileName(value.name);
      return;
    }
    if (value == null) {
      setFileName(initialFile?.name ?? null);
    }
  }, [value, initialFile?.name]);

  const handleButtonClick = () => {
    if (!disabled) inputRef.current?.click();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFile(file);
      setFileName(file.name);
      e.target.value = ''; // Permitir re-subir el mismo archivo
    }
  };

  const allowedTypesLabel = accept
    ? `Archivos permitidos: ${accept}`
    : null;

  return {
    inputRef,
    fileName,
    handleButtonClick,
    handleChange,
    allowedTypesLabel,
  };
};

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
  initialFile?: InitialFile
) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  useEffect(() => {
    const loadInitial = async () => {
      if (!initialFile) return;
      try {
        const source = initialFile.url ?? initialFile.base64;
        if (!source) return;
        const response = await fetch(source);
        const blob = await response.blob();
        const file = new File([blob], initialFile.name, { type: blob.type });
        setFileName(initialFile.name);
        onFile(file);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to load initial file', err);
      }
    };
    void loadInitial();
  }, [initialFile, onFile]);

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

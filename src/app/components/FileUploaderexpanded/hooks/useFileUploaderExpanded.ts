// src/app/components/FileUploaderExpanded/hooks/useFileUploaderExpanded.ts
'use client';
import { useState, DragEvent, useMemo, useEffect, useRef, useCallback, ChangeEvent } from 'react';

import { UseFileUploaderExpandedReturn } from './types';

import { useFileUploader } from '@/app/components/FileUploader/hooks/useFileUploader';
import { FileUploaderProps ,InitialFile} from '@/app/components/FileUploader/types';


export const useFileUploaderExpanded = (
  onFile: FileUploaderProps['onFile'],
  accept?: FileUploaderProps['accept'],
  disabled: boolean = false,
  initialFile?: InitialFile
): UseFileUploaderExpandedReturn => {
  const { inputRef, fileName, handleButtonClick, handleChange: baseHandleChange } =
    useFileUploader(onFile, accept, disabled, initialFile);

  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  // Limpieza de ObjectURLs creados localmente
  useEffect(() => {
    return () => {
      if (objectUrlRef.current && typeof URL !== 'undefined' && 'revokeObjectURL' in URL) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    };
  }, []);

  // Sincronizar preview con initialFile si viene por url/base64
  useEffect(() => {
    if (!initialFile) return;
    const src = initialFile.url ?? initialFile.base64 ?? null;
    setPreviewUrl(src);
  }, [initialFile, initialFile?.url, initialFile?.base64]);

  const setPreviewFromFile = useCallback((file: File) => {
    // liberar previo si era objectURL
    if (objectUrlRef.current && typeof URL !== 'undefined' && 'revokeObjectURL' in URL) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    if (typeof URL !== 'undefined' && 'createObjectURL' in URL) {
      const url = URL.createObjectURL(file);
      objectUrlRef.current = url;
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  }, []);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = () => {
    if (!disabled) setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (disabled) return;
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const matchesAccept =
      !accept ||
      file.type.match(accept) ||
      accept.split(',').some((type) => file.name.endsWith(type.trim()));

    if (!matchesAccept) {
      onFile?.(null);
      return;
    }

    // simula selección para disparar la misma lógica del input
    if (inputRef.current) {
      const dt = new DataTransfer();
      dt.items.add(file);
      inputRef.current.files = dt.files;
      const evt = new Event('change', { bubbles: true });
      inputRef.current.dispatchEvent(evt);
    } else {
      setPreviewFromFile(file);
      onFile?.(file);
    }
  };

  // Interceptar cambios del input para actualizar vista previa
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewFromFile(file);
    }
    baseHandleChange(e);
  };

  const mainText = useMemo(() => {
    if (fileName) return fileName;
    return isDragging ? 'Suelta el archivo aquí' : 'Arrastra y suelta un archivo o usa el botón';
  }, [fileName, isDragging]);

  return {
    inputRef,
    fileName,
    handleButtonClick,
    handleChange,
    isDragging,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    mainText,
    previewUrl,
    applyExternalFile: (file: File) => {
      setPreviewFromFile(file);
      onFile?.(file);
    },
  };
};

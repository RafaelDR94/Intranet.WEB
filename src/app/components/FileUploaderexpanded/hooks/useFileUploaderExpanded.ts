// src/app/components/FileUploaderExpanded/hooks/useFileUploaderExpanded.ts
'use client';
import { UseFileUploaderExpandedReturn } from './types';
import { useState, DragEvent, useMemo } from 'react';
import { FileUploaderProps ,InitialFile} from '@/app/components/FileUploader/types';
import { useFileUploader } from '@/app/components/FileUploader/hooks/useFileUploader';


export const useFileUploaderExpanded = (
  onFile: FileUploaderProps['onFile'],
  accept?: FileUploaderProps['accept'],
  disabled: boolean = false,
  initialFile?: InitialFile
): UseFileUploaderExpandedReturn => {
  const { inputRef, fileName, handleButtonClick, handleChange } =
    useFileUploader(onFile, accept, disabled, initialFile);

  const [isDragging, setIsDragging] = useState(false);

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
      onFile?.(file);
    }
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
  };
};

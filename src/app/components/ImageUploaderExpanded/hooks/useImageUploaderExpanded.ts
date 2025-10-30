'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useFileUploaderExpanded } from '@/app/components/FileUploaderexpanded/hooks/useFileUploaderExpanded';

import {
  UseImageUploaderExpandedParams,
  UseImageUploaderExpandedReturn,
} from './types';

const DEFAULT_PLACEHOLDER = 'arrastra/selecciona la imagen que deseas subir';

export const useImageUploaderExpanded = ({
  onImage,
  accept = 'image/*',
  disabled = false,
  placeholder = DEFAULT_PLACEHOLDER,
  initialFile,
}: UseImageUploaderExpandedParams): UseImageUploaderExpandedReturn => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const {
    inputRef,
    fileName,
    handleButtonClick,
    handleChange,
    isDragging,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  } = useFileUploaderExpanded(onImage, accept, disabled, initialFile);

  const displayText = useMemo(() => fileName ?? placeholder, [fileName, placeholder]);

  const handleCaptureFromCamera = useCallback(
    (file: File) => {
      const input = inputRef.current;
      if (!input) {
        onImage(file);
        return;
      }

      try {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        input.files = dataTransfer.files;
        const changeEvent = new Event('change', { bubbles: true });
        input.dispatchEvent(changeEvent);
      } catch {
        onImage(file);
      }
    },
    [inputRef, onImage]
  );

  const openCamera = useCallback(() => {
    if (disabled) return;
    setIsCameraOpen(true);
  }, [disabled]);

  const closeCamera = useCallback(() => {
    setIsCameraOpen(false);
  }, []);

  useEffect(() => {
    if (disabled) {
      setIsCameraOpen(false);
    }
  }, [disabled]);

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible && isCameraOpen) {
      setIsCameraOpen(false);
    }
  }, [isVisible, isCameraOpen]);

  return {
    inputRef,
    fileName,
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
  };
};

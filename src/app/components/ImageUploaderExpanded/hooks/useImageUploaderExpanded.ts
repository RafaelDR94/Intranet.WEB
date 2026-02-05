'use client';

import type { ChangeEvent, DragEvent } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useFileUploaderExpanded } from '@/app/components/FileUploaderexpanded/hooks/useFileUploaderExpanded';

import {
  UseImageUploaderExpandedParams,
} from './types';
import { usePrincipal } from '@/app/context/PrincipalContext/PrincipalContext';
import { SelectedImage } from '../types';
const DEFAULT_PLACEHOLDER = 'arrastra/selecciona la imagen que deseas subir';

export const useImageUploaderExpanded = ({
  onImage,
  accept = 'image/*',
  disabled = false,
  placeholder = DEFAULT_PLACEHOLDER,
  initialFile,
  initialFiles,
  multiple,
}: UseImageUploaderExpandedParams) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const { usePrincipalImage } = usePrincipal();
  const { showImage } = usePrincipalImage;
  const [images, setImages] = useState<SelectedImage[]>(() => {
    if (Array.isArray(initialFiles) && initialFiles.length > 0) return initialFiles;
    if (initialFile) {
      return [
        {
          id: `initial-${initialFile.name ?? initialFile.url ?? 'image'}`,
          name: initialFile.name ?? 'Imagen',
          url: initialFile.url ?? initialFile.base64 ?? undefined,
          selected: true,
        },
      ];
    }
    return [];
  });

  const {
    inputRef,
    fileName,
    handleButtonClick,
    handleChange,
    isDragging,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    previewUrl: singlePreview,
    applyExternalFile,
  } = useFileUploaderExpanded(onImage, accept, disabled, initialFile);

  const displayText = useMemo(() => {
    if (multiple) {
      const selectedCount = images.filter((img) => img.selected !== false).length;
      if (selectedCount > 0) return `${selectedCount} imagen(es) seleccionada(s)`;
    }
    return fileName ?? placeholder;
  }, [fileName, images, multiple, placeholder]);

  useEffect(() => {
    if (!multiple) return;
    if (Array.isArray(initialFiles)) {
      setImages(initialFiles);
    }
  }, [initialFiles, multiple]);

  const notifyImages = useCallback(
    (list: SelectedImage[]) => {
      setImages(list);
      if (multiple) {
        const selected = list.filter((item) => item.selected !== false);
        onImage?.(selected);
      }
    },
    [multiple, onImage]
  );

  const addFiles = useCallback(
    (files: FileList | File[] | null | undefined) => {
      if (!files || files.length === 0) return;
      const nextImages: SelectedImage[] = [...images];

      Array.from(files).forEach((file) => {
        const id = `${file.name}-${file.lastModified}-${Math.random().toString(16).slice(2)}`;
        nextImages.push({
          id,
          file,
          name: file.name,
          url: typeof URL !== 'undefined' ? URL.createObjectURL(file) : undefined,
          selected: true,
        });
      });

      notifyImages(nextImages);
    },
    [images, notifyImages]
  );

  const handleCaptureFromCamera = useCallback(
    (file: File) => {
      if (multiple) {
        addFiles([file]);
        return;
      }

      const input = inputRef.current;
      if (!input) {
        applyExternalFile(file);
        return;
      }

      try {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        input.files = dataTransfer.files;
        const changeEvent = new Event('change', { bubbles: true });
        input.dispatchEvent(changeEvent);
      } catch {
        applyExternalFile(file);
      }
    },
    [addFiles, applyExternalFile, inputRef, multiple]
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

  const multiPreview = useMemo(() => {
    if (!multiple) return singlePreview;
    const selected = images.find((img) => img.selected !== false);
    return selected?.url ?? null;
  }, [images, multiple, singlePreview]);

  const openPreview = useCallback(() => {
    if (!multiPreview) return;
    showImage({
      src: multiPreview,
      alt: fileName ?? 'Vista previa',
    });
  }, [fileName, multiPreview, showImage]);

  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (multiple) {
        addFiles(event.target.files ?? undefined);
      } else {
        handleChange(event);
      }
    },
    [addFiles, handleChange, multiple]
  );

  const handleDropInput = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (disabled) return;
      handleDragLeave();
      if (multiple) {
        addFiles(event.dataTransfer.files);
      } else {
        handleDrop(event);
      }
    },
    [addFiles, disabled, handleDragLeave, handleDrop, multiple]
  );

  const toggleImage = useCallback(
    (id: string) => {
      const next = images.map((img) =>
        img.id === id ? { ...img, selected: !(img.selected !== false) } : img
      );
      notifyImages(next);
    },
    [images, notifyImages]
  );

  const clearImages = useCallback(() => {
    const remaining = images.filter((img) => img.selected === false);
    notifyImages(remaining);
  }, [images, notifyImages]);

  const reorderImages = useCallback(
    (targetId: string) => {
      if (!multiple || !draggingId || draggingId === targetId) return;

      const currentIndex = images.findIndex((img) => img.id === draggingId);
      const targetIndex = images.findIndex((img) => img.id === targetId);

      if (currentIndex === -1 || targetIndex === -1) return;

      const next = [...images];
      const [moved] = next.splice(currentIndex, 1);
      next.splice(targetIndex, 0, moved);
      notifyImages(next);
    },
    [draggingId, images, notifyImages]
  );

  const handleImageDragStart = useCallback((id: string) => {
    if (disabled || !multiple) return;
    setDraggingId(id);
  }, [disabled, multiple]);

  const handleImageDragOverGallery = useCallback(
    (event: DragEvent<HTMLLabelElement>, id: string) => {
      event.preventDefault();
      if (disabled || !multiple || !draggingId || draggingId === id) return;
      event.dataTransfer.dropEffect = 'move';
    },
    [disabled, draggingId, multiple]
  );

  const handleImageDropGallery = useCallback(
    (event: DragEvent<HTMLLabelElement>, id: string) => {
      event.preventDefault();
      if (disabled || !multiple) return;
      reorderImages(id);
      setDraggingId(null);
    },
    [disabled, multiple, reorderImages]
  );

  const handleImageDragEnd = useCallback(() => {
    setDraggingId(null);
  }, []);

  return {
    inputRef,
    fileName,
    handleButtonClick,
    handleChange: handleInputChange,
    isDragging,
    handleDragOver,
    handleDragLeave,
    handleDrop: handleDropInput,
    displayText,
    containerRef,
    isCameraOpen,
    openCamera,
    closeCamera,
    handleCaptureFromCamera,
    previewUrl: multiPreview,
    openPreview,
    images,
    toggleImage,
    clearImages,
    draggingId,
    handleImageDragStart,
    handleImageDragOverGallery,
    handleImageDropGallery,
    handleImageDragEnd,
  };
};

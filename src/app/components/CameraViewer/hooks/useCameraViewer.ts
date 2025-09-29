'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { FacingMode } from '../types';
import { UseCameraViewerOptions, UseCameraViewerReturn } from './types';

const buildConstraints = (mode: FacingMode): MediaStreamConstraints => ({
  audio: false,
  video: {
    facingMode: { ideal: mode },
  },
});

export const useCameraViewer = ({
  isOpen,
  defaultFacingMode = 'environment',
  onError,
}: UseCameraViewerOptions): UseCameraViewerReturn => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<FacingMode>(defaultFacingMode);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const closeStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const startStream = useCallback(
    async (mode: FacingMode) => {
      if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
        const notSupported = new Error('Camera API is not available');
        setError(notSupported.message);
        onError?.(notSupported);
        return;
      }

      setIsLoading(true);
      setError(null);
      closeStream();

      const tryStart = async (constraints: MediaStreamConstraints) => {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          try {
            await videoRef.current.play();
          } catch {
            // Autoplay can fail on some browsers when user interaction is required.
          }
        }
        streamRef.current = stream;
      };

      try {
        await tryStart(buildConstraints(mode));
      } catch (firstError) {
        console.log("firstError",firstError);
        try {
          await tryStart({ audio: false, video: true });
        } catch (finalError) {
          const err = finalError instanceof Error ? finalError : new Error(String(finalError));
          setError(err.message);
          onError?.(err);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [closeStream, onError]
  );

  const toggleFacingMode = useCallback(() => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  }, []);

  const capturePhoto = useCallback(async (): Promise<File | null> => {
    const video = videoRef.current;
    if (!video) return null;
    if (!video.videoWidth || !video.videoHeight) return null;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext('2d');
    if (!context) return null;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    return await new Promise<File | null>((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          resolve(null);
          return;
        }
        const fileName = `captura-${Date.now()}.png`;
        const file = new File([blob], fileName, { type: blob.type });
        resolve(file);
      }, 'image/png');
    });
  }, []);

  useEffect(() => {
    setFacingMode(defaultFacingMode);
  }, [defaultFacingMode]);

  useEffect(() => {
    if (isOpen) {
      void startStream(facingMode);
      return () => {
        closeStream();
      };
    }

    closeStream();
  }, [isOpen, facingMode, startStream, closeStream]);

  return {
    videoRef,
    facingMode,
    isLoading,
    error,
    toggleFacingMode,
    capturePhoto,
    closeStream,
  };
};

import { RefObject } from 'react';

import { FacingMode } from '../types';

export interface UseCameraViewerOptions {
  isOpen: boolean;
  defaultFacingMode?: FacingMode;
  onError?: (error: Error) => void;
}

export interface UseCameraViewerReturn {
  videoRef: RefObject<HTMLVideoElement | null>
  facingMode: FacingMode;
  isLoading: boolean;
  error: string | null;
  toggleFacingMode: () => void;
  capturePhoto: () => Promise<File | null>;
  closeStream: () => void;
}


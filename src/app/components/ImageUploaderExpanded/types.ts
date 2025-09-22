import { FacingMode } from '@/app/components/CameraViewer/types';
import { InitialFile } from '@/app/components/FileUploader/types';

export interface CameraViewerLabels {
  capture?: string;
  switchCamera?: string;
  close?: string;
}

export interface ImageUploaderExpandedProps {
  /** Optional caption rendered on top of the uploader. */
  label?: string;
  /** Custom text displayed inside the dropzone when no image was selected. */
  placeholder?: string;
  /** Callback fired whenever a file is selected or captured. */
  onImage: (file: File | null) => void;
  /** Disable both the input and the camera trigger. */
  disabled?: boolean;
  /** Extra classes for the dropzone wrapper. */
  className?: string;
  /** Camera facing mode to use when opening the viewer. */
  defaultFacingMode?: FacingMode;
  /** Allows overriding the file accept attribute. Defaults to "image/*". */
  accept?: string;
  /** Label for the select button. Defaults to "Seleccionar Imagen". */
  buttonLabel?: string;
  /** Labels used inside the camera viewer controls. */
  cameraLabels?: CameraViewerLabels;
  /** Optional camera icon aria-label to keep the button accessible. */
  cameraButtonAriaLabel?: string;
  /** Preload an image file. */
  initialFile?: InitialFile;
  /** Testing id. */
  dataTestId?: string;
}

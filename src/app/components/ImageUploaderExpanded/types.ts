import { FacingMode } from '@/app/components/CameraViewer/types';
import { InitialFile } from '@/app/components/FileUploader/types';

export type SelectedImage = {
  id: string;
  name: string;
  url?: string;
  file?: File;
  selected?: boolean;
};

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
  onImage: (file: File | SelectedImage[] | null) => void;
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
  /** Preload multiple images. */
  initialFiles?: SelectedImage[];
  /** Testing id. */
  dataTestId?: string;
  /** Modo de vista previa: muestra la imagen seleccionada con opción para cambiar. */
  preview?: boolean;
  /** Permite seleccionar varias imágenes. */
  multiple?: boolean;
}

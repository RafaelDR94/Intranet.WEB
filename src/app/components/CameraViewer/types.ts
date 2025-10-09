export type FacingMode = 'user' | 'environment';

export interface CameraViewerProps {
  /** Controls if the viewer must be visible. */
  isOpen: boolean;
  /** Close the viewer and release the camera. */
  onClose: () => void;
  /** Returns the captured photo as a File. */
  onCapture: (file: File) => void;
  /** Pick which camera should be used by default. */
  defaultFacingMode?: FacingMode;
  /** Label for the capture button. */
  captureButtonLabel?: string;
  /** Label for the camera switch button. */
  switchButtonLabel?: string;
  /** Label for the close button. */
  closeButtonLabel?: string;
  /** Extra classes for the outer wrapper. */
  className?: string;
  /** Optional callback when starting the camera fails. */
  onError?: (error: Error) => void;
}


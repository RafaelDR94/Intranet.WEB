import { RefObject } from 'react';

import { InitialFile } from '@/app/components/FileUploader/types';
import { UseFileUploaderExpandedReturn } from '@/app/components/FileUploaderexpanded/hooks/types';

export interface UseImageUploaderExpandedParams {
  onImage: (file: File | null) => void;
  accept?: string;
  disabled?: boolean;
  placeholder?: string;
  initialFile?: InitialFile;
}

export interface UseImageUploaderExpandedReturn
  extends Omit<UseFileUploaderExpandedReturn, 'mainText'> {
  containerRef: RefObject<HTMLDivElement | null>
  displayText: string;
  isCameraOpen: boolean;
  openCamera: () => void;
  closeCamera: () => void;
  handleCaptureFromCamera: (file: File) => void;
}

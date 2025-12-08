import { RefObject } from 'react';

import { InitialFile } from '@/app/components/FileUploader/types';
import { SelectedImage } from '../types';
import { UseFileUploaderExpandedReturn } from '@/app/components/FileUploaderexpanded/hooks/types';

export interface UseImageUploaderExpandedParams {
  onImage: (file: File | SelectedImage[] | null) => void;
  accept?: string;
  disabled?: boolean;
  placeholder?: string;
  initialFile?: InitialFile;
  initialFiles?: SelectedImage[];
  multiple?: boolean;
}

export interface UseImageUploaderExpandedReturn
  extends Omit<UseFileUploaderExpandedReturn, 'mainText'> {
  containerRef: RefObject<HTMLDivElement | null>
  displayText: string;
  isCameraOpen: boolean;
  openCamera: () => void;
  closeCamera: () => void;
  handleCaptureFromCamera: (file: File) => void;
  images?: SelectedImage[];
  toggleImage?: (id: string) => void;
  clearImages?: () => void;
}

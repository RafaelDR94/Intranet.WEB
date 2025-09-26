import { DragEvent } from "react";

import { useFileUploader } from "../../FileUploader/hooks/useFileUploader";
export type UseFileUploaderExpandedReturn = {
  // de useFileUploader original
  inputRef: ReturnType<typeof useFileUploader>['inputRef'];
  fileName: string | null;
  handleButtonClick: () => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

  // DnD
  isDragging: boolean;
  handleDragOver: (e: DragEvent<HTMLDivElement>) => void;
  handleDragLeave: () => void;
  handleDrop: (e: DragEvent<HTMLDivElement>) => void;

  // UI helpers
  mainText: string;
};

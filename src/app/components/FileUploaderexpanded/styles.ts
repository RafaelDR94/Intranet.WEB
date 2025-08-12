// src/app/components/FileUploaderExpanded/styles.ts
import clsx from 'clsx';

export const dropzoneBase = clsx(
  'block w-full min-w-0',             
  'flex flex-col items-center justify-center',
  'rounded-md transition-colors',
  'border border-dashed',             
  'p-20 md:p-20'                        
);

export const dropzoneIdle = 'border-gray-30 bg-white-100';
export const dropzoneDragging = 'border-blue-50 bg-blue-10';
export const dropzoneDisabled = 'opacity-50 cursor-not-allowed';

export const textBase = 'text-label font-medium text-center truncate max-w-full';
export const textIdle = 'text-gray-70';

export const buttonWrapper = 'mt-2';   
// src/app/components/FileUploaderExpanded/styles.ts
import clsx from 'clsx';

export const dropzoneBase = clsx(
  'block w-full min-w-0',             
  'flex flex-col items-center justify-center',
  'rounded-2xl transition-all duration-200',
  'border-2 border-dashed',             
  'p-8 md:p-12 shadow-2xs'                        
);

export const dropzoneIdle = 'border-gray-30 bg-white-100 hover:border-green-80 hover:bg-green-10/10';
export const dropzoneDragging = 'border-green-80 bg-green-10/30 scale-[1.01]';
export const dropzoneDisabled = 'opacity-50 cursor-not-allowed bg-gray-10 shadow-none';

export const textBase = 'text-label font-semibold text-center truncate max-w-full tracking-wide';
export const textIdle = 'text-gray-70';

export const buttonWrapper = 'mt-3';   
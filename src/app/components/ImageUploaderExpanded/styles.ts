import clsx from 'clsx';

export const containerClasses = 'flex w-full flex-col gap-2';

export const dropzoneBaseClasses = clsx(
  'block w-full min-w-0',
  'flex flex-col items-center justify-center gap-5',
  'rounded-md border border-dashed',
  'bg-white-100',
  'p-12 md:p-16',
  'transition-colors text-center'
);

export const dropzoneIdleClasses = 'border-gray-30 text-gray-70';
export const dropzoneDraggingClasses = 'border-blue-50 bg-blue-10 text-blue-60';
export const dropzoneDisabledClasses = 'opacity-60 cursor-not-allowed';

export const cameraButtonClasses = clsx(
  'flex flex-col items-center justify-center gap-2',
  'text-blue-60',
  'transition-colors',
  'cursor-pointer',
  'focus:outline-none focus-visible:ring focus-visible:ring-blue-50 focus-visible:ring-offset-2'
);

export const cameraIconClasses = '';

export const separatorClasses = 'text-sm text-gray-60';
export const helperTextClasses = 'text-sm text-gray-70';

export const buttonWrapperClasses = 'mt-4';

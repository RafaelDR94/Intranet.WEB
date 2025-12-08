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

// Preview mode styles
export const previewWrapperClasses = clsx(
  dropzoneBaseClasses,
  dropzoneIdleClasses,
  'relative overflow-hidden'
);
export const previewImageClasses = clsx(
  'max-h-[360px] w-full object-contain rounded-md',
  'bg-white'
);
export const previewActionsClasses = 'mt-4 flex justify-center';
export const previewCancelButtonClasses = clsx(
  'absolute top-3 right-3'
);

export const galleryWrapper = 'mt-6 flex flex-col gap-4';
export const galleryGrid = 'grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
export const galleryItem = (selected: boolean) =>
  clsx(
    'relative overflow-hidden rounded-md border',
    selected ? 'border-blue-50 ring-2 ring-blue-50' : 'border-gray-30',
    'cursor-pointer'
  );
export const galleryImage = 'h-32 w-full object-cover';

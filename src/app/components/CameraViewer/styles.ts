import clsx from 'clsx';

export const overlayClasses = clsx(
  'fixed inset-0 z-50',
  'flex items-center justify-center',
  'bg-black/70 backdrop-blur-sm',
  'p-6'
);

export const panelClasses = clsx(
  'relative flex w-full max-w-md flex-col gap-4',
  'rounded-lg bg-white shadow-xl',
  'p-4 md:p-6'
);

export const videoClasses = clsx(
  'w-full rounded-md bg-black',
  'object-cover',
  'aspect-[3/4]'
);

export const mirroredVideoClasses = 'scale-x-[-1]';

export const controlsClasses = clsx(
  'flex flex-col gap-3',
  'sm:flex-row sm:items-center sm:justify-between'
);

export const errorMessageClasses = 'text-sm text-red-500 text-center';


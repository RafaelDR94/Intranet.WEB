import clsx from 'clsx';

export const container = 'flex gap-2 items-center';

export const pageButton = (active: boolean, disabled: boolean) =>
  clsx(
    'w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all',
    {
      'bg-green-90 text-white-100': active,
      'text-gray-100 hover:bg-green-10': !disabled && !active,
      'focus:outline-none focus:ring-3 focus:ring-green-30': !disabled,
      'text-gray-50 pointer-events-none': disabled,
    }
  );

export const arrowButton = (disabled: boolean) =>
  clsx(
    'w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all',
    {
      'text-gray-100 hover:bg-green-10': !disabled,
      'focus:outline-none focus:ring-2 focus:ring-green-40': !disabled,
      'text-gray-40 pointer-events-none': disabled,
    }
  );

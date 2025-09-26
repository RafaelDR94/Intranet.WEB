import clsx from 'clsx';

import { AvatarSize } from './types';

export const baseClasses =
  'relative inline-flex items-center justify-center rounded-full bg-green-90 text-white-100 font-semibold select-none';

export const imageClass = 'w-full h-full object-cover rounded-full';

export const sizes: Record<AvatarSize, string> = {
  xl: 'w-24 h-24 text-h1',
  lg: 'w-20 h-20 text-h2',
  md: 'w-16 h-16 text-h3',
  sm: 'w-14 h-14 text-h4',
  xs: 'w-12 h-12 text-h5',
  xxs: 'w-10 h-10 text-s1',
  tiny: 'w-8 h-8 text-c2',
};

export const onlineClasses = (size: AvatarSize) =>
  clsx(
    'absolute border-0.5 bottom-2 right-0 translate-x-1/4 translate-y-1/4 rounded-full bg-alert-green-100 ring-white-100 ring-2',
    {
      'w-6 h-6': size === 'xl',
      'w-5 h-5': size === 'lg',
      'w-4 h-4': size === 'md',
      'w-3.5 h-3.5': size === 'sm',
      'w-2.5 h-2.5': size === 'xs' || size === 'xxs',
      'w-1.5 h-1.5': size === 'tiny',
    }
  );

import React from 'react';
import clsx from 'clsx';
import ArrowRight from '@/assets/icons/navegacion/nav-arrow-right.svg';
import ArrowUp from '@/assets/icons/navegacion/arrow-up.svg';
type Variant = 'solid' | 'outline' | 'ghost';
type Size = 'giant' | 'large' | 'medium' | 'small' | 'xsmall';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  arrowDirection?: 'right' | 'up';
  iconOnly?: boolean;
}

const sizeMap: Record<Size, string> = {
  giant:  'px-6 py-3 text-btn-giant rounded-lg',
  large:  'px-5 py-2.5 text-btn-large rounded-md',
  medium: 'px-4 py-2 text-btn-md rounded-md',
  small:  'px-3 py-1.5 text-btn-sm rounded-sm',
  xsmall: 'px-2 py-1 text-btn-xs rounded-sm',
};

const variantMap: Record<Variant, string> = {
  solid:   'bg-green-80 text-white hover:bg-green-90 focus:ring-2 focus:ring-green-60 focus:bg-green-60 active:bg-green-100 disabled:bg-gray-20 disabled:text-gray-40',
  outline: 'border border-green-80 text-green-80 hover:bg-green-10 focus:ring-2 focus:ring-green-40 active:bg-white-50  active:text-green-100 disabled:text-gray-40 disabled:ring-gray-40 disabled:border-gray-40 disabled:bg-gray-10',
  ghost:   'text-green-80 hover:bg-green-10 focus:ring-2 focus:text-green-60 focus:ring-green-60 active:bg-green-20 active:text-green-100  disabled:text-gray-40 disabled:bg-gray-10',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'solid',
  size = 'medium',
  arrowDirection = 'right',
  iconOnly = false,
  disabled = false,
  className,
  children,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold focus:outline-none focus:ring-offset-2 whitespace-nowrap';

  const sizeClasses = sizeMap[size];
  const variantClasses = variantMap[variant];

  const Icon = arrowDirection === 'right' ? ArrowRight : ArrowUp;

  return (
    <button
      className={clsx(
        baseClasses,
        sizeClasses,
        variantClasses,
        className
      )}
      disabled={disabled}
      {...props}
    >
      {!iconOnly && <span>{children}</span>}
      <Icon
        className={clsx(
          
          !iconOnly && 'ml-2 transition-transform',
           'text-inherit'
        )}
      />
    </button>
  );
};

'use client';

import React from 'react';
import clsx from 'clsx';

import HelpIcon from '@/assets/icons/acciones/help-circle.svg';

export type HelpButtonProps = {
  onClick: () => void;
  className?: string;
};

export const HelpButton: React.FC<HelpButtonProps> = ({ onClick, className }) => (
  <button
    type="button"
    data-tour="help-button"
    aria-label="Centro de tutoriales"
    onClick={onClick}
    className={clsx(
      'h-9 w-9 flex items-center justify-center rounded-full hover:bg-gray-10 focus:outline-none focus:ring-2 focus:ring-blue-40',
      className
    )}
  >
    <HelpIcon aria-hidden />
  </button>
);

export default HelpButton;

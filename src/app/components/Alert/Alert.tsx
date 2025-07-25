'use client';

import React from 'react';
import clsx from 'clsx';

import InfoIcon from '@/assets/icons/acciones/info-empty.svg';
import SuccessIcon from '@/assets/icons/organization/star.svg';
import WarningIcon from '@/assets/icons/bussines/high-priority.svg';

type AlertType = 'default' | 'success' | 'info' | 'warning' | 'error';
type AlertVariant = 'filled' | 'subtle';

interface AlertProps {
  type?: AlertType;
  variant?: AlertVariant;
  title: string;
  description: string;
  showPrimaryButton?: boolean;
  showSecondaryButton?: boolean;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
  primaryLabel?: string;
  secondaryLabel?: string;
}

const styles = {
  bgColor: {
    default: {
      filled: 'bg-blue-90 text-white-100',
      subtle: 'bg-turquoise-20 border border-turquoise-100',
    },
    success: {
      filled: 'bg-alert-green-100 text-white-100',
      subtle: 'bg-alert-green-10 text-blue-100 border border-alert-green-100',
    },
    info: {
      filled: 'bg-alert-blue-100 text-white-100',
      subtle: 'bg-blue-10 text-blue-100 border border-alert-blue-100',
    },
    warning: {
      filled: 'bg-alert-yellow-100 text-white-100',
      subtle: 'bg-alert-yellow-10 text-blue-100 border border-alert-yellow-100',
    },
    error: {
      filled: 'bg-alert-red-100 text-white-100',
      subtle: 'bg-alert-red-10 text-blue-100 border border-alert-red-100',
    },
  },
  iconColor: {
    default: {
      filled: 'text-white-100',
      subtle: 'text-turquoise-100',
    },
    success: {
      filled: 'text-white-100',
      subtle: 'text-alert-green-100',
    },
    info: {
      filled: 'text-white-100',
      subtle: 'text-alert-blue-100',
    },
    warning: {
      filled: 'text-white-100',
      subtle: 'text-alert-yellow-100',
    },
    error: {
      filled: 'text-white-100',
      subtle: 'text-alert-red-100',
    },
  },
  titleColor: {
    default: {
      filled: 'text-white-100',
      subtle: 'text-turquoise-100',
    },
    success: {
      filled: 'text-white-100',
      subtle: 'text-alert-green-100',
    },
    info: {
      filled: 'text-white-100',
      subtle: 'text-alert-blue-100',
    },
    warning: {
      filled: 'text-white-100',
      subtle: 'text-alert-yellow-100',
    },
    error: {
      filled: 'text-white-100',
      subtle: 'text-alert-red-100',
    },
  },
  textColor: {
    default: {
      filled: 'text-white-80',
      subtle: 'text-turquoise-100',
    },
    success: {
      filled: 'text-white-80',
      subtle: 'text-alert-green-100',
    },
    info: {
      filled: 'text-white-80',
      subtle: 'text-alert-blue-100',
    },
    warning: {
      filled: 'text-white-80',
      subtle: 'text-alert-yellow-100',
    },
    error: {
      filled: 'text-white-80',
      subtle: 'text-alert-red-100',
    },
  },
  buttonColor: {
    default: {
      filled: 'text-white-100',
      subtle: 'text-green-100',
    },
    success: {
      filled: 'text-white-100',
      subtle: 'text-green-100',
    },
    info: {
      filled: 'text-white-100',
      subtle: 'text-green-100',
    },
    warning: {
      filled: 'text-white-100',
      subtle: 'text-green-100',
    },
    error: {
      filled: 'text-white-100',
      subtle: 'text-green-100',
    },
    
  },
   buttonColor2: {
    default: {
      filled: 'text-blue-30',
      subtle: 'text-white-10',
    },
    success: {
      filled: 'text-alert-green-50',
      subtle: 'text-white-10',
    },
    info: {
      filled: 'text-alert-green-50',
      subtle: 'text-white-10',
    },
    warning: {
      filled: 'text-alert-yellow-10',
      subtle: 'text-white-10',
    },
    error: {
      filled: 'text-alert-red-10',
      subtle: 'text-white-10',
    },
    
  },
};

const icons: Record<AlertType, React.ReactNode> = {
  default: <InfoIcon />,
  success: <SuccessIcon />,
  info: <InfoIcon />,
  warning: <WarningIcon />,
  error: <WarningIcon />,
};

export const Alert: React.FC<AlertProps> = ({
  type = 'default',
  variant = 'filled',
  title,
  description,
  showPrimaryButton = true,
  showSecondaryButton = true,
  onPrimaryClick,
  onSecondaryClick,
  primaryLabel = 'Button',
  secondaryLabel = 'Button',
}) => {
  return (
    <div
      className={clsx(
        'rounded-lg p-4 flex flex-col gap-3 shadow-sm',
        styles.bgColor[type][variant]
      )}
    >
      <div className="flex items-start gap-3">
        <div className={clsx('w-5 h-5 shrink-0', styles.iconColor[type][variant])}>
          {icons[type]}
        </div>
        <div className="flex-1">
          <h4 className={clsx('font-semibold text-h5', styles.titleColor[type][variant])}>
            {title}
          </h4>
          <p className={clsx('text-c1', styles.textColor[type][variant])}>
            {description}
          </p>
        </div>
      </div>
      <div className="flex gap-2 pl-8">
        {showPrimaryButton && (
          <button
            onClick={onPrimaryClick}
            className={clsx('text-cta-sm font-medium ', styles.buttonColor[type][variant])}
          >
            {primaryLabel}
          </button>
        )}
        {showSecondaryButton && (
          <button
            onClick={onSecondaryClick}
            className={clsx('text-cta-sm font-medium ', styles.buttonColor2[type][variant])}
          >
            {secondaryLabel}
          </button>
        )}
      </div>
    </div>
  );
};

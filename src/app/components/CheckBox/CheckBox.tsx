import React, { useRef, useEffect } from 'react';
import clsx from 'clsx';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  indeterminate?: boolean;
  disabled?: boolean;
  label?: string;
  labelPosition?: 'left' | 'right';
  name?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  indeterminate = false,
  disabled = false,
  label,
  labelPosition = 'right',
  name,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

const checkboxClasses = clsx(
  'w-5 h-5 rounded border flex items-center justify-center transition-colors duration-200 peer',
  {
    'border-gray-30 bg-gray-10 cursor-not-allowed': disabled,
    'border-green-90 bg-green-90': (checked || indeterminate) && !disabled,
    'border-gray-50 bg-white-100 hover:border-green-90 hover:bg-green-10 focus:ring-2 focus:ring-offset-2 focus:ring-green-60': !checked && !indeterminate && !disabled,
  }
);

  const iconColor = disabled ? 'text-white-100' : 'text-white-100';

  const layout = labelPosition === 'left' ? 'flex-row-reverse space-x-reverse' : 'flex-row';

  return (
    <label className={clsx('inline-flex items-center space-x-2 cursor-pointer', layout)}>
      <div className={checkboxClasses}>
        {indeterminate ? (
          <span className={clsx('w-3 h-0.5 rounded-sm', iconColor, 'bg-current')} />
        ) : checked ? (
          <svg
            className={clsx( iconColor)}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M6.293 9.707a1 1 0 011.414 0L10 11.586l4.293-4.293a1 1 0 111.414 1.414l-5 5a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        ) : null}
        <input
          ref={inputRef}
          type="checkbox"
          name={name}
          className="sr-only peer"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
        />
      </div>
      {label && (
        <span
          className={clsx(
            'text-b3 text-green-90 select-none',
            disabled && 'text-green-90'
          )}
        >
          {label}
        </span>
      )}
    </label>
  );
};

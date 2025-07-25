// ToggleButton.tsx
import React from 'react';
import clsx from 'clsx';

interface ToggleButtonProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
    label?: string;
    labelPosition?: 'left' | 'right';
}

export const ToggleButton: React.FC<ToggleButtonProps> = ({
    checked,
    onChange,
    disabled = false,
    label,
    labelPosition = 'right',
}) => {
    return (
        <label
            className={clsx(
                'flex items-center space-x-2 group',
                labelPosition === 'left' && 'flex-row-reverse space-x-reverse',
                disabled ? 'cursor-not-allowed' : 'cursor-pointer'
            )}
        >
            <div
                className={clsx(
                    'w-[28px] h-4 rounded-full transition-colors duration-300 relative',
                    disabled
                        ? 'bg-gray-20'
                        : checked
                            ? 'bg-green-90 group-hover:bg-green-60'
                            : 'bg-gray-10 group-hover:bg-gray-20'
                )}
            >
                <span
                    className={clsx(
                        'absolute top-0.5 left-0.5 w-3 h-3 rounded-full shadow-md transition-transform duration-300',
                        'bg-white-100',
                        checked ? 'translate-x-[12px]' : 'translate-x-0'
                    )}
                />
                <input
                    type="checkbox"
                    className="sr-only"
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                    disabled={disabled}
                />
            </div>
            {label && (
                <span
                    className={clsx(
                        'text-green-90 select-none',
                        disabled && 'text-green-90'
                    )}
                >
                    {label}
                </span>
            )}
        </label>
    );
};

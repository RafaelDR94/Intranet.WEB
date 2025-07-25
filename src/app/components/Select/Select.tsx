'use client';

import React, { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';
import ChevronDown from '@/assets/icons/navegacion/nav-arrow-down.svg';
import ChevronUp from '@/assets/icons/navegacion/nav-arrow-up.svg';
import Check from '@/assets/icons/acciones/check.svg';

export type SelectOption = {
    label: string;
    value: string;
    disabled?: boolean;
};

type SelectSize = 'md' | 'lg';
type SelectVariant =
    | 'default'
    | 'filled'
    | 'disabled'
    | 'success'
    | 'info'
    | 'warning'
    | 'error';

interface SelectProps {
    options: SelectOption[];
    placeholder?: string;
    multiple?: boolean;
    selected: string[];
    onChange: (values: string[]) => void;
    size?: SelectSize;
    variant?: SelectVariant;
    label?: string;
    helperText?: string;
    disabled?: boolean;
}

const baseStyles = {
    container: 'flex flex-col gap-1 relative w-full',
    label: 'text-label font-medium text-black-100',
    trigger:
        'flex justify-between items-center rounded-md border px-3 cursor-pointer transition-all',
    sizes: {
        md: 'text-sm py-2',
        lg: 'text-base py-3',
    },
    variants: {
        default: 'border-gray-30  text-black-100',
        filled: 'border-gray-30  text-black-100',
        disabled: 'bg-gray-20 border-gray-20 text-gray-50 cursor-not-allowed',
        success: 'border-alert-green-100 text-black-100',
        info: 'border-alert-blue-100 text-black-100',
        warning: 'border-alert-yellow-100 text-black-100',
        error: 'border-alert-red-100 text-black-100',
    },
    focusLike: 'border-green-100 bg-green-10 text-black-100',
    menu: 'absolute z-50 left-0 top-full mt-1 w-full rounded-md bg-white shadow-md max-h-60 overflow-y-auto border border-gray-30',
    option:
        'flex items-center justify-between px-3 py-2 text-sm cursor-pointer hover:bg-green-10',
    optionDisabled: 'text-gray-40 cursor-not-allowed',
    checkbox: 'w-6 h-6 rounded-md border border-green-100',
    checkboxChecked: 'bg-green-100 border-green-100',
    helper: 'text-c2 mt-1',
    helperColors: {
        default: 'text-gray-60',
        success: 'text-alert-green-100',
        info: 'text-alert-blue-100',
        warning: 'text-alert-yellow-100',
        error: 'text-alert-red-100',
    },
};

export const Select: React.FC<SelectProps> = ({
    options,
    placeholder = 'Select',
    multiple = false,
    selected,
    onChange,
    size = 'md',
    variant = 'default',
    label,
    helperText,
    disabled,
}) => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleOption = (value: string) => {
        if (multiple) {
            onChange(
                selected.includes(value)
                    ? selected.filter((v) => v !== value)
                    : [...selected, value]
            );
        } else {
            onChange([value]);
            setOpen(false);
        }
    };

    const selectedLabels = options
        .filter((opt) => selected.includes(opt.value))
        .map((opt) => opt.label);

    const helperClass =
        baseStyles.helperColors[variant as keyof typeof baseStyles.helperColors] ??
        baseStyles.helperColors.default;

    const currentVariant = disabled ? 'disabled' : variant;

    return (
        <div className={baseStyles.container} ref={ref}>
            {label && <label className={baseStyles.label}>{label}</label>}

            <div
                className={clsx(
                    baseStyles.trigger,
                    baseStyles.sizes[size],
                    open
                        ? baseStyles.focusLike
                        : baseStyles.variants[currentVariant],
                    !disabled && 'hover:border-green-80',
                    disabled && baseStyles.variants.disabled
                )}
                onClick={() => !disabled && setOpen(!open)}
            >
                <span>
                    {selected.length === 0
                        ? placeholder
                        : multiple
                            ? `${selected.length} Opciones Seleccionadas`
                            : selectedLabels[0]}
                </span>
                {multiple && selected.length > 0 && open ? (
                    <Check className="text-green-100" />
                ) : open ? (
                    <ChevronUp />
                ) : (
                    <ChevronDown />
                )}
            </div>

            {/* NUEVO: Texto informativo con las opciones seleccionadas */}
            {multiple && selected.length > 0 && (
                <span className="text-c2 text-gray-60">
                    Opciones: {selectedLabels.join(', ')}
                </span>
            )}

            {helperText && (
                <span className={clsx(baseStyles.helper, helperClass)}>{helperText}</span>
            )}

            {open && (
                <div className={baseStyles.menu}>
                    {options.map((option) => {
                        const isSelected = selected.includes(option.value);
                        return (
                            <div
                                key={option.value}
                                className={clsx(
                                    baseStyles.option,
                                    option.disabled && baseStyles.optionDisabled
                                )}
                                onClick={() => !option.disabled && toggleOption(option.value)}
                            >
                                <span className={clsx(option.disabled && 'text-gray-40')}>
                                    {option.label}
                                </span>
                                {multiple ? (
                                    <div
                                        className={clsx(
                                            baseStyles.checkbox,
                                            isSelected && baseStyles.checkboxChecked,
                                            'flex items-center justify-center'
                                        )}
                                    >
                                        {isSelected && <Check className="text-white" />}
                                    </div>
                                ) : (
                                    isSelected && open && <Check className="text-green-100" />
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

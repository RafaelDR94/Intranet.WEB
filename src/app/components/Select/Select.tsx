'use client';
import React from 'react';
import clsx from 'clsx';
import ChevronDown from '@/assets/icons/navegacion/nav-arrow-down.svg';
import ChevronUp from '@/assets/icons/navegacion/nav-arrow-up.svg';
import Check from '@/assets/icons/acciones/check.svg';
import { SelectProps } from './types';
import { baseStyles } from './styles';
import useSelect from './hooks/useSelect';
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
    const { open, ref, toggleOption, setOpen } = useSelect({ multiple, onChange, selected });
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
                    !disabled && baseStyles.hover,
                    disabled && baseStyles.variants.disabled
                )}
                onClick={() => {if(!disabled) { setOpen(!open)}}}
            >
                <span>
                    {selected.length === 0
                        ? placeholder
                        : multiple
                            ? `${selected.length} Opciones Seleccionadas`
                            : selectedLabels[0]}
                </span>
                {multiple && selected.length > 0 && open ? (
                    <Check className={baseStyles.check} />
                ) : open ? (
                    <ChevronUp />
                ) : (
                    <ChevronDown />
                )}
            </div>

            {/* NUEVO: Texto informativo con las opciones seleccionadas */}
            {multiple && selected.length > 0 && (
                <span className={baseStyles.infoText}>
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
                                <span className={clsx(option.disabled && baseStyles.optionlabel)}>
                                    {option.label}
                                </span>
                                {multiple ? (
                                    <div
                                        className={clsx(
                                            baseStyles.checkbox,
                                            isSelected && baseStyles.checkboxChecked,
                                            baseStyles.checkitem
                                        )}
                                    >
                                        {isSelected && <Check className={baseStyles.selectedCheck} />}
                                    </div>
                                ) : (
                                    isSelected && open && <Check className={baseStyles.selecteCheck2} />
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

'use client';
import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import ChevronDown from '@/assets/icons/navegacion/nav-arrow-down.svg';
import ChevronUp from '@/assets/icons/navegacion/nav-arrow-up.svg';
import Check from '@/assets/icons/acciones/check.svg';
import { SelectProps } from './types';
import { baseStyles } from './styles';
import useSelect from './hooks/useSelect';

/**
 * Select con selección simple/múltiple, variantes y typeahead (sin input visible).
 * - Evita doble tipeo (un solo onKeyDown y stopPropagation).
 * - Limpia el término de búsqueda al cerrar/seleccionar/escapar.
 */
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
  className
}) => {
  const { open, ref, toggleOption, setOpen } = useSelect({ multiple, onChange, selected });

  // --- Estado para typeahead (sin input) ---
  const [searchTerm, setSearchTerm] = useState('');

  // Limpiar cuando el menú se cierra
  useEffect(() => {
    if (!open) setSearchTerm('');
  }, [open]);

  const selectedLabels = options
    .filter((opt) => selected.includes(opt.value))
    .map((opt) => opt.label);

  const helperClass =
    baseStyles.helperColors[variant as keyof typeof baseStyles.helperColors] ??
    baseStyles.helperColors.default;

  const currentVariant = disabled ? 'disabled' : variant;

  // Filtrado por término
  const filteredOptions =
    searchTerm.trim() === ''
      ? options
      : options.filter((opt) =>
          opt.label.toLowerCase().includes(searchTerm.toLowerCase())
        );

  // --- Teclado / typeahead ---
  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (disabled) return;
    if (e.repeat) return; // evita auto-repetición por tecla sostenida

    // Abrir con Enter/Espacio/Flecha Abajo
    if (!open && (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown')) {
      e.preventDefault();
      setOpen(true);
      return;
    }
    if (!open) return;

    // Búsqueda incremental (caracteres "imprimibles")
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      setSearchTerm((s) => s + e.key);
      e.preventDefault();
      return;
    }

    if (e.key === 'Backspace') {
      setSearchTerm((s) => s.slice(0, -1));
      e.preventDefault();
      return;
    }

    if (e.key === 'Escape') {
      // Si hay búsqueda, primero la limpia; si no, cierra
      if (searchTerm) {
        setSearchTerm('');
      } else {
        setOpen(false);
      }
      e.preventDefault();
      return;
    }

    if (e.key === 'Enter') {
      // Atajo: en simple, selecciona la primera coincidencia
      if (!multiple && filteredOptions.length > 0) {
        toggleOption(filteredOptions[0].value);
        setSearchTerm('');
        setOpen(false);
      }
      e.preventDefault();
      return;
    }
  };

  // Props del trigger: un solo onKeyDown y stopPropagation para evitar bubbling
  const triggerProps = {
    tabIndex: disabled ? -1 : 0,
    onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => {
      handleKeyDown(e);
      e.stopPropagation();
    },
    onClick: () => {
      if (!disabled) setOpen(!open);
    },
    onBlur: () => {
      // Opcional: si manejas cierre por blur, limpia búsqueda
      // (si el hook ya cierra por click fuera, esto es redundante pero seguro)
      setSearchTerm('');
    }
  };

  return (
    <div className={clsx(baseStyles.container, className)} ref={ref}>
      {label && <label className={baseStyles.label}>{label}</label>}

      <div
        {...triggerProps}
        className={clsx(
          baseStyles.trigger,
          baseStyles.sizes[size],
          open ? baseStyles.focusLike : baseStyles.variants[currentVariant],
          !disabled && baseStyles.hover,
          disabled && baseStyles.variants.disabled
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={baseStyles.triggerText}>
          {open && searchTerm !== ''
            ? searchTerm // muestra lo que escribe el usuario
            : (!selected || selected.length === 0 || selectedLabels.length === 0)
              ? (open ? 'Escribe para filtrar…' : placeholder)
              : multiple
                ? `${selected.length} Opciones Seleccionadas`
                : selectedLabels[0]
          }
        </span>
        {multiple && selected.length > 0 && open ? (
          <Check className={baseStyles.check} />
        ) : open ? (
          <ChevronUp />
        ) : (
          <ChevronDown />
        )}
      </div>

      {multiple && selected.length > 0 && (
        <span className={baseStyles.infoText}>
          Opciones: {selectedLabels.join(', ')}
        </span>
      )}

      {helperText && (
        <span className={clsx(baseStyles.helper, helperClass)}>{helperText}</span>
      )}

      {open && (
        <div className={baseStyles.menu} role="listbox">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => {
              const isSelected = selected.includes(option.value);
              return (
                <div
                  key={option.value}
                  className={clsx(
                    baseStyles.option,
                    option.disabled && baseStyles.optionDisabled
                  )}
                  onClick={() => {
                    if (!option.disabled) {
                      toggleOption(option.value);
                      if (!multiple) {
                        setSearchTerm('');
                        setOpen(false);
                      }
                    }
                  }}
                  role="option"
                  aria-selected={isSelected}
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
            })
          ) : (
            <div className={baseStyles.noResults}>Sin resultados</div>
          )}
        </div>
      )}
    </div>
  );
};

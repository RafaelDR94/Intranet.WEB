"use client";
import clsx from "clsx";
import React, { useEffect, useId, useMemo, useRef, useState } from "react";

import useSelect from "./hooks/useSelect";
import { baseStyles } from "./styles";
import { SelectProps } from "./types";

import Check from "@/assets/icons/acciones/check.svg";
import ChevronDown from "@/assets/icons/navegacion/nav-arrow-down.svg";
import ChevronUp from "@/assets/icons/navegacion/nav-arrow-up.svg";

/**
 * Selector con **selección simple o múltiple**, variantes visuales y **typeahead**
 * (búsqueda incremental sin `<input>` visible).
 *
 * @remarks
 * - **Interacciones corregidas**:
 *   1. Selección con `onMouseDown` en las opciones → evita que el `blur` cierre
 *      el panel antes de seleccionar.
 *   2. No se limpia la búsqueda en el `onBlur` del trigger → se limpia al cerrar (`open=false`).
 *   3. Manejo defensivo de `selected` al calcular etiquetas.
 * - **Teclado**:
 *   - Abrir: `Enter`, `Espacio`, `ArrowDown`.
 *   - Cerrar: `Escape` (si hay búsqueda activa, primero la limpia).
 *   - Typeahead: cualquier tecla “imprimible” (concatena término), `Backspace` borra.
 *   - `Enter` (modo simple): selecciona el primer match del filtro.
 * - **Accesibilidad**:
 *   - `aria-haspopup="listbox"`, `aria-expanded`, `aria-controls` al trigger.
 *   - Panel con `role="listbox"`, `aria-labelledby` y `aria-multiselectable` cuando aplica.
 *
 * @example Básico (simple)
 * ```tsx
 * <Select
 *   options={[{label:'Uno',value:'1'},{label:'Dos',value:'2'}]}
 *   selected={[]}
 *   onChange={(vals) => console.log(vals)}
 * />
 * ```
 *
 * @example Múltiple
 * ```tsx
 * <Select
 *   multiple
 *   options={[{label:'Rojo',value:'r'},{label:'Azul',value:'b'}]}
 *   selected={['r']}
 *   onChange={(vals) => setColors(vals)}
 *   placeholder="Selecciona colores"
 * />
 * ```
 */
export const Select: React.FC<SelectProps> = ({
  options,
  placeholder = "Select",
  multiple = false,
  selected,
  onChange,
  size = "md",
  variant = "default",
  label,
  helperText,
  disabled,
  className,
  labelClassName,
  triggerClassName,
  helperClassName,
  maxPanelHeight,
}) => {
  const listboxId = useId();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { open, ref, toggleOption, setOpen } = useSelect({
    multiple,
    onChange,
    selected,
  });

  const safeSelected = useMemo(
    () => (Array.isArray(selected) ? selected : []),
    [selected]
  );

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!open) setSearchTerm("");
  }, [open]);

  useEffect(() => {
    if (open && !disabled) {
      searchInputRef.current?.focus();
    } else {
      searchInputRef.current?.blur();
    }
  }, [open, disabled]);

  const selectedLabels = useMemo(
    () => options.filter((opt) => safeSelected.includes(opt.value)).map((opt) => opt.label),
    [options, safeSelected]
  );

  const helperClass =
    baseStyles.helperColors[variant as keyof typeof baseStyles.helperColors] ??
    baseStyles.helperColors.default;

  const currentVariant = disabled ? "disabled" : variant;

  const filteredOptions = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (term === "") return options;
    return options.filter((opt) => opt.label.toLowerCase().includes(term));
  }, [options, searchTerm]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement | HTMLInputElement> = (event) => {
    if (disabled) return;
    if (event.repeat) return;

    const isSearchField = searchInputRef.current === event.target;

    if (!open && (event.key === "Enter" || event.key === " " || event.key === "ArrowDown")) {
      event.preventDefault();
      setOpen(true);
      return;
    }
    if (!open) return;

    if (isSearchField) {
      if (event.key === "Escape") {
        if (searchTerm) {
          setSearchTerm("");
        } else {
          setOpen(false);
        }
        event.preventDefault();
        return;
      }

      if (event.key === "Enter") {
        if (!multiple && filteredOptions.length > 0) {
          toggleOption(filteredOptions[0].value);
          setSearchTerm("");
          setOpen(false);
        }
        event.preventDefault();
      }

      return;
    }

    if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      setSearchTerm((prev) => prev + event.key);
      event.preventDefault();
      return;
    }

    if (event.key === "Backspace") {
      setSearchTerm((prev) => prev.slice(0, -1));
      event.preventDefault();
      return;
    }

    if (event.key === "Escape") {
      if (searchTerm) {
        setSearchTerm("");
      } else {
        setOpen(false);
      }
      event.preventDefault();
      return;
    }

    if (event.key === "Enter") {
      if (!multiple && filteredOptions.length > 0) {
        toggleOption(filteredOptions[0].value);
        setSearchTerm("");
        setOpen(false);
      }
      event.preventDefault();
    }
  };

  const triggerLabel =
    open && searchTerm !== ""
      ? searchTerm
      : safeSelected.length === 0 || selectedLabels.length === 0
      ? open
        ? "Escribe para filtrar"
        : placeholder
      : multiple
      ? `${safeSelected.length} Opciones Seleccionadas`
      : selectedLabels[0];

  const triggerProps = {
    tabIndex: disabled ? -1 : 0,
    onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => {
      handleKeyDown(event);
      event.stopPropagation();
    },
    onClick: () => {
      if (!disabled) setOpen(!open);
    },
  } as const;

  const menuStyle = maxPanelHeight ? { maxHeight: maxPanelHeight } : undefined;

  return (
    <div className={clsx(baseStyles.container, className)} ref={ref}>
      {label && <label className={clsx(baseStyles.label, labelClassName)}>{label}</label>}

      <div
        {...triggerProps}
        className={clsx(
          baseStyles.trigger,
          baseStyles.sizes[size],
          open ? baseStyles.focusLike : baseStyles.variants[currentVariant],
          !disabled && baseStyles.hover,
          disabled && baseStyles.variants.disabled,
          triggerClassName
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
      >
        <span>{triggerLabel}</span>
        {multiple && safeSelected.length > 0 && open ? (
          <Check className={baseStyles.check} />
        ) : open ? (
          <ChevronUp />
        ) : (
          <ChevronDown />
        )}
      </div>

      {multiple && safeSelected.length > 0 && (
        <span className={baseStyles.infoText}>
          Opciones: {selectedLabels.join(", ")}
        </span>
      )}

      {helperText && (
        <span className={clsx(baseStyles.helper, helperClass, helperClassName)}>{helperText}</span>
      )}

      {open && (
        <div
          className={baseStyles.menu}
          role="presentation"
          style={menuStyle}
        >
          <div className={baseStyles.searchContainer} role="presentation">
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              placeholder="Buscar..."
              className={baseStyles.searchInput}
              disabled={disabled}
            />
          </div>

          <div
            className={baseStyles.optionsContainer}
            role="listbox"
            id={listboxId}
            aria-multiselectable={multiple || undefined}
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => {
                const isSelected = safeSelected.includes(option.value);
                const disabledOption = Boolean(option.disabled);

                return (
                  <div
                    key={option.value}
                    className={clsx(
                      baseStyles.option,
                      disabledOption && baseStyles.optionDisabled
                    )}
                    onMouseDown={(event) => {
                      event.preventDefault();
                      if (!disabledOption) {
                        toggleOption(option.value);
                        if (!multiple) {
                          setSearchTerm("");
                          setOpen(false);
                        }
                      }
                    }}
                    role="option"
                    aria-selected={isSelected}
                  >
                    <span className={clsx(disabledOption && baseStyles.optionlabel)}>
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
              <div className={baseStyles.emptyState}>Sin resultados</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};



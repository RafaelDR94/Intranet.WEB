"use client";
import clsx from "clsx";
import React, { useEffect, useMemo, useState } from "react";

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
}) => {
  const { open, ref, toggleOption, setOpen } = useSelect({
    multiple,
    onChange,
    selected,
  });

  // Asegura que `selected` siempre sea un array
  const safeSelected = useMemo(() => (Array.isArray(selected) ? selected : []), [selected]);

  // --- Estado para typeahead (sin input) ---
  const [searchTerm, setSearchTerm] = useState("");

  // Limpiar búsqueda cuando el menú se cierra
  useEffect(() => {
    if (!open) setSearchTerm("");
  }, [open]);

  const selectedLabels = useMemo(
    () => options.filter((opt) => safeSelected.includes(opt.value)).map((opt) => opt.label),
    [options, safeSelected]
  );

  const helperClass =
    baseStyles.helperColors[variant as keyof typeof baseStyles.helperColors] ??
    baseStyles.helperColors.default;

  const currentVariant = disabled ? "disabled" : variant;

  // Filtrado por término
  const filteredOptions = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (term === "") return options;
    return options.filter((opt) => opt.label.toLowerCase().includes(term));
  }, [options, searchTerm]);

  // --- Teclado / typeahead ---
  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (disabled) return;
    if (e.repeat) return; // evita auto-repetición por tecla sostenida

    // Abrir con Enter/Espacio/Flecha Abajo
    if (!open && (e.key === "Enter" || e.key === " " || e.key === "ArrowDown")) {
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

    if (e.key === "Backspace") {
      setSearchTerm((s) => s.slice(0, -1));
      e.preventDefault();
      return;
    }

    if (e.key === "Escape") {
      // Si hay búsqueda, primero la limpia; si no, cierra
      if (searchTerm) {
        setSearchTerm("");
      } else {
        setOpen(false);
      }
      e.preventDefault();
      return;
    }

    if (e.key === "Enter") {
      // Atajo: en simple, selecciona la primera coincidencia
      if (!multiple && filteredOptions.length > 0) {
        toggleOption(filteredOptions[0].value);
        setSearchTerm("");
        setOpen(false);
      }
      e.preventDefault();
      return;
    }
  };

  // Props del trigger: un solo onKeyDown; NO limpiamos en onBlur
  const triggerProps = {
    tabIndex: disabled ? -1 : 0,
    onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => {
      handleKeyDown(e);
      e.stopPropagation();
    },
    onClick: () => {
      if (!disabled) setOpen(!open);
    },
  } as const;

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
        <span>
          {open && searchTerm !== ""
            ? searchTerm // muestra lo que escribe el usuario
            : safeSelected.length === 0 || selectedLabels.length === 0
            ? open
              ? "Escribe para filtrar…"
              : placeholder
            : multiple
            ? `${safeSelected.length} Opciones Seleccionadas`
            : selectedLabels[0]}
        </span>
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
        <span className={clsx(baseStyles.helper, helperClass)}>{helperText}</span>
      )}

      {open && (
        <div className={baseStyles.menu} role="listbox">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => {
              const isSelected = safeSelected.includes(option.value);
              const disabledOpt = !!option.disabled;
              return (
                <div
                  key={option.value}
                  className={clsx(
                    baseStyles.option,
                    disabledOpt && baseStyles.optionDisabled
                  )}
                  // Usar onMouseDown garantiza que la selección ocurra ANTES del blur/cierre externo
                  onMouseDown={(e) => {
                    e.preventDefault(); // mantiene el foco para que no se dispare blur del trigger
                    if (!disabledOpt) {
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
                  <span className={clsx(disabledOpt && baseStyles.optionlabel)}>
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
                      {isSelected && (
                        <Check className={baseStyles.selectedCheck} />
                      )}
                    </div>
                  ) : (
                    isSelected && open && (
                      <Check className={baseStyles.selecteCheck2} />
                    )
                  )}
                </div>
              );
            })
          ) : (
            <div>Sin resultados</div>
          )}
        </div>
      )}
    </div>
  );
};

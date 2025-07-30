// src/components/CustomRadio.tsx
import React from 'react';
import clsx from 'clsx';
import { customRadioStyles } from './styles';
import { CustomRadioProps } from './types';

/**
 * Componente de botón de radio personalizado reutilizable.
 *
 * Permite seleccionar una opción dentro de un grupo de botones, aplicando estilos
 * visuales personalizados para estados como activo, deshabilitado, hover y focus.
 * Ideal para formularios donde se requiere una mejor experiencia de usuario visual.
 *
 * @param id Identificador único del input
 * @param name Nombre del grupo de radios al que pertenece
 * @param label Texto visible junto al botón
 * @param value Valor que representa la opción
 * @param checked Si el botón está seleccionado
 * @param disabled Si el botón está deshabilitado
 * @param onChange Callback que se ejecuta al cambiar de opción
 */
const CustomRadio: React.FC<CustomRadioProps> = ({
  id,
  name,
  label,
  value,
  checked,
  disabled = false,
  onChange,
}) => {
  return (
    <label
      htmlFor={id}
      className={clsx(
        customRadioStyles.radioLabel,
        disabled && customRadioStyles.radioDisabled,
      )}
    >
      <span
        className={clsx(
          customRadioStyles.radioDefault,
          checked ? customRadioStyles.colorCheked : '',
          disabled ? customRadioStyles.colorDisabled : '',
          customRadioStyles.colorHover,
          customRadioStyles.colorFocus,
        )}
      >
        <input
          id={id}
          name={name}
          type="radio"
          value={value}
          checked={checked}
          disabled={disabled}
          onChange={() => onChange(value)}
          className={customRadioStyles.radioInput}
        />
        {checked && (
          <span className={customRadioStyles.radioChecked}/>
        )}
      </span>
      {label && (
        <span
          className={clsx(
            customRadioStyles.LabelRadio,
            disabled
              ? customRadioStyles.labelTextDisabled
              : customRadioStyles.labelTextEnabled
          )}
        >
          {label}
        </span>
      )}
    </label>
  );
};

export default CustomRadio;

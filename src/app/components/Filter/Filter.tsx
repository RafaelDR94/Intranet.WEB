import React from 'react';

import ContextMenu from '../ContextMenu/ContextMenu';

import type { ContextMenuItem } from '../ContextMenu/types';
import FilterIcon from "@/assets/icons/organization/filter-alt.svg";

/**
 * Represents a single filter option displayed inside the contextual menu.
 */
export interface FilterOption {
  /** Visible label for the option. */
  label: string;
  /** Unique identifier returned when the option is selected. */
  value: string;
  /** If provided, disables the option. */
  disabled?: boolean;
}

type FilterProps = {
  /** Title displayed at the top of the contextual menu. */
  title?: string;
  /** List of options rendered inside the filter menu. */
  options: FilterOption[];
  /** Optional custom trigger; defaults to the filter icon button. */
  trigger?: React.ReactNode;
  /** Currently selected option. Works in both controlled and uncontrolled modes. */
  selectedValue?: string | null;
  /** Default value when uncontrolled. */
  defaultValue?: string | null;
  /** Invoked when the user selects an option. */
  onChange?: (value: string) => void;
};

const Filter: React.FC<FilterProps> = ({
  title = "Filtros",
  options,
  trigger,
  selectedValue,
  defaultValue = null,
  onChange,
}) => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const isControlled = selectedValue !== undefined;
  const [internalValue, setInternalValue] = React.useState<string | null>(
    defaultValue ?? null,
  );
  const currentValue = isControlled ? selectedValue ?? null : internalValue;

  const menuName = React.useMemo(
    () => `filter-${Math.random().toString(36).slice(2, 8)}`,
    [],
  );

  React.useEffect(() => {
    if (isControlled) return;
    const values = new Set(options.map((opt) => opt.value));
    if (!currentValue || !values.has(currentValue)) {
      setInternalValue(defaultValue ?? options[0]?.value ?? null);
    }
  }, [options, currentValue, defaultValue, isControlled]);

  const handleSelect = React.useCallback(
    (value: string) => {
      if (!isControlled) {
        setInternalValue(value);
      }
      onChange?.(value);
      setMenuOpen(false);
    },
    [isControlled, onChange],
  );

  const items = React.useMemo<ContextMenuItem[]>(() => {
    if (!options.length) {
      return [
        {
          label: "Sin opciones disponibles",
          disabled: true,
        },
      ];
    }

    return options.map<ContextMenuItem>((option, index) => ({
      label: option.label,
      disabled: option.disabled,
      controlType: "radio",
      controlSide: "left",
      onClick: () => handleSelect(option.value),
      controlProps: {
        id: `${menuName}-${index}`,
        name: menuName,
        value: option.value,
        checked: currentValue === option.value,
        onChange: () => handleSelect(option.value),
      },
    }));
  }, [options, handleSelect, menuName, currentValue]);

  return (
    <div className='z-10'>
        <ContextMenu
          title={title}
          trigger={trigger ?? <FilterIcon />}
          items={items}
          isOpen={menuOpen}
          setIsOpen={setMenuOpen}
          autoFlip={false}
        />
    </div>
  );
};

export default Filter;
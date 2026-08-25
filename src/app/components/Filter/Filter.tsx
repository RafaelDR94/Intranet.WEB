import React from 'react';

import ContextMenu from '../ContextMenu/ContextMenu';

import type { ContextMenuItem } from '../ContextMenu/types';
import FilterIcon from "@/assets/icons/organization/filter-alt.svg";
import { FilterProps } from './types';
/**
 * Represents a single filter option displayed inside the contextual menu.
 */

const Filter: React.FC<FilterProps> = ({
  title = "Filtros",
  options,
  trigger,
  selectedValue,
  defaultValue = null,
  onChange,
  groups,
  alignRight = false,
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
    if (groups?.length) {
      return groups.flatMap((group, groupIndex) => [
        { label: group.title, section: true, disabled: true },
        ...group.options.map<ContextMenuItem>((option, optionIndex) => ({
          label: option.label,
          disabled: option.disabled,
          controlType: 'radio',
          controlSide: 'left',
          onClick: () => {
            group.onChange?.(option.value)
            setMenuOpen(false)
          },
          controlProps: {
            id: `${menuName}-${groupIndex}-${optionIndex}`,
            name: `${menuName}-${groupIndex}`,
            value: option.value,
            checked: group.selectedValue === option.value,
            onChange: () => {
              group.onChange?.(option.value)
              setMenuOpen(false)
            },
          },
        })),
      ])
    }

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
  }, [options, handleSelect, menuName, currentValue, groups]);

  return (
    <div className="relative z-[70] inline-block">
      <ContextMenu
        title={title}
        trigger={trigger ?? <FilterIcon />}
        items={items}
        isOpen={menuOpen}
        setIsOpen={setMenuOpen}
        autoFlip={false}
        alignRight={alignRight}
      />
    </div>
  );
};

export default Filter;

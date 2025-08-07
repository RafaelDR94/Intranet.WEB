'use client';
import { useState, useRef, ReactNode } from 'react';
import ArrowRight from '@/assets/icons/navegacion/nav-arrow-right.svg';
import { contextMenuStyles } from './styles';

type MenuItem = {
  label: string;
  disabled?: boolean;
  danger?: boolean;
  onClick?: () => void;
};

type ContextMenuProps = {
  trigger: ReactNode;
  items: MenuItem[];
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
};

// Helper mínimo para componer clases sin dependencias
const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ');

export const ContextMenu: React.FC<ContextMenuProps> = ({
  trigger,
  items,
  isOpen,
  setIsOpen,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [pressedIndex, setPressedIndex] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const menuIsOpen = isOpen ?? internalIsOpen;
  const setMenuIsOpen = setIsOpen ?? setInternalIsOpen;

  const toggleMenu = () => setMenuIsOpen(!menuIsOpen);

  const handleItemClick = (index: number, disabled?: boolean) => {
    if (disabled) return;
    setPressedIndex(index);
    const item = items[index];
    if (item?.onClick) item.onClick();
    // No cerramos automáticamente; el padre decide.
  };

  return (
    <div className={contextMenuStyles.Container} ref={menuRef}>
      <div onClick={toggleMenu} className={contextMenuStyles.Trigger}>
        {trigger}
      </div>

      {menuIsOpen && (
        <div
          className={contextMenuStyles.Menu}
          role="menu"
          aria-orientation="vertical"
        >
          {items.map((item, index) => {
            const isPressed = index === pressedIndex;
            const itemClass = cx(
              contextMenuStyles.ItemBase,
              isPressed && contextMenuStyles.ItemPressed,
              item.disabled && contextMenuStyles.ItemDisabled,
              item.danger && contextMenuStyles.ItemDanger,
              !item.disabled && !isPressed && !item.danger && contextMenuStyles.ItemHover
            );

            return (
              <button
                key={index}
                type="button"
                role="menuitem"
                disabled={item.disabled}
                onClick={() => handleItemClick(index, item.disabled)}
                className={itemClass}
              >
                <span>{item.label}</span>
                <ArrowRight className={contextMenuStyles.Icon} />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

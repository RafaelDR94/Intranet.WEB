'use client';

import React from 'react';
import ArrowRight from '@/assets/icons/navegacion/nav-arrow-right.svg';

import CustomRadio from '../CustomRadio/CustomRadio';
import { Checkbox } from '../CheckBox/CheckBox';
import { ToggleButton } from '../ToogleButton.tsx/ToogleButton';
import { Button } from '../Button/Button';
import { Control } from '../Control/Control';

import { ContextMenuItem, ContextMenuProps } from './types';
import { contextMenuStyles as cm } from './styles';
const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ');

import { useContextMenu } from './hooks/useContextMenu';

export const ContextMenu: React.FC<ContextMenuProps> = ({
  trigger,
  items,
  isOpen,
  setIsOpen,
  alignRight = false,
  autoFlip = false,
  estimatedMenuHeight = 320,
}) => {
  const {
    rootRef,
    menuRef,
    menuIsOpen,
    toggleMenu,
    hAlign,
    vAlign,
    pressedIndex,
    handleItemActivate,
  } = useContextMenu({
    isOpen,
    setIsOpen,
    alignRight,
    autoFlip,
    estimatedMenuHeight,
    itemsLength: items.length,
  });

  const renderControl = (item: ContextMenuItem) => {
    const p = item.controlProps ?? {};
    switch (item.controlType) {
      case 'details':
        return (
          <Button variant="outline" size="small" className={cm.ControlButton}>
            Details
          </Button>
        );
      case 'badge':
        return (
          <button type="button" aria-label="details" className={cm.BadgeButton} {...p}>
            Details
          </button>
        );
      case 'toggle':
        return <ToggleButton checked={false} onChange={() => {}} {...p} />;
      case 'radio':
        return (
          <CustomRadio id="" name="" label="" value="" checked={false} onChange={() => {}} {...p} />
        );
      case 'checkbox':
        return <Checkbox checked={false} onChange={() => {}} {...p} />;
      case 'control':
        return <Control onIncrement={() => {}} onDecrement={() => {}} variant="filled" {...p} />;
      default:
        return null;
    }
  };

  return (
    <div ref={rootRef} className={cm.Container}>
      <div onClick={toggleMenu} className={cm.Trigger}>
        {trigger}
      </div>

      {menuIsOpen && (
        <div
          ref={menuRef}
          role="menu"
          aria-orientation="vertical"
          className={cx(
            cm.MenuBase,
            cm.MenuSize,
            hAlign === 'right' ? cm.RightAligned : cm.LeftAligned,
            vAlign === 'down' ? cm.OpenDown : cm.OpenUp
          )}
        >
          {items.map((item, index) => {
            const isPressed = index === pressedIndex;
            const hasControl = Boolean(item.controlType);
            const controlLeft = item.controlSide === 'left';

            const itemClass = cx(
              cm.ItemBase,
              isPressed && cm.ItemPressed,
              item.disabled && cm.ItemDisabled,
              item.danger && cm.ItemDanger,
              !item.disabled && !isPressed && !item.danger && cm.ItemHover
            );

            return (
              <div
                key={index}
                role="menuitem"
                tabIndex={item.disabled ? -1 : 0}
                aria-disabled={item.disabled || undefined}
                onClick={() => handleItemActivate(index, items)}
                className={itemClass}
              >
                <div className={cm.ItemContent}>
                  {hasControl && controlLeft && <div className={cm.LeftSlot}>{renderControl(item)}</div>}
                  <span className={cm.Label}>{item.label}</span>
                  {hasControl ? (
                    !controlLeft && <div className={cm.RightSlot}>{renderControl(item)}</div>
                  ) : (
                    <ArrowRight className={cm.Icon} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ContextMenu;

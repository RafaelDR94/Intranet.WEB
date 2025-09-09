'use client';

import React, { useCallback, useEffect, useRef } from 'react';

import { Button } from '../Button/Button';
import { Checkbox } from '../CheckBox/CheckBox';
import { Control } from '../Control/Control';
import CustomRadio from '../CustomRadio/CustomRadio';
import { ToggleButton } from '../ToogleButton/ToogleButton';

import { useContextMenu } from './hooks/useContextMenu';
import { contextMenuStyles as cm } from './styles';
import { ContextMenuItem, ContextMenuProps } from './types';

import ArrowRight from '@/assets/icons/navegacion/nav-arrow-right.svg';


const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ');

// Nombre del evento global para coordinar instancias
const OPEN_EVENT = 'ctxmenu:open';
/**
 * Menú contextual accesible con soporte para:
 * - Trigger controlado/no-controlado
 * - Cierre por click afuera y tecla Escape
 * - Navegación con flechas Arriba/Abajo + Enter/Espacio
 * - Alineación a la derecha y auto-flip vertical
 *
 * @remarks
 * - `items` puede incluir íconos (SVG) y controles (checkbox/radio/toggle/badge/details/control).
 * - Si pasas `isOpen`/`setIsOpen`, el componente funciona en modo **controlado**.
 * - Si no, manejará su propio estado interno.
 *
 * @accessibility
 * - El trigger recibe `aria-haspopup="menu"` y `aria-expanded`.
 * - El menú usa `role="menu"` e items `role="menuitem"`.
 */
export const ContextMenu: React.FC<ContextMenuProps> = ({
  title,
  trigger,
  items,
  isOpen,
  setIsOpen,
  alignRight = true,
  autoFlip = true,
  estimatedMenuHeight = 320,
  ignoreRefs = [],
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

  // ID por instancia para el bus global
  const instanceId = useRef(Symbol('ctxmenu'));

  // Cierre seguro (funciona en modo controlado y no controlado)
  const requestClose = useCallback(() => {
    if (setIsOpen) {
      setIsOpen(false);
    } else if (menuIsOpen) {
      // fallback si no hay setIsOpen
      toggleMenu();
    }
  }, [setIsOpen, menuIsOpen, toggleMenu]);

  // Coordinar instancias: cuando se abre una, las demás se cierran
  useEffect(() => {
    const onAnotherOpen = (e: Event) => {
      const detail = (e as CustomEvent<{ id: symbol }>).detail;
      if (!detail) return;
      if (detail.id !== instanceId.current && menuIsOpen) {
        requestClose();
      }
    };
    window.addEventListener(OPEN_EVENT, onAnotherOpen as EventListener);
    return () => window.removeEventListener(OPEN_EVENT, onAnotherOpen as EventListener);
  }, [menuIsOpen, requestClose]);

  // Emitir evento cuando esta instancia se abre
  useEffect(() => {
    if (menuIsOpen) {
      window.dispatchEvent(new CustomEvent(OPEN_EVENT, { detail: { id: instanceId.current } }));
    }
  }, [menuIsOpen]);

  // 👉 util para saber si el target está dentro de algún ref ignorado
  const isInsideIgnored = useCallback(
    (node: Node) => ignoreRefs.some((r) => r?.current && r.current.contains(node)),
    [ignoreRefs]
  );

  // Cerrar con click fuera y con Escape
  useEffect(() => {
    if (!menuIsOpen) return;

    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      const root = rootRef.current;
      const menu = menuRef.current;

      const insideRoot = !!(root && root.contains(target));
      const insideMenu = !!(menu && menu.contains(target));
      const insideIgnored = isInsideIgnored(target);

      // Si el pointerdown NO ocurrió dentro del trigger+menú
      // y TAMPOCO dentro de zonas ignoradas → cerramos
      if (!insideRoot && !insideMenu && !insideIgnored) {
        requestClose();
      }
      // Si cae dentro de zonas ignoradas, NO cerrar (permitimos interacción con submenús externos)
    };

    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        requestClose();
      }
    };

    // Usamos pointerdown en captura para adelantarnos a otros handlers
    document.addEventListener('pointerdown', handlePointerDown, { capture: true });
    document.addEventListener('keydown', handleKeydown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown, { capture: true } as any);
      document.removeEventListener('keydown', handleKeydown);
    };
  }, [menuIsOpen, ignoreRefs, isInsideIgnored, menuRef, requestClose, rootRef]);

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
        return <ToggleButton checked={false} onChange={() => { }} {...p} />;
      case 'radio':
        return (
          <CustomRadio id="" name="" label="" value="" checked={false} onChange={() => { }} {...p} />
        );
      case 'checkbox':
        return <Checkbox checked={false} onChange={() => { }} {...p} />;
      case 'control':
        return <Control onIncrement={() => { }} onDecrement={() => { }} variant="filled" {...p} />;
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
          {title && (
            <div className={cm.HeaderWrap} >
              <span className={cm.HeaderText}>{title}</span>
            </div>
          )}
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

            const RightIcon = item.icon ?? ArrowRight;

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
                    <RightIcon className={cm.Icon} />
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

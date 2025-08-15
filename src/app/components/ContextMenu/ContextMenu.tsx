'use client';

import React, { useEffect, useRef } from 'react';
import ArrowRight from '@/assets/icons/navegacion/nav-arrow-right.svg';
import CustomRadio from '../CustomRadio/CustomRadio';
import { Checkbox } from '../CheckBox/CheckBox';
import { ToggleButton } from '../ToogleButton.tsx/ToogleButton';
import { Button } from '../Button/Button';
import { Control } from '../Control/Control';
import { ContextMenuItem, ContextMenuProps } from './types';
import { contextMenuStyles as cm } from './styles';
import { useContextMenu } from './hooks/useContextMenu';

/**
 * ContextMenu
 *
 * Un menú contextual accesible y controlable que se abre al hacer click sobre un *trigger*.
 *
 * ✅ Características principales
 * - **Controlado / No controlado**: Puedes manejar `isOpen`/`setIsOpen` o dejar que el componente administre su propio estado.
 * - **AutoFlip**: Si no cabe en la ventana, intenta invertir su apertura vertical para mantenerse visible.
 * - **Alineación horizontal**: `alignRight` posiciona el menú a la derecha o izquierda del trigger.
 * - **Cierre seguro**: Cierra con `Escape`, clic fuera y coordina múltiples instancias (al abrir una, el resto se cierran).
 * - **Zonas ignoradas**: Con `ignoreRefs` puedes permitir interacciones en zonas que **no** deben cerrar el menú.
 * - **Controles embebidos**: Soporta `toggle`, `checkbox`, `radio`, `control`, `badge`, `details` en cada ítem.
 * - **Título opcional**: Puedes proporcionar un título para el menú contextual.
 * ♿ Accesibilidad
 * - Usa `role="menu"`/`role="menuitem"`, `tabIndex` y `aria-disabled`.
 * - Cierra con `Escape` y gestiona focus de forma predecible.
 */

const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ');

// Nombre del evento global para coordinar instancias
const OPEN_EVENT = 'ctxmenu:open';

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
  const requestClose = () => {
    if (setIsOpen) {
      setIsOpen(false);
    } else if (menuIsOpen) {
      // fallback si no hay setIsOpen
      toggleMenu();
    }
  };

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
  }, [menuIsOpen]);

  // Emitir evento cuando esta instancia se abre
  useEffect(() => {
    if (menuIsOpen) {
      window.dispatchEvent(new CustomEvent(OPEN_EVENT, { detail: { id: instanceId.current } }));
    }
  }, [menuIsOpen]);

  // 👉 util para saber si el target está dentro de algún ref ignorado
  const isInsideIgnored = (node: Node) =>
    ignoreRefs.some((r) => r?.current && r.current.contains(node));

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
  }, [menuIsOpen, ignoreRefs]);

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

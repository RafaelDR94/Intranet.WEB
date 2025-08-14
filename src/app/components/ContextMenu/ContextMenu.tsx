'use client';

import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import ArrowRight from '@/assets/icons/navegacion/nav-arrow-right.svg';

// Controles opcionales (ajusta rutas si aplican)
import CustomRadio from '../CustomRadio/CustomRadio';
import { Checkbox } from '../CheckBox/CheckBox';
import { ToggleButton } from '../ToogleButton.tsx/ToogleButton';
import { Button } from '../Button/Button';
import { Control } from '../Control/Control';

// Helper para componer clases
const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ');

// 🔒 Estilos **encapsulados** SOLO para este componente
const cm = {
  root: 'relative inline-block isolate',
  trigger: 'inline-block',

  // panel base + restricciones SOLO del ContextMenu
  panelBase: 'absolute z-50 rounded-md shadow-300 bg-white-100 p-1',
  panelSize: 'w-56 max-w-[calc(100vw-1rem)] overflow-x-hidden',

  // posición
  alignRight: 'right-0',
  alignLeft: 'left-0',
  dirDown: 'top-full mt-2',
  dirUp: 'bottom-full mb-2',

  // items
  item: 'w-full flex justify-between items-center px-4 py-2 text-left text-gray-70 font-normal text-b1 rounded-sm',
  itemPressed: 'bg-green-10 text-black-100',
  itemDisabled: 'text-gray-40 cursor-not-allowed',
  itemDanger: 'text-alert-red-100',
  itemHover: 'hover:bg-gray-10',
  icon: 'w-5 h-5 text-green-100',

  // soporte de controles
  content: 'flex w-full items-center justify-between gap-2',
  label: 'flex-1 truncate',
  leftSlot: 'flex items-center justify-center',
  rightSlot: 'flex items-center justify-center',
  controlBtn: 'px-2 py-1 text-sm border rounded-sm',
  badgeBtn: 'px-2 py-0.5 text-xs bg-gray-20 rounded-full',
};

type ControlType = 'details' | 'badge' | 'toggle' | 'radio' | 'checkbox' | 'control';
type ControlSide = 'left' | 'right';

export interface ContextMenuItem {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  danger?: boolean;
  controlType?: ControlType;
  controlSide?: ControlSide;
  controlProps?: Record<string, any>;
}

export interface ContextMenuProps {
  trigger: React.ReactNode;
  items: ContextMenuItem[];
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;

  // NEW: opciones de posicionamiento para emular tu componente previo
  alignRight?: boolean;            // por defecto false → izquierda
  autoFlip?: boolean;              // por defecto false → no calcula flip vertical
  estimatedMenuHeight?: number;    // por defecto 320px (heurístico)
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  trigger,
  items,
  isOpen,
  setIsOpen,

  // NEW: defaults
  alignRight = false,
  autoFlip = false,
  estimatedMenuHeight = 320,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [pressedIndex, setPressedIndex] = useState<number | null>(null);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // NEW: hAlign ahora respeta estrictamente la prop alignRight
  const [hAlign, setHAlign] = useState<'right' | 'left'>(alignRight ? 'right' : 'left');

  // NEW: vAlign por defecto abre hacia abajo; solo cambia si autoFlip=true
  const [vAlign, setVAlign] = useState<'down' | 'up'>('down');

  const menuIsOpen = isOpen ?? internalIsOpen;
  const setMenuIsOpen = setIsOpen ?? setInternalIsOpen;
  const toggleMenu = () => setMenuIsOpen(!menuIsOpen);

  // NEW: cuando cambia alignRight desde fuera, actualizamos hAlign
  useEffect(() => {
    setHAlign(alignRight ? 'right' : 'left');
  }, [alignRight]);

  // ---- colocación inteligente (flip vertical SOLO si autoFlip) ----
  const computeVerticalPlacement = () => {
    if (!autoFlip) return; // respeta prop

    // Usamos el rect del contenedor (trigger) para medir espacio disponible
    const container = rootRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const shouldOpenUp = spaceBelow < estimatedMenuHeight;

    setVAlign(shouldOpenUp ? 'up' : 'down');
  };

  useLayoutEffect(() => {
    if (!menuIsOpen) return;
    // NEW: solo calculamos el flip vertical si está activado
    computeVerticalPlacement();
  }, [menuIsOpen, autoFlip, estimatedMenuHeight, items.length]);

  // Recalcular al redimensionar ventana o si cambia el tamaño del panel (solo si autoFlip)
  useEffect(() => {
    if (!menuIsOpen || !autoFlip) return;

    const onResize = () => computeVerticalPlacement();
    window.addEventListener('resize', onResize);

    const ro = new ResizeObserver(() => computeVerticalPlacement());
    if (menuRef.current) ro.observe(menuRef.current);

    return () => {
      window.removeEventListener('resize', onResize);
      ro.disconnect();
    };
  }, [menuIsOpen, autoFlip]);

  const handleItemActivate = (index: number, disabled?: boolean) => {
    if (disabled) return;
    setPressedIndex(index);
    items[index]?.onClick?.();
  };

  const renderControl = (item: ContextMenuItem) => {
    const p = item.controlProps ?? {};
    switch (item.controlType) {
      case 'details':
        return (
          <Button variant="outline" size="small" className={cm.controlBtn}>
            Details
          </Button>
        );
      case 'badge':
        return (
          <button type="button" aria-label="details" className={cm.badgeBtn} {...p}>
            Details
          </button>
        );
      case 'toggle':
        return (
          <ToggleButton
            checked={false}
            onChange={() => {}}
            disabled={false}
            label=""
            labelPosition="right"
            labelColor=""
            className=""
            {...p}
          />
        );
      case 'radio':
        return (
          <CustomRadio
            id=""
            name=""
            label=""
            value=""
            checked={false}
            disabled={false}
            onChange={() => {}}
            {...p}
          />
        );
      case 'checkbox':
        return (
          <Checkbox
            checked={false}
            onChange={() => {}}
            indeterminate={false}
            disabled={false}
            label=""
            labelPosition="right"
            name=""
            className=""
            {...p}
          />
        );
      case 'control':
        return <Control onIncrement={() => {}} onDecrement={() => {}} variant="filled" {...p} />;
      default:
        return null;
    }
  };

  return (
    <div ref={rootRef} className={cm.root}>
      <div onClick={toggleMenu} className={cm.trigger}>
        {trigger}
      </div>

      {menuIsOpen && (
        <div
          ref={menuRef}
          role="menu"
          aria-orientation="vertical"
          className={cx(
            cm.panelBase,
            cm.panelSize,
            // NEW: horizontal controlado por prop alignRight
            hAlign === 'right' ? cm.alignRight : cm.alignLeft,
            // NEW: vertical controlado por autoFlip (si no, siempre 'down')
            vAlign === 'down' ? cm.dirDown : cm.dirUp
          )}
        >
          {items.map((item, index) => {
            const isPressed = index === pressedIndex;
            const hasControl = Boolean(item.controlType);
            const controlLeft = item.controlSide === 'left';

            const itemClass = cx(
              cm.item,
              isPressed && cm.itemPressed,
              item.disabled && cm.itemDisabled,
              item.danger && cm.itemDanger,
              !item.disabled && !isPressed && !item.danger && cm.itemHover
            );

            return (
              <div
                key={index}
                role="menuitem"
                tabIndex={item.disabled ? -1 : 0}
                aria-disabled={item.disabled || undefined}
                onClick={() => handleItemActivate(index, item.disabled)}
                className={itemClass}
              >
                <div className={cm.content}>
                  {hasControl && controlLeft && <div className={cm.leftSlot}>{renderControl(item)}</div>}
                  <span className={cm.label}>{item.label}</span>
                  {hasControl ? (
                    !controlLeft && <div className={cm.rightSlot}>{renderControl(item)}</div>
                  ) : (
                    <ArrowRight className={cm.icon} />
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

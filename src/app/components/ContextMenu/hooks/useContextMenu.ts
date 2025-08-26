'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { ContextMenuItem } from '../types';

type HAlign = 'right' | 'left';
type VAlign = 'down' | 'up';

interface UseContextMenuLogicParams {
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
  alignRight?: boolean;
  autoFlip?: boolean;
  estimatedMenuHeight?: number;
  itemsLength?: number;
}

interface UseContextMenuLogicReturn {
  rootRef: React.MutableRefObject<HTMLDivElement | null>;
  menuRef: React.MutableRefObject<HTMLDivElement | null>;

  menuIsOpen: boolean;
  setMenuIsOpen: (open: boolean) => void;
  toggleMenu: () => void;

  hAlign: HAlign;
  vAlign: VAlign;

  pressedIndex: number | null;
  setPressedIndex: (i: number | null) => void;

  handleItemActivate: (index: number, items: ContextMenuItem[]) => void;
}

export function useContextMenu({
  isOpen,
  setIsOpen,
  alignRight = false,
  autoFlip = false,
  estimatedMenuHeight = 320,
  itemsLength = 0,
}: UseContextMenuLogicParams): UseContextMenuLogicReturn {
  // controlado / no-controlado
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const menuIsOpen = isOpen ?? internalIsOpen;
  const setMenuIsOpen = setIsOpen ?? setInternalIsOpen;
  const toggleMenu = () => setMenuIsOpen(!menuIsOpen);

  // refs
  const rootRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // alineación
  const [hAlign, setHAlign] = useState<HAlign>(alignRight ? 'right' : 'left');
  const [vAlign, setVAlign] = useState<VAlign>('down');

  useEffect(() => {
    setHAlign(alignRight ? 'right' : 'left');
  }, [alignRight]);

  // calcular flip vertical
  const computeVerticalPlacement = () => {
    if (!autoFlip) return;
    const container = rootRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const shouldOpenUp = spaceBelow < estimatedMenuHeight;
    setVAlign(shouldOpenUp ? 'up' : 'down');
  };

  useLayoutEffect(() => {
    if (!menuIsOpen) return;
    computeVerticalPlacement();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuIsOpen, autoFlip, estimatedMenuHeight, itemsLength]);

  useEffect(() => {
    if (!menuIsOpen || !autoFlip) return;

    const onResize = () => computeVerticalPlacement();
    window.addEventListener('resize', onResize);

    const RO: typeof ResizeObserver | undefined = (globalThis as any).ResizeObserver;
    const ro = RO ? new RO(() => computeVerticalPlacement()) : null;
    if (ro && menuRef.current) ro.observe(menuRef.current);

    return () => {
      window.removeEventListener('resize', onResize);
      ro?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuIsOpen, autoFlip]);

  // interacción de items
  const [pressedIndex, setPressedIndex] = useState<number | null>(null);

  const handleItemActivate = (index: number, items: ContextMenuItem[]) => {
    const item = items[index];
    if (!item || item.disabled) return;
    setPressedIndex(index);
    item.onClick?.();
  };

  return {
    rootRef,
    menuRef,
    menuIsOpen,
    setMenuIsOpen,
    toggleMenu,
    hAlign,
    vAlign,
    pressedIndex,
    setPressedIndex,
    handleItemActivate,
  };
}

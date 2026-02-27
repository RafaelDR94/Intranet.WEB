import { ComponentType, SVGProps } from 'react';

export type ControlType =
  | 'details'
  | 'badge'
  | 'toggle'
  | 'radio'
  | 'checkbox'
  | 'control';

export type ControlSide = 'left' | 'right';

export interface ContextMenuItem {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  danger?: boolean;
  dataTour?: string;
  controlType?: ControlType;
  controlSide?: ControlSide;
  controlProps?: Record<string, any>;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
}

export interface ContextMenuProps {
  title?: string;
  trigger: React.ReactNode;
  items: ContextMenuItem[];
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
  outsideSafeRefs?: Array<React.RefObject<HTMLElement>>;
  // Posicionamiento
  alignRight?: boolean;         // default: false (izquierda)
  autoFlip?: boolean;           // default: false (no calcula flip vertical)
  estimatedMenuHeight?: number; // default: 320
  ignoreRefs?: Array<React.RefObject<HTMLElement | null>>; // <-- cambiar aquí
}

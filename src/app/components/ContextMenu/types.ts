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
  controlType?: ControlType;
  controlSide?: ControlSide;
  controlProps?: Record<string, any>;
}

export interface ContextMenuProps {
  trigger: React.ReactNode;
  items: ContextMenuItem[];
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;

  // Posicionamiento
  alignRight?: boolean;         // default: false (izquierda)
  autoFlip?: boolean;           // default: false (no calcula flip vertical)
  estimatedMenuHeight?: number; // default: 320
}

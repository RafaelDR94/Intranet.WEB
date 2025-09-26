import React from 'react';

import type { Size, Variant } from '@/app/components/Button/types';

export interface ButtonsNavigationProps {
  children: React.ReactNode;
  ariaLabel?: string;
  className?: string;
  dataTestId?: string;
  activeId?: string;
  defaultActiveId?: string;
  onActiveChange?: (id: string) => void;
  contentClassName?: string;
  /** Default size for buttons (overridable per item). Default: 'small' */
  buttonSize?: Size;
  /** Default variant when item is active. Default: 'solid' */
  activeVariant?: Variant;
  /** Default variant when item is inactive. Default: 'outline' */
  inactiveVariant?: Variant;
}

export interface ButtonsNavigationItemProps {
  id: string;
  label: string;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  dataTestId?: string;
  /** Per-item size override */
  size?: Size;
  /** Per-item active variant override */
  activeVariant?: Variant;
  /** Per-item inactive variant override */
  inactiveVariant?: Variant;
  /** Optional native button type */
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>['type'];
  /**
   * Optional custom content for the button label (node or render function)
   */
  children?:
    | React.ReactNode
    | ((args: { id: string; label: string; active: boolean; disabled: boolean }) => React.ReactNode);
  /** Content to render below nav when this item is active */
  renderContent?: React.ReactNode | (() => React.ReactNode);
}

export type ButtonsNavigationComponent = React.FC<ButtonsNavigationProps> & {
  Item: React.FC<ButtonsNavigationItemProps>;
};


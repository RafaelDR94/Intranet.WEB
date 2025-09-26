"use client";
import clsx from 'clsx';
import React from 'react';

import type {
  ButtonsNavigationComponent,
  ButtonsNavigationItemProps,
  ButtonsNavigationProps,
} from './types';

import { Button } from '@/app/components/Button/Button';
import type { Size, Variant } from '@/app/components/Button/types';

const containerClasses = 'flex items-center gap-3';

const ButtonsNavigationBase: React.FC<ButtonsNavigationProps> = ({
  children,
  ariaLabel = 'Buttons navigation',
  className,
  dataTestId = 'buttons-navigation',
  activeId,
  defaultActiveId,
  onActiveChange,
  contentClassName,
  buttonSize = 'small',
  activeVariant = 'solid',
  inactiveVariant = 'outline',
}) => {
  const childArray = React.Children.toArray(children).filter(Boolean) as React.ReactElement<
    ButtonsNavigationItemProps
  >[];

  const computeInitial = React.useCallback(() => {
    if (defaultActiveId) return defaultActiveId;
    const marked = childArray.find((el) => el.props && (el.props as any).active);
    if (marked) return (marked.props as any).id as string;
    return childArray[0]?.props.id;
  }, [defaultActiveId, childArray]);

  const [internalActive, setInternalActive] = React.useState<string | undefined>(computeInitial);
  React.useEffect(() => {
    if (activeId === undefined) setInternalActive((prev) => prev ?? computeInitial());
  }, [activeId, computeInitial]);

  const currentActive = activeId ?? internalActive;

  const handleSelect = (id: string, childOnClick?: () => void, disabled?: boolean) => {
    if (disabled) return;
    childOnClick?.();
    onActiveChange?.(id);
    if (activeId === undefined) setInternalActive(id);
  };

  const enhanced = childArray.map((child, idx) => {
    const { id, onClick, disabled, className: itemClass, size, activeVariant: itemActiveV, inactiveVariant: itemInactV, children: itemChildren, type, dataTestId } =
      child.props;
    const isActive = currentActive === id;
    const usedSize: Size = size ?? buttonSize;
    const usedVariant: Variant = isActive ? itemActiveV ?? activeVariant : itemInactV ?? inactiveVariant;

    const content =
      typeof itemChildren === 'function'
        ? (itemChildren as any)({ id, label: child.props.label, active: isActive, disabled: !!disabled })
        : itemChildren ?? child.props.label;

    const testId = dataTestId ?? `buttonnav-${id}`;

    return (
      <Button
        key={child.key ?? id ?? idx}
        variant={usedVariant}
        size={usedSize}
        aria-current={isActive ? 'page' : undefined}
        disabled={disabled}
        onClick={() => handleSelect(id, onClick, disabled)}
        className={itemClass}
        type={type}
        dataTestId={testId}
        hideIcon
      >
        {content}
      </Button>
    );
  });

  const activeChild = childArray.find((el) => el.props.id === currentActive) ?? childArray[0];
  const activeContentRaw = activeChild?.props?.renderContent;
  const activeContent = typeof activeContentRaw === 'function' ? activeContentRaw() : activeContentRaw;

  return (
    <div className={clsx('space-y-4', className)}>
      <nav aria-label={ariaLabel} className={containerClasses} data-testid={dataTestId}>
        {enhanced}
      </nav>
      {activeContent && (
        <div className={contentClassName} data-testid={`${dataTestId}-content`}>
          {activeContent}
        </div>
      )}
    </div>
  );
};

const ButtonsNavigationItem: React.FC<ButtonsNavigationItemProps> = () => null as any;

export const ButtonsNavigation = ButtonsNavigationBase as ButtonsNavigationComponent;
ButtonsNavigation.Item = ButtonsNavigationItem;

export default ButtonsNavigation;


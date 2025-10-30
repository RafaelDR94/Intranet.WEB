"use client";
import clsx from 'clsx';
import React from 'react';

import { breadcrumbsStyles, itemStyles } from './styles';
import type { BreadcrumbItemProps, BreadcrumbsComponent, BreadcrumbsProps } from './types';

import ArrowRight from '@/assets/icons/navegacion/nav-arrow-right.svg';

const Separator: React.FC = () => (
  <ArrowRight
    className={breadcrumbsStyles.separator}
    data-testid="breadcrumb-separator"
    aria-hidden="true"
  />
);

const BreadcrumbsBase: React.FC<BreadcrumbsProps> = ({
  children,
  separator,
  ariaLabel = 'Breadcrumb',
  className,
  dataTestId = 'breadcrumbs',
  activeId,
  defaultActiveId,
  onActiveChange,
  contentClassName,
}) => {
  const childArray = React.Children.toArray(children).filter(Boolean) as React.ReactElement<
    BreadcrumbItemProps
  >[];
  const sep = separator ?? <Separator />;

  // Compute initial active id: defaultActiveId -> child marked active -> first child
  const computeInitial = React.useCallback(() => {
    if (defaultActiveId) return defaultActiveId;
    const marked = childArray.find((el) => el.props.active);
    if (marked) return marked.props.id;
    return childArray[0]?.props.id;
  }, [defaultActiveId, childArray]);

  const [internalActive, setInternalActive] = React.useState<string | undefined>(computeInitial);
  // Keep internal in sync if children change and uncontrolled
  React.useEffect(() => {
    if (activeId === undefined) {
      setInternalActive((prev) => prev ?? computeInitial());
    }
  }, [activeId, computeInitial]);

  const currentActive = activeId ?? internalActive;

  const handleSelect = (id: string, childOnClick?: () => void, disabled?: boolean) => {
    if (disabled) return;
    childOnClick?.();
    onActiveChange?.(id);
    if (activeId === undefined) {
      setInternalActive(id);
    }
  };

  // Build enhanced items with active + click handling, and collect content
  const enhanced = childArray.map((child, idx) => {
    const { id, onClick, disabled } = child.props;
    const isActive = currentActive === id;
    const cloned = React.cloneElement(child, {
      active: isActive,
      onClick: () => handleSelect(id, onClick, disabled),
    });
    const withSep = (
      <React.Fragment key={child.key ?? id ?? idx}>
        {cloned}
        {idx < childArray.length - 1 && sep}
      </React.Fragment>
    );
    return withSep;
  });

  const activeChild = childArray.find((el) => el.props.id === currentActive) ?? childArray[0];
  const activeContentRaw = activeChild?.props?.renderContent;
  const activeContent = typeof activeContentRaw === 'function' ? activeContentRaw() : activeContentRaw;


  return (
    <div className={clsx('space-y-4', className)}>
      {childArray.length > 1 && (
        <nav
          aria-label={ariaLabel}
          className={clsx(breadcrumbsStyles.container)}
          data-testid={dataTestId}
        >
          {enhanced}
        </nav>
      )}

      {activeContent && (
        <div className={contentClassName} data-testid={`${dataTestId}-content`}>
          {activeContent}
        </div>
      )}
    </div>
  );
};

const BreadcrumbItem: React.FC<BreadcrumbItemProps> = ({
  id,
  label,
  active = false,
  disabled = false,
  onClick,
  href,
  className,
  dataTestId,
  children,
}) => {
  const classes = clsx(
    itemStyles.base,
    disabled ? itemStyles.disabled : active ? itemStyles.active : itemStyles.inactive,
    className
  );

  const testId = dataTestId ?? `breadcrum-${id}`; // requested pattern

  const content =
    typeof children === 'function'
      ? (children as any)({ id, label, active, disabled, href })
      : children ?? label;

  if (href) {
    return (
      <a href={href} aria-current={active ? 'page' : undefined} className={classes} data-testid={testId}>
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      aria-current={active ? 'page' : undefined}
      disabled={disabled}
      className={classes}
      data-testid={testId}
    >
      {content}
    </button>
  );
};

export const Breadcrumbs = BreadcrumbsBase as BreadcrumbsComponent;
Breadcrumbs.Item = BreadcrumbItem;

export default Breadcrumbs;

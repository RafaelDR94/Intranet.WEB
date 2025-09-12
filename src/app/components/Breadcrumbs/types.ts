import React from 'react';

export interface BreadcrumbsProps {
  /** Children must be Breadcrumbs.Item elements */
  children: React.ReactNode;
  /** Optional custom separator (default ›) */
  separator?: React.ReactNode;
  /** Optional aria-label for nav */
  ariaLabel?: string;
  /** Container className */
  className?: string;
  /** data-testid for container */
  dataTestId?: string;
  /** Controlled active item id */
  activeId?: string;
  /** Initial active id for uncontrolled mode */
  defaultActiveId?: string;
  /** Notifies when active id changes */
  onActiveChange?: (id: string) => void;
  /** Optional class for the content wrapper */
  contentClassName?: string;
}

export interface BreadcrumbItemProps {
  /** Unique id for item; used to build data-testid as breadcrum-{id} */
  id: string;
  /** Visible label for the crumb */
  label: string;
  /** If true, styles as active/current */
  active?: boolean;
  /** Disable click interaction */
  disabled?: boolean;
  /** Click handler for interactive crumbs */
  onClick?: () => void;
  /** Optional href; renders as anchor if provided */
  href?: string;
  /** Optional custom className for the item */
  className?: string;
  /** Optional override for data-testid (defaults to breadcrum-{id}) */
  dataTestId?: string;
  /**
   * Optional custom content to render inside the item.
   * Can be a ReactNode or a render function that receives state.
   */
  children?:
    | React.ReactNode
    | ((args: {
        id: string;
        label: string;
        active: boolean;
        disabled: boolean;
        href?: string;
      }) => React.ReactNode);

  /**
   * Content to render below the breadcrumb bar when this item is active.
   * Supports a ReactNode or a lazy render function.
   */
  renderContent?: React.ReactNode | (() => React.ReactNode);
}

export type BreadcrumbsComponent = React.FC<BreadcrumbsProps> & {
  Item: React.FC<BreadcrumbItemProps>;
};

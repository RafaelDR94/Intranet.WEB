import { ReactNode, ComponentType, SVGProps } from 'react';

export type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

export interface DetailsPanelIcons {
    expand?: IconComponent;     // Icono para ampliar al 100%
    collapse?: IconComponent;   // Icono para volver a 2/5
    close?: IconComponent;      // Icono para cerrar (tache)
}

export interface DetailsPanelLabels {
    leftLabel?: ReactNode;      // Label izquierdo opcional
    rightLabel?: ReactNode;     // Label derecho opcional
}

export interface DetailsPanelProps {
    open: boolean;
    expanded?: boolean;
    collapsedWidthClass?: string;
    onClose: () => void;
    onExpandedChange?: (value: boolean) => void;
    closeButtonDataTour?: string;
    actionButton?: React.ReactNode;
    renderActions?: () => React.ReactNode;
    leftLabel?: React.ReactNode;
    rightLabel?: React.ReactNode;
    childrenLabel?: React.ReactNode;
    secondLeftLabel?: React.ReactNode;
    secondRightLabel?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
    side?: 'left' | 'right';
    zIndex?: number;
    withinContainer?: boolean;
    label?: () => React.ReactNode;
    divider?: boolean;
    contentClassName?: string;
}

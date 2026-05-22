"use client";

import clsx from "clsx";
import React, { useState } from "react";

import { useIsMobile } from "../DataTable/components/DataTableLayout/hooks/useMediaQuery";

import { detailsPanelStyles, detailsPanelStyles as s } from "./styles";
import { DetailsPanelProps } from "./types";

import { Button } from "@/app/components/Button/Button";
import CloseIcon from "@/assets/icons/acciones/cancel.svg";
import ExpandIcon from "@/assets/icons/navegacion/sidebar-collapse.svg";
import CollapseIcon from "@/assets/icons/navegacion/sidebar-expand.svg";

export const DetailsPanelLayout: React.FC<DetailsPanelProps> = ({
  open,
  expanded,
  collapsedWidthClass,
  onClose,
  onExpandedChange,
  closeButtonDataTour,
  actionButton,
  renderActions,
  leftLabel,
  rightLabel,
  children,
  className,
  side = "right",
  zIndex = 80,
  label,
  withinContainer = false,
  divider = true,
  contentClassName,
}) => {
  const [internalExpanded, setInternalExpanded] = useState<boolean>(
    expanded ?? false,
  );
  const isControlled = typeof onExpandedChange === "function";
  const isMobile = useIsMobile();
  const isExpanded = isControlled ? Boolean(expanded) : internalExpanded;
  const effectiveExpanded = isMobile ? true : isExpanded;
  const widthClass = !open
    ? "w-0"
    : isMobile
      ? "w-full max-w-full min-w-0"
    : effectiveExpanded
      ? "w-full"
      : collapsedWidthClass ?? "w-2/5 min-w-[320px]";

  const sidePosition = side === "right" ? "right-0" : "left-0";
  const borderSide = side === "right" ? "border-l" : "border-r";

  // 🎯 Posicionamiento: fixed (cubre viewport) vs absolute (solo el contenedor padre)
  const positionClass = withinContainer ? "absolute" : "fixed";

  const toggleExpand = () => {
    if (typeof onExpandedChange === "function") onExpandedChange(!isExpanded);
    else setInternalExpanded(!isExpanded);
  };

  if (!open) return null;

  return (
    <aside
      aria-hidden={!open}
      aria-label="Panel de detalles"
      className={clsx(
        positionClass,
        s.rootBase,
        sidePosition,
        widthClass,
        className,
      )}
      style={{ zIndex }}
    >
      <div className={clsx(s.sheet, borderSide, "w-full")}>
        {/* Header */}
        <header className={s.header}>
          {!isMobile && <div className={s.headerLeft}>{actionButton}</div>}

          <div className={s.headerRight}>
            {renderActions?.()}
            {label?.()}
            {!isMobile && open && (
              <Button
                variant="ghost"
                size="small"
                iconOnly
                aria-label={effectiveExpanded ? "Colapsar panel" : "Expandir panel"}
                icon={() =>
                  effectiveExpanded ? (
                    <CollapseIcon className={detailsPanelStyles.iconButtons} />
                  ) : (
                    <ExpandIcon className={detailsPanelStyles.iconButtons} />
                  )
                }
                onClick={toggleExpand}
              />
            )}

            <Button
              variant="ghost"
              size="small"
              iconOnly
              aria-label="Cerrar panel"
              icon={() => (
                <CloseIcon className={detailsPanelStyles.iconButtons} />
              )}
              onClick={onClose}
              data-tour={closeButtonDataTour}
            />
          </div>
        </header>

        {divider && <div className={s.divider} />}

        {(leftLabel || rightLabel) && (
          <div className={s.labels}>
            <div className={detailsPanelStyles.headertexts}>{leftLabel}</div>
            <div className={detailsPanelStyles.headertexts}>{rightLabel}</div>
          </div>
        )}

        <section className={clsx(s.content, contentClassName)}>{children}</section>
        {isMobile && <>{actionButton}</>}
      </div>
    </aside>
  );
};

export default DetailsPanelLayout;

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
  onClose,
  onExpandedChange,
  actionButton,
  renderActions,
  leftLabel,
  rightLabel,
  children,
  className,
  side = "right",
  zIndex = 50,
  label,
  withinContainer = false,
}) => {
  const [internalExpanded, setInternalExpanded] = useState<boolean>(
    expanded ?? false,
  );
  const isControlled = typeof onExpandedChange === "function";
  const isExpanded = isControlled ? Boolean(expanded) : internalExpanded;
  const isMobile = useIsMobile();
  const widthClass = !open
    ? "w-0"
    : isExpanded
      ? "w-full"
      : "w-2/5 min-w-[320px]";

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
            {open && (
              <Button
                variant="ghost"
                size="small"
                iconOnly
                aria-label={isExpanded ? "Colapsar panel" : "Expandir panel"}
                icon={() =>
                  isExpanded ? (
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
            />
          </div>
        </header>

        <div className={s.divider} />

        {(leftLabel || rightLabel) && (
          <div className={s.labels}>
            <div className={detailsPanelStyles.headertexts}>{leftLabel}</div>
            <div className={detailsPanelStyles.headertexts}>{rightLabel}</div>
          </div>
        )}

        <section className={s.content}>{children}</section>
        {isMobile && <>{actionButton}</>}
      </div>
    </aside>
  );
};

export default DetailsPanelLayout;

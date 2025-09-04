/**
 * Calendar Component
 * 
 * Componente de selección de rangos de fecha con soporte para presets
 * y selección personalizada. Adaptado a dispositivos móviles y de escritorio.
 * 
 * @param {function} onCalendarClick - Callback ejecutado cuando se confirma un rango de fechas.
 */

import React, { useEffect, useRef } from "react";
import CalendarIcon from "@/assets/icons/System/System/calendar.svg";
import { ContextMenu } from "../ContextMenu/ContextMenu";
import DatePicker from "react-datepicker";
import { calendarStyles } from "./styles";
import type { CalendarProps } from "./types";
import "react-datepicker/dist/react-datepicker.css";
import "./datepicker.css";
import { useCalendar } from "./hooks/useCalendar";
import { useIsMobile } from "../DataTable/components/DataTableLayout/hooks/useMediaQuery";

export const Calendar: React.FC<CalendarProps> = ({ onCalendarClick }) => {
  const isDisabled = false; // Actualmente no se permite deshabilitar el calendario
  const isMobile = useIsMobile(); // Detecta si es vista móvil para aplicar diseño responsive

  // Custom hook que encapsula lógica de fechas, estado de UI y callbacks
  const {
    startDate,
    endDate,
    startDateStr,
    endDateStr,
    isOpen,
    showCustomRange,
    canGo,
    setIsOpen,
    setShowCustomRange,
    handleTriggerClick,
    handleDateChange,
    handleGo,
    presets,
  } = useCalendar({ onCalendarClick, isMobile });

  /**
   * Evita que el fondo haga scroll al abrir el modal en mobile
   */
  useEffect(() => {
    if (isMobile && showCustomRange) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isMobile, showCustomRange]);

  // Refs para detectar interacciones fuera del calendario o submenú
  const containerRef = useRef<HTMLDivElement>(null);
  const subMenuRef = useRef<HTMLDivElement>(null);

  // Memoriza si el último pointerdown fue dentro del submenú
  const lastDownInsideSubmenu = useRef(false);

  /**
   * Cierra el calendario si se hace click fuera de él o se presiona ESC
   */
  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as Node;

      const insideContainer = !!(
        containerRef.current && containerRef.current.contains(target)
      );
      const insideSubmenu = !!(
        showCustomRange &&
        subMenuRef.current &&
        subMenuRef.current.contains(target)
      );

      lastDownInsideSubmenu.current = insideSubmenu;

      if (!insideContainer) {
        setIsOpen(false);
        setShowCustomRange(false);
        return;
      }

      if (showCustomRange && !insideSubmenu) {
        setShowCustomRange(false);
      }
    };

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        setShowCustomRange(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown, {
      capture: true,
    });
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown, {
        capture: true,
      } as any);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [showCustomRange, setIsOpen, setShowCustomRange]);

  return (
    <div className={calendarStyles.calendarContainer} ref={containerRef}>
      {/* Botón que despliega el menú contextual con presets */}
      <ContextMenu
        trigger={
          <button
            className={`${calendarStyles.triggerBtn}
              ${isDisabled ? calendarStyles.triggerDisabled : ""}
              hover:${calendarStyles.triggerHover}
              focus:${calendarStyles.trigerFocus}`}
            onClick={handleTriggerClick}
            disabled={isDisabled}
            aria-selected={isOpen}
            aria-disabled={isDisabled}
          >
            <CalendarIcon />
          </button>
        }
        alignRight={isMobile} // En mobile, alinear a la derecha
        ignoreRefs={[subMenuRef]} // Ignorar clicks dentro del submenú
        isOpen={isOpen}
        setIsOpen={(open) => {
          if (!open && !lastDownInsideSubmenu.current) {
            setShowCustomRange(false);
          }
          setIsOpen(open);
        }}
        items={presets.map((p) => ({ label: p.label, onClick: p.action }))}
      />

      {/* Modal personalizado para móviles */}
      {showCustomRange && isMobile ? (
        <div className={calendarStyles.modalOverlay}>
          <div className={calendarStyles.subCalendarMobile} ref={subMenuRef}>
            <h4 className={calendarStyles.subCalendarTitle}>
              PERIODO PERSONALIZADO
            </h4>

            <div className={calendarStyles.subCalendarWrapper}>
              <div className={calendarStyles.wrapper}>
                <div className={calendarStyles.inputWrapperMobile}>
                  <label className={calendarStyles.inputLabel}>Desde</label>
                  <input
                    type="text"
                    className={calendarStyles.input}
                    value={startDateStr}
                    readOnly
                  />
                </div>
                <div className={calendarStyles.inputWrapperMobile}>
                  <label className={calendarStyles.inputLabel}>Hasta</label>
                  <input
                    type="text"
                    className={calendarStyles.input}
                    value={endDateStr}
                    readOnly
                  />
                </div>
                <div className={calendarStyles.buttonWrapperMobile}>
                  <button
                    className={calendarStyles.buttonMobile}
                    onClick={handleGo}
                    disabled={!canGo}
                  >
                    Ir
                  </button>
                </div>
              </div>

              {/* Selector de rango de fechas */}
              <DatePicker
                selected={startDate}
                onChange={handleDateChange}
                startDate={startDate}
                endDate={endDate}
                selectsRange
                inline
                calendarClassName="custom-calendar"
                dateFormat="dd/MM/yyyy"
              />
            </div>
          </div>
        </div>
      ) : (
        // Vista escritorio
        showCustomRange && (
          <div
            className={calendarStyles.subCalendarContainer}
            ref={subMenuRef}
          >
            <h4 className={calendarStyles.subCalendarTitle}>
              PERIODO PERSONALIZADO
            </h4>

            <div className={calendarStyles.subCalendarWrapper}>
              <div className={calendarStyles.wrapper}>
                <div className={calendarStyles.inputWrapper}>
                  <label className={calendarStyles.inputLabel}>Desde</label>
                  <input
                    type="text"
                    className={calendarStyles.input}
                    value={startDateStr}
                    readOnly
                  />
                </div>
                <div className={calendarStyles.inputWrapper}>
                  <label className={calendarStyles.inputLabel}>Hasta</label>
                  <input
                    type="text"
                    className={calendarStyles.input}
                    value={endDateStr}
                    readOnly
                  />
                </div>
                <div className={calendarStyles.buttonWrapper}>
                  <button
                    className={calendarStyles.button}
                    onClick={handleGo}
                    disabled={!canGo}
                  >
                    Ir
                  </button>
                </div>
              </div>

              {/* Calendario para selección de rango */}
              <DatePicker
                selected={startDate}
                onChange={handleDateChange}
                startDate={startDate}
                endDate={endDate}
                selectsRange
                inline
                calendarClassName="custom-calendar"
                dateFormat="dd/MM/yyyy"
              />
            </div>
          </div>
        )
      )}
    </div>
  );
};

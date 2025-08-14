import React, { useEffect, useRef } from "react";
import CalendarIcon from "@/assets/icons/System/System/calendar.svg";
import { ContextMenu } from "../ContextMenu/ContextMenu";
import DatePicker from "react-datepicker";
import { calendarStyles } from "./styles";
import type { CalendarProps } from "./types";
import "react-datepicker/dist/react-datepicker.css";
import "./datepicker.css";
import { useCalendar } from "./hooks/useCalendar";

export const Calendar: React.FC<CalendarProps> = ({ onCalendarClick }) => {
  const isDisabled = false;

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
  } = useCalendar({ onCalendarClick });

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const subMenuRef = useRef<HTMLDivElement>(null);

  // 👉 Guardamos si el último pointerdown fue dentro del submenú
  const lastDownInsideSubmenu = useRef(false);

  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as Node;

      const insideContainer = !!(containerRef.current && containerRef.current.contains(target));
      const insideSubmenu =
        !!(showCustomRange && subMenuRef.current && subMenuRef.current.contains(target));

      // memoriza dónde cayó el último pointerdown
      lastDownInsideSubmenu.current = insideSubmenu;

      // 1) Fuera de TODO el calendario → cerrar todo
      if (!insideContainer) {
        setIsOpen(false);
        setShowCustomRange(false);
        return;
      }

      // 2) Dentro del calendario pero FUERA del submenú → cierra SOLO el submenú
      if (showCustomRange && !insideSubmenu) {
        setShowCustomRange(false);
      }

      // 3) Dentro del submenú → no cierres nada aquí
    };

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        setShowCustomRange(false);
      }
    };

    // pointerdown en capture para correr antes que otros listeners
    document.addEventListener("pointerdown", handlePointerDown, { capture: true });
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown, { capture: true } as any);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [showCustomRange, setIsOpen, setShowCustomRange]);

  return (
    <div className={calendarStyles.calendarContainer} ref={containerRef}>
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
        alignRight={false}
        ignoreRefs={[subMenuRef]}
        isOpen={isOpen}
        setIsOpen={(open) => {
          // ⛔️ Solo cerramos el submenú si el cierre del menú
          // NO fue provocado por un click dentro del submenú.
          if (!open && !lastDownInsideSubmenu.current) {
            setShowCustomRange(false);
          }
          setIsOpen(open);
        }}
        items={presets.map((p) => ({ label: p.label, onClick: p.action }))}
      />

      {showCustomRange && (
        <div className={calendarStyles.subCalendarContainer} ref={subMenuRef}>
          <h4 className={calendarStyles.subCalendarTitle}>PERIODO PERSONALIZADO</h4>

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
      )}
    </div>
  );
};

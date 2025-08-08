import React, { useState, useMemo } from "react";
import CalendarIcon from "@/assets/icons/System/System/calendar.svg";
import { ContextMenu } from "../ContextMenu/ContextMenu";
import DatePicker from "react-datepicker";
import { calendarStyles } from "./styles";
import type { CalendarProps } from "./types";
import "react-datepicker/dist/react-datepicker.css";
import "./datepicker.css";

import {
  WEEK_STARTS_ON,
  startOfDay,
  endOfDay,
  todayRange,
  weekRange,
  monthRange,
  formatDMY, 
} from "@/app/utilities/DatesHelper/Dateshelper";

export const Calendar: React.FC<CalendarProps> = () => {
  // Mantén solo los Date para el DatePicker
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showCustomRange, setShowCustomRange] = useState(false);
  const [menuPinned, setMenuPinned] = useState(false);

  const isDisabled = false;
  const isOpen = menuPinned;
  const today = new Date();

  // Deriva SIEMPRE el string formateado desde Date (evita estados desincronizados)
  const startDateStr = useMemo(() => formatDMY(startDate), [startDate]);
  const endDateStr   = useMemo(() => formatDMY(endDate),   [endDate]);

  const handleClick = () => {
    if (!isDisabled) {
      const pinned = !menuPinned;
      setMenuPinned(pinned);
      if (!pinned) setShowCustomRange(false);
    }
  };

  const setRange = (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
    // NO hagas console.log aquí; el estado aún no cambió.
  };

  const applyRange = (start: Date, end: Date) => {
    setRange(start, end);
    setShowCustomRange(false);
  };

  const presets = [
    {
      label: "Hoy",
      action: () => {
        const { start, end } = todayRange(today);
        applyRange(start, end);
      },
    },
    {
      label: "Semana Actual",
      action: () => {
        const { start, end } = weekRange(today, WEEK_STARTS_ON);
        applyRange(start, end);
      },
    },
    {
      label: "Mes Actual",
      action: () => {
        const { start, end } = monthRange(today);
        applyRange(start, end);
      },
    },
    { label: "Personalizar", action: () => setShowCustomRange(true) },
  ];

  const handleGo = () => {
    // ¡SIEMPRE loguea/manda las cadenas derivadas!
    const payload = { startDate: startDateStr, endDate: endDateStr };
    console.log("payload rango ➜", payload); // { startDate: "08-08-2025", endDate: "08-08-2025" }
  };

  console.log("start", startDateStr, "end", endDateStr);

  return (
    <div className={calendarStyles.calendarContainer}>
      <ContextMenu
        trigger={
          <button
            className={`${calendarStyles.triggerBtn}
              ${isDisabled ? calendarStyles.triggerDisabled : ""}
              hover:${calendarStyles.triggerHover}
              focus:${calendarStyles.trigerFocus}`}
            onClick={handleClick}
            disabled={isDisabled}
            aria-selected={menuPinned}
            aria-disabled={isDisabled}
          >
            <CalendarIcon />
          </button>
        }
        isOpen={isOpen}
        setIsOpen={setMenuPinned}
        items={presets.map((p) => ({ label: p.label, onClick: p.action }))}
      />

      {showCustomRange && (
        <div className={calendarStyles.subCalendarContainer}>
          <h4 className={calendarStyles.subCalendarTitle}>PERIODO PERSONALIZADO</h4>

          <div className={calendarStyles.subCalendarWrapper}>
            <div className={calendarStyles.wrapper}>
              <div className={calendarStyles.inputWrapper}>
                <label className={calendarStyles.inputLabel}>Desde</label>
                <input
                  type="text"
                  className={calendarStyles.input}
                  value={startDateStr}   // <-- siempre dd-MM-yyyy
                  readOnly
                />
              </div>
              <div className={calendarStyles.inputWrapper}>
                <label className={calendarStyles.inputLabel}>Hasta</label>
                <input
                  type="text"
                  className={calendarStyles.input}
                  value={endDateStr}     // <-- siempre dd-MM-yyyy
                  readOnly
                />
              </div>
              <div className={calendarStyles.buttonWrapper}>
                <button className={calendarStyles.button} onClick={handleGo}>Ir</button>
              </div>
            </div>

            <DatePicker
              selected={startDate}
              onChange={(dates: [Date | null, Date | null] | null) => {
                if (!dates) return;
                const [start, end] = dates;
                const s = start ? startOfDay(start) : null;
                const e = end ? endOfDay(end) : null;
                setRange(s, e);
              }}
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

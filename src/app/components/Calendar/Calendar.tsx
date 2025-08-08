import React from "react";
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

  return (
    <div className={calendarStyles.calendarContainer}>
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
        isOpen={isOpen}
        setIsOpen={setIsOpen}
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

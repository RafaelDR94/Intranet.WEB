import { useCallback, useMemo, useState } from "react";
import {
  WEEK_STARTS_ON,
  startOfDay,
  endOfDay,
  todayRange,
  weekRange,
  monthRange,
  formatDMY,
} from "@/app/utilities/DatesHelper/Dateshelper";

export type Preset = { label: string; action: () => void };

export interface UseCalendarOptions {
  onCalendarClick?: (start: Date, end: Date) => void;
  weekStartsOn?: number;
  initialOpen?: boolean;
  today?: Date;
}

export const useCalendar = ({
  onCalendarClick,
  weekStartsOn = WEEK_STARTS_ON,
  initialOpen = false,
  today = new Date(),
}: UseCalendarOptions = {}) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(initialOpen);
  const [showCustomRange, setShowCustomRange] = useState<boolean>(false);

  // Derivados
  const startDateStr = useMemo(() => formatDMY(startDate), [startDate]);
  const endDateStr = useMemo(() => formatDMY(endDate), [endDate]);
  const canGo = !!(startDate && endDate);

  // Helpers
  const setRange = useCallback((start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
  }, []);

  const goWithRange = useCallback(
    (s: Date | null, e: Date | null) => {
      if (!s || !e) return false;
      onCalendarClick?.(s, e);
      const payload = { startDate: formatDMY(s), endDate: formatDMY(e) };
      console.log("payload rango ➜", payload);
      return true;
    },
    [onCalendarClick]
  );

  const applyRange = useCallback(
    (start: Date, end: Date) => {
      setRange(start, end);
      setShowCustomRange(false);
      setIsOpen(false);
      goWithRange(start, end);
    },
    [goWithRange, setRange]
  );

  // UI handlers
  const handleTriggerClick = useCallback(() => {
    const next = !isOpen;
    setIsOpen(next);
    if (!next) setShowCustomRange(false);
  }, [isOpen]);

  const handleDateChange = useCallback(
    (dates: [Date | null, Date | null] | null) => {
      if (!dates) return;
      const [start, end] = dates;
      const s = start ? startOfDay(start) : null;
      const e = end ? endOfDay(end) : null;
      setRange(s, e);
    },
    [setRange]
  );

  const handleGo = useCallback(() => {
    return goWithRange(startDate, endDate);
  }, [startDate, endDate, goWithRange]);

  // Presets
  const presets: Preset[] = useMemo(
    () => [
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
          const { start, end } = weekRange(today, weekStartsOn);
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
    ],
    [applyRange, today, weekStartsOn]
  );

  return {
    // estado
    startDate,
    endDate,
    startDateStr,
    endDateStr,
    isOpen,
    showCustomRange,
    canGo,
    // acciones
    setIsOpen,
    setShowCustomRange,
    setRange,
    applyRange,
    handleTriggerClick,
    handleDateChange,
    handleGo,
    // datos derivados
    presets,
  };
};

export type UseCalendarReturn = ReturnType<typeof useCalendar>;

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

/**
 * Representa un preset de rango de fechas con una etiqueta y una acción asociada.
 */
export type Preset = { label: string; action: () => void };

/**
 * Opciones configurables para el hook `useCalendar`.
 */
export interface UseCalendarOptions {
  /** Callback ejecutado cuando se confirma un rango personalizado o preset */
  onCalendarClick?: (start?: Date, end?: Date) => void;
  /** Día de inicio de la semana (por defecto viene de WEEK_STARTS_ON) */
  weekStartsOn?: number;
  /** Si el calendario debe iniciarse abierto */
  initialOpen?: boolean;
  /** Fecha base para cálculos de "hoy", "semana", etc. (por defecto, `new Date()`) */
  today?: Date;
  /** Indica si es dispositivo móvil (afecta comportamiento de UI) */
  isMobile?: boolean;
}

/**
 * Hook personalizado que encapsula lógica de selección de fechas, presets y control de UI
 * para un componente de calendario.
 *
 * @param {UseCalendarOptions} options - Opciones de configuración del hook
 * @returns Objeto con estado, acciones y presets para el calendario
 */
export const useCalendar = ({
  onCalendarClick,
  weekStartsOn = WEEK_STARTS_ON,
  initialOpen = false,
  today = new Date(),
  isMobile = false,
}: UseCalendarOptions = {}) => {
  // Estado principal del rango
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // Estado de UI
  const [isOpen, setIsOpen] = useState<boolean>(initialOpen);
  const [showCustomRange, setShowCustomRange] = useState<boolean>(false);

  // Formatos derivados para mostrar las fechas
  const startDateStr = useMemo(() => formatDMY(startDate), [startDate]);
  const endDateStr = useMemo(() => formatDMY(endDate), [endDate]);

  // Habilita el botón "Ir" solo si hay ambas fechas
  const canGo = !!(startDate && endDate);

  /**
   * Setea las fechas de inicio y fin
   */
  const setRange = useCallback((start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
  }, []);

  /**
   * Ejecuta el callback con el rango (si es válido)
   */
  const goWithRange = useCallback(
    (s: Date | null, e: Date | null) => {
      if (!s || !e) return false;
      onCalendarClick?.(s, e);
      return true;
    },
    [onCalendarClick]
  );

  /**
   * Aplica el rango (setea estado, cierra modales y dispara callback)
   */
  const applyRange = useCallback(
    (start: Date, end: Date) => {
      setRange(start, end);
      setShowCustomRange(false);
      setIsOpen(false);
      goWithRange(start, end);
    },
    [goWithRange, setRange]
  );

  /**
   * Alterna apertura del calendario contextual
   */
  const handleTriggerClick = useCallback(() => {
    const next = !isOpen;
    setIsOpen(next);
    if (!next) setShowCustomRange(false); // al cerrar el calendario, también cerramos el submenú
  }, [isOpen]);

  /**
   * Maneja cambio en el selector de fechas
   */
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

  /**
   * Ejecuta la acción de confirmación de rango actual
   */
  const handleGo = useCallback(() => {
    const didApply = goWithRange(startDate, endDate);
    if (didApply) {
      setShowCustomRange(false);
      setIsOpen(false);
    }
    return didApply;
  }, [goWithRange, startDate, endDate]);

  /** Removes an applied date range and notifies the consumer to show all rows. */
  const clearRange = useCallback(() => {
    setRange(null, null);
    setShowCustomRange(false);
    setIsOpen(false);
    onCalendarClick?.();
  }, [onCalendarClick, setRange]);

  /**
   * Presets predefinidos de rangos comunes (hoy, semana, mes, personalizado)
   */
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
      {
        label: "Quitar filtro de fecha",
        action: clearRange,
      },
      {
        label: "Personalizar",
        action: () => {
          if (isMobile) setIsOpen(false); // en mobile cerramos el dropdown
          setShowCustomRange(true);
        },
      },
    ],
    [applyRange, clearRange, today, weekStartsOn, isMobile]
  );

  return {
    // Estado
    startDate,
    endDate,
    startDateStr,
    endDateStr,
    isOpen,
    showCustomRange,
    canGo,

    // Acciones
    setIsOpen,
    setShowCustomRange,
    setRange,
    applyRange,
    handleTriggerClick,
    handleDateChange,
    handleGo,
    clearRange,

    // Datos
    presets,
  };
};

/**
 * Tipo inferido del valor de retorno de `useCalendar`.
 */
export type UseCalendarReturn = ReturnType<typeof useCalendar>;

export interface CalendarProps {
  /** Se activa la devolución de Callback cuando se aplica un rango */
  onCalendarClick?: (start: Date, end: Date) => void;
}

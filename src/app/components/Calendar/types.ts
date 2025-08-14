/** Props for Calendar component */
export interface CalendarProps {
  /** Callback triggered when a range is applied */
    onCalendarClick?: (start: Date, end: Date) => void; // <-- sin null
}

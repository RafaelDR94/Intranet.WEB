
export interface TableLayoutProps {

  onSearchChange?: (value: string) => void
  onCalendarClick?: () => void
  onFilterClick?: () => void
  onTableActionClick?: () => void
  onSearch?: () => void
  actionsRender?: () => React.ReactNode
  actionLabel?: string
  showCalendar?: boolean
  showFilter?: boolean
  showButton?: boolean
}

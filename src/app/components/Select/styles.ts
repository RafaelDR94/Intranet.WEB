export const baseStyles = {
  selectedCheck: "text-white-100",
  selecteCheck2: "text-green-80",
  optionlabel: "text-gray-50",
  hover: "hover:border-green-80",
  check: "text-green-80",
  checkitem: "flex items-center justify-center",
  infoText: "text-c2 text-gray-60 font-medium",
  container: "flex flex-col gap-1 relative w-full",
  label: "text-label font-semibold text-gray-80 tracking-wide",
  trigger:
    "flex justify-between items-center rounded-xl border px-3.5 cursor-pointer transition-all duration-200 shadow-2xs bg-white-100",
  sizes: {
    md: "text-sm py-2.5",
    lg: "text-base py-3",
  },
  variants: {
    default: "border-gray-30 text-black-100 hover:border-gray-50",
    filled: "border-gray-30 text-black-100 hover:border-gray-50",
    disabled: "bg-gray-10 border-gray-20 text-gray-40 cursor-not-allowed shadow-none",
    success: "border-alert-green-100 text-black-100",
    info: "border-alert-blue-100 text-black-100",
    warning: "border-alert-yellow-100 text-black-100",
    error: "border-alert-red-100 text-black-100",
  },
  focusLike: "border-green-80 bg-green-10/20 text-black-100 ring-2 ring-green-60/30",
  menu:
    "text-black-100 absolute z-[90] left-0 top-full mt-1.5 w-full rounded-2xl bg-white-100 shadow-xl max-h-[240px] flex flex-col border border-gray-20 overflow-hidden",
  searchContainer:
    "sticky top-0 left-0 z-10 bg-white-100 px-3.5 py-2.5 border-b border-gray-20",
  searchInput:
    "w-full border border-gray-30 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-green-80 focus:ring-2 focus:ring-green-60/20 placeholder:text-gray-50 disabled:bg-gray-10 disabled:text-gray-40 disabled:cursor-not-allowed",
  optionsContainer: "flex-1 overflow-y-auto overscroll-contain py-1",
  option:
    "flex items-start justify-between gap-2 px-3.5 py-2.5 min-h-10 text-sm leading-6 cursor-pointer whitespace-normal break-words hover:bg-green-10/60 hover:text-black-100 transition-colors",
  optionDisabled: "text-gray-40 cursor-not-allowed",
  checkbox: "w-5 h-5 rounded-md border border-green-80 transition-colors",
  checkboxChecked: "bg-green-80 border-green-80",
  helper: "text-c2 font-medium tracking-tight mt-0.5",
  emptyState: "px-3.5 py-4 text-sm text-gray-50 text-center",
  helperColors: {
    default: "text-gray-60",
    success: "text-alert-green-100",
    info: "text-alert-blue-100",
    warning: "text-alert-yellow-100",
    error: "text-alert-red-100",
  },
};

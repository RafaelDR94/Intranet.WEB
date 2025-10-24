export const baseStyles = {
  selectedCheck: "text-white",
  selecteCheck2: "text-green-100",
  optionlabel: "text-gray-40",
  hover: "hover:border-green-80",
  check: "text-green-100",
  checkitem: "flex items-center justify-center",
  infoText: "text-c2 text-gray-60",
  container: "flex flex-col gap-1 relative w-full",
  label: "text-label font-medium text-gray-60",
  trigger:
    "flex justify-between items-center rounded-md border px-3 cursor-pointer transition-all",
  sizes: {
    md: "text-sm py-2",
    lg: "text-base py-3",
  },
  variants: {
    default: "border-gray-30 text-black-100",
    filled: "border-gray-30 text-black-100",
    disabled: "bg-gray-20 border-gray-20 text-gray-50 cursor-not-allowed",
    success: "border-alert-green-100 text-black-100",
    info: "border-alert-blue-100 text-black-100",
    warning: "border-alert-yellow-100 text-black-100",
    error: "border-alert-red-100 text-black-100",
  },
  focusLike: "border-green-100 bg-green-10 text-black-100",
  menu:
    "absolute z-50 left-0 top-full mt-1 w-full rounded-md bg-white shadow-md max-h-[220px] flex flex-col border border-gray-30 overflow-hidden",
  searchContainer: "sticky top-0 left-0 z-10 bg-white px-3 py-2 border-b border-gray-30",
  searchInput:
    "w-full border border-gray-30 rounded-md px-2 py-1 text-sm outline-none focus:border-green-100 focus:ring-0 placeholder:text-gray-50 disabled:bg-gray-20 disabled:text-gray-50 disabled:cursor-not-allowed",
  optionsContainer: "flex-1 overflow-y-auto overscroll-contain",
  option:
    "flex items-center justify-between px-3 h-10 text-sm cursor-pointer hover:bg-green-10",
  optionDisabled: "text-gray-40 cursor-not-allowed",
  checkbox: "w-6 h-6 rounded-md border border-green-100",
  checkboxChecked: "bg-green-100 border-green-100",
  helper: "text-c2 mt-1",
  emptyState: "px-3 py-4 text-sm text-gray-50",
  helperColors: {
    default: "text-gray-60",
    success: "text-alert-green-100",
    info: "text-alert-blue-100",
    warning: "text-alert-yellow-100",
    error: "text-alert-red-100",
  },
};

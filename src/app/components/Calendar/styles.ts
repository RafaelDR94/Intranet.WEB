export const calendarStyles = {
  calendarContainer: "calendar-container relative z-[70]",
  triggerBtn: "calendar-icon p-1 rounded-[10px] transition-all",
  triggerDisabled: "opacity-40 cursor-not-allowed",
  triggerHover: "bg-green-10",
  trigerFocus: "ring-2 focus:ring-green-40 focus:outline-none",
  subCalendarContainer:
    "absolute right-0 top-full mt-2 w-[400px] rounded-md bg-white-100 p-4 shadow-lg z-[100]",
  subCalendarMobile:
    "absolute top-1/2 left-1/2 z-[100] w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-md bg-white-100 p-4 shadow-md",
  subCalendarTitle: "text-center text-sm text-blue-60",
  subCalendarWrapper: "mt-3 flex justify-between gap-4",
  wrapper: "w-[140px] shrink-0",
  inputWrapper: "flex items-center mt-3",
  inputLabel: "text-gray-70 text-label w-[40px] mr-2",
  input:
    "w-[90px] rounded border-none bg-gray-10 px-2 py-1 text-label text-black-80",
  buttonWrapper: "flex justify-center",
  button: "bg-green-80 text-white rounded px-4 py-1 mt-2 w-full",
  modalOverlay:
    "fixed inset-0 z-[95] flex items-center justify-center bg-[#002A4133] bg-opacity-50",
  /* Mobile Styles*/
  inputWrapperMobile: "flex flex-col mt-3",
  buttonWrapperMobile: "w-auto",
  buttonMobile: "bg-green-80 text-white rounded px-4 py-1 mt-3 w-auto",
};

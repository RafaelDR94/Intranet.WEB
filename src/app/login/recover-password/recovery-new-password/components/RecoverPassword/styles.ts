export const recoverNewPasswordStyles = {
  formWrapper: "mx-auto flex w-full max-w-[446px] flex-col gap-4 sm:gap-5",
  formPanel:
    "flex flex-col gap-4 rounded-[14px] px-4 py-5 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] sm:gap-5 sm:px-6 sm:py-6",
  inputGroup: "flex flex-col gap-2",
  inputLabel: "text-[12px] font-medium leading-4 text-white/80",
  inputShell:
    "flex h-12 items-center gap-3 rounded-xl border-[1.5px] border-gray-40 bg-white-100/10 px-3 text-white transition focus-within:border-white/90",
  input:
    "h-full flex-1 bg-transparent text-[14px] leading-5 text-white placeholder:text-white/50 outline-none",
  inputToggle:
    "inline-flex size-6 items-center justify-center text-white/65 transition hover:text-white",
  requirements:
    "flex flex-col gap-2 rounded-lg px-3 py-4 sm:px-[16.8px] sm:pb-[0.8px] sm:pt-[16.8px]",
  requirementsTitle: "text-[12px] font-medium leading-4 text-white",
  requirementRow:
    "flex items-start gap-2 text-[12px] font-medium leading-4 sm:items-center",
  requirementNeutral: "text-white/80",
  requirementValid: "text-[#71f58e]",
  requirementInvalid: "text-[#ff6363]",
  requirementIcon:
    "inline-flex size-6 shrink-0 items-center justify-center rounded-full text-current",
  requirementNeutralIcon: "text-white/80",
  requirementValidIcon: "text-[#71f58e]",
  requirementInvalidIcon: "text-[#ff6363]",
  submitButton:
    "flex h-12 w-full items-center justify-center rounded-xl px-5 text-[16px] font-semibold leading-[29px] text-white-100 transition disabled:cursor-not-allowed",
  submitEnabled: "bg-green-80 hover:bg-green-70",
  submitDisabled: "bg-gray-40/30 text-white/40",
  successPanel:
    "mx-auto flex w-full max-w-[446px] flex-col items-center gap-5 rounded-[14px] px-4 py-5 text-center shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] sm:gap-[23px] sm:px-6 sm:py-6",
  successIconWrap:
    "flex size-16 items-center justify-center rounded-full bg-[#c9f8d3] text-[#27b44b] sm:size-20",
  successTitle:
    "text-[28px] font-semibold leading-[34px] text-white sm:text-[32px] sm:leading-[38px]",
  successText:
    "max-w-[399px] text-[16px] font-semibold leading-6 text-white sm:text-[18px] sm:leading-7",
} as const;

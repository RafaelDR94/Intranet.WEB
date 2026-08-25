export const loginStyles = {
  page: "relative flex min-h-screen items-center justify-center font-outfit overflow-hidden bg-[#0A1F2E] px-4 py-8 sm:px-6 sm:py-12",
  formContainer:
    "relative z-10 mx-auto w-full max-w-[460px] rounded-[32px] border border-white/20 bg-white/10 p-6 text-white shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] backdrop-blur-xl sm:p-10",
  formWrapper: "flex w-full flex-col gap-6 sm:gap-8",
  header: "flex flex-col gap-2 text-center",
  title:
    "text-[28px] font-semibold tracking-tight text-white sm:text-[32px]",
  subtitle:
    "text-[15px] font-light leading-relaxed text-white/80",
  emailStepPanel: "",
  emailStepForm: "flex flex-col gap-5",
  emailStepLabel:
    "mb-1 block text-sm font-medium text-white/90",
  emailStepInput:
    "h-13 w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 transition-all hover:bg-white/10 focus:border-[#58becc] focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-[#58becc]",
  emailStepButton:
    "mt-2 flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2E97A8] to-[#58BECC] px-5 text-[16px] font-semibold text-white shadow-lg transition-transform hover:scale-[1.02] hover:opacity-90 disabled:pointer-events-none disabled:opacity-50",
  passkeyButton:
    "mb-4 flex h-13 w-full items-center justify-center rounded-xl border border-white/20 bg-white/10 text-[16px] font-semibold text-white transition hover:bg-white/20 disabled:pointer-events-none disabled:opacity-50",
  readOnlyEmailWrap: "mb-5 flex flex-col gap-3 rounded-xl border border-white/10 bg-black/20 p-4",
  readOnlyEmailHeader: "flex items-center justify-between",
  readOnlyEmailValue:
    "text-sm font-medium text-white truncate",
  editEmailButton:
    "text-xs font-semibold uppercase tracking-wider text-[#58becc] transition hover:text-white",
  panel: "",
  formSkin: [
    "[&_form]:space-y-5",
    "[&_label]:mb-1",
    "[&_label]:block",
    "[&_label]:text-sm",
    "[&_label]:font-medium",
    "[&_label]:text-white/90",
    "[&_[data-testid$='-icon']]:text-white/60",
    "[&_[data-testid$='-icon']]:hover:text-white",
    "[&_[data-testid$='-helpertext']]:text-xs",
    "[&_[data-testid$='-helpertext']]:text-white/60",
    "[&_input]:h-13",
    "[&_input]:rounded-xl",
    "[&_input]:border-white/20",
    "[&_input]:bg-white/5",
    "[&_input]:px-4",
    "[&_input]:text-white",
    "[&_input]:placeholder:text-white/40",
    "[&_input]:transition-all",
    "[&_input]:hover:bg-white/10",
    "[&_input]:focus:border-[#58becc]",
    "[&_input]:focus:bg-white/10",
    "[&_input]:focus:ring-1",
    "[&_input]:focus:ring-[#58becc]",
    "[&_button[type='submit']]:mt-4",
    "[&_button[type='submit']]:flex",
    "[&_button[type='submit']]:h-13",
    "[&_button[type='submit']]:w-full",
    "[&_button[type='submit']]:items-center",
    "[&_button[type='submit']]:justify-center",
    "[&_button[type='submit']]:rounded-xl",
    "[&_button[type='submit']]:bg-gradient-to-r",
    "[&_button[type='submit']]:from-[#2E97A8]",
    "[&_button[type='submit']]:to-[#58BECC]",
    "[&_button[type='submit']]:px-5",
    "[&_button[type='submit']]:text-[16px]",
    "[&_button[type='submit']]:font-semibold",
    "[&_button[type='submit']]:text-white",
    "[&_button[type='submit']]:shadow-lg",
    "[&_button[type='submit']]:transition-transform",
    "[&_button[type='submit']]:hover:scale-[1.02]",
    "[&_button[type='submit']_svg]:hidden",
  ].join(" "),
  rememberContainer: "flex items-center justify-between gap-4 pt-2 text-white",
  rememberCheckbox:
    "[&>div]:size-5 [&>div]:rounded-md [&>div]:border-white/30 [&>div]:bg-white/5 [&>span]:text-[14px] [&>span]:font-normal [&>span]:text-white/90",
  forgotPasswordLink:
    "text-[14px] font-medium text-[#58becc] transition hover:text-white",
  supportContainer:
    "mt-8 text-center text-[13px] text-white/60",
  supportLink: "font-semibold text-[#58becc] transition hover:text-white",
} as const;

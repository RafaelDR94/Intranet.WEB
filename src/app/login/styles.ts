export const loginStyles = {
  page: "flex min-h-screen flex-col bg-white md:flex-row",
  formContainer:
    "relative flex min-h-screen w-full items-center justify-center bg-blue-100 px-4 py-8 text-white shadow-[6px_0px_7.5px_0_rgba(0,0,0,0.2),5px_2px_7.9px_0_rgba(0,0,0,0.15)] sm:px-6 sm:py-10 md:max-w-[524px] md:px-16 md:py-[120px]",
  formWrapper: "mx-auto flex w-full max-w-[448px] flex-col gap-6 sm:gap-8",
  header: "flex flex-col gap-2 text-center",
  title:
    "text-[28px] font-semibold leading-[34px] text-white sm:text-[32px] sm:leading-[38px]",
  subtitle:
    "text-[16px] font-semibold leading-6 text-white/80 sm:text-[18px] sm:leading-7",
  emailStepPanel:
    "rounded-2xl px-[32px] py-[32px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)]",
  emailStepForm: "flex flex-col gap-5",
  emailStepLabel:
    "mb-1 text-[12px] font-medium leading-4 text-white/70",
  emailStepInput:
    "h-12 w-full rounded-xl border-[1.5px] border-gray-40 bg-transparent px-3 py-3 text-sm leading-5 text-white placeholder:text-white/40 hover:border-white/80 focus:border-green-40 focus:outline-none",
  emailStepButton:
    "flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-green-80 px-5 text-[16px] font-semibold leading-[29px] text-white transition hover:bg-[#67cfc5] disabled:cursor-not-allowed disabled:bg-[#295f68]",
  readOnlyEmailWrap: "mb-5 flex flex-col gap-2",
  readOnlyEmailHeader: "flex items-center justify-between gap-3",
  readOnlyEmailValue:
    "flex h-12 items-center rounded-xl border-[1.5px] border-gray-40 px-3 py-3 text-sm leading-5 text-white/90",
  editEmailButton:
    "text-[12px] font-medium leading-4 text-[#66f3ec] transition-colors hover:text-[#8cf7f1]",
  panel:
    "rounded-2xl px-0 pt-0 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)]",
  formSkin: [
    "[&_form]:space-y-5",
    "[&_label]:mb-1",
    "[&_label]:text-[12px]",
    "[&_label]:font-medium",
    "[&_label]:leading-4",
    "[&_label]:text-white/70",
    "[&_[data-testid$='-icon']]:text-white/55",
    "[&_[data-testid$='-icon']]:hover:text-white",
    "[&_[data-testid$='-helpertext']]:text-[12px]",
    "[&_[data-testid$='-helpertext']]:leading-4",
    "[&_button[type='submit']]:h-12",
    "[&_button[type='submit']]:w-full",
    "[&_button[type='submit']]:justify-center",
    "[&_button[type='submit']]:rounded-xl",
    "[&_button[type='submit']]:bg-green-80",
    "[&_button[type='submit']]:text-[16px]",
    "[&_button[type='submit']]:font-semibold",
    "[&_button[type='submit']]:leading-[29px]",
    "[&_button[type='submit']]:text-white",
    "[&_button[type='submit']]:shadow-none",
    "[&_button[type='submit']_svg]:hidden",
  ].join(" "),
  rememberContainer: "flex items-center justify-between gap-4 text-white",
  rememberCheckbox:
    "[&>div]:size-6 [&>div]:rounded-[8px] [&>div]:border-[1.5px] [&>div]:border-[#aed2e5] [&>div]:bg-transparent [&>span]:text-[16px] [&>span]:font-normal [&>span]:leading-6 [&>span]:text-white/90",
  forgotPasswordLink:
    "text-[12px] font-medium leading-4 text-[#66f3ec] transition-colors hover:text-[#8cf7f1]",
  supportContainer:
    "mt-4 border-t border-white/70 pt-4 text-center text-[12px] font-medium leading-4 text-white",
  supportLink: "text-[#6cb6e0] transition-colors hover:text-[#93caea]",
  logoContainer: "relative hidden flex-1 overflow-hidden bg-white md:block",
  logo: "object-cover object-center",
} as const;

import { SpinnerSize } from "./types";
export const sizeClasses: Record<SpinnerSize, string> = {
  giant: 'w-14 h-14 border-[6px] outline-offset-[-3px]',     // 56px
  large: 'w-12 h-12 border-[6px] outline-offset-[-3px]',     // 48px
  medium: 'w-10 h-10 border-[5px] outline-offset-[-2.5px]',  // 40px
  small: 'w-8 h-8 border-[4px] outline-offset-[-2px]',       // 32px
  tiny: 'w-6 h-6 border-[4px] outline-offset-[-2px]',        // 24px
};
// src/app/components/Control/styles.ts
import clsx from 'clsx';
// (Opcional) si quieres basarte en el mapa de Input para consistencia de alturas tipográficas
// import { sizes as inputSizes } from '../Input/styles'; // no es estrictamente necesario

export const controlBase = {
  ctn: 'flex items-center rounded-md overflow-hidden border border-green-90 bg-white-100',
  btn: 'flex-1 text-center transition text-green-100 focus:outline-none',
  btnHover: 'hover:bg-green-10',
  btnDisabled: 'text-gray-50 cursor-not-allowed pointer-events-none',
  divider: 'w-px bg-green-60',
};

const bySize = {
  sm: {
    ctn: 'h-8',               // ~ 32px
    btnPad: 'px-2 py-1',
    icon: 'w-3 h-3',
    divider: 'h-5',
  },
  md: {
    ctn: 'h-10',              // ~ 40px
    btnPad: 'px-3 py-2',
    icon: 'w-[14px] h-[14px]',
    divider: 'h-6',
  },
  lg: {
    ctn: 'h-12',              // ~ 48px
    btnPad: 'px-4 py-3',
    icon: 'w-4 h-4',
    divider: 'h-7',
  },
} as const;

export function controlCtn(size: keyof typeof bySize, extra?: string) {
  return clsx(controlBase.ctn, bySize[size].ctn, extra);
}

export function controlBtn(size: keyof typeof bySize, disabled?: boolean) {
  return clsx(
    controlBase.btn,
    bySize[size].btnPad,
    disabled ? controlBase.btnDisabled : controlBase.btnHover,
  );
}

export function controlDivider(size: keyof typeof bySize) {
  return clsx(controlBase.divider, bySize[size].divider);
}

export function iconClass(size: keyof typeof bySize) {
  return bySize[size].icon;
}

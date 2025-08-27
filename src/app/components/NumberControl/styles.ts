// src/app/components/NumberControl/styles.ts

import {
  sizes as inputSizes,
  variants as inputVariants,
  helperColors as inputHelperColors,
} from '@/app/components/Input/styles';

const container = 'flex flex-col gap-1 group';
const label = 'text-label font-medium text-gray-70';
const row = 'flex items-center gap-2';
const controlWrap = 'shrink-0'; // evita que el control se estire
const inputBase =
  'rounded-md border px-3 outline-none transition-all w-[120px] text-center'; // input más angosto para números
const hover = 'hover:border-green-80 focus:border-green-100 focus:bg-green-10';
const helper = 'text-c2';

export const numberControlStyles = {
  container,
  label,
  row,
  controlWrap,
  inputBase,
  hover,
  helper,
  // Para mantener compatibilidad con Input reutilizamos directamente sus mapas:
  sizes: inputSizes,
  variants: inputVariants,
  helperColors: inputHelperColors,
};

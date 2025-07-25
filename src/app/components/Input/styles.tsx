// src/app/components/Input/styles.ts
import clsx from 'clsx'
import { InputSize, InputVariant } from './types'

const container = 'flex flex-col gap-1 group'
const label = 'text-label font-medium text-black-100'
const helperBase = 'text-c2'
const inputBase = 'rounded-md border px-3 outline-none transition-all w-full'
const hoverFocus = 'hover:border-green-80 focus:border-green-100 focus:bg-green-10'

export const sizes: Record<InputSize, string> = {
  md: 'text-sm py-2',
  lg: 'text-base py-3',
}

export const variants: Record<InputVariant, string> = {
  default: 'border-gray-30 text-black-100 placeholder-gray-60',
  filled:  'border-gray-30 text-black-100 placeholder-black-100',
  disabled:
    'bg-gray-20 border-gray-20 text-gray-50 placeholder-gray-50 cursor-not-allowed',
  success: 'border-alert-green-100 text-black-100 placeholder-black-100',
  info:    'border-alert-blue-100 text-black-100 placeholder-black-100',
  warning: 'border-alert-yellow-100 text-black-100 placeholder-black-100',
  error:   'border-alert-red-100 text-black-100 placeholder-black-100',
}

// Ahora incluimos 'filled' para que el tipo cuadre
export const helperColors: Record<Exclude<InputVariant, 'disabled'>, string> = {
  default: 'text-gray-60',
  filled:  'text-gray-60',           // <--- agregado
  success: 'text-alert-green-100',
  info:    'text-alert-blue-100',
  warning: 'text-alert-yellow-100',
  error:   'text-alert-red-100',
}

export function containerClasses() {
  return container
}

export function labelClasses() {
  return label
}

export function inputClasses(size: InputSize, variant: InputVariant) {
  return clsx(inputBase, sizes[size], variants[variant], hoverFocus)
}

export function helperClasses(variant: InputVariant) {
  const color = helperColors[variant as Exclude<InputVariant, 'disabled'>] ?? helperColors.default
  return clsx(helperBase, color)
}

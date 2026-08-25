// src/app/components/Input/styles.ts
import clsx from 'clsx'

import { InputSize, InputVariant } from './types'

const container = 'flex flex-col gap-1 group w-full'
const label = 'text-label font-semibold text-gray-80 tracking-wide'
const helperBase = 'text-c2 font-medium tracking-tight mt-0.5'
const inputBase = 'rounded-xl border px-3.5 outline-none transition-all duration-200 w-full shadow-2xs'
const hoverFocus = 'hover:border-green-80 focus:border-green-80 focus:ring-2 focus:ring-green-60/30 focus:bg-green-10/20'

export const sizes: Record<InputSize, string> = {
  md: 'text-sm py-2.5',
  lg: 'text-base py-3',
  sm: 'text-b3 py-2 w-[325px] mb-2'
}

export const variants: Record<InputVariant, string> = {
  default: 'border-gray-30 bg-white-100 text-black-100 placeholder-gray-50 hover:border-gray-50',
  filled:  'border-gray-30 bg-white-100 text-black-100 placeholder-gray-50 hover:border-gray-50',
  disabled:
    'bg-gray-10 border-gray-20 text-gray-40 placeholder-gray-40 cursor-not-allowed shadow-none',
  success: 'border-alert-green-100 bg-white-100 text-black-100 placeholder-gray-50 focus:ring-alert-green-100/30',
  info:    'border-alert-blue-100 bg-white-100 text-black-100 placeholder-gray-50 focus:ring-alert-blue-100/30',
  warning: 'border-alert-yellow-100 bg-white-100 text-black-100 placeholder-gray-50 focus:ring-alert-yellow-100/30',
  error:   'border-alert-red-100 bg-white-100 text-black-100 placeholder-gray-50 focus:ring-alert-red-100/30',
}

export const helperColors: Record<Exclude<InputVariant, 'disabled'>, string> = {
  default: 'text-gray-60',
  filled:  'text-gray-60',
  success: 'text-alert-green-100',
  info:    'text-alert-blue-100',
  warning: 'text-alert-yellow-100',
  error:   'text-alert-red-100',
}

export function textareaClasses(size: InputSize, variant: InputVariant) {
  return clsx(
    inputBase,
    sizes[size],
    variants[variant],
    'min-h-24 h-auto resize-none leading-relaxed whitespace-pre-wrap overflow-y-auto',
    variant !== 'disabled' && hoverFocus
  )
}

export function containerClasses() {
  return container
}

export function labelClasses() {
  return label
}

export function inputClasses(size: InputSize, variant: InputVariant) {
  return clsx(
    inputBase,
    sizes[size],
    variants[variant],
    variant !== 'disabled' && hoverFocus
  )
}

export function helperClasses(variant: InputVariant) {
  const color = helperColors[variant as Exclude<InputVariant, 'disabled'>] ?? helperColors.default
  return clsx(helperBase, color)
}

export const eyesicontyles = {
  eyeIcon: "",
  eyeButton: "absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-50 hover:text-green-80 focus:outline-none transition-colors p-1 rounded-md",
}
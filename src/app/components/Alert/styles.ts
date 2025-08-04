import clsx from 'clsx'
import { AlertType, AlertVariant } from './types'

const baseContainer = 'rounded-lg p-4 flex flex-col gap-3 shadow-sm'
const headerLayout = 'flex items-start gap-3'
const iconContainer = 'w-5 h-5 shrink-0'
const textContainer = 'flex-1'
const buttonsLayout = 'flex gap-2 pl-8'
const buttonBase = 'text-cta-sm font-medium'

// Mapa de clases según type y variant
type StyleMap = Record<AlertType, Record<AlertVariant, string>>

export const bgColorMap: StyleMap = {
  default: {
    filled: 'bg-blue-90 text-white-100',
    subtle: 'bg-turquoise-20 border border-turquoise-100',
  },
  success: {
    filled: 'bg-alert-green-100 text-white-100',
    subtle: 'bg-alert-green-10 text-blue-100 border border-alert-green-100',
  },
  info: {
    filled: 'bg-alert-blue-100 text-white-100',
    subtle: 'bg-blue-10 text-blue-100 border border-alert-blue-100',
  },
  warning: {
    filled: 'bg-alert-yellow-100 text-white-100',
    subtle: 'bg-alert-yellow-10 text-blue-100 border border-alert-yellow-100',
  },
  error: {
    filled: 'bg-alert-red-100 text-white-100',
    subtle: 'bg-alert-red-10 text-blue-100 border border-alert-red-100',
  },
  notification: {
    filled: 'bg-alert-blue-100 text-white-100',
    subtle: 'bg-blue-10 text-blue-100 border border-alert-blue-100',
  },
}

export const iconColorMap: StyleMap = {
  default: {
    filled: 'text-white-100',
    subtle: 'text-turquoise-100',
  },
  success: {
    filled: 'text-white-100',
    subtle: 'text-alert-green-100',
  },
  info: {
    filled: 'text-white-100',
    subtle: 'text-alert-blue-100',
  },
  warning: {
    filled: 'text-white-100',
    subtle: 'text-alert-yellow-100',
  },
  error: {
    filled: 'text-white-100',
    subtle: 'text-alert-red-100',
  },
  notification: {
    filled: 'text-white-100',
    subtle: 'text-alert-blue-100',
  },
}

export const titleColorMap: StyleMap = iconColorMap
export const textColorMap: StyleMap = {
  default: {
    filled: 'text-white-80',
    subtle: 'text-turquoise-100',
  },
  success: {
    filled: 'text-white-80',
    subtle: 'text-alert-green-100',
  },
  info: {
    filled: 'text-white-80',
    subtle: 'text-alert-blue-100',
  },
  warning: {
    filled: 'text-white-80',
    subtle: 'text-alert-yellow-100',
  },
  error: {
    filled: 'text-white-80',
    subtle: 'text-alert-red-100',
  },
  notification: {
    filled: 'text-white-80',
    subtle: 'text-alert-blue-100',
  },
}

export const buttonColorMap: StyleMap = {
  default: {
    filled: 'text-white-100',
    subtle: 'text-green-100',
  },
  success: {
    filled: 'text-white-100',
    subtle: 'text-green-100',
  },
  info: {
    filled: 'text-white-100',
    subtle: 'text-green-100',
  },
  warning: {
    filled: 'text-white-100',
    subtle: 'text-green-100',
  },
  error: {
    filled: 'text-white-100',
    subtle: 'text-green-100',
  },
  notification: {
    filled: 'text-white-100',
    subtle: 'text-green-100',
  },
}

export const buttonColorMap2: StyleMap = {
  default: {
    filled: 'text-blue-30',
    subtle: 'text-white-10',
  },
  success: {
    filled: 'text-alert-green-50',
    subtle: 'text-white-10',
  },
  info: {
    filled: 'text-alert-green-50',
    subtle: 'text-white-10',
  },
  warning: {
    filled: 'text-alert-yellow-10',
    subtle: 'text-white-10',
  },
  error: {
    filled: 'text-alert-red-10',
    subtle: 'text-white-10',
  },
  notification: {
    filled: 'text-alert-green-50',
    subtle: 'text-white-10',
  },
}

// Helpers para componer clases
export function getBgClasses(type: AlertType, variant: AlertVariant) {
  return clsx(bgColorMap[type][variant])
}
export function getIconClasses(type: AlertType, variant: AlertVariant) {
  return clsx(iconColorMap[type][variant])
}
export function getTitleClasses(type: AlertType, variant: AlertVariant) {
  return clsx('font-semibold text-h5', titleColorMap[type][variant])
}
export function getTextClasses(type: AlertType, variant: AlertVariant) {
  return clsx('text-c1', textColorMap[type][variant])
}
export function getButtonClasses(type: AlertType, variant: AlertVariant, secondary = false) {
  const map = secondary ? buttonColorMap2 : buttonColorMap
  return clsx(buttonBase, map[type][variant])
}

export const containerClasses = baseContainer
export const headerClasses = headerLayout
export const iconContainerClasses = iconContainer
export const textContainerClasses = textContainer
export const buttonsContainerClasses = buttonsLayout
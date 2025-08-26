import { Variant, Size } from './types'

// Clases base comunes
export const baseClasses =
  'inline-flex items-center justify-center font-semibold focus:outline-none focus:ring-offset-2 whitespace-nowrap'

// Mapeo de tamaños
export const sizeMap: Record<Size, string> = {
  giant:  'px-6 py-3 text-btn-giant rounded-lg',
  large:  'px-5 py-2.5 text-btn-large rounded-md',
  medium: 'px-4 py-2 text-btn-md rounded-md',
  small:  'px-3 py-1.5 text-btn-sm rounded-sm',
  xsmall: 'px-2 py-1 text-btn-xs rounded-sm',
}

// Mapeo de variantes
export const variantMap: Record<Variant, string> = {
  solid:
    'bg-green-80 text-white hover:bg-green-90 focus:ring-2 focus:ring-green-60 focus:bg-green-60 active:bg-green-100 disabled:bg-gray-20 disabled:text-gray-40',
  outline:
    'border border-green-80 text-green-80 hover:bg-green-10 focus:ring-2 focus:ring-green-40 active:bg-white-50 active:text-green-100 disabled:text-gray-40 disabled:ring-gray-40 disabled:border-gray-40 disabled:bg-gray-10',
  ghost:
    'text-green-80 hover:bg-green-10 focus:ring-2 focus:text-green-60 focus:ring-green-60 active:bg-green-20 active:text-green-100 disabled:text-gray-40 disabled:bg-gray-10',
}
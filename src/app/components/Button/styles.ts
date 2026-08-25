import { Variant, Size } from './types'

// Clases base comunes con micro-interacciones y jerarquía visual refinada
export const baseClasses =
  'inline-flex items-center justify-center font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 whitespace-nowrap transition-all duration-200 ease-in-out active:scale-[0.98] tracking-wide'

// Mapeo de tamaños con esquinas redondeadas modernas
export const sizeMap: Record<Size, string> = {
  giant:  'px-6 py-3 text-btn-giant rounded-xl shadow-sm hover:shadow-md',
  large:  'px-5 py-2.5 text-btn-large rounded-xl shadow-sm hover:shadow-md',
  medium: 'px-4 py-2 text-btn-md rounded-xl shadow-sm hover:shadow-md',
  small:  'px-3.5 py-1.5 text-btn-sm rounded-lg shadow-2xs hover:shadow-sm',
  xsmall: 'px-2.5 py-1 text-btn-xs rounded-md shadow-2xs',
}

// Mapeo de variantes conservando paleta de colores pero elevando presencia visual
export const variantMap: Record<Variant, string> = {
  solid:
    'bg-green-80 text-white-100 shadow-sm hover:bg-green-90 hover:-translate-y-0.5 focus:ring-green-60 focus:bg-green-80 active:translate-y-0 active:bg-green-100 disabled:bg-gray-20 disabled:text-gray-40 disabled:shadow-none disabled:translate-y-0 disabled:cursor-not-allowed',
  outline:
    'border-2 border-green-80 text-green-80 bg-transparent hover:bg-green-10 hover:-translate-y-0.5 focus:ring-green-40 active:translate-y-0 active:bg-green-20 active:text-green-100 disabled:text-gray-40 disabled:ring-gray-40 disabled:border-gray-30 disabled:bg-gray-10 disabled:translate-y-0 disabled:cursor-not-allowed',
  ghost:
    'text-green-80 bg-transparent hover:bg-green-10/80 hover:-translate-y-0.5 focus:ring-green-60 focus:text-green-90 active:translate-y-0 active:bg-green-20 active:text-green-100 disabled:text-gray-40 disabled:bg-transparent disabled:translate-y-0 disabled:cursor-not-allowed',
}
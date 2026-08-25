import clsx from 'clsx'

import { CheckboxProps } from './types'

export const baseLabel = 'inline-flex items-center space-x-2 cursor-pointer'
export const layoutMap = {
  left: 'flex-row-reverse space-x-reverse',
  right: 'flex-row',
}

export function checkboxClasses({ checked, indeterminate, disabled }: Pick<CheckboxProps, 'checked' | 'indeterminate' | 'disabled'>): string {
  return clsx(
    'w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 peer shadow-2xs',
    {
      'border-gray-20 bg-gray-10 cursor-not-allowed shadow-none': disabled,
      'border-green-80 bg-green-80 text-white-100': (checked || indeterminate) && !disabled,
      'border-gray-40 bg-white-100 hover:border-green-80 hover:bg-green-10/20 focus:ring-2 focus:ring-offset-2 focus:ring-green-60/30': !checked && !indeterminate && !disabled,
    }
  )
}

export const indicatorClass = 'w-3 h-0.5 rounded-full bg-current'
export const checkmarkClass = 'fill-white-100 text-white-100'
export const labelTextBase = 'text-b3 font-medium text-gray-90 select-none tracking-wide'
export const labelTextDisabled = 'text-gray-40 select-none'

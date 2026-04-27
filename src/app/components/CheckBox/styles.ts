import clsx from 'clsx'

import { CheckboxProps } from './types'

export const baseLabel = 'inline-flex items-center space-x-2 cursor-pointer'
export const layoutMap = {
  left: 'flex-row-reverse space-x-reverse',
  right: 'flex-row',
}

export function checkboxClasses({ checked, indeterminate, disabled }: Pick<CheckboxProps, 'checked' | 'indeterminate' | 'disabled'>): string {
  return clsx(
    'w-5 h-5 rounded border border-green-90 border-2 flex items-center justify-center transition-colors duration-200 peer',
    {
      'border-gray-30 bg-gray-10 cursor-not-allowed': disabled,
      'border-green-90 bg-green-90': (checked || indeterminate) && !disabled,
      'border-green-90 bg-white-100 hover:border-green-90 hover:bg-green-10 focus:ring-2 focus:ring-offset-2 focus:ring-green-60': !checked && !indeterminate && !disabled,
    }
  )
}

export const indicatorClass = 'w-3 h-0.5 rounded-sm bg-current'
export const checkmarkClass = 'fill-white text-white'
export const labelTextBase = 'text-b3 text-green-90 select-none'
export const labelTextDisabled = 'text-green-90'

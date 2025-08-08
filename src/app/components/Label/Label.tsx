import React from 'react'
import { getLabelClasses } from './styles'
import type { LabelProps } from './types'

export const Label: React.FC<LabelProps> = ({ type, text }) => (
  <span className={getLabelClasses(type)}>{text}</span>
)

export default Label

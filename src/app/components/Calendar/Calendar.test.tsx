import React from 'react'
import { render } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
vi.mock('react-datepicker/dist/react-datepicker.css', () => ({}), { virtual: true })
vi.mock('./datepicker.css', () => ({}), { virtual: true })
vi.mock('@/assets/icons/System/System/calendar.svg', () => ({ default: () => <svg /> }))

import { Calendar } from './Calendar'

describe('Calendar', () => {
  it('renders trigger button', () => {
    const { container } = render(<Calendar />)
    expect(container.querySelector('button')).toBeInTheDocument()
  })
})

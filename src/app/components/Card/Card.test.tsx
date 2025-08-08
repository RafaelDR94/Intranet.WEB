import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

import { Card } from './Card'

describe('Card', () => {
  const baseProps = {
    imageSrc: 'image.png',
    label: 'Label',
    title: 'Title',
    description: 'Description',
    onAccept: vi.fn(),
  }

  it('renders label and title', () => {
    render(<Card {...baseProps} />)
    expect(screen.getByText('Label')).toBeInTheDocument()
    expect(screen.getByText('Title')).toBeInTheDocument()
  })
})

import { render, screen } from '@testing-library/react'
import React from 'react'
import { describe, it, expect } from 'vitest'

import List from './List'

describe('List', () => {
  it('renders list items', () => {
    render(<List items={[{ id: 1, label: 'Item', controlType: 'badge', showAvatar: false }]} />)
    expect(screen.getByText('Item')).toBeInTheDocument()
  })
})

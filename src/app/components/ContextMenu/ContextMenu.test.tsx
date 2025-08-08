import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
vi.mock('@/assets/icons/navegacion/nav-arrow-right.svg', () => ({ default: () => <svg /> }))

import { ContextMenu } from './ContextMenu'

describe('ContextMenu', () => {
  it('opens menu on trigger click', () => {
    render(<ContextMenu trigger={<button>Open</button>} items={[{ label: 'Item' }]} />)
    fireEvent.click(screen.getByText('Open'))
    expect(screen.getByRole('menu')).toBeInTheDocument()
  })
})
